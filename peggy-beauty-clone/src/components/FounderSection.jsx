import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { getBookingUrl } from '../config/booking'

const stats = ['18+ Years Experience', 'Licensed (Canada)', 'Master Colorist']

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.14,
    },
  },
}

const fadeUpVariants = {
  hidden: { opacity: 0, y: 34 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.72, ease: 'easeOut' },
  },
}

function FounderSection() {
  const { ref, inView } = useInView({
    threshold: 0.24,
    triggerOnce: true,
  })

  return (
    <section ref={ref} className="mx-auto max-w-7xl px-6 py-12">
      <div className="grid gap-8 md:grid-cols-3 md:items-stretch">
        <motion.div animate={inView ? 'visible' : 'hidden'} initial="hidden" variants={fadeUpVariants} className="h-full md:min-h-[560px] md:col-span-1">
          <div
            className="rounded-lg overflow-hidden ring-1 ring-gray-100 shadow-md h-full"
            style={{
              borderRadius: '28px',
              overflow: 'hidden',
              WebkitClipPath: 'inset(0 round 28px)',
              clipPath: 'inset(0 round 28px)',
            }}
          >
            <img
              src="/images/salon/peggy-portrait.png"
              alt="Salon founder portrait"
              className="object-cover w-full h-full"
              style={{ display: 'block', objectPosition: 'center top' }}
            />
          </div>
        </motion.div>
        <motion.div animate={inView ? 'visible' : 'hidden'} initial="hidden" variants={containerVariants} className="h-full md:min-h-[560px] md:col-span-2">
            <div className="brand-card shadow-lg h-full flex flex-col" style={{ padding: '1.5rem' }}>
              <div className="flex-1">
            <motion.p className="mb-3 text-xs font-bold uppercase tracking-[0.22em] brand-heading-color" variants={fadeUpVariants} style={{ fontSize: 'var(--faq-answer-size)' }}>
              FACE BEHIND THE BRAND
            </motion.p>

            <motion.h2 className="font-heading text-4xl leading-tight text-deep-black sm:text-5xl" variants={fadeUpVariants} style={{ fontSize: 'var(--faq-question-size)' }}>
              Peggy Zokaie — <span className="brand-accent">Master Colorist &amp; Blonde Specialist</span>
            </motion.h2>

            <motion.p className="mt-6 leading-8 text-muted-text" variants={fadeUpVariants} style={{ fontSize: 'var(--faq-answer-size)' }}>
              Peggy Zokaie brings over 18 years of global experience and a refined eye for colour, balance, and makeup artistry. Licensed in Canada, Peggy combines technical mastery with a calm, guest-first approach — delivering bespoke colour, polished makeup, and results that suit your lifestyle.
            </motion.p>

            <motion.p className="mt-6 leading-8 text-muted-text" variants={fadeUpVariants} style={{ fontSize: 'var(--faq-answer-size)' }}>
              Her vision for Peggy Beauty was to create a welcoming space where every guest can experience true transformation — from balayage blondes and custom hair coloring to flawless bridal and event makeup that bring dream looks to life.
            </motion.p>

            <motion.p className="mt-6 leading-8 text-muted-text" variants={fadeUpVariants} style={{ fontSize: 'var(--faq-answer-size)' }}>
              Peggy’s “why” is simple yet powerful: to help each guest feel like the best version of themselves through expert care, artistry, and attention to detail. Her dedication to modern hairstyling techniques and personalized beauty experiences has made Peggy Beauty one of the most sought-after salons in Toronto.
            </motion.p>

            <motion.ul className="mt-8 grid gap-3 text-lg font-heading text-deep-black" variants={fadeUpVariants}>
              <li>Bellami</li>
              <li>Created by Passion</li>
              <li>Built with Love</li>
              <li>Driven by Success</li>
            </motion.ul>
              </div>

            <motion.div className="mt-6 flex gap-3" variants={fadeUpVariants}>
              {(() => {
                const url = getBookingUrl()
                const open = (e) => { e.preventDefault(); console.log('Opening booking URL:', url); window.open(url, '_blank') }
                return <a href={url} onClick={open} rel="noopener noreferrer" className="inline-flex items-center rounded bg-primary px-4 py-2 text-deep-black font-semibold">Book Now</a>
              })()}
              <Link to="/services" className="inline-flex items-center rounded border border-white/30 px-4 py-2">Services</Link>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default FounderSection
