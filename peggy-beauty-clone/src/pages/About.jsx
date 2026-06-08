import { useEffect } from 'react'
import { motion } from 'framer-motion'
import ExtensionsFeature from '../components/ExtensionsFeature'
import FounderSection from '../components/FounderSection'
import PageHero from '../components/PageHero'

function About() {
  const container = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.12 } },
  }

  const fadeUp = {
    hidden: { opacity: 0, y: 18 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
  }

  useEffect(() => {
    document.title = 'About Peggy Beauty — Master Colorist & Makeup Specialist'

    const setMeta = (name, content, attr = 'name') => {
      let el = document.querySelector(`meta[${attr}="${name}"]`)
      if (!el) {
        el = document.createElement('meta')
        el.setAttribute(attr, name)
        document.head.appendChild(el)
      }
      el.setAttribute('content', content)
    }

    setMeta('description', 'Learn about Peggy Zokaie, Master Colorist and Makeup Specialist at Peggy Beauty. Bespoke makeup, balayage, and color services.')
    setMeta('og:title', 'About Peggy Beauty — Master Colorist & Makeup Specialist', 'property')
    setMeta('og:description', 'Learn about Peggy Zokaie, Master Colorist and Makeup Specialist at Peggy Beauty. Bespoke makeup, balayage, and color services.', 'property')
    setMeta('og:image', window.location.origin + '/images/about_page_banner.png', 'property')
    setMeta('og:type', 'article', 'property')

    // JSON-LD schema for About page
    const ld = {
      '@context': 'https://schema.org',
      '@type': 'AboutPage',
      'mainEntityOfPage': {
        '@type': 'WebPage',
        '@id': window.location.href,
      },
      'headline': 'About Peggy Beauty',
      'description': 'Peggy Zokaie is a master colorist and makeup specialist with 18+ years experience, offering bespoke makeup, balayage and colour services.',
      'image': [window.location.origin + '/images/about_page_banner.png']
    }

    let script = document.querySelector('script[data-jsonld-about]')
    if (!script) {
      script = document.createElement('script')
      script.type = 'application/ld+json'
      script.setAttribute('data-jsonld-about', '1')
      document.head.appendChild(script)
    }
    script.textContent = JSON.stringify(ld)

    return () => {
      // cleanup: remove JSON-LD and meta tags we added (keep canonical site tags intact)
      const js = document.querySelector('script[data-jsonld-about]')
      if (js) js.remove()
    }
  }, [])

  return (
    <>
      <PageHero
        eyebrow="Face Behind the Brand"
        title="About Peggy Zokaie — Master Colorist & Makeup Specialist"
        description="Peggy brings over 18 years of global experience, combining technical mastery with a calm, guest-first approach."
        image="/images/about_page_banner.png"
      />

      <motion.section
        className="page"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.16 }}
        variants={container}
      >
        <div className="mt-6 max-w-3xl">
          <motion.p className="text-lg font-semibold" variants={fadeUp}>
            Meet Peggy Zokaie — Master Colorist and Blonde Specialist at Peggy Beauty.
          </motion.p>

          <motion.p className="mt-4" variants={fadeUp}>
            With over 18 years of professional experience and licensed in Canada, Peggy brings advanced expertise and an unwavering commitment to excellence.
          </motion.p>

          <motion.p className="mt-4" variants={fadeUp}>
            Our philosophy is simple: luxury should feel personal and refined. We combine hygiene-first standards with premium professional products and a calm, elegant environment so you leave feeling confident and beautifully refreshed.
          </motion.p>

          <motion.p className="mt-4" variants={fadeUp}>
            Every service is performed with meticulous attention to detail, precision, and the highest standards of cleanliness and care.
          </motion.p>
        </div>

        <motion.div className="mt-10" variants={fadeUp}>
          <ExtensionsFeature />
        </motion.div>
      </motion.section>

      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.18 }} variants={container}>
        <motion.div variants={fadeUp} className="mt-12">
          <FounderSection />
        </motion.div>
      </motion.div>
    </>
  )
}

export default About
