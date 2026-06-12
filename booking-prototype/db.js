const fs = require('fs');
const path = require('path');

const file = process.env.PERSIST_FILE || (
  process.env.VERCEL ? path.join('/tmp', 'peggy-booking-persist.json') : path.join(__dirname, 'persist.json')
);

const DEFAULT_AVAILABILITY = {
  open: true,
  openTime: '09:00',
  closeTime: '17:00',
  closedDates: [],
};

function normalizeAvailability(availability) {
  const source = availability && typeof availability === 'object' ? availability : {};
  const openTime = typeof source.openTime === 'string' && /^\d{2}:\d{2}$/.test(source.openTime) ? source.openTime : DEFAULT_AVAILABILITY.openTime;
  const closeTime = typeof source.closeTime === 'string' && /^\d{2}:\d{2}$/.test(source.closeTime) ? source.closeTime : DEFAULT_AVAILABILITY.closeTime;
  const closedDates = Array.isArray(source.closedDates)
    ? Array.from(new Set(source.closedDates.filter((date) => typeof date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(date)))).sort()
    : [];
  return {
    open: typeof source.open === 'boolean' ? source.open : DEFAULT_AVAILABILITY.open,
    openTime,
    closeTime,
    closedDates,
  };
}

function _read() {
  if (!fs.existsSync(file)) return { bookings: [], nextId: 1, clients: [], nextClientId: 1, availability: normalizeAvailability() };
  try {
    const d = JSON.parse(fs.readFileSync(file, 'utf8'));
    if (!d.bookings) d.bookings = [];
    if (!d.nextId) d.nextId = 1;
    if (!d.clients) d.clients = [];
    if (!d.nextClientId) d.nextClientId = 1;
    d.availability = normalizeAvailability(d.availability);
    return d;
  } catch (e) {
    return { bookings: [], nextId: 1, clients: [], nextClientId: 1, availability: normalizeAvailability() };
  }
}

function _write(data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf8');
}

function createBooking(b) {
  const data = _read();
  const id = data.nextId++;
  const booking = Object.assign({ id }, b);
  data.bookings.push(booking);
  _write(data);
  return booking;
}

function listClients() {
  const data = _read();
  return (data.clients || []).slice().reverse();
}

function upsertClient(c) {
  const data = _read();
  // try match by email then phone
  let found = null;
  if (c.email) found = data.clients.find(x => x.email && x.email.toLowerCase() === (c.email||'').toLowerCase());
  if (!found && c.phone) found = data.clients.find(x => x.phone && x.phone.replace(/[^0-9]/g,'') === (c.phone||'').replace(/[^0-9]/g,''));
  if (found) {
    found.name = c.name || found.name;
    if (c.birthday) found.birthday = c.birthday;
    if (c.email) found.email = c.email;
    if (c.phone) found.phone = c.phone;
    // preserve existing flags unless explicitly provided
    if (typeof c.disabledBirthday !== 'undefined') found.disabledBirthday = !!c.disabledBirthday;
    if (c.lastBirthdaySent) found.lastBirthdaySent = c.lastBirthdaySent;
  } else {
    const clientId = data.nextClientId++;
    found = { id: clientId, name: c.name || '', email: c.email || '', phone: c.phone || '', birthday: c.birthday || '', disabledBirthday: !!c.disabledBirthday, lastBirthdaySent: c.lastBirthdaySent || '' };
    data.clients.push(found);
  }
  _write(data);
  return found;
}

function updateClient(id, updates) {
  const data = _read();
  const idx = data.clients.findIndex((x) => String(x.id) === String(id));
  if (idx === -1) return null;
  const client = data.clients[idx];
  Object.keys(updates || {}).forEach(k => {
    client[k] = updates[k];
  });
  _write(data);
  return client;
}

function getClient(id) {
  const data = _read();
  return data.clients.find((c) => String(c.id) === String(id));
}

function listBookings() {
  const data = _read();
  return data.bookings.slice().reverse();
}

function getBooking(id) {
  const data = _read();
  return data.bookings.find((b) => String(b.id) === String(id));
}

function setCheckoutSessionId(id, sessionId) {
  const data = _read();
  const b = data.bookings.find((x) => String(x.id) === String(id));
  if (!b) return null;
  b.checkoutSessionId = sessionId;
  _write(data);
  return b;
}

function setPaymentConfirmed(id, payment) {
  const data = _read();
  const b = data.bookings.find((x) => String(x.id) === String(id));
  if (!b) return null;
  b.status = 'confirmed';
  b.payment = {
    amount_total: payment.amount_total,
    currency: payment.currency,
    payment_status: payment.payment_status,
    session_id: payment.session_id,
  };
  _write(data);
  return b;
}

function setStatus(id, status) {
  const data = _read();
  const b = data.bookings.find((x) => String(x.id) === String(id));
  if (!b) return null;
  b.status = status;
  _write(data);
  return b;
}

function updateBooking(b) {
  const data = _read();
  const idx = data.bookings.findIndex((x) => String(x.id) === String(b.id));
  if (idx === -1) return null;
  data.bookings[idx] = b;
  _write(data);
  return b;
}

function getAvailability() {
  const data = _read();
  return normalizeAvailability(data.availability);
}

function updateAvailability(updates) {
  const data = _read();
  const current = normalizeAvailability(data.availability);
  data.availability = normalizeAvailability(Object.assign({}, current, updates || {}));
  _write(data);
  return data.availability;
}

module.exports = {
  createBooking,
  listBookings,
  getBooking,
  setCheckoutSessionId,
  setPaymentConfirmed,
  setStatus,
  updateBooking,
  listClients,
  upsertClient,
  updateClient,
  getClient,
  getAvailability,
  updateAvailability,
  file,
};
