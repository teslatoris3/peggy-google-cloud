const path = require('path');
// Load env from the booking-prototype folder (next to this file)
require('dotenv').config({ path: path.join(__dirname, '.env') });
const express = require('express');

const app = express();
const stripeSecret = process.env.STRIPE_SECRET_KEY || '';
const stripe = stripeSecret ? require('stripe')(stripeSecret) : null;

// Persistence
const db = require('./db');

const crypto = require('crypto');
const fs = require('fs');
const DOCUMENTS_FILE = process.env.DOCUMENTS_FILE || (
	process.env.VERCEL ? path.join('/tmp', 'peggy-booking-documents.txt') : path.join(__dirname, 'documents.txt')
);

const TWILIO_SID = (process.env.TWILIO_SID || '').trim();
const TWILIO_TOKEN = (process.env.TWILIO_TOKEN || '').trim();
const TWILIO_FROM = (process.env.TWILIO_FROM || '').trim();
const EMPLOYEE_PHONE = (process.env.EMPLOYEE_PHONE || '').trim();
const TWILIO_MESSAGING_SERVICE_SID = (process.env.TWILIO_MESSAGING_SERVICE_SID || '').trim();
const DEPOSIT_ENABLED = (process.env.DEPOSIT_ENABLED || 'false') === 'true';

// Logging setup
const LOG_DIR = path.join(__dirname, 'logs');
try { if (!fs.existsSync(LOG_DIR)) fs.mkdirSync(LOG_DIR); } catch (e) { console.warn('Could not create logs dir', e && e.message); }
function appendLog(fileName, text) {
	try { fs.appendFileSync(path.join(LOG_DIR, fileName), `${new Date().toISOString()} ${text}\n`); } catch (e) { console.error('appendLog err', e && e.message); }
}

async function sendSms(to, body) {
	if (TWILIO_SID && TWILIO_TOKEN && (TWILIO_FROM || TWILIO_MESSAGING_SERVICE_SID)) {
		// Prefer using Twilio SDK if available
		try {
			const twilioLib = require('twilio');
			const client = twilioLib(TWILIO_SID, TWILIO_TOKEN);
			const params = { to, body };
			if (TWILIO_MESSAGING_SERVICE_SID) params.messagingServiceSid = TWILIO_MESSAGING_SERVICE_SID;
			else params.from = TWILIO_FROM;
			const res = await client.messages.create(params);
			appendLog('sms.log', `SENT to=${to} sid=${res && res.sid}`);
			console.log('SMS sent to', to);
			return res;
		} catch (err) {
			// If auth error, do NOT silently simulate — surface the error so creds can be fixed.
			try {
				const status = err && err.status;
				const message = err && (err.message || JSON.stringify(err));
				appendLog('sms.log', `TWILIO_ERR status=${status} to=${to} err=${message}`);
				console.error('Twilio send error', status, message);
			} catch (e) {}
			return Promise.reject(err);
		}
	}

	// Simulate SMS for local testing or when Twilio not configured
	appendLog('sms.log', `SIMULATED to=${to} body=${body}`);
	console.log('SIMULATED SMS to', to, '\n', body);
	return { sid: 'SIMULATED' };
}

function generateToken() {
	return crypto.randomBytes(12).toString('hex');
}

async function createAndSendApproval(booking) {
	const token = generateToken();
	const expires = Date.now() + 24 * 60 * 60 * 1000; // 24h
	booking.approvalToken = token;
	booking.approvalTokenExpires = expires;
	booking.approvalSentTo = EMPLOYEE_PHONE || booking.employeePhone || '';
	db.updateBooking(booking);

	if (!booking.approvalSentTo) {
		console.log('No employee phone configured; skipping SMS');
		return;
	}

	const defaultBase = `http://localhost:${process.env.PORT || PORT || 4000}`;
	const base = process.env.PUBLIC_BASE_URL || defaultBase;
	const accept = `${base}/action/approve/${token}`;
	const reject = `${base}/action/reject/${token}`;
	const adminList = `${base}/admin.html`;
	const when = booking.appointmentTime ? ` at ${booking.appointmentTime}` : '';
	const details = `Name: ${booking.customerName}\nEmail: ${booking.email || ''}\nPhone: ${booking.phone || ''}\nService: ${booking.serviceName || ''}${when}`;
	const msg = `New booking #${booking.id}\n${details}\nApprove: ${accept}\nReject: ${reject}\nAdmin list: ${adminList}`;
	console.log('Approval SMS body:\n', msg);
	try {
		if (booking.approvalSentTo && booking.approvalSentTo === TWILIO_FROM) {
			console.warn('Warning: approval recipient equals TWILIO_FROM; switching to booking.employeePhone if available');
			booking.approvalSentTo = booking.employeePhone || booking.approvalSentTo;
			db.updateBooking(booking);
		}
		console.log('About to send SMS to', booking.approvalSentTo);
		await sendSms(booking.approvalSentTo, msg);
		console.log('Approval SMS sent to', booking.approvalSentTo);
	} catch (err) {
		console.error('Failed to send SMS. Error:', err && (err.stack || err.message || err));
	}
}

// Basic auth middleware for admin routes
const ADMIN_USER = process.env.ADMIN_USER || '';
const ADMIN_PASS = process.env.ADMIN_PASS || '';

function basicAuth(req, res, next) {
	if (!ADMIN_USER || !ADMIN_PASS) return next();
	const auth = req.headers.authorization;
	if (!auth || !auth.startsWith('Basic ')) {
		res.setHeader('WWW-Authenticate', 'Basic realm="Admin Area"');
		return res.status(401).send('Authentication required.');
	}
	const creds = Buffer.from(auth.split(' ')[1], 'base64').toString();
	const [user, pass] = creds.split(':');
	if (user === ADMIN_USER && pass === ADMIN_PASS) return next();
	res.setHeader('WWW-Authenticate', 'Basic realm="Admin Area"');
	return res.status(401).send('Invalid credentials');
}

// Protect admin UI and API paths
app.use('/admin', basicAuth);
app.use('/admin.html', basicAuth);

// Serve static client (after admin protection middleware)
app.use(express.static(path.join(__dirname, 'public')));

// Simple CORS support for requests from local frontend
app.use((req, res, next) => {
	res.setHeader('Access-Control-Allow-Origin', process.env.ALLOW_ORIGIN || '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
	res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
	if (req.method === 'OPTIONS') return res.sendStatus(200);
	next();
});

function timeToMinutes(value) {
	const match = String(value || '').match(/^(\d{2}):(\d{2})$/);
	if (!match) return null;
	const hours = Number(match[1]);
	const minutes = Number(match[2]);
	if (hours > 23 || minutes > 59) return null;
	return hours * 60 + minutes;
}

function normalizeDate(value) {
	const match = String(value || '').match(/^(\d{4}-\d{2}-\d{2})/);
	return match ? match[1] : '';
}

function normalizeAppointmentTime(value) {
	const match = String(value || '').match(/T(\d{2}:\d{2})/);
	return match ? match[1] : '';
}

function validateAvailabilityPayload(payload) {
	const openTime = String(payload.openTime || '').trim();
	const closeTime = String(payload.closeTime || '').trim();
	const openMinutes = timeToMinutes(openTime);
	const closeMinutes = timeToMinutes(closeTime);
	if (openMinutes === null || closeMinutes === null) return { error: 'invalid_hours' };
	if (openMinutes >= closeMinutes) return { error: 'invalid_hour_range' };

	const closedDates = Array.isArray(payload.closedDates)
		? payload.closedDates.map(normalizeDate).filter(Boolean)
		: [];

	return {
		availability: {
			open: payload.open !== false,
			openTime,
			closeTime,
			closedDates: Array.from(new Set(closedDates)).sort(),
		},
	};
}

function getAvailabilityConflict(appointmentTime) {
	const availability = db.getAvailability();
	const appointmentDate = normalizeDate(appointmentTime);
	const appointmentClock = normalizeAppointmentTime(appointmentTime);
	if (!availability.open) return 'Online booking is closed right now. Please call the salon to book.';
	if (!appointmentDate || !appointmentClock) return 'Please choose an appointment date and time.';
	if (availability.closedDates.includes(appointmentDate)) return 'Peggy is closed on that date. Please choose another day.';

	const appointmentMinutes = timeToMinutes(appointmentClock);
	const openMinutes = timeToMinutes(availability.openTime);
	const closeMinutes = timeToMinutes(availability.closeTime);
	if (appointmentMinutes === null || openMinutes === null || closeMinutes === null) return 'Please choose a valid appointment time.';
	if (appointmentMinutes < openMinutes || appointmentMinutes >= closeMinutes) {
		return `Please choose a time between ${availability.openTime} and ${availability.closeTime}.`;
	}
	return '';
}

app.get('/availability', (req, res) => {
	res.json(db.getAvailability());
});

app.get('/booking/availability', (req, res) => {
	res.json(db.getAvailability());
});

// Endpoint to receive lightweight notifications (e.g., Book Now clicked)
app.post('/notify', express.json(), async (req, res) => {
	try {
		const { source = 'site', page = '/', details = '' } = req.body || {};
		const to = EMPLOYEE_PHONE || '';
		// Do not send SMS for lightweight notifications (clicks). Just log for analytics.
		console.log(`Notify event (no SMS): source=${source}, page=${page}, details=${details}`);
		return res.json({ ok: true });
	} catch (err) {
		console.error('notify error', err && err.message);
		return res.status(500).json({ ok: false, error: 'send_failed' });
	}
});

// Create a booking and a Stripe Checkout session for deposit
// Use route-specific JSON parser so the webhook route can use raw body
app.post('/create-booking', express.json(), async (req, res) => {
	try {
		const { customerName, email, phone, serviceName, depositAmount, appointmentTime, birthday } = req.body;
		// Log incoming booking request for debugging
		try { appendLog('bookings.log', `INBOUND ${JSON.stringify(req.body)}`); } catch (e) { console.warn('log booking err', e && e.message); }
		// Require appointmentTime always; depositAmount only when deposit workflow is enabled
		if (!customerName || !email || !appointmentTime || (DEPOSIT_ENABLED && (depositAmount === undefined || depositAmount === null))) {
			return res.status(400).json({ error: 'Missing required fields' });
		}
		const availabilityConflict = getAvailabilityConflict(appointmentTime);
		if (availabilityConflict) {
			appendLog('bookings.log', `UNAVAILABLE appointmentTime=${appointmentTime} reason=${availabilityConflict}`);
			return res.status(409).json({ error: 'unavailable', message: availabilityConflict });
		}

		const created = db.createBooking({
			customerName,
			email,
			phone,
			birthday: birthday || '',
			appointmentTime,
			serviceName: serviceName || 'Service',
			status: 'pending_payment',
			depositAmount,
			currency: 'usd',
			createdAt: new Date().toISOString(),
		});
		// Upsert client record for birthday messaging and client list
		try { db.upsertClient({ name: customerName, email, phone, birthday: birthday || '' }); } catch (e) { console.error('upsert client err', e && e.message); }
		const bookingId = String(created.id);
		// If deposit workflow is enabled, go through Stripe/Checkout as before.
		if (DEPOSIT_ENABLED) {
			let session;
			const stripeKey = process.env.STRIPE_SECRET_KEY || '';
			const useStripe = stripeKey && !stripeKey.includes('replace');
			if (useStripe) {
				session = await stripe.checkout.sessions.create({
					payment_method_types: ['card'],
					mode: 'payment',
					line_items: [
						{
							price_data: {
								currency: created.currency,
								product_data: { name: `Deposit for ${created.serviceName}` },
								unit_amount: Math.round(depositAmount * 100),
							},
							quantity: 1,
						},
					],
					metadata: { bookingId },
					success_url: `${req.protocol}://${req.get('host')}/success.html?session_id={CHECKOUT_SESSION_ID}`,
					cancel_url: `${req.protocol}://${req.get('host')}/cancel.html`,
				});

				db.setCheckoutSessionId(bookingId, session.id);
				return res.json({ checkoutUrl: session.url, bookingId });
			} else {
				// Simulate checkout session if Stripe not configured
				const fakeSessionId = `fake_sess_${bookingId}_${Date.now()}`;
				const fakeUrl = `${req.protocol}://${req.get('host')}/success.html?session_id=${fakeSessionId}`;
				db.setCheckoutSessionId(bookingId, fakeSessionId);
				db.setPaymentConfirmed(bookingId, {
					amount_total: Math.round((depositAmount || 0) * 100),
					currency: created.currency,
					payment_status: 'paid',
					session_id: fakeSessionId,
				});
				// trigger approval SMS for simulated flow as well
				try {
					const booking = db.getBooking(bookingId);
					if (booking) await createAndSendApproval(booking);
				} catch (err) {
					console.error('Error sending simulated approval SMS', err && err.message);
				}
				return res.json({ checkoutUrl: fakeUrl, bookingId, simulated: true });
			}
		}

		// If deposits are disabled, mark booking confirmed and send approval SMS immediately
		db.setPaymentConfirmed(bookingId, {
			amount_total: 0,
			currency: created.currency,
			payment_status: 'not_required',
			session_id: null,
		});
		try {
			const booking = db.getBooking(bookingId);
			if (booking) await createAndSendApproval(booking);
		} catch (err) {
			console.error('Error sending approval SMS', err && err.message);
		}
		return res.json({ ok: true, bookingId, simulated: true, deposit_disabled: true });
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: 'server_error', details: err.message });
	}
});

// Admin: force re-send approval SMS for a booking
app.post('/admin/send-approval/:bookingId', basicAuth, async (req, res) => {
	const bookingId = String(req.params.bookingId || '');
	try {
		const booking = db.getBooking(bookingId);
		if (!booking) return res.status(404).json({ ok: false, error: 'not_found' });
		await createAndSendApproval(booking);
		appendLog('bookings.log', `ADMIN_RESEND booking=${bookingId}`);
		return res.json({ ok: true });
	} catch (e) {
		console.error('admin resend err', e && e.message);
		return res.status(500).json({ ok: false, error: e && (e.message || e) });
	}
});

// Admin: fetch recent log lines
app.get('/admin/logs/:name', basicAuth, (req, res) => {
	const name = req.params.name || 'sms';
	const file = path.join(LOG_DIR, `${name}.log`);
	try {
		if (!fs.existsSync(file)) return res.json({ ok: true, lines: [] });
		const content = fs.readFileSync(file, 'utf8');
		const lines = content.trim().split('\n').slice(-200);
		return res.json({ ok: true, lines });
	} catch (e) {
		return res.status(500).json({ ok: false, error: e && e.message });
	}
});

// Endpoint to list bookings (for quick testing)
app.get('/bookings', (req, res) => {
	res.json(db.listBookings());
});

// Stripe webhook endpoint — needs raw body for signature verification
app.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
	const sig = req.headers['stripe-signature'];
	const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

	let event;
	try {
		if (webhookSecret) {
			event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
		} else {
			// If no webhook secret provided (quick local test), parse body
			event = JSON.parse(req.body.toString());
		}
	} catch (err) {
		console.error('Webhook signature verification failed.', err.message);
		return res.status(400).send(`Webhook Error: ${err.message}`);
	}

	// Handle the event
	switch (event.type) {
		case 'checkout.session.completed': {
			const session = event.data.object;
			const bookingId = session.metadata && session.metadata.bookingId;
			if (bookingId) {
				db.setPaymentConfirmed(bookingId, {
					amount_total: session.amount_total,
					currency: session.currency,
					payment_status: session.payment_status,
					session_id: session.id,
				});
				console.log(`Booking ${bookingId} confirmed via Checkout session.`);
				// send approval SMS to employee if configured
				try {
					const booking = db.getBooking(bookingId);
					if (booking) await createAndSendApproval(booking);
				} catch (err) {
					console.error('Error sending approval SMS', err && err.message);
				}
			}
			break;
		}
		default:
			console.log(`Unhandled event type ${event.type}`);
	}

	res.json({ received: true });
});

const PORT = process.env.PORT || 4000;
if (require.main === module) {
	app.listen(PORT, () => console.log(`Booking prototype listening on http://localhost:${PORT}`));
}

// Admin endpoints
app.get('/admin/bookings', (req, res) => {
	res.json(db.listBookings());
});

app.get('/admin/clients', (req, res) => {
	res.json(db.listClients());
});

app.get('/admin/availability', (req, res) => {
	res.json(db.getAvailability());
});

app.post('/admin/availability', basicAuth, express.json(), (req, res) => {
	try {
		const result = validateAvailabilityPayload(req.body || {});
		if (result.error) return res.status(400).json({ ok: false, error: result.error });
		const availability = db.updateAvailability(result.availability);
		appendLog('bookings.log', `ADMIN_AVAILABILITY open=${availability.open} hours=${availability.openTime}-${availability.closeTime} closedDates=${availability.closedDates.join(',')}`);
		return res.json({ ok: true, availability });
	} catch (e) {
		console.error('availability update err', e && e.message);
		return res.status(500).json({ ok: false, error: e && e.message });
	}
});

// Admin: disable birthday messages for a client
app.post('/admin/clients/:id/disable', basicAuth, express.json(), (req, res) => {
	const id = String(req.params.id || '');
	const client = db.getClient(id);
	if (!client) return res.status(404).json({ ok: false, error: 'not_found' });
	try {
		db.updateClient(id, { disabledBirthday: true });
		appendLog('bookings.log', `ADMIN_DISABLE_CLIENT id=${id}`);
		return res.json({ ok: true });
	} catch (e) {
		console.error('disable client err', e && e.message);
		return res.status(500).json({ ok: false, error: e && e.message });
	}
});

// Admin: enable birthday messages for a client
app.post('/admin/clients/:id/enable', basicAuth, express.json(), (req, res) => {
	const id = String(req.params.id || '');
	const client = db.getClient(id);
	if (!client) return res.status(404).json({ ok: false, error: 'not_found' });
	try {
		db.updateClient(id, { disabledBirthday: false });
		appendLog('bookings.log', `ADMIN_ENABLE_CLIENT id=${id}`);
		return res.json({ ok: true });
	} catch (e) {
		console.error('enable client err', e && e.message);
		return res.status(500).json({ ok: false, error: e && e.message });
	}
});

// Admin: send birthday message to a client immediately
app.post('/admin/clients/:id/send-birthday-now', basicAuth, express.json(), async (req, res) => {
	const id = String(req.params.id || '');
	const client = db.getClient(id);
	if (!client) return res.status(404).json({ ok: false, error: 'not_found' });
	if (!client.phone) return res.status(400).json({ ok: false, error: 'no_phone' });
	try {
		const name = client.name || 'there';
		const msg = `Happy birthday ${name}! Wishing you a wonderful day from the salon. you have half price on all services today!`;
		// Use sendSms (will use Twilio when configured)
		await sendSms(client.phone, msg);
		const yearNow = String(new Date().getFullYear());
		db.updateClient(id, { lastBirthdaySent: yearNow });
		appendLog('bookings.log', `ADMIN_SEND_BIRTHDAY id=${id}`);
		return res.json({ ok: true });
	} catch (e) {
		console.error('send-birthday-now err', e && (e.stack || e.message || e));
		return res.status(500).json({ ok: false, error: e && (e.message || String(e)) });
	}
});

// Approve/reject via token links sent in SMS to employee (public links)
app.get('/action/approve/:token', async (req, res) => {
    console.log('ACTION approve/reject hit, token:', req.params.token);
	const token = String(req.params.token || '');
	const booking = db.listBookings().find(b => b && b.approvalToken === token);
	if (!booking) return res.status(404).send('Approval token not found or expired.');
	// check expiry
	if (booking.approvalTokenExpires && Date.now() > booking.approvalTokenExpires) return res.status(410).send('Approval token expired.');
	booking.status = 'approved';
	booking.approvalToken = null;
	booking.approvalTokenExpires = null;
	db.updateBooking(booking);
	// send confirmation SMS to client
	try {
		const when = booking.appointmentTime ? ` on ${booking.appointmentTime}` : '';
		const name = booking.customerName || 'there';
		const service = booking.serviceName || 'service';
		const msg = `Hi ${name}, your appointment for ${service}${when} has been confirmed! See you then. - Peggy Beauty Salon`;
		if (booking.phone) await sendSms(booking.phone, msg);
		appendLog('bookings.log', `TOKEN_APPROVE id=${booking.id}`);
	} catch (e) { console.error('Error sending client confirmation SMS', e && e.message); }
	return res.send('<html><body><h2>Booking approved</h2><p>Thank you — the client has been notified.</p><p><a href="/admin.html">Back to admin</a></p></body></html>');
});

app.get('/action/reject/:token', async (req, res) => {
    console.log('ACTION approve/reject hit, token:', req.params.token);
	const token = String(req.params.token || '');
	const booking = db.listBookings().find(b => b && b.approvalToken === token);
	if (!booking) return res.status(404).send('Approval token not found or expired.');
	if (booking.approvalTokenExpires && Date.now() > booking.approvalTokenExpires) return res.status(410).send('Approval token expired.');
	booking.status = 'rejected';
	booking.approvalToken = null;
	booking.approvalTokenExpires = null;
	db.updateBooking(booking);
	try {
		const when = booking.appointmentTime ? ` on ${booking.appointmentTime}` : '';
		const name = booking.customerName || 'there';
		const service = booking.serviceName || 'service';
		const msg = `Hi ${name}, unfortunately your appointment request for ${service}${when} could not be accommodated. Please call us to reschedule. - Peggy Beauty Salon`;
		if (booking.phone) await sendSms(booking.phone, msg);
		appendLog('bookings.log', `TOKEN_REJECT id=${booking.id}`);
	} catch (e) { console.error('Error sending client rejection SMS', e && e.message); }
	return res.send('<html><body><h2>Booking rejected</h2><p>The client has been notified.</p><p><a href="/admin.html">Back to admin</a></p></body></html>');
});

// Admin: approve/reject a booking (from admin UI)
app.post('/admin/bookings/:id/:act', basicAuth, express.json(), async (req, res) => {
	const id = String(req.params.id || '');
	const act = String(req.params.act || '').toLowerCase();
	const booking = db.getBooking(id);
	if (!booking) return res.status(404).json({ ok: false, error: 'not_found' });
	if (act !== 'approve' && act !== 'reject') return res.status(400).json({ ok: false, error: 'invalid_action' });
	booking.status = act === 'approve' ? 'approved' : 'rejected';
	booking.approvalToken = null;
	booking.approvalTokenExpires = null;
	db.updateBooking(booking);
	// send confirmation to client
	try {
		const when = booking.appointmentTime ? ` on ${booking.appointmentTime}` : '';
		const name = booking.customerName || 'there';
		const service = booking.serviceName || 'service';
		const msg = act === 'approve'
			? `Hi ${name}, your appointment for ${service}${when} has been confirmed! See you then. - Peggy Beauty Salon`
			: `Hi ${name}, unfortunately your appointment request for ${service}${when} could not be accommodated. Please call us to reschedule. - Peggy Beauty Salon`;
		if (booking.phone) await sendSms(booking.phone, msg);
		appendLog('bookings.log', `ADMIN_${act.toUpperCase()} id=${booking.id}`);
	} catch (e) { console.error('Error sending client SMS from admin action', e && e.message); }
	return res.json({ ok: true, booking });
});

// Twilio debug endpoint (basic masking) - protected by admin basic auth
app.get('/twilio-debug', basicAuth, async (req, res) => {
	if (!TWILIO_SID || !TWILIO_TOKEN) return res.json({ ok: false, error: 'missing_twilio_env' });
	try {
		const https = require('https');
		const auth = 'Basic ' + Buffer.from(`${TWILIO_SID}:${TWILIO_TOKEN}`).toString('base64');
		const options = {
			hostname: 'api.twilio.com',
			port: 443,
			path: `/2010-04-01/Accounts/${TWILIO_SID}.json`,
			method: 'GET',
			headers: { Authorization: auth },
		};
		const result = await new Promise((resolve, reject) => {
			const req2 = https.request(options, (resp) => {
				let data = '';
				resp.on('data', (c) => (data += c));
				resp.on('end', () => resolve({ status: resp.statusCode, body: data }));
			});
			req2.on('error', reject);
			req2.end();
		});
		// Mask token length only
		return res.json({ ok: true, twilio: { sid: `${TWILIO_SID.slice(0,4)}...${TWILIO_SID.slice(-4)}`, tokenLen: (TWILIO_TOKEN||'').length, status: result.status, body: result.body } });
	} catch (e) {
		return res.json({ ok: false, error: e && (e.message || e) });
	}
});

// Simple env debug (admin-protected)
app.get('/env-debug', basicAuth, (req, res) => {
	return res.json({ EMPLOYEE_PHONE: EMPLOYEE_PHONE || null, TWILIO_FROM: TWILIO_FROM || null });
});

// Send birthday messages to clients whose birthday matches today (month-day)
async function sendBirthdayMessages() {
	try {
		const clients = db.listClients();
		if (!clients || !clients.length) return;
		const now = new Date();
		const mm = String(now.getMonth() + 1).padStart(2, '0');
		const dd = String(now.getDate()).padStart(2, '0');
		const today = `${mm}-${dd}`;
		let sent = 0;
		clients.forEach(c => {
			if (!c.birthday) return;
			if (c.disabledBirthday) return;
			// Accept YYYY-MM-DD or MM-DD formats
			const parts = c.birthday.split('-');
			let monDay = '';
			if (parts.length === 3) monDay = `${parts[1]}-${parts[2]}`;
			else if (parts.length === 2) monDay = `${parts[0]}-${parts[1]}`;
			if (monDay === today) {
				// avoid duplicate sends in the same year
				const yearNow = String(now.getFullYear());
				if (c.lastBirthdaySent && String(c.lastBirthdaySent) === yearNow) return;
				const to = c.phone || c.email || '';
				if (!to) return;
				const name = c.name || 'there';
				const msg = `Happy birthday ${name}! Wishing you a wonderful day from the salon. you have half price on all services today!`;
				try {
					sendSms(c.phone || c.email, msg).catch(e => console.error('birthday sms err', e && e.message));
					// mark as sent for this year
					try { db.updateClient(c.id, { lastBirthdaySent: yearNow }); } catch (e) { console.error('updateClient err', e && e.message); }
					sent++;
				} catch (e) { console.error('birthday sms err', e && e.message); }
			}
		});
		return sent;
	} catch (err) {
		console.error('sendBirthdayMessages err', err && err.message);
	}
}

// Run on a long-lived local server. On Vercel, use the admin trigger endpoint
// or a Vercel Cron route instead of keeping a serverless function alive.
if (!process.env.VERCEL) {
	try { sendBirthdayMessages(); } catch (e) {}
	setInterval(sendBirthdayMessages, 24 * 60 * 60 * 1000);
}
