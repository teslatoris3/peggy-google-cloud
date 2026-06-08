import SEO from '../components/SEO'

function Gallery() {
  const meta = {
    title: 'Gallery — Peggy Beauty',
    description: 'Before-and-after photos and behind-the-scenes videos from Peggy Beauty salon.',
    url: 'https://example.com/gallery',
    image: '/images/hero.png'
  }
  const photos = [
    '/images/gallery/photos/img_3176.jpg',
    '/images/gallery/photos/img_3178.jpg',
    '/images/gallery/photos/img_3272.png',
    '/images/gallery/photos/img_3546.png',
    '/images/gallery/photos/img_3750.png',
    '/images/gallery/photos/img_3848.png',
  ]

  const videos = [
    '/images/gallery/videos/img_3765.mp4',
    '/images/gallery/videos/img_4267.mp4',
    '/images/gallery/videos/img_3691.mov',
    '/images/gallery/videos/img_3966.mov',
    '/images/gallery/videos/img_4262.mov',
  ]

  // interleave photos and videos a bit for variety
  const media = []
  const maxLen = Math.max(photos.length, videos.length)
  for (let i = 0; i < maxLen; i++) {
    if (i < photos.length) media.push({ src: photos[i], type: 'image' })
    if (i < videos.length) media.push({ src: videos[i], type: 'video' })
  }

  return (
    <>
      <SEO {...meta} />
      <section className="page">
      <h1 className="text-3xl font-heading">Gallery</h1>
      <p className="mt-2 text-muted-text">Showcase salon work, transformations, nail designs, client looks, and behind-the-scenes videos here.</p>

      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4 auto-rows-fr">
        {media.map((m, i) => (
          <figure
            key={m.src}
            className={`rounded-lg overflow-hidden group bg-white shadow-sm ${i === 0 ? 'md:col-span-2 md:row-span-2' : ''}`}
          >
            {m.type === 'image' ? (
              <img src={m.src} alt={`Gallery ${i + 1}`} className="w-full h-48 md:h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            ) : (
              <div className="relative w-full h-48 md:h-full bg-black">
                {(() => {
                  const base = m.src.replace(/\.(mov|mp4|webm)$/i, '')
                  const webm = `${base}-opt.webm`
                  const mp4 = `${base}-opt.mp4`
                  return (
                    <video
                      className="w-full h-full object-cover"
                      controls
                      preload="metadata"
                      playsInline
                      muted
                      autoPlay
                      loop
                    >
                      <source src={mp4} type="video/mp4" />
                      <source src={webm} type="video/webm" />
                      <source src={m.src} />
                    </video>
                  )
                })()}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <svg className="w-12 h-12 text-white/90" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
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
