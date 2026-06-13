import { useEffect, useMemo, useState } from 'react'
import { getAvailabilityUrl, getBookingUrl, getOpeningHoursUrl } from '../config/booking'

const FALLBACK_HOURS = [
  { day: 'Monday',    open: true,  openTime: '10:00', closeTime: '18:00' },
  { day: 'Tuesday',   open: true,  openTime: '10:00', closeTime: '18:00' },
  { day: 'Wednesday', open: true,  openTime: '10:00', closeTime: '18:00' },
  { day: 'Thursday',  open: true,  openTime: '10:00', closeTime: '18:00' },
  { day: 'Friday',    open: true,  openTime: '10:00', closeTime: '18:00' },
  { day: 'Saturday',  open: true,  openTime: '09:00', closeTime: '16:00' },
  { day: 'Sunday',    open: false, openTime: '10:00', closeTime: '18:00' },
]

function fmt(time) {
  if (!time) return ''
  const [h, m] = time.split(':').map(Number)
  const suffix = h >= 12 ? 'pm' : 'am'
  const hour = h % 12 || 12
  return m === 0 ? `${hour}${suffix}` : `${hour}:${String(m).padStart(2, '0')}${suffix}`
}

async function fetchWithRetry(url, retries = 3, delayMs = 1500) {
  for (let i = 0; i <= retries; i++) {
    try {
      const res = await fetch(url, { cache: 'no-store' })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      return await res.json()
    } catch (err) {
      if (i === retries) throw err
      await new Promise((r) => setTimeout(r, delayMs * (i + 1)))
    }
  }
}

const weekdayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

function formatDateKey(date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function VisitUsSection() {
  const [hoursList, setHoursList] = useState(FALLBACK_HOURS)
  const [closedDates, setClosedDates] = useState([])

  useEffect(() => {
    let ignore = false

    async function loadOpeningHours() {
      try {
        const data = await fetchWithRetry(getOpeningHoursUrl())
        if (!ignore && Array.isArray(data)) setHoursList(data)
      } catch {
        // keep fallback hours
      }
    }

    async function loadAvailability() {
      try {
        const res = await fetchWithRetry(getAvailabilityUrl())
        if (!ignore && Array.isArray(res.closedDates)) setClosedDates(res.closedDates)
      } catch {
        // keep empty closed dates
      }
    }

    loadOpeningHours()
    loadAvailability()
    const refreshTimer = window.setInterval(() => {
      loadOpeningHours()
      loadAvailability()
    }, 15000)
    window.addEventListener('focus', loadOpeningHours)
    window.addEventListener('focus', loadAvailability)

    return () => {
      ignore = true
      window.clearInterval(refreshTimer)
      window.removeEventListener('focus', loadOpeningHours)
      window.removeEventListener('focus', loadAvailability)
    }
  }, [])

  const closedDaysThisWeek = useMemo(() => {
    const closed = new Set(closedDates)
    const days = new Set()
    const start = new Date()
    for (let offset = 0; offset < 7; offset += 1) {
      const date = new Date(start)
      date.setDate(start.getDate() + offset)
      if (closed.has(formatDateKey(date))) days.add(weekdayNames[date.getDay()])
    }
    return days
  }, [closedDates])

  return (
    <section id="visit-us" className="w-full bg-[#F7E6E2]">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid gap-6 md:grid-cols-2 items-stretch">
          <div className="flex items-center">
            <div className="w-full text-center md:text-left md:flex md:flex-col md:items-center md:justify-center md:min-h-[420px] space-y-6 md:space-y-10">
              <p className="text-sm md:text-base font-bold uppercase tracking-[0.22em] text-primary">VISIT US</p>
              <h2 className="opening-script text-5xl md:text-7xl">Opening Hours</h2>
              {(() => {
                const url = getBookingUrl()
                const open = (e) => { e.preventDefault(); window.open(url, '_blank') }
                return (
                  <a href={url} onClick={open} rel="noopener noreferrer" className="inline-flex items-center rounded border border-black px-6 py-3 text-lg md:text-xl text-deep-black font-semibold">
                    BOOK YOUR CONSULTATION
                  </a>
                )
              })()}
            </div>
          </div>

          <div className="pl-8">
            <div className="md:h-full md:flex md:items-center">
              <div className="border-l border-gray-300 h-full md:pl-8 flex items-center">
                <div className="working-hours md:min-h-[420px] w-full">
                  <div className="brand-card w-full" style={{ padding: '1.5rem' }}>
                    <ul className="elementor-icon-list-items space-y-8 md:space-y-10">
                      {hoursList.map(({ day, open, openTime, closeTime }) => {
                        const isClosed = !open || closedDaysThisWeek.has(day)
                        const displayTime = isClosed ? 'CLOSED' : `${fmt(openTime)}-${fmt(closeTime)}`
                        return (
                          <li className="elementor-icon-list-item" key={day}>
                            <span className="elementor-icon-list-text text-muted-text">
                              {day.toUpperCase()} - {displayTime}
                            </span>
                          </li>
                        )
                      })}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default VisitUsSection
