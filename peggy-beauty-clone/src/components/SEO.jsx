import { useEffect } from 'react'

function setMeta(name, value, attr = 'name') {
  if (!value) return
  let el = document.querySelector(`meta[${attr}="${name}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, name)
    document.head.appendChild(el)
  }
  el.setAttribute('content', value)
}

export default function SEO({ title, description, url, image }) {
  useEffect(() => {
    if (title) document.title = title
    setMeta('description', description)
    setMeta('og:title', title, 'property')
    setMeta('og:description', description, 'property')
    setMeta('og:url', url, 'property')
    setMeta('og:image', image, 'property')
    setMeta('twitter:title', title)
    setMeta('twitter:description', description)
    setMeta('twitter:image', image)
    // canonical
    if (url) {
      let link = document.querySelector('link[rel="canonical"]')
      if (!link) {
        link = document.createElement('link')
        link.setAttribute('rel', 'canonical')
        document.head.appendChild(link)
      }
      link.setAttribute('href', url)
    }
  }, [title, description, url, image])

  return null
}
