import { useEffect, useMemo, useState } from 'react'
import SEO from '../components/SEO'
import { DEFAULT_GALLERY_MEDIA, loadGalleryMedia } from '../data/galleryMedia'
import { getGalleryMediaUrl } from '../config/booking'

async function fetchWithRetry(url, retries = 3, delayMs = 1500) {
  for (let i = 0; i <= retries; i++) {
    try {
      const res = await fetch(url, { cache: 'no-store' })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      return await res.json()
    } catch (err) {
      if (i === retries) throw err
      await new Promise((r) => setTimeout(r, delayMs * (i + 1)))
    }
  }
}

function Gallery() {
  const meta = {
    title: 'Gallery — Peggy Beauty',
    description: 'Before-and-after photos and behind-the-scenes videos from Peggy Beauty salon.',
    url: 'https://example.com/gallery',
    image: '/images/hero.png'
  }
  const [media, setMedia] = useState(DEFAULT_GALLERY_MEDIA)

  useEffect(() => {
    let ignore = false

    async function loadMedia() {
      // 1. Try to fetch from the VPS server (source of truth for admin-uploaded content)
      try {
        const serverMedia = await fetchWithRetry(getGalleryMediaUrl())
        if (!ignore && Array.isArray(serverMedia) && serverMedia.length) {
          setMedia(serverMedia)
          return
        }
      } catch {
        // server unreachable — fall through to localStorage
      }

      // 2. Fall back to localStorage (admin panel edits made in-browser)
      if (!ignore) {
        const local = loadGalleryMedia()
        setMedia(local)
      }
    }

    loadMedia()

    const handleStorage = () => loadMedia()
    window.addEventListener('storage', handleStorage)
    window.addEventListener('gallery-media-updated', handleStorage)
    return () => {
      ignore = true
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
                    const mp4 = `${base}-opt.mp4`
                    const webm = `${base}-opt.webm`
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
