import { useMemo, useState } from 'react'
import PageHero from '../components/PageHero'
import SEO from '../components/SEO'
import {
  DEFAULT_GALLERY_MEDIA,
  loadGalleryMedia,
  normalizeGalleryMedia,
  resetGalleryMedia,
  saveGalleryMedia,
} from '../data/galleryMedia'

const emptyDraft = {
  type: 'image',
  src: '',
  alt: '',
}

function AdminGallery() {
  const [items, setItems] = useState(() => loadGalleryMedia())
  const [draft, setDraft] = useState(emptyDraft)

  const meta = useMemo(
    () => ({
      title: 'Gallery Admin — Peggy Beauty',
      description: 'Manage Peggy Beauty gallery photos and videos.',
      url: 'https://example.com/admin/gallery',
      image: '/images/hero.png',
    }),
    [],
  )

  const previewItems = useMemo(() => normalizeGalleryMedia(items), [items])

  function updateItem(index, field, value) {
    setItems((current) =>
      current.map((item, i) => (i === index ? { ...item, [field]: value } : item)),
    )
  }

  function addItem() {
    if (!draft.src.trim()) return
    setItems((current) =>
      normalizeGalleryMedia([
        ...current,
        {
          type: draft.type === 'video' ? 'video' : 'image',
          src: draft.src.trim(),
          alt: draft.alt.trim() || 'Gallery item',
        },
      ]),
    )
    setDraft(emptyDraft)
  }

  function removeItem(index) {
    setItems((current) => current.filter((_, i) => i !== index))
  }

  function moveItem(index, direction) {
    setItems((current) => {
      const next = [...current]
      const target = index + direction
      if (target < 0 || target >= next.length) return next
      ;[next[index], next[target]] = [next[target], next[index]]
      return next
    })
  }

  function handleSave() {
    saveGalleryMedia(previewItems)
    setItems(loadGalleryMedia())
    window.dispatchEvent(new Event('gallery-media-updated'))
    window.alert('Gallery media saved in this browser.')
  }

  function handleReset() {
    if (!window.confirm('Reset the gallery to the default site media?')) return
    resetGalleryMedia()
    setItems(DEFAULT_GALLERY_MEDIA)
  }

  function exportJson() {
    const blob = new Blob([JSON.stringify(previewItems, null, 2)], {
      type: 'application/json',
    })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'peggy-gallery-media.json'
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <>
      <SEO {...meta} />
      <PageHero
        eyebrow="Admin"
        title="Gallery Media Manager"
        description="Edit gallery photos and videos without touching the rest of the site."
        image="/images/about_page_banner.png"
      />

      <section className="page">
        <div className="max-w-5xl rounded-3xl border border-gray-100 bg-white p-6 shadow-sm md:p-8">
          <p className="text-sm uppercase tracking-wide text-primary">Safe editor</p>
          <h2 className="mt-2 text-3xl font-semibold">Manage gallery media</h2>
          <p className="mt-3 max-w-3xl text-muted-text">
            These changes are saved in this browser only, so Peggy can experiment safely without affecting the live code or other site features.
          </p>

          <div className="mt-6 grid gap-4 md:grid-cols-[1fr_auto_auto]">
            <select
              className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm"
              value={draft.type}
              onChange={(e) => setDraft((current) => ({ ...current, type: e.target.value }))}
            >
              <option value="image">Image</option>
              <option value="video">Video</option>
            </select>
            <input
              className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm"
              placeholder="/images/gallery/photos/example.png"
              value={draft.src}
              onChange={(e) => setDraft((current) => ({ ...current, src: e.target.value }))}
            />
            <input
              className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm"
              placeholder="Alt text / caption"
              value={draft.alt}
              onChange={(e) => setDraft((current) => ({ ...current, alt: e.target.value }))}
            />
          </div>

          <div className="mt-4 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={addItem}
              className="rounded bg-primary px-4 py-2 text-sm font-semibold text-deep-black"
            >
              Add item
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="rounded border border-gray-200 px-4 py-2 text-sm font-semibold"
            >
              Save to browser
            </button>
            <button
              type="button"
              onClick={exportJson}
              className="rounded border border-gray-200 px-4 py-2 text-sm font-semibold"
            >
              Export JSON
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="rounded border border-red-200 px-4 py-2 text-sm font-semibold text-red-700"
            >
              Reset defaults
            </button>
          </div>

          <div className="mt-8 grid gap-4">
            {previewItems.map((item, index) => (
              <div
                key={`${item.src}-${index}`}
                className="grid gap-4 rounded-2xl border border-gray-100 bg-[#fafafa] p-4 md:grid-cols-[160px_1fr_auto]"
              >
                <div className="overflow-hidden rounded-xl bg-black">
                  {item.type === 'video' ? (
                    <video src={encodeURI(item.src)} className="h-40 w-full object-cover" muted playsInline />
                  ) : (
                    <img src={encodeURI(item.src)} alt={item.alt} className="h-40 w-full object-cover" />
                  )}
                </div>

                <div className="grid gap-3">
                  <div className="flex flex-wrap gap-2">
                    <select
                      className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm"
                      value={item.type}
                      onChange={(e) => updateItem(index, 'type', e.target.value)}
                    >
                      <option value="image">Image</option>
                      <option value="video">Video</option>
                    </select>
                    <input
                      className="min-w-0 flex-1 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm"
                      value={item.src}
                      onChange={(e) => updateItem(index, 'src', e.target.value)}
                    />
                  </div>
                  <input
                    className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm"
                    value={item.alt}
                    onChange={(e) => updateItem(index, 'alt', e.target.value)}
                    placeholder="Alt text"
                  />
                </div>

                <div className="flex flex-row flex-wrap gap-2 md:flex-col md:justify-start">
                  <button type="button" onClick={() => moveItem(index, -1)} className="rounded border px-3 py-2 text-sm">
                    Up
                  </button>
                  <button type="button" onClick={() => moveItem(index, 1)} className="rounded border px-3 py-2 text-sm">
                    Down
                  </button>
                  <button type="button" onClick={() => removeItem(index)} className="rounded border border-red-200 px-3 py-2 text-sm text-red-700">
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

export default AdminGallery
