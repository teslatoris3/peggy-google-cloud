import { Link } from 'react-router-dom'
import { useEffect } from 'react'
import ServiceCard from '../components/ServiceCard'
import servicesData from '../data/services'
import PageHero from '../components/PageHero'
import FAQSection from '../components/FAQSection'
import SEO from '../components/SEO'
import { getBookingUrl } from '../config/booking'

const services = [
  {
    title: 'Makeup & Bridal Beauty',
    description:
      'With 15 years of makeup artistry experience, Peggy creates polished, camera-ready looks that feel timeless, flattering, and completely personal. From soft glam to full bridal beauty, every application is tailored to your features, your skin tone, and the moment you are celebrating.',
    features: [
      'Custom bridal and special event makeup',
      'Soft glam, full glam, and editorial finishes',
      'Long-wear application with a seamless, skin-like result',
    ],
  },
  {
    title: 'Balayage & Blonde Services',
    description:
      'Soft, dimensional balayage and bright blonde services crafted for effortless grow-out and healthy-looking dimension.',
    features: [
      'Hand-painted balayage and root smudge',
      'Blonde toning, glossing, and refresh',
      'Custom colour plans for low-maintenance wear',
    ],
  },
  {
    title: 'Full Colour & Correction',
    description:
      'Precision colour, retouch, and correction services that restore balance while protecting hair integrity.',
    features: [
      'Root touch-ups and all-over colour',
      'Correction for fading, brassiness, and uneven tone',
      'Healthy hair care with bond-building treatments',
    ],
  },
  {
    title: 'Haircut & Styling',
    description:
      'Luxury haircut, blowout, and styling services tailored to your texture, lifestyle, and event needs.',
    features: [
      'Consultation-based precision cuts',
      'Shaping, layering, and long-hair maintenance',
      'Special occasion styling and finishing',
    ],
  },
  {
    title: 'Repair & Treatment Rituals',
    description:
      'Restorative hair treatments designed to strengthen, hydrate, and add shine from root to tip.',
    features: [
      'Deep conditioning and bond repair',
      'Scalp care and hydration therapies',
      'Luxury treatment packages for healthier texture',
    ],
  },
  {
    title: 'Bridal & Event Beauty',
    description:
      'Effortless bridal styling, trial sessions, and polished event looks for your most meaningful moments.',
    features: [
      'Consultation and trial styling',
      'On-site bridal hair support',
      'Long-lasting finish for wedding day and events',
    ],
  },
]

const brandLogos = [
  { src: '/images/logo.png', alt: 'Peggy Beauty' },
  { src: '/images/brands/oribe.jpg', alt: 'ORIBE' },
  { src: '/images/brands/loreal.jpg', alt: 'L\'Oreal' },
  { src: '/images/brands/bellami.jpg', alt: 'Bellami' },
  { src: '/images/brands/haircare.jpg', alt: 'Luxury Hair Care' },
]

function Services() {
  useEffect(() => {
    const ld = {
      '@context': 'https://schema.org',
      '@type': 'Service',
      'provider': {
        '@type': 'LocalBusiness',
        'name': 'Peggy Beauty',
        'url': window.location.origin
      },
      'serviceType': 'Beauty Salon Services',
      'hasOfferCatalog': {
        '@type': 'OfferCatalog',
        'name': 'Service Menu',
        'itemListElement': services.map(s => ({ '@type': 'Offer', 'itemOffered': { '@type': 'Service', 'name': s.title, 'description': s.description } }))
      }
    }

    const script = document.createElement('script')
    script.type = 'application/ld+json'
    script.className = 'services-json-ld'
    script.textContent = JSON.stringify(ld)
    document.head.appendChild(script)

    return () => { if (script && script.parentNode) script.parentNode.removeChild(script) }
  }, [])
  const meta = {
    title: 'Services — Peggy Beauty',
    description: 'Explore Peggy Beauty services: balayage, colouring, haircuts, bridal makeup, and restorative treatments.',
    url: 'https://example.com/services',
    image: '/images/salon/salon-interior.png'
  }

  return (
    <>
      <SEO {...meta} />
      <div className="services-hero">
        <PageHero
          eyebrow="Services"
          title="Peggy Beauty Service Menu"
          image="/images/salon/salon-interior.png"
          showText={false}
        />
      </div>

      <div className="mt-8 mx-auto w-full px-4">
        <div className="mx-auto max-w-4xl overflow-hidden rounded-3xl border border-gray-100 bg-white/80 p-6 md:p-8 shadow-sm">
          <p className="text-base md:text-lg leading-8 text-muted-text max-w-3xl mx-auto">
            Peggy Beauty offers a curated range of services tailored to your unique hair goals — from precision haircuts and bespoke colour to hand-painted balayage. Each service includes a personalized consultation and aftercare guidance so your results stay vibrant and healthy. See full pricing on our <Link to="/pricing">Pricing</Link> page.
          </p>
        </div>
      </div>

      <section className="page">

        <div className="mt-10 overflow-hidden rounded-3xl border border-gray-200 bg-white/80 p-6 shadow-sm">
          <div className="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-center">
            <div>
              <p className="text-sm uppercase tracking-wide text-primary">Trusted partners</p>
              <p className="mt-2 text-muted-text max-w-2xl">
                We work with premium brands and salon partners to deliver safer, more consistent beauty, colour, and finish services.
              </p>
            </div>
            {(() => {
              const url = getBookingUrl()
              return (
                <a
                  href={url}
                  onClick={(e) => {
                    e.preventDefault()
                    console.log('DEBUG booking url:', url)
                    window.open(url, '_blank')
                  }}
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center rounded bg-primary px-4 py-2 text-sm font-semibold text-deep-black"
                >
                  Book a consultation
                </a>
              )
            })()}
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-5">
            {brandLogos.map((brand) => (
              <div key={brand.src} className="flex items-center justify-center rounded-xl bg-white p-3 shadow-sm">
                <img src={brand.src} alt={brand.alt} className="max-h-12 md:max-h-16 object-contain" loading="lazy" />
              </div>
            ))}
          </div>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {servicesData
            .slice()
            .sort((a, b) => a.order - b.order)
            .map((service) => (
              <div key={service.id}>
                <ServiceCard {...service} />
              </div>
            ))}
        </div>

        {/* Starting prices removed per request */}

        {/* Pricing moved to the dedicated Pricing page */}

        <div className="mt-12 max-w-3xl">
          <FAQSection />
        </div>
      </section>
    </>
  )
}

export default Services
