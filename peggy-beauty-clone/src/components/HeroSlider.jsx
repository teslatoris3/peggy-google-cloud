import { useEffect, useState } from 'react'
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
      <section className="relative h-[56vh] md:h-[64vh] w-full overflow-hidden page-hero" aria-label="Peggy Beauty hero">
        <div className="absolute inset-0">
          <AnimatePresence mode="sync">
            {slides[activeSlide].image.includes('main11') ? (
              <motion.picture
                key={activeSlide}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                initial={{ opacity: 0 }}
                transition={{ duration: 1.2, ease: 'linear' }}
                style={{ display: 'block', willChange: 'opacity' }}
              >
                <source type="image/avif" srcSet="/images/slider/main11-320.avif 320w, /images/slider/main11-640.avif 640w, /images/slider/main11-1024.avif 1024w, /images/slider/main11-1600.avif 1600w" sizes="100vw" />
                <source type="image/webp" srcSet="/images/slider/main11-320.webp 320w, /images/slider/main11-640.webp 640w, /images/slider/main11-1024.webp 1024w, /images/slider/main11-1600.webp 1600w" sizes="100vw" />
                <motion.img
                  alt={slides[activeSlide].alt}
                  className="absolute inset-0 h-full w-full object-cover"
                  src="/images/slider/main11-1600.webp"
                  onError={handleSlideError}
                  style={{ objectPosition: slides[activeSlide].position, transformOrigin: 'center center' }}
                />
              </motion.picture>
            ) : (
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
            )}
          </AnimatePresence>
        </div>

        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/30" />

        <img src="/images/hero-accent.svg" alt="" aria-hidden="true" className="absolute bottom-0 left-0 w-full pointer-events-none" />


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
