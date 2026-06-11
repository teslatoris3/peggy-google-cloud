import React from 'react'
import { getBookingUrl } from '../config/booking'

function BookingButton() {
  const url = getBookingUrl()
  const open = (e) => { e.preventDefault(); console.log('DEBUG booking url:', url); window.open(url, '_blank') }

  return (
    <a href={url} onClick={open} rel="noopener noreferrer" className="inline-flex items-center rounded bg-primary px-3 py-1.5 text-sm md:px-4 md:py-2 md:text-base font-semibold text-deep-black">Book Now</a>
  )
}

export default BookingButton
