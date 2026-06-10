import React from 'react'
import { getBookingUrl } from '../config/booking'

function BookingButton() {
  const url = getBookingUrl()
  const open = (e) => { e.preventDefault(); window.open(url, '_blank') }

  return (
    <a href={url} onClick={open} rel="noopener noreferrer" className="inline-flex items-center rounded bg-primary px-4 py-2 text-sm font-semibold text-deep-black">Book Now</a>
  )
}

export default BookingButton
