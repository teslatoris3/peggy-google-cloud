import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import LocationMap from '../components/LocationMap'

function Contact() {
  // Render an internal contact page. This page is informational only and does not
  // redirect to the booking server so users can contact Peggy without booking.
  const [searchParams] = useSearchParams()
  const prefillService = searchParams.get('service') || ''

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    date: '',
    time: '',
    service: prefillService,
    message: '',
  })

  const [status, setStatus] = useState(null)

  useEffect(() => {
    // page meta
    const prevTitle = document.title
    document.title = 'Book Appointment - Peggy Beauty'
    let meta = document.querySelector('meta[name="description"]')
    const desc = 'Request an appointment at Peggy Beauty — balayage, makeup, colour, and cuts. This form is a booking request; we will confirm availability.'
    if (!meta) {
      meta = document.createElement('meta')
      meta.name = 'description'
      document.head.appendChild(meta)
    }
    meta.content = desc

    // JSON-LD (basic)
    const ld = {
      '@context': 'https://schema.org',
      '@type': 'HairSalon',
      'name': 'Peggy Beauty',
      'url': window.location.origin,
      'telephone': '+14165187979',
      'address': {
        '@type': 'PostalAddress',
        'addressLocality': 'North York',
        'addressRegion': 'ON',
        'addressCountry': 'CA',
      },
      'hasMap': 'https://www.google.com/maps/search/?api=1&query=Peggy+Beauty+North+York+Toronto',
      'description': desc,
    }

    const script = document.createElement('script')
    script.type = 'application/ld+json'
    script.className = 'contact-json-ld'
    script.text = JSON.stringify(ld)
    document.head.appendChild(script)

    return () => {
      document.title = prevTitle
      if (script && script.parentNode) script.parentNode.removeChild(script)
      // leave meta as-is (don't remove) to avoid clobbering other pages
    }
  }, [])

  useEffect(() => {
    // if URL prefill changes, update form.service
    if (prefillService) setForm((s) => ({ ...s, service: prefillService }))
  }, [prefillService])

  function handleChange(e) {
    const { name, value } = e.target
    setForm((s) => ({ ...s, [name]: value }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    setStatus('sending')
    // This is a client-side stub. Replace with real submission (API / email) if available.
    setTimeout(() => {
      console.log('Booking request', form)
      setStatus('sent')
    }, 700)
  }

  return (
    <div className="page" style={{ padding: 32 }}>
      <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: '2rem', margin: 0 }}>Contact Us</h1>
      <p style={{ color: '#6B6B6B', marginTop: 8 }}>This page is for general enquiries — not for booking appointments. To request a booking, use the booking form on the booking server or call us directly.</p>

      <div style={{ marginTop: 20, display: 'grid', gap: 12, maxWidth: 720 }}>
        <a href="tel:+14165187979" style={{ display: 'inline-flex', gap: 12, alignItems: 'center', padding: 12, background: '#fff', borderRadius: 10, border: '1px solid #efe8e2', textDecoration: 'none', color: '#222' }}>📞 +14165187979</a>
        <a href="mailto:Pegahzokaie@yahoo.com" style={{ display: 'inline-flex', gap: 12, alignItems: 'center', padding: 12, background: '#fff', borderRadius: 10, border: '1px solid #efe8e2', textDecoration: 'none', color: '#222' }}>✉️ Pegahzokaie@yahoo.com</a>
        <a href="https://www.instagram.com/peggybeauty.salon" target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', gap: 12, alignItems: 'center', padding: 12, background: '#fff', borderRadius: 10, border: '1px solid #efe8e2', textDecoration: 'none', color: '#222' }}>📸 Instagram — @peggybeauty.salon</a>
        <a href="https://www.facebook.com/peggybeauty" target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', gap: 12, alignItems: 'center', padding: 12, background: '#fff', borderRadius: 10, border: '1px solid #efe8e2', textDecoration: 'none', color: '#222' }}>👍 Facebook — Peggy Beauty</a>
      </div>

      <p style={{ color: '#6B6B6B', marginTop: 14 }}>Note: To make a booking, please use the booking page (external) or call us directly.</p>

      <div style={{ marginTop: 28, maxWidth: 1100 }}>
        <LocationMap
          title="Find us on the map"
          caption="Open Peggy Beauty in Google Maps for the most direct route and neighborhood context."
        />
      </div>
    </div>
  )
}

export default Contact
