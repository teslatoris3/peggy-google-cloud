const fs = require('fs');
const path = require('path');

const file = process.env.GALLERY_MEDIA_FILE || (
  process.env.VERCEL ? path.join('/tmp', 'peggy-gallery-media.json') : path.join(__dirname, 'gallery-media.json')
);

const DEFAULT_GALLERY_MEDIA = [
  { type: 'image', src: '/images/makeup_new.jpeg', alt: 'Makeup artistry with a polished bridal finish' },
  { type: 'image', src: '/images/gallery/photos/hair_colored_blue.png', alt: 'Women color hair with vivid blue dimension' },
  { type: 'image', src: '/images/gallery/photos/man_hair_cut.jpg', alt: 'Men hair cut with a clean modern fade' },
  { type: 'image', src: '/images/gallery/photos/boys-haircuts-fringe-up-teaneck-nj2.png', alt: 'Boy haircut with a fresh fringe-up finish' },
  { type: 'image', src: '/images/gallery/photos/img_3176.jpg', alt: 'Salon transformation with soft polished styling' },
  { type: 'image', src: '/images/gallery/photos/img_3750.png', alt: 'Client look with camera-ready styling' },
  { type: 'image', src: '/images/gallery/photos/img_3914.png', alt: 'Fresh salon work with a refined finish' },
  { type: 'image', src: '/images/gallery/photos/img_3956.jpg', alt: 'Long-form colour and styling result' },
  { type: 'image', src: '/images/gallery/photos/img_4129.png', alt: 'Elegant salon transformation with detail work' },
  { type: 'image', src: '/images/gallery/photos/img_4293.png', alt: 'Signature beauty look with polished finish' },
  { type: 'image', src: '/images/gallery/photos/img_4371.png', alt: 'Clean, professional salon styling result' },
  { type: 'image', src: '/images/gallery/photos/img_4482.png', alt: 'Refined salon photo with balanced colour' },
  { type: 'image', src: '/images/gallery/photos/img_4555.png', alt: 'Finished beauty look with glossy texture' },
  { type: 'video', src: '/images/gallery/videos/IMG_5684 (1).MOV', alt: 'Behind the scenes salon video' },
  { type: 'video', src: '/images/gallery/videos/IMG_7097 (1).MOV', alt: 'Salon video featuring a fresh transformation' },
  { type: 'video', src: '/images/gallery/videos/IMG_7097 (1)2.MOV', alt: 'Salon video — latest transformation' },
];

function normalizeItems(items) {
  if (!Array.isArray(items)) return [];
  const seen = new Set();

  return items
    .map((item) => ({
      type: item && item.type === 'video' ? 'video' : 'image',
      src: typeof item?.src === 'string' ? item.src.trim() : '',
      alt: typeof item?.alt === 'string' ? item.alt.trim() : '',
    }))
    .filter((item) => item.src)
    .filter((item) => {
      if (seen.has(item.src)) return false;
      seen.add(item.src);
      return true;
    });
}

function readFile() {
  if (!fs.existsSync(file)) return DEFAULT_GALLERY_MEDIA.slice();
  try {
    const raw = fs.readFileSync(file, 'utf8');
    const parsed = JSON.parse(raw);
    const normalized = normalizeItems(parsed);
    return normalized.length ? normalized : DEFAULT_GALLERY_MEDIA.slice();
  } catch (error) {
    return DEFAULT_GALLERY_MEDIA.slice();
  }
}

function writeFile(items) {
  const normalized = normalizeItems(items);
  fs.writeFileSync(file, JSON.stringify(normalized, null, 2), 'utf8');
  return normalized;
}

function resetGalleryMedia() {
  return writeFile(DEFAULT_GALLERY_MEDIA);
}

module.exports = {
  file,
  DEFAULT_GALLERY_MEDIA,
  normalizeItems,
  getGalleryMedia: readFile,
  setGalleryMedia: writeFile,
  resetGalleryMedia,
};
