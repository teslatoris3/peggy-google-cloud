const fs = require('fs');
const path = require('path');

const file = process.env.OPENING_HOURS_FILE || (
  process.env.VERCEL ? path.join('/tmp', 'peggy-opening-hours.json') : path.join(__dirname, 'opening-hours.json')
);

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const DEFAULT_HOURS = [
  { day: 'Monday',    open: true,  openTime: '10:00', closeTime: '18:00' },
  { day: 'Tuesday',   open: true,  openTime: '10:00', closeTime: '18:00' },
  { day: 'Wednesday', open: true,  openTime: '10:00', closeTime: '18:00' },
  { day: 'Thursday',  open: true,  openTime: '10:00', closeTime: '18:00' },
  { day: 'Friday',    open: true,  openTime: '10:00', closeTime: '18:00' },
  { day: 'Saturday',  open: true,  openTime: '09:00', closeTime: '16:00' },
  { day: 'Sunday',    open: false, openTime: '10:00', closeTime: '18:00' },
];

function normalizeEntry(entry) {
  const day = DAYS.includes(entry && entry.day) ? entry.day : null;
  if (!day) return null;
  const open = entry.open !== false;
  const openTime = /^\d{2}:\d{2}$/.test(entry && entry.openTime) ? entry.openTime : '10:00';
  const closeTime = /^\d{2}:\d{2}$/.test(entry && entry.closeTime) ? entry.closeTime : '18:00';
  return { day, open, openTime, closeTime };
}

function normalize(data) {
  const map = {};
  DEFAULT_HOURS.forEach((d) => { map[d.day] = { ...d }; });
  if (Array.isArray(data)) {
    data.forEach((entry) => {
      const n = normalizeEntry(entry);
      if (n) map[n.day] = n;
    });
  }
  return DAYS.map((d) => map[d]);
}

function getHours() {
  if (!fs.existsSync(file)) return normalize([]);
  try {
    const raw = fs.readFileSync(file, 'utf8');
    const parsed = JSON.parse(raw);
    return normalize(parsed);
  } catch (e) {
    return normalize([]);
  }
}

function setHours(data) {
  const normalized = normalize(data);
  fs.writeFileSync(file, JSON.stringify(normalized, null, 2), 'utf8');
  return normalized;
}

module.exports = { getHours, setHours, DEFAULT_HOURS, DAYS };
