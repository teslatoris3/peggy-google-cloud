import { useEffect, useMemo, useState } from 'react'
import SEO from '../components/SEO'
import { loadGalleryMedia, DEFAULT_GALLERY_MEDIA } from '../data/galleryMedia'

function Gallery() {
  const meta = {
    title: 'Gallery — Peggy Beauty',
    description: 'Before-and-after photos and behind-the-scenes videos from Peggy Beauty salon.',
    url: 'https://example.com/gallery',
    image: '/images/hero.png'
  }
  const [media, setMedia] = useState(DEFAULT_GALLERY_MEDIA)

  useEffect(() => {
    setMedia(loadGalleryMedia())

    const handleStorage = () => setMedia(loadGalleryMedia())
    window.addEventListener('storage', handleStorage)
    window.addEventListener('gallery-media-updated', handleStorage)
    return () => {
      window.removeEventListener('storage', handleStorage)
      window.removeEventListener('gallery-media-updated', handleStorage)
    }
  }, [])

  const resolvedMedia = useMemo(
    () =>
      media.map((item) => ({
        ...item,
        resolvedSrc: encodeURI(item.src),
      })),
    [media],
  )

  return (
    <>
      <SEO {...meta} />
      <section className="page">
        <h1 className="text-3xl font-heading">Gallery</h1>
        <p className="mt-2 text-muted-text">
          A curated look at salon transformations, cuts, colour, and behind-the-scenes moments from Peggy Beauty.
        </p>

        <div className="mt-6 grid grid-cols-2 gap-4 auto-rows-fr md:grid-cols-4">
          {resolvedMedia.map((m, i) => (
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
