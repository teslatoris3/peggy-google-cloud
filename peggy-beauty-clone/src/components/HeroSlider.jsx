import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import OptimizedImage from './OptimizedImage'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay } from 'swiper/modules'
import 'swiper/css'
import '../styles/HeroSlider.css'
const slides = [
  { image: '/images/slider/main11.png', alt: 'Salon styling and bridal-ready looks', position: 'center 50%' },
  { image: '/images/slider/main2.png', alt: 'Soft glam makeup and colour services', position: 'center 50%' },
  { image: '/images/slider/main3.png', alt: 'Dimensional salon colour and finish', position: 'center 50%' },
]

const brandLogos = [
  { src: '/images/brands/loreal.jpg', alt: "L'Oreal" },
  { src: '/images/brands/oribe.jpg', alt: 'ORIBE' },
  { src: '/images/brands/bellami.jpg', alt: 'Bellami' },
  { src: '/images/brands/haircare.jpg', alt: 'Luxury Hair Care' },
  // repeat some worldwide brands to populate the marquee
  { src: '/images/brands/loreal.jpg', alt: "L'Oreal" },
  { src: '/images/brands/oribe.jpg', alt: 'ORIBE' },
]

const contentVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: 0.25,
      staggerChildren: 0.12,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: 'easeOut' },
  },
}

function HeroSlider() {
  const [activeSlide, setActiveSlide] = useState(0)

  const handleBrandError = (e) => {
    e.currentTarget.onerror = null
    e.currentTarget.src = '/images/brands/loreal.jpg'
  }

  const handleSlideError = (e) => {
    e.currentTarget.onerror = null
    e.currentTarget.src = '/images/logo.png'
  }

  useEffect(() => {
    const interval = window.setInterval(() => {
      setActiveSlide((currentSlide) => (currentSlide + 1) % slides.length)
    }, 5200)

    return () => window.clearInterval(interval)
  }, [])

  return (
    <>
      <section className="relative min-h-[72vh] md:h-screen w-full overflow-hidden" aria-label="Peggy Beauty hero">
        <div className="absolute inset-0">
          <AnimatePresence mode="sync">
            <motion.img
              key={activeSlide}
              animate={{ opacity: 1 }}
              alt={slides[activeSlide].alt}
              className="absolute inset-0 h-full w-full object-cover"
              exit={{ opacity: 0 }}
              initial={{ opacity: 0 }}
              src={slides[activeSlide].image}
              onError={handleSlideError}
              style={{ display: 'block', objectPosition: slides[activeSlide].position, transformOrigin: 'center center', willChange: 'opacity' }}
              transition={{ duration: 1.2, ease: 'linear' }}
            />
          </AnimatePresence>
        </div>

        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/30" />

        <img src="/images/hero-accent.svg" alt="" aria-hidden="true" className="absolute bottom-0 left-0 w-full pointer-events-none" />

        <motion.div animate="visible" className="relative z-10 mx-auto h-full max-w-6xl px-6 text-white" initial="hidden" variants={contentVariants}>
          <div className="h-full flex items-center">
            <motion.div className="w-full md:w-1/2" variants={itemVariants}>
              <motion.p
                className="mb-4 text-xs font-bold uppercase tracking-[0.18em] text-primary sm:tracking-[0.28em]"
                style={{ fontSize: 'clamp(1.1rem, 2.2vw + 0.6rem, 2rem)', fontWeight: 800 }}
                variants={itemVariants}
              >
                Premium Hair Experience
              </motion.p>

              <motion.h1
                className="text-3xl sm:text-5xl md:text-7xl font-heading leading-tight text-white hero-force-large"
                style={{ fontSize: 'clamp(2rem, 6vw + 1rem, 4.5rem)', fontWeight: 900, lineHeight: 1 }}
                variants={itemVariants}
              >
                Hair Extensions & Hair Color Specialists
              </motion.h1>

              <motion.p
                className="mx-auto mt-6 max-w-3xl text-base leading-8 text-offwhite-cream/90 md:text-lg"
                style={{ fontSize: 'clamp(1rem, 2.8vw + 0.8rem, 2rem)', fontWeight: 600 }}
                variants={itemVariants}
              >
                We specialize in premium hair extensions and expert hair coloring, creating natural-looking, high-end transformations tailored to you.
              </motion.p>

              <motion.div className="mt-8 flex gap-6 items-center" variants={itemVariants}>
                <Link className="rounded-md bg-primary px-3 py-1.5 text-sm md:px-8 md:py-4 md:text-xl font-semibold text-deep-black shadow-sm" to="/contact">Book Now</Link>
                <Link className="rounded-md border border-white/30 px-3 py-1.5 text-sm md:px-8 md:py-4 md:text-xl" to="/services">Services</Link>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>

        {/* Chevron removed per request */}
      </section>

      <section className="brand-marquee bg-[#F7E6E2] py-6" aria-label="Brand partners">
        <div className="mx-auto max-w-7xl px-6">
          <div className="brand-marquee__track">
            <div className="brand-marquee__group">
              {brandLogos.map((brand) => (
                <div key={brand.src} className="brand-marquee__item">
                  <OptimizedImage src={brand.src} alt={brand.alt} loading="lazy" onError={handleBrandError} className="h-10 md:h-14 object-contain" />
                </div>
              ))}
            </div>

            {/* duplicate for seamless loop */}
            <div className="brand-marquee__group" aria-hidden>
              {brandLogos.map((brand) => (
                <div key={brand.src + '-dup'} className="brand-marquee__item">
                  <OptimizedImage src={brand.src} alt={brand.alt} loading="lazy" className="h-10 md:h-14 object-contain" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default HeroSlider
