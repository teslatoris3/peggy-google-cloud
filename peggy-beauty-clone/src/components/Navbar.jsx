import { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronDown, Menu, Phone, X } from 'lucide-react'
import OptimizedImage from './OptimizedImage'
import { getBookingUrl } from '../config/booking'
// Styles migrated to Tailwind in src/index.css

const navigation = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/services', label: 'Services' },
  { to: '/pricing', label: 'Pricing' },
  { to: '/gallery', label: 'Gallery' },
  { to: '/contact', label: 'Contact' },
]

function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [openMobileGroup, setOpenMobileGroup] = useState(null)
  const bookingUrl = getBookingUrl()

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 24)

    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    document.body.classList.toggle('drawer-open', isDrawerOpen)

    return () => document.body.classList.remove('drawer-open')
  }, [isDrawerOpen])

  const closeDrawer = () => {
    setIsDrawerOpen(false)
    setOpenMobileGroup(null)
  }

  return (
    <header className="w-full">
      <a className="announcement flex items-center justify-center gap-2 py-3 text-sm md:text-base font-medium" href="tel:+14165187979">
        <Phone size={14} aria-hidden="true" />
        <span>CALL NOW TO BOOK AN APPOINTMENT +14165187979</span>
      </a>

      <motion.div
        animate={{ boxShadow: isScrolled ? '0 10px 30px rgba(10,10,10,0.08)' : '0 0 0 rgba(10,10,10,0)'}}
        transition={{ duration: 0.25 }}
        className={`sticky top-0 z-40 overflow-x-clip bg-white/95 ${isScrolled ? 'backdrop-blur-safe' : ''}`}
      >
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-32">
            <div className="flex min-w-0 items-center gap-6">
              <NavLink to="/" className="flex h-14 w-44 shrink-0 items-center justify-center" aria-label="Peggy Beauty home">
                <OptimizedImage src="/images/logo.png" alt="Peggy Beauty" className="max-h-24 w-auto object-contain" />
              </NavLink>

              <nav className="hidden md:flex items-center gap-12 text-base md:text-2xl text-deep-black">
                {navigation.map((item) => (
                  <div className="group relative" key={item.label}>
                    <NavLink className="flex min-h-11 items-center hover:underline py-2 site-nav-link" to={item.to}>{item.label}</NavLink>
                    {item.items && (
                      <div className="absolute left-0 mt-3 bg-white text-black rounded shadow-lg opacity-0 pointer-events-none group-hover:pointer-events-auto group-hover:opacity-100 transition-opacity">
                        <ul className="p-4">
                          {item.items.map((it) => (
                            <li key={it.label}><NavLink className="flex min-h-11 items-center whitespace-nowrap px-2" to={it.to}>{it.label}</NavLink></li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </nav>
            </div>

            <div className="flex items-center gap-4">
              <a href={bookingUrl} onClick={(e) => {
                e.preventDefault();
                try { fetch(`${bookingUrl}/notify`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ source: 'navbar', page: window.location.pathname }) }).catch(() => {}); } catch(e){}
                console.log('Opening booking URL:', bookingUrl);
                window.open(bookingUrl, '_blank')
              }} className="min-h-11 items-center rounded bg-primary px-6 py-3 md:px-8 md:py-3 text-lg font-semibold text-deep-black inline-flex" rel="noopener noreferrer">Book Now</a>
              <button className="flex h-11 w-11 items-center justify-center text-deep-black md:hidden" onClick={() => setIsDrawerOpen(true)} aria-label="Open menu"><Menu /></button>
            </div>
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {isDrawerOpen && (
          <>
            <motion.button animate={{ opacity: 1 }} aria-label="Close navigation menu" className="fixed inset-0 bg-black/40 z-50" exit={{ opacity: 0 }} initial={{ opacity: 0 }} onClick={closeDrawer} type="button" style={{ zIndex: 99999 }} />
            <motion.aside animate={{ x: 0 }} className="fixed right-0 top-0 h-full w-80 bg-white shadow-lg z-50" exit={{ x: '100%' }} initial={{ x: '100%' }} transition={{ duration: 0.28, ease: 'easeOut' }} style={{ zIndex: 99999 }}>
              <div className="p-4 flex items-center justify-between">
                <OptimizedImage src="/images/logo.png" alt="Peggy Beauty" className="h-10" />
                <button aria-label="Close navigation menu" className="" onClick={closeDrawer} type="button"><X size={24} aria-hidden="true" /></button>
              </div>
              <nav className="p-4 flex flex-col gap-2">
                {navigation.map((item) => (
                  <div key={item.label}>
                    {item.items ? (
                      <>
                        <button className="flex w-full justify-between items-center py-2" onClick={() => setOpenMobileGroup(openMobileGroup === item.label ? null : item.label)} type="button">
                          <span>{item.label}</span>
                          <ChevronDown className={openMobileGroup === item.label ? 'is-open' : ''} size={18} aria-hidden="true" />
                        </button>
                        {openMobileGroup === item.label && (
                          <div className="pl-4 flex flex-col gap-2">
                            <NavLink to={item.to} onClick={closeDrawer}>{item.label}</NavLink>
                            {item.items.map((it) => (<NavLink key={it.label} to={it.to} onClick={closeDrawer}>{it.label}</NavLink>))}
                          </div>
                        )}
                      </>
                    ) : (
                      <NavLink to={item.to} onClick={closeDrawer} className="py-2 block">{item.label}</NavLink>
                    )}
                  </div>
                ))}
              </nav>
                <div className="p-4">
                <a href={bookingUrl} onClick={(e) => { e.preventDefault(); closeDrawer(); console.log('Opening booking URL:', bookingUrl); window.open(bookingUrl, '_blank') }} className="block w-full text-center rounded bg-primary py-2" rel="noopener noreferrer">Book Now</a>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </header>
  )
}

export default Navbar
