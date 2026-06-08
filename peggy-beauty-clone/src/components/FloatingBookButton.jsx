import React from 'react'
import { getBookingUrl } from '../config/booking'

export default function FloatingBookButton() {
  const url = getBookingUrl()
  const notify = async () => {
    try {
      fetch(`${url}/notify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ source: 'floating_button', page: window.location.pathname })
      }).catch(() => {});
    } catch (e) {}
  }
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      onClick={notify}
      style={{ position: 'fixed', right: 18, bottom: 18, zIndex: 9999 }}
      className="rounded-full bg-primary px-4 py-3 text-sm font-semibold text-deep-black shadow-lg hover:scale-105 transition-transform"
    >
      Book Now
    </a>
  )
}
