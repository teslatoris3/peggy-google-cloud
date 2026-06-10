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
  const open = (e) => { e.preventDefault(); try { notify() } catch (e) {} ; console.log('DEBUG booking url:', url); window.open(url, '_blank') }

  return (
    <a
      href={url}
      onClick={open}
      rel="noopener noreferrer"
      style={{ position: 'fixed', right: 18, bottom: 18, zIndex: 9999 }}
      className="rounded-full bg-primary px-4 py-3 text-sm font-semibold text-deep-black shadow-lg hover:scale-105 transition-transform"
    >
      Book Now
    </a>
  )
}
