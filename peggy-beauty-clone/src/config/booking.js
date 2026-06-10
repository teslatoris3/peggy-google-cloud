const DEFAULT_PRODUCTION_BOOKING_URL = 'https://peggybeautysalon.com/booking';
const LOCAL_BOOKING_URL = 'http://localhost:4000';

export function getBookingUrl() {
  const configuredUrl = import.meta.env.VITE_BOOKING_URL;
  if (configuredUrl) return configuredUrl.replace(/\/$/, '');

  if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
    return LOCAL_BOOKING_URL;
  }

  return DEFAULT_PRODUCTION_BOOKING_URL;
}

export function getServiceBookingUrl(serviceName) {
  const url = new URL(getBookingUrl());
  url.searchParams.set('service', serviceName);
  return url.toString();
}
