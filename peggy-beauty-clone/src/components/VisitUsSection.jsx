import { useEffect, useMemo, useState } from 'react'
import { getAvailabilityUrl, getBookingUrl } from '../config/booking'
import LocationMap from './LocationMap'


const hoursList = [
  { dayKey: 'Tuesday', label: 'TUESDAY', time: '10am-6pm' },
  { dayKey: 'Wednesday', label: 'WEDNESDAY', time: '10am-6pm' },
  { dayKey: 'Thursday', label: 'THURSDAY', time: '10am-8pm' },
  { dayKey: 'Friday', label: 'FRIDAY', time: '10am-6pm' },
  { dayKey: 'Saturday', label: 'SATURDAY', time: '9am-4pm' },
  { dayKey: 'Sunday', label: 'SUNDAY', time: 'CLOSED' },
  { dayKey: 'Monday', label: 'MONDAY', time: '6am-10pm' },
]

const weekdayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

function formatDateKey(date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function VisitUsSection() {
  const today = null
  const [closedDates, setClosedDates] = useState([])

  useEffect(() => {
    let ignore = false

    async function loadAvailability() {
      try {
        const res = await fetch(getAvailabilityUrl(), { cache: 'no-store' })
        if (!res.ok) return
        const availability = await res.json()
        if (!ignore && Array.isArray(availability.closedDates)) {
          setClosedDates(availability.closedDates)
        }
      } catch (error) {
        // Keep the published hours unchanged if availability cannot be reached.
      }
    }

    loadAvailability()
    const refreshTimer = window.setInterval(loadAvailability, 15000)
    window.addEventListener('focus', loadAvailability)

    return () => {
      ignore = true
      window.clearInterval(refreshTimer)
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
      if (closed.has(formatDateKey(date))) {
        days.add(weekdayNames[date.getDay()])
      }
    }

    return days
  }, [closedDates])

  return (
    <>
      <section id="visit-us" className="w-full bg-[#F7E6E2]">
        <div className="mx-auto max-w-7xl px-6 py-12">
          <div className="grid gap-6 md:grid-cols-2 items-stretch">
            <div className="flex items-center">
              <div className="w-full text-center md:text-left md:flex md:flex-col md:items-center md:justify-center md:min-h-[420px] space-y-6 md:space-y-10">
                <p className="text-sm md:text-base font-bold uppercase tracking-[0.22em] text-primary">VISIT US</p>
                <h2 className="opening-script text-5xl md:text-7xl">Opening Hours</h2>

                {(() => {
                  const url = getBookingUrl()
                  const open = (e) => { e.preventDefault(); console.log('DEBUG booking url:', url); window.open(url, '_blank') }
                  return <a href={url} onClick={open} rel="noopener noreferrer" className="inline-flex items-center rounded border border-black px-6 py-3 text-lg md:text-xl text-deep-black font-semibold">BOOK YOUR CONSULTATION</a>
                })()}
              </div>
            </div>

            <div className="space-y-6 md:pl-8">
              <div className="md:h-full md:flex md:items-center">
                <div className="border-l border-gray-300 h-full md:pl-8 flex items-center">
                  <div className="working-hours md:min-h-[420px] w-full">
                    <div className="brand-card w-full" style={{ padding: '1.5rem' }}>
                      <ul className="elementor-icon-list-items space-y-8 md:space-y-10">
                        {hoursList.map(({ dayKey, label, time }) => {
                          const displayTime = closedDaysThisWeek.has(dayKey) ? 'CLOSED' : time
                          return (
                          <li className="elementor-icon-list-item" key={dayKey}>
                            <span className={`elementor-icon-list-text ${dayKey === today ? 'font-semibold text-deep-black' : 'text-muted-text'}`}>
                              {label} - {displayTime}
                            </span>
                          </li>
                          )
                        })}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <LocationMap
                title="Peggy Beauty location"
                caption="Find Peggy Beauty in North York, Toronto and open directions in Google Maps."
              />
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default VisitUsSection
