import SEO from '../components/SEO'

function Gallery() {
  const dedupeBySrc = (items) => Array.from(new Map(items.map((item) => [item.src, item])).values())

  const meta = {
    title: 'Gallery — Peggy Beauty',
    description: 'Before-and-after photos and behind-the-scenes videos from Peggy Beauty salon.',
    url: 'https://example.com/gallery',
    image: '/images/hero.png'
  }
  const media = dedupeBySrc([
    {
      type: 'image',
      src: '/images/gallery/photos/hair_colored_blue.png',
      alt: 'Women color hair with vivid blue dimension',
    },
    {
      type: 'image',
      src: '/images/gallery/photos/man_hair_cut.jpg',
      alt: 'Men hair cut with a clean modern fade',
    },
    {
      type: 'image',
      src: '/images/gallery/photos/boys-haircuts-fringe-up-teaneck-nj.jpg',
      alt: 'Boy haircut with a fresh fringe-up finish',
    },
    {
      type: 'image',
      src: '/images/gallery/photos/img_3176.jpg',
      alt: 'Salon transformation with soft polished styling',
    },
    {
      type: 'image',
      src: '/images/gallery/photos/img_3750.png',
      alt: 'Client look with camera-ready styling',
    },
    {
      type: 'image',
      src: '/images/gallery/photos/img_3914.png',
      alt: 'Fresh salon work with a refined finish',
    },
    {
      type: 'image',
      src: '/images/gallery/photos/img_3956.jpg',
      alt: 'Long-form colour and styling result',
    },
    {
      type: 'image',
      src: '/images/gallery/photos/img_4129.png',
      alt: 'Elegant salon transformation with detail work',
    },
    {
      type: 'image',
      src: '/images/gallery/photos/img_4293.png',
      alt: 'Signature beauty look with polished finish',
    },
    {
      type: 'image',
      src: '/images/gallery/photos/img_4371.png',
      alt: 'Clean, professional salon styling result',
    },
    {
      type: 'image',
      src: '/images/gallery/photos/img_4482.png',
      alt: 'Refined salon photo with balanced colour',
    },
    {
      type: 'image',
      src: '/images/gallery/photos/img_4555.png',
      alt: 'Finished beauty look with glossy texture',
    },
    {
      type: 'video',
      src: '/images/gallery/videos/IMG_5684 (1).MOV',
      alt: 'Behind the scenes salon video',
    },
  ]).map((item) => ({
    ...item,
    resolvedSrc: encodeURI(item.src),
  }))

  return (
    <>
      <SEO {...meta} />
      <section className="page">
        <h1 className="text-3xl font-heading">Gallery</h1>
        <p className="mt-2 text-muted-text">
          A curated look at salon transformations, cuts, colour, and behind-the-scenes moments from Peggy Beauty.
        </p>

        <div className="mt-6 grid grid-cols-2 gap-4 auto-rows-fr md:grid-cols-4">
          {media.map((m, i) => (
            <figure
              key={m.src}
              className={`group overflow-hidden rounded-lg bg-white shadow-sm ${i === 0 ? 'md:col-span-2 md:row-span-2' : ''}`}
            >
              {m.type === 'image' ? (
                <img
                  src={m.resolvedSrc}
                  alt={m.alt}
                  className="h-48 w-full object-cover transition-transform duration-500 group-hover:scale-105 md:h-full"
                />
              ) : (
                <div className="relative h-48 w-full bg-black md:h-full">
                  {(() => {
                    const base = m.resolvedSrc.replace(/\.(mov|mp4|webm)$/i, '')
                    const webm = `${base}-opt.webm`
                    const mp4 = `${base}-opt.mp4`
                    return (
                      <video
                        className="h-full w-full object-cover"
                        controls
                        preload="metadata"
                        playsInline
                        muted
                        autoPlay
                        loop
                      >
                        <source src={mp4} type="video/mp4" />
                        <source src={webm} type="video/webm" />
                        <source src={m.resolvedSrc} />
                      </video>
                    )
                  })()}
                  <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                    <svg className="h-12 w-12 text-white/90" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="12" cy="12" r="11" stroke="currentColor" strokeWidth="1.5" opacity="0.6" />
                      <path d="M10 8L16 12L10 16V8Z" fill="currentColor" />
                    </svg>
                  </div>
                </div>
              )}
            </figure>
          ))}
        </div>
      </section>
    </>
  )
}

export default Gallery
