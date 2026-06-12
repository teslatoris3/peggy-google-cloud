import { Link } from 'react-router-dom'
import { getBookingUrl } from '../config/booking'


const hoursList = [
  { dayKey: 'Tuesday', label: 'TUESDAY', time: '10am-6pm' },
  { dayKey: 'Wednesday', label: 'WEDNESDAY', time: '10am-6pm' },
  { dayKey: 'Thursday', label: 'THURSDAY', time: '10am-8pm' },
  { dayKey: 'Friday', label: 'FRIDAY', time: '10am-6pm' },
  { dayKey: 'Saturday', label: 'SATURDAY', time: '9am-4pm' },
  { dayKey: 'Sunday', label: 'SUNDAY', time: 'CLOSED' },
  { dayKey: 'Monday', label: 'MONDAY', time: '6am-10pm' },
]


function VisitUsSection() {
  const today = null

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

            <div className="pl-8">
              <div className="md:h-full md:flex md:items-center">
                <div className="border-l border-gray-300 h-full md:pl-8 flex items-center">
                  <div className="working-hours md:min-h-[420px] w-full">
                    <div className="brand-card w-full" style={{ padding: '1.5rem' }}>
                      <ul className="elementor-icon-list-items space-y-8 md:space-y-10">
                        {hoursList.map(({ dayKey, label, time }) => (
                          <li className="elementor-icon-list-item" key={dayKey}>
                            <span className={`elementor-icon-list-text ${dayKey === today ? 'font-semibold text-deep-black' : 'text-muted-text'}`}>
                              {label} - {time}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default VisitUsSection
