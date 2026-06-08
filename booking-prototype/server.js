require('dotenv').config();
const express = require('express');
const path = require('path');

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

const TWILIO_SID = process.env.TWILIO_SID || '';
const TWILIO_TOKEN = process.env.TWILIO_TOKEN || '';
const TWILIO_FROM = process.env.TWILIO_FROM || '';
const EMPLOYEE_PHONE = process.env.EMPLOYEE_PHONE || '';
const TWILIO_MESSAGING_SERVICE_SID = process.env.TWILIO_MESSAGING_SERVICE_SID || '';
const DEPOSIT_ENABLED = (process.env.DEPOSIT_ENABLED || 'false') === 'true';

async function sendSms(to, body) {
  if (TWILIO_SID && TWILIO_TOKEN && TWILIO_FROM) {
    // use Twilio REST API via fetch
    const url = `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_SID}/Messages.json`;
    const params = new URLSearchParams();
    // Prefer MessagingServiceSid if configured
    if (TWILIO_MESSAGING_SERVICE_SID) {
      params.append('MessagingServiceSid', TWILIO_MESSAGING_SERVICE_SID);
    } else {
      params.append('From', TWILIO_FROM);
    }
    params.append('To', to);
    params.append('Body', body);
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: 'Basic ' + Buffer.from(`${TWILIO_SID}:${TWILIO_TOKEN}`).toString('base64'),
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    });
    const json = await res.json();
    return json;
  }

  // Simulate SMS for local testing
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

  const base = `${process.env.PUBLIC_BASE_URL || `http://localhost:${PORT || 4000}`}`;
  const accept = `${base}/action/approve/${token}`;
  const reject = `${base}/action/reject/${token}`;
  const adminList = `${base}/admin.html`;
  const when = booking.appointmentTime ? ` at ${booking.appointmentTime}` : '';
  const details = `Name: ${booking.customerName}\nEmail: ${booking.email || ''}\nPhone: ${booking.phone || ''}\nService: ${booking.serviceName || ''}${when}`;
  const msg = `New booking #${booking.id}\n${details}\nApprove: ${accept}\nReject: ${reject}\nAdmin list: ${adminList}`;
  console.log('Approval SMS body:\n', msg);
  try {
    await sendSms(booking.approvalSentTo, msg);
    console.log('Approval SMS sent to', booking.approvalSentTo);
  } catch (err) {
    console.error('Failed to send SMS', err && err.message);
  }
}

// Record an approved booking into documents.txt (CSV-style)
function recordApproval(booking) {
  try {
    if (!booking) return;
    const header = 'id,customerName,appointmentTime,serviceName,status,loggedAt\n';
    if (!fs.existsSync(DOCUMENTS_FILE)) {
      fs.writeFileSync(DOCUMENTS_FILE, header, 'utf8');
    }
    const when = booking.appointmentTime ? booking.appointmentTime.replace(/\n|\r|,/g, ' ') : '';
    const line = `${booking.id},"${(booking.customerName||'').replace(/"/g,'""')}","${when}","${(booking.serviceName||'').replace(/"/g,'""')}",${booking.status || ''},${new Date().toISOString()}\n`;
    fs.appendFileSync(DOCUMENTS_FILE, line, 'utf8');
  } catch (e) {
    console.error('recordApproval error', e && e.message);
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
    // Require appointmentTime always; depositAmount only when deposit workflow is enabled
    if (!customerName || !email || !appointmentTime || (DEPOSIT_ENABLED && (depositAmount === undefined || depositAmount === null))) {
      return res.status(400).json({ error: 'Missing required fields' });
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
          sendSms(c.phone || c.email, msg);
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

// Admin endpoint to trigger birthday messages immediately (protected by basicAuth)
app.post('/admin/send-birthdays-now', express.json(), async (req, res) => {
  try {
    const count = await sendBirthdayMessages();
    return res.json({ ok: true, sent: typeof count === 'number' ? count : 0 });
  } catch (e) {
    console.error('admin send birthdays err', e && e.message);
    return res.status(500).json({ ok: false, error: 'send_failed' });
  }
});

// Admin: disable birthday messages for a client
app.post('/admin/clients/:id/disable', express.json(), (req, res) => {
  const id = req.params.id;
  const updated = db.updateClient(id, { disabledBirthday: true });
  if (!updated) return res.status(404).json({ error: 'not_found' });
  return res.json({ ok: true, client: updated });
});

// Admin: enable birthday messages for a client
app.post('/admin/clients/:id/enable', express.json(), (req, res) => {
  const id = req.params.id;
  const updated = db.updateClient(id, { disabledBirthday: false });
  if (!updated) return res.status(404).json({ error: 'not_found' });
  return res.json({ ok: true, client: updated });
});

// Admin: send birthday message now for a specific client (force send)
app.post('/admin/clients/:id/send-birthday-now', express.json(), async (req, res) => {
  try {
    const id = req.params.id;
    const client = db.getClient(id);
    if (!client) return res.status(404).json({ error: 'not_found' });
    if (!client.phone && !client.email) return res.status(400).json({ error: 'no_contact' });
    const name = client.name || 'there';
    const msg = `Happy birthday ${name}! Wishing you a wonderful day from the salon. you have half price on all services today!`;
    try { await sendSms(client.phone || client.email, msg); } catch (e) { console.error('send-bday-now err', e && e.message); }
    try { db.updateClient(id, { lastBirthdaySent: String(new Date().getFullYear()) }); } catch (e) {}
    return res.json({ ok: true });
  } catch (e) {
    console.error('send birthday now err', e && e.message);
    return res.status(500).json({ ok: false });
  }
});

// Admin: resend approval SMS for a booking
app.post('/admin/bookings/:id/resend-approval', express.json(), (req, res) => {
  const id = req.params.id;
  const booking = db.getBooking(id);
  if (!booking) return res.status(404).json({ error: 'not_found' });
  try {
    createAndSendApproval(booking).then(() => {
      res.json({ ok: true, booking: db.getBooking(id) });
    }).catch(err => {
      console.error('resend approval err', err && err.message);
      res.status(500).json({ error: 'send_failed' });
    });
  } catch (e) {
    console.error('resend approval exception', e && e.message);
    res.status(500).json({ error: 'send_failed' });
  }
});

app.post('/admin/bookings/:id/approve', express.json(), (req, res) => {
  const id = req.params.id;
  const updated = db.setStatus(id, 'approved');
  if (!updated) return res.status(404).json({ error: 'not_found' });
  // notify client via SMS if possible
  try {
    if (updated.phone) {
      const when = updated.appointmentTime ? ` at ${updated.appointmentTime}` : '';
      const clientMsg = `Your booking #${updated.id} for ${updated.serviceName}${when} was APPROVED by the salon.`;
      console.log('Notify client SMS body:\n', clientMsg);
      sendSms(updated.phone, clientMsg).catch(e => console.error('notify client sms err', e && e.message));
    }
  } catch (e) {
    console.error('Error sending client approval SMS', e && e.message);
  }
  // record approval in documents.txt
  try { recordApproval(updated); } catch(e) {}
  res.json({ ok: true, booking: updated });
});

app.post('/admin/bookings/:id/reject', express.json(), async (req, res) => {
  const id = req.params.id;
  const booking = db.getBooking(id);
  if (!booking) return res.status(404).json({ error: 'not_found' });

  // If a real Stripe key is configured and we have a session id, attempt refund
  try {
    if (stripe && booking.payment && booking.payment.session_id && !booking.simulated) {
      // Try to retrieve the Checkout Session to find the payment_intent
      const session = await stripe.checkout.sessions.retrieve(booking.payment.session_id);
      const payment_intent = session.payment_intent || booking.payment.payment_intent;
      if (payment_intent) {
        await stripe.refunds.create({ payment_intent });
        db.setStatus(id, 'rejected');
        return res.json({ ok: true, refunded: true, booking: db.getBooking(id) });
      }
    }
  } catch (err) {
    console.error('Refund error', err && err.message);
    // continue to mark rejected even if refund failed
  }

  db.setStatus(id, 'rejected');
  // notify client via SMS that booking was rejected
  try {
    const b = db.getBooking(id);
    if (b && b.phone) {
      const when = b.appointmentTime ? ` at ${b.appointmentTime}` : '';
      const clientMsg = `Your booking #${b.id} for ${b.serviceName}${when} was REJECTED by the salon.`;
      console.log('Notify client SMS body:\n', clientMsg);
      sendSms(b.phone, clientMsg).catch(e => console.error('notify client sms err', e && e.message));
    }
  } catch (e) {
    console.error('Error sending client rejection SMS', e && e.message);
  }

  return res.json({ ok: true, refunded: false, booking: db.getBooking(id) });
});

// Token-based approve/reject links (used in SMS)
// Redirect link endpoints open the friendly approval UI which will call the API
app.get('/approve-link/:token', (req, res) => {
  const token = req.params.token;
  res.redirect(`/approval-result.html?token=${token}&action=approve`);
});

app.get('/reject-link/:token', (req, res) => {
  const token = req.params.token;
  res.redirect(`/approval-result.html?token=${token}&action=reject`);
});

// Server-side immediate action links: perform approve/reject and return simple HTML confirmation.
app.get('/action/approve/:token', (req, res) => {
  const token = req.params.token;
  const bookings = db.listBookings();
  const booking = bookings.find(b => b.approvalToken === token && (!b.approvalTokenExpires || b.approvalTokenExpires > Date.now()));
  if (!booking) return res.status(404).send('<h1>Invalid or expired link</h1>');
  db.setStatus(booking.id, 'approved');
  const updated = db.getBooking(booking.id);
  // record approval
  try { recordApproval(updated); } catch (e) {}
  if (updated && updated.phone) {
    const when = updated.appointmentTime ? ` at ${updated.appointmentTime}` : '';
    const clientMsg = `Your booking #${updated.id} for ${updated.serviceName}${when} was APPROVED.`;
    console.log('Notify client SMS body:\n', clientMsg);
    sendSms(updated.phone, clientMsg).catch(() => {});
  }
  res.send(`<html><body><h1>Booking ${booking.id} approved</h1><p>You can close this window.</p></body></html>`);
});

app.get('/action/reject/:token', (req, res) => {
  const token = req.params.token;
  const bookings = db.listBookings();
  const booking = bookings.find(b => b.approvalToken === token && (!b.approvalTokenExpires || b.approvalTokenExpires > Date.now()));
  if (!booking) return res.status(404).send('<h1>Invalid or expired link</h1>');
  db.setStatus(booking.id, 'rejected');
  const updated = db.getBooking(booking.id);
  if (updated && updated.phone) {
    const when = updated.appointmentTime ? ` at ${updated.appointmentTime}` : '';
    const clientMsg = `Your booking #${updated.id} for ${updated.serviceName}${when} was REJECTED.`;
    console.log('Notify client SMS body:\n', clientMsg);
    sendSms(updated.phone, clientMsg).catch(() => {});
  }
  res.send(`<html><body><h1>Booking ${booking.id} rejected</h1><p>You can close this window.</p></body></html>`);
});

// API endpoints to perform approve/reject actions by token (used by approval-result.html)
app.get('/api/approve/:token', (req, res) => {
  const token = req.params.token;
  const bookings = db.listBookings();
  const booking = bookings.find(b => b.approvalToken === token && (!b.approvalTokenExpires || b.approvalTokenExpires > Date.now()));
  if (!booking) return res.status(404).json({ error: 'invalid_or_expired' });
  db.setStatus(booking.id, 'approved');
  const updated = db.getBooking(booking.id);
  // record approval
  try { recordApproval(updated); } catch (e) {}
  // notify client
  if (updated && updated.phone) {
    const when = updated.appointmentTime ? ` at ${updated.appointmentTime}` : '';
    sendSms(updated.phone, `Your booking #${updated.id} for ${updated.serviceName}${when} was APPROVED.`).catch(e => console.error('notify client sms err', e && e.message));
  }
  return res.json({ ok: true, booking: updated });
});

app.get('/api/reject/:token', (req, res) => {
  const token = req.params.token;
  const bookings = db.listBookings();
  const booking = bookings.find(b => b.approvalToken === token && (!b.approvalTokenExpires || b.approvalTokenExpires > Date.now()));
  if (!booking) return res.status(404).json({ error: 'invalid_or_expired' });
  db.setStatus(booking.id, 'rejected');
  const updated = db.getBooking(booking.id);
  if (updated && updated.phone) {
    const when = updated.appointmentTime ? ` at ${updated.appointmentTime}` : '';
    sendSms(updated.phone, `Your booking #${updated.id} for ${updated.serviceName}${when} was REJECTED.`).catch(e => console.error('notify client sms err', e && e.message));
  }
  return res.json({ ok: true, booking: updated });
});

// Endpoint to receive inbound SMS (e.g., employee replies "approve 12" or "reject 12")
app.post('/sms', express.urlencoded({ extended: false }), (req, res) => {
  try {
    const from = (req.body.From || req.body.from || '').toString();
    const body = (req.body.Body || req.body.body || '').toString().trim();
    if (!from || !body) return res.status(400).send('missing');

    // Normalize phones to digits only for comparison
    const norm = (s) => (s || '').toString().replace(/[^0-9]/g, '');
    const fromDigits = norm(from);
    const employeeDigits = norm(EMPLOYEE_PHONE || '');

    // Only allow actions from configured employee phone (if set)
    if (employeeDigits && !fromDigits.endsWith(employeeDigits) && !employeeDigits.endsWith(fromDigits)) {
      console.log('Ignoring inbound SMS from unknown number', from);
      return res.status(403).send('forbidden');
    }

    const m = body.match(/^(approve|reject)\s+(\d+)$/i);
    if (!m) {
      console.log('Inbound SMS did not match action pattern:', body);
      return res.status(200).send('unrecognized');
    }
    const action = m[1].toLowerCase();
    const id = m[2];
    const b = db.getBooking(id);
    if (!b) return res.status(404).send('not_found');

    if (action === 'approve') {
      db.setStatus(id, 'approved');
      const updated = db.getBooking(id);
      try { recordApproval(updated); } catch (e) {}
      if (updated && updated.phone) {
        const when = updated.appointmentTime ? ` at ${updated.appointmentTime}` : '';
        sendSms(updated.phone, `Your booking #${updated.id} for ${updated.serviceName}${when} was APPROVED by the salon.`).catch(e => console.error('notify client sms err', e && e.message));
      }
      return res.status(200).send('ok');
    } else if (action === 'reject') {
      db.setStatus(id, 'rejected');
      const updated = db.getBooking(id);
      if (updated && updated.phone) {
        const when = updated.appointmentTime ? ` at ${updated.appointmentTime}` : '';
        sendSms(updated.phone, `Your booking #${updated.id} for ${updated.serviceName}${when} was REJECTED by the salon.`).catch(e => console.error('notify client sms err', e && e.message));
      }
      return res.status(200).send('ok');
    }
  } catch (err) {
    console.error('Inbound SMS handler error', err && err.message);
    return res.status(500).send('error');
  }
});

// Serve the documents.txt file for quick viewing
app.get('/documents.txt', (req, res) => {
  try {
    if (!fs.existsSync(DOCUMENTS_FILE)) {
      fs.writeFileSync(DOCUMENTS_FILE, 'id,customerName,appointmentTime,serviceName,status,loggedAt\n', 'utf8');
    }
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.send(fs.readFileSync(DOCUMENTS_FILE, 'utf8'));
  } catch (e) {
    console.error('documents serve error', e && e.message);
    res.status(500).send('error');
  }
});

module.exports = app;
