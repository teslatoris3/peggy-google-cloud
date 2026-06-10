import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { getBookingUrl } from '../config/booking'

const stats = [
  { value: 20, suffix: '+', label: 'Years' },
  { value: 1, text: 'Award Winning', label: '' },
  { value: 1, text: 'Top Salon Vaughan', label: '' },
]

const pillars = [
  'Bellami',
  'Created by Passion',
  'Built with Love',
  'Driven by Success',
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.13,
    },
  },
}

const fadeUpVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: 'easeOut' },
  },
}

function AnimatedStat({ label, suffix = '', text, value, inView }) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!inView || text) return

    let frameId
    const duration = 1100
    const start = performance.now()

    const animate = (time) => {
      const progress = Math.min((time - start) / duration, 1)
      setCount(Math.floor(progress * value))

      if (progress < 1) {
        frameId = requestAnimationFrame(animate)
      }
    }

    frameId = requestAnimationFrame(animate)

    return () => cancelAnimationFrame(frameId)
  }, [inView, text, value])

  return (
    <div className="face-brand__stat">
      <strong>{text || `${count}${suffix}`}</strong>
      {label && <span>{label}</span>}
    </div>
  )
}

function FaceBehindBrand() {
  const { ref, inView } = useInView({
    threshold: 0.22,
    triggerOnce: true,
  })

  return (
    <section ref={ref} className="mx-auto max-w-7xl px-6 py-12">
      <div className="grid gap-8 md:grid-cols-2">
        <motion.div animate={inView ? 'visible' : 'hidden'} initial="hidden" variants={fadeUpVariants}>
          <img src="/images/salon/peggy-portrait.png" alt="Julie Brocca portrait" className="rounded-lg object-cover" />
        </motion.div>

        <motion.div animate={inView ? 'visible' : 'hidden'} initial="hidden" variants={containerVariants}>
          <div className="brand-card shadow-lg" style={{ padding: '1.5rem' }}>
            <motion.p className="text-sm uppercase tracking-wide text-primary" variants={fadeUpVariants}>FACE BEHIND THE BRAND</motion.p>
              <motion.h2 className="mt-2 text-2xl font-heading" variants={fadeUpVariants}>Julie Brocca, <span className="brand-accent">Founder &amp; Creative Director</span></motion.h2>
            <motion.p className="mt-3 text-sm text-muted-text" variants={fadeUpVariants}>With over 20 years of experience in the hair and beauty industry, Julie Brocca transformed her lifelong passion for hairstyling into an award-winning luxury salon in Vaughan.</motion.p>

            <motion.div className="mt-6 grid grid-cols-3 gap-4" variants={fadeUpVariants}>
              {stats.map((stat) => (
                <div key={stat.label || stat.text} className="text-center">
                  <strong className="block text-xl">{stat.text || `${stat.value}${stat.suffix}`}</strong>
                  <span className="text-sm text-muted-text">{stat.label}</span>
                </div>
              ))}
            </motion.div>

            <motion.ul className="mt-6 list-inside grid gap-2" variants={containerVariants}>
              {pillars.map((pillar) => (<li key={pillar} className="text-sm">{pillar}</li>))}
            </motion.ul>

            <motion.div className="mt-6" variants={fadeUpVariants}>
              {(() => {
                const url = getBookingUrl()
                const open = (e) => { e.preventDefault(); console.log('Opening booking URL:', url); window.open(url, '_blank') }
                return (
                  <a href={url} onClick={open} rel="noopener noreferrer" className="inline-flex items-center rounded bg-primary px-4 py-2 text-deep-black font-semibold">Book Now</a>
                )
              })()}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default FaceBehindBrand
