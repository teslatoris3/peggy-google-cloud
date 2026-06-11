import { Link } from 'react-router-dom'
import { useState } from 'react'
import { ArrowRight, Check } from 'lucide-react'
import OptimizedImage from './OptimizedImage'
import { getBookingUrl } from '../config/booking'

const serviceRows = [
  {
    title: "Signature Makeup & Beauty",
    eyebrow: 'Makeup & Beauty',
    image: '/images/services/makeup.png',
    description:
      'Professional makeup services for bridal, special events, and editorial work — tailored to your skin tone and the occasion.',
    services: [
      'Bridal makeup',
      'Soft-glam & evening looks',
      'Airbrush and long-wear application',
      'Consultation and colour matching',
    ],
  },
  {
    title: 'Hair Coloring Specialists in Toronto',
    eyebrow: 'Hair Coloring',
    image: '/images/services/hair-color.png',
    description:
      'Our color work is dimensional, glossy, and designed to grow out beautifully while protecting hair health.',
    services: [
      'Balayage blonde',
      'Root touch-ups',
      'Color correction',
      'Glossing and toning',
    ],
  },
]

const galleryItems = [
  'Balayage Glow',
  'Facial Contouring',
  'Luxury Finish',
]

function ServicesShowcase() {
  const bookingUrl = getBookingUrl()
  return (
    <section id="signature-services" className="mx-auto max-w-7xl px-6 py-12">
      <div className="text-center">
        <p className="text-sm uppercase tracking-wide text-primary">Signature Services</p>
        <h2 className="mt-2 text-4xl md:text-5xl font-heading">Luxury Beauty Services & Bespoke Styling</h2>
          </div>

      <div className="mt-8 grid gap-12">
        {serviceRows.map((row, index) => (
          <article key={row.eyebrow} className={`grid items-center gap-6 md:grid-cols-2 ${index % 2 === 1 ? 'md:grid-flow-col-dense' : ''}`}>
            <div className="order-1 md:order-0">
              {row.image && row.image.includes('hair-color') ? (
                (() => {
                  const [videoFailed, setVideoFailed] = useState(false)
                  if (!videoFailed) {
                    return (
                      <video
                        src="/videos/haircolor-loop.mp4"
                        poster="/images/services/hair-color-poster.svg"
                        className="rounded-lg object-cover w-full h-64 md:h-80"
                        autoPlay
                        loop
                        muted
                        playsInline
                        onError={() => setVideoFailed(true)}
                      />
                    )
                  }

                  return (
                    <OptimizedImage src={row.image === '/images/gallery/photos/featured_remote.jpg' ? '/images/gallery/photos/featured_remote_resized.jpg' : '/images/services/hair-color.png'} alt={`${row.eyebrow} salon service`} className="rounded-lg object-cover w-full h-64 md:h-80" />
                  )
                })()
              ) : (
                <OptimizedImage src={row.image === '/images/gallery/photos/featured_remote.jpg' ? '/images/gallery/photos/featured_remote_resized.jpg' : row.image} alt={`${row.eyebrow} salon service`} className="rounded-lg object-cover w-full h-64 md:h-80" />
              )}
            </div>

            <div className="brand-card" style={{ padding: '1.5rem' }}>
              <p className="text-sm text-primary">{row.eyebrow}</p>
              <h3 className="mt-2 text-2xl font-semibold">{row.title}</h3>
              <p className="mt-3 text-sm text-muted-text">{row.description}</p>
              <ul className="mt-4 grid gap-2">
                {row.services.map((service) => (
                  <li key={service} className="flex items-start gap-2 text-sm"><Check size={16} aria-hidden="true" />{service}</li>
                ))}
              </ul>
              <a href={bookingUrl} onClick={(e) => { e.preventDefault(); console.log('DEBUG booking url:', bookingUrl); window.open(bookingUrl, '_blank') }} rel="noopener noreferrer" className="mt-6 inline-flex items-center gap-2 rounded bg-primary px-4 py-2 text-deep-black font-semibold">Book a Consultation <ArrowRight size={16} /></a>
            </div>
          </article>
        ))}
      </div>

      <div className="mt-12 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
        {[
          '/images/gallery/photos/img_3178.jpg',
          '/images/slider/featured1.png',
          '/images/gallery/photos/img_3546.png',
        ].map((src, idx) => (
          <figure key={src} className="overflow-hidden rounded-lg bg-white">
            <OptimizedImage src={src} alt={`${galleryItems[idx]} before and after salon result`} className="w-full object-cover" />
            <figcaption className="p-3 text-sm">
              <span className="text-muted-text block">Before / After</span>
              <strong className="block">{galleryItems[idx]}</strong>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  )
}

export default ServicesShowcase
