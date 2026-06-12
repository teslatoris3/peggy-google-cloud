export const GALLERY_MEDIA_STORAGE_KEY = 'peggy-gallery-media-v1'

export const DEFAULT_GALLERY_MEDIA = [
  {
    type: 'image',
    src: '/images/makeup_new.jpeg',
    alt: 'Makeup artistry with a polished bridal finish',
  },
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
    src: '/images/gallery/photos/boys-haircuts-fringe-up-teaneck-nj2.png',
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
  {
    type: 'video',
    src: '/images/gallery/videos/IMG_7097 (1).MOV',
    alt: 'Salon video featuring a fresh transformation',
  },
]

export function normalizeGalleryMedia(items) {
  if (!Array.isArray(items)) return []

  const seen = new Set()
  return items
    .map((item) => ({
      type: item?.type === 'video' ? 'video' : 'image',
      src: typeof item?.src === 'string' ? item.src.trim() : '',
      alt: typeof item?.alt === 'string' ? item.alt.trim() : '',
    }))
    .filter((item) => item.src !== '')
    .filter((item) => {
      if (seen.has(item.src)) return false
      seen.add(item.src)
      return true
    })
}

export function loadGalleryMedia() {
  if (typeof window === 'undefined') return DEFAULT_GALLERY_MEDIA

  try {
    const raw = window.localStorage.getItem(GALLERY_MEDIA_STORAGE_KEY)
    if (!raw) return DEFAULT_GALLERY_MEDIA
    const parsed = JSON.parse(raw)
    const normalized = normalizeGalleryMedia(parsed)
    return normalized.length ? normalized : DEFAULT_GALLERY_MEDIA
  } catch (error) {
    return DEFAULT_GALLERY_MEDIA
  }
}

export function saveGalleryMedia(items) {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(GALLERY_MEDIA_STORAGE_KEY, JSON.stringify(normalizeGalleryMedia(items)))
}

export function resetGalleryMedia() {
  if (typeof window === 'undefined') return
  window.localStorage.removeItem(GALLERY_MEDIA_STORAGE_KEY)
}
