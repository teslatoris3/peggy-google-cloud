import { useState } from 'react'
import { ArrowRight, Check } from 'lucide-react'
import OptimizedImage from './OptimizedImage'
import { getBookingUrl } from '../config/booking'

const serviceRows = [
  {
    title: 'Hair Highlight & Colour Services',
    eyebrow: 'Hair Highlighting',
    image: '/images/replace_hair_highlight.jpeg',
    description:
      'Expert hair highlighting and colour services to add dimension, brightness, and natural-looking depth. We specialise in balayage, foils, and personalised colour blending to suit your skin tone and lifestyle.',
    services: [
      'Balayage and face-framing highlights',
      'Foil and babylight techniques',
      'Root touch-ups and colour corrections',
      'Glossing, toning, and brightness maintenance',
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

const featuredGalleryItems = [
  {
    type: 'image',
    title: 'Shinion and Updo',
    images: [
      {
        src: '/images/services/shinion_high_quality.png',
        alt: 'Shinion and updo salon result',
      },
    ],
  },
  {
    type: 'slideshow',
    title: 'Threading and waxing',
    images: [
      {
        src: '/images/services/threading_waxing-2048.avif',
        alt: 'Threading before and after salon result',
      },
      {
        src: '/images/services/waxing-1600.webp',
        alt: 'Waxing before and after salon result',
      },
    ],
  },
  {
    type: 'image',
    title: 'makeup',
    images: [
      {
        src: '/images/makeup_new.jpeg',
        alt: 'Makeup salon result',
      },
    ],
  },
]

function GalleryImageCard({ title, images, type }) {
  const isSlideshow = type === 'slideshow' && images.length > 1

  return (
    <figure className="overflow-hidden rounded-lg bg-white">
      <div className={isSlideshow ? 'gallery-crossfade' : 'block w-full'}>
        {images.map((image, imageIndex) => (
          <OptimizedImage
            key={image.src}
            src={image.src}
            alt={image.alt}
            className={
              isSlideshow
                ? `gallery-crossfade__image ${imageIndex === 0 ? 'gallery-crossfade__image--first' : 'gallery-crossfade__image--second'}`
                : 'w-full h-[220px] sm:h-[300px] object-cover'
            }
          />
        ))}
      </div>
      <figcaption className="p-3 text-sm">
        <strong className="block">{title}</strong>
      </figcaption>
    </figure>
  )
}

function HairColorMedia({ fallbackImage, alt }) {
  const [videoFailed, setVideoFailed] = useState(false)

  if (videoFailed) {
    return (
      <OptimizedImage
        src={fallbackImage}
        alt={alt}
        className="rounded-lg object-cover w-full h-[260px] sm:h-[420px] md:h-[520px]"
      />
    )
  }

  return (
    <video
      src="/videos/IMG_7017 (1).MOV"
      poster="/images/services/hair-color-poster.svg"
      className="rounded-lg object-cover w-full h-[260px] sm:h-[420px] md:h-[520px]"
      autoPlay
      loop
      muted
      playsInline
      onError={() => setVideoFailed(true)}
    />
  )
}

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
            <div className="order-2 md:order-1">
              {row.image && row.image.includes('hair-color') ? (
                <HairColorMedia
                  fallbackImage="/images/services/hair-color.png"
                  alt={`${row.eyebrow} salon service`}
                />
              ) : (
                <OptimizedImage src={row.image === '/images/gallery/photos/featured_remote.jpg' ? '/images/gallery/photos/featured_remote_resized.jpg' : row.image} alt={`${row.eyebrow} salon service`} className="rounded-lg object-cover w-full h-[260px] sm:h-[420px] md:h-[520px]" />
              )}
            </div>

            <div className="brand-card order-1 md:order-2" style={{ padding: '1.5rem' }}>
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
        {featuredGalleryItems.map((item) => (
          <GalleryImageCard key={item.title} {...item} />
        ))}
      </div>
    </section>
  )
}

export default ServicesShowcase
