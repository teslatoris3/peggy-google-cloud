import BookingButton from '../components/BookingButton'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import SEO from '../components/SEO'
import { getServiceBookingUrl } from '../config/booking'

const pricingCategories = [
  {
    title: 'WOMEN HAIRCUTS & STYLE',
    items: [
      { name: 'Women Haircuts (Without Styling)', details: 'Short Hair (Above Shoulders): Start at $50 (30 minutes) · Medium Hair (Shoulder Length): Start at $55 (40 minutes) · Long Hair (Below Shoulders): Start at $60 (45 minutes)' },
      { name: 'Women Haircuts + Style', details: 'Short Hair (Cut + Basic Blow Dry): Start at $80 (50 minutes) · Medium Hair (Cut + Blow Dry + Finish): Start at $100 (45 minutes) · Long Hair (Cut + Blow Dry + Finish): Start at $120 (1 hour)' },
      { name: 'Men’s cut', details: 'Start at $40' },
      { name: 'Kids Haircut', details: 'Boy (3–5 Years): Start at $30 (20 minutes) · Girl (3–5 Years): Start at $30 (20 minutes)' },
      { name: 'Bridal Hair Style (Without Makeup)', details: 'Start at $70 (35 minutes)' },
    ],
  },
  {
    title: 'HAIR STYLING',
    items: [
      { name: 'Blow Dry – Short Hair', details: 'Start at Start at $30 (20 minutes)' },
      { name: 'Blow Dry – Medium Hair', details: 'Start at Start at $35 (30 minutes)' },
      { name: 'Blow Dry – Long Hair', details: 'Start at Start at $40 (40 minutes)' },
      { name: 'Blow Dry + Straightening', details: 'Short Start at $35 (30m) · Medium Start at $35 (40m) · Long Start at $40 (50m)' },
      { name: 'Blow Dry + Soft Curls', details: 'Short Start at $35 (30m) · Medium Start at $40 (40m) · Long Start at $45 (50m)' },
      { name: 'Blow Dry + Hollywood Curls', details: 'Medium/Long: Start at $50 (40 minutes)' },
      { name: 'Formal Updo', details: 'Medium Start at $70 · Long Start at $90' },
    ],
  },
  {
    title: "WOMEN’S HAIR COLOR",
    items: [
      { name: 'Root Retouch (Single Process)', details: 'Start at $60 (1 hr 30 minutes)' },
      { name: 'Full Color', details: 'Short: $80 (2 hr) · Medium: $100 (2 hr 15 minutes) · Long: $120 (2 hr 30 minutes)' },
      { name: 'Half Head Highlights', details: 'Short Start at $180 (3 hours) · Medium Start at $230 (3 hours 30 minutes) · Long Start at $270 (4 hours)' },
      { name: 'Full Head Highlights', details: 'Short Start at $150 (2 hours) · Medium Start at $200 (2.5 hours) · Long Start at $250 (3 hours)' },
      { name: 'Balayage', details: 'Short Start at $200 (2 hours 30 minutes) · Medium Start at $240 (3 hours) · Long Start at $300 (3 hours 30 minutes)' },
      { name: 'Ombre', details: 'Short Start at $200 (2 hours 30 minutes) · Medium Start at $240 (3 hours) · Long Start at $300 (3 hours 30 minutes)' },
      { name: 'Bleaching (Full Head)', details: 'Half Head: Short Start at $250 (3 hours) · Medium Start at $300 (3 hours 30 minutes) · Long Start at $350 (3 hours 30 minutes)' },
      { name: 'Standalone Toner Service', details: 'Start at $40 (20 minutes)' },
    ],
  },
  {
    title: 'HAIR TREATMENTS',
    items: [
      { name: 'Keratin Treatment', details: 'Short Start at $200 (2 hours 30 minutes) · Medium Start at $250 (3 hours) · Long Start at $300 (3 hours)' },
      { name: 'Botox Hair Treatment', details: 'Short Start at $200 (2 hours 30 minutes) · Medium Start at $250 (3 hours) · Long Start at $300 (3 hours)' },
    ],
  },
  {
    title: 'THREADING & WAXING SERVICES',
    items: [
      { name: 'Eyebrow Threading', details: 'Start at $20 (15 minutes)' },
      { name: 'Upper Lip Threading', details: 'Start at $10 (5 minutes)' },
      { name: 'Full Face Threading', details: 'Start at $40 (30 minutes)' },
      { name: 'Underarm Waxing', details: 'Start at $30 (5 minutes)' },
      { name: 'Eyebrow Waxing', details: 'Start at $20 (15 minutes)' },
      { name: 'Full Face Waxing', details: 'Start at $35 (30 minutes)' },
      { name: 'Party Makeup', details: 'Start at $180 (1 hour)' },
    ],
  },
]

const fadeIn = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45 } },
}

function Pricing() {
  const meta = {
    title: 'Pricing — Peggy Beauty',
    description: 'Starting prices for Peggy Beauty services including haircuts, colour, balayage, and treatments. Final pricing varies by consultation.',
    url: 'https://example.com/pricing',
    image: '/images/hero.png'
  }

  return (
    <>
      <SEO {...meta} />
      <section className="page">
        <h1 className="text-3xl font-heading">Pricing</h1>
        <p className="mt-2 text-muted-text">Starting prices are listed below. Final pricing depends on service details and consultation.</p>

        <motion.div className="mt-6 space-y-6" initial="hidden" whileInView="visible" viewport={{ once: true }}>
          {pricingCategories.map((cat) => (
            <motion.article key={cat.title} variants={fadeIn} className="rounded-2xl border bg-white p-6 md:p-8">
              <h2 className="text-xl md:text-2xl font-semibold brand-heading-color">{cat.title}</h2>
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                {cat.items.map((it) => (
                  <div key={it.name} className="rounded-lg border p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-medium">{it.name}</h3>
                        <p className="mt-2 text-sm text-muted-text">{it.details}</p>
                      </div>
                      <div className="ml-4 hidden md:block">
                        <a href={getServiceBookingUrl(it.name)} className="inline-flex items-center gap-2 rounded bg-primary px-3 py-2 text-sm font-semibold text-deep-black" target="_blank" rel="noopener noreferrer">
                          Book
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.article>
          ))}
        </motion.div>

        <div className="mt-6"><BookingButton /></div>
      </section>
    </>
  )
}

export default Pricing
