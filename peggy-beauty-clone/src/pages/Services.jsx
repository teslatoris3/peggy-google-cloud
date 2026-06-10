import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
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
      'Professional makeup and bridal beauty services including trials, airbrush options, and long-wear techniques for special events.',
    features: [
      'Bridal makeup and trials',
      'Airbrush and long-wear application',
      'Custom colour matching and consultation',
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
  const container = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.08 } },
  }

  const fadeIn = {
    hidden: { opacity: 0, y: 18 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  }

  const pricing = [
    { title: 'Haircut — Women', price: '$95+', duration: '60–90 min' },
    { title: 'Haircut — Men', price: '$55+', duration: '30–45 min' },
    { title: 'Blowout & Style', price: '$45+', duration: '30–60 min' },
  ]

  const faqs = [
    { q: 'Do I need a consultation?', a: 'For new clients we recommend a consultation to discuss goals and assess hair health.' },
    { q: 'How long do appointments take?', a: 'Appointment length varies by service; colour and bridal makeup can take multiple hours.' },
  ]

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

      <motion.div className="mt-8 mx-auto w-full px-4" variants={fadeIn}>
        <div className="mx-auto max-w-4xl overflow-hidden rounded-3xl border border-gray-100 bg-white/80 p-6 md:p-8 shadow-sm">
          <p className="text-base md:text-lg leading-8 text-muted-text max-w-3xl mx-auto">
            Peggy Beauty offers a curated range of services tailored to your unique hair goals — from precision haircuts and bespoke colour to hand-painted balayage. Each service includes a personalized consultation and aftercare guidance so your results stay vibrant and healthy. See full pricing on our <Link to="/pricing">Pricing</Link> page.
          </p>
        </div>
      </motion.div>

      <motion.section className="page" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.16 }} variants={container}>

        <motion.div className="mt-10 overflow-hidden rounded-3xl border border-gray-200 bg-white/80 p-6 shadow-sm" variants={fadeIn}>
          <div className="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-center">
            <div>
              <p className="text-sm uppercase tracking-wide text-primary">Trusted partners</p>
              <p className="mt-2 text-muted-text max-w-2xl">
                We work with premium brands and salon partners to deliver safer, more consistent beauty, colour, and finish services.
              </p>
            </div>
              {(() => { const url = getBookingUrl(); return (
                <a href={url} onClick={(e) => { e.preventDefault(); console.log('DEBUG booking url:', url); window.open(url, '_blank') }} rel="noopener noreferrer" className="inline-flex items-center justify-center rounded bg-primary px-4 py-2 text-sm font-semibold text-deep-black">
                  Book a consultation
                </a>
              )})()}
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-5">
            {brandLogos.map((brand) => (
              <div key={brand.src} className="flex items-center justify-center rounded-xl bg-white p-3 shadow-sm">
                <img src={brand.src} alt={brand.alt} className="max-h-12 md:max-h-16 object-contain" loading="lazy" />
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div className="mt-10 page-grid">
          {servicesData
            .slice()
            .sort((a, b) => a.order - b.order)
            .map((service) => (
              <motion.div key={service.id} variants={fadeIn}>
                <ServiceCard {...service} />
              </motion.div>
            ))}
        </motion.div>

        {/* Starting prices removed per request */}

        {/* Pricing moved to the dedicated Pricing page */}

        <motion.section className="mt-12 max-w-3xl" variants={fadeIn}>
          <FAQSection />
        </motion.section>
      </motion.section>
    </>
  )
}

export default Services
