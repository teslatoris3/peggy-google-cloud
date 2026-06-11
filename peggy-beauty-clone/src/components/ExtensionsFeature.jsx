import { Link } from 'react-router-dom'
import OptimizedImage from './OptimizedImage'
import { ArrowRight, Check } from 'lucide-react'
import { getBookingUrl } from '../config/booking'

function ExtensionsFeature() {
  const bookingUrl = getBookingUrl()

  return (
    <section className="mt-12 bg-[#F7E6E2]">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <article className="grid items-center gap-6 md:grid-cols-2">
          <div className="order-1 md:order-0">
            <OptimizedImage src="/images/services/makeup.png" alt="Makeup & Beauty salon service" className="rounded-lg object-cover w-full h-64 md:h-80" />
          </div>

          <div className="brand-card" style={{ padding: '1.5rem' }}>
            <p className="text-sm text-primary">Makeup &amp; Beauty</p>
            <h3 className="mt-2 text-2xl font-semibold">Signature Makeup &amp; Beauty</h3>
            <p className="mt-3 text-sm text-muted-text">Professional makeup services for bridal, special events, and editorial work — tailored to your skin tone and the occasion.</p>
            <ul className="mt-4 grid gap-2">
              <li className="flex items-start gap-2 text-sm"><Check size={16} aria-hidden="true" />Bridal makeup</li>
              <li className="flex items-start gap-2 text-sm"><Check size={16} aria-hidden="true" />Soft-glam &amp; evening looks</li>
              <li className="flex items-start gap-2 text-sm"><Check size={16} aria-hidden="true" />Airbrush and long-wear application</li>
              <li className="flex items-start gap-2 text-sm"><Check size={16} aria-hidden="true" />Consultation and colour matching</li>
            </ul>
            <a href={bookingUrl} onClick={(e) => { e.preventDefault(); window.open(bookingUrl, '_blank') }} rel="noopener noreferrer" className="mt-6 inline-flex items-center gap-2 rounded bg-primary px-4 py-2 text-deep-black font-semibold">Book a Consultation <ArrowRight size={16} /></a>
          </div>
        </article>
      </div>
    </section>
  )
}

export default ExtensionsFeature
