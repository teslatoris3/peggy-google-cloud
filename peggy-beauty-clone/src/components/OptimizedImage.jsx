import React, { useEffect, useState } from 'react';

export default function OptimizedImage({ src, alt = '', sizes = '100vw', className = '', style = {}, ...imgProps }) {
  const [manifest, setManifest] = useState(null);
  const [candidates, setCandidates] = useState(null);

  useEffect(() => {
    let mounted = true;
    fetch('/optimized-manifest.json').then(r => r.json()).then(data => {
      if (!mounted) return;
      setManifest(data);
    }).catch(() => setManifest(null));
    return () => { mounted = false };
  }, []);

  useEffect(() => {
    if (!manifest) return;
    const keyMatch = Object.keys(manifest.images || {}).find(k => k.endsWith(src.replace(/^\//, '')) || k.includes('/public/' + src.replace(/^\//, '')));
    if (!keyMatch) {
      setCandidates(null);
      return;
    }
    const variants = manifest.images[keyMatch].variants || [];
    const avif = variants.filter(v => v.format === 'avif').map(v => ({ url: toWebPath(v.file), w: v.width }));
    const webp = variants.filter(v => v.format === 'webp').map(v => ({ url: toWebPath(v.file), w: v.width }));
    setCandidates({ avif, webp });
  }, [manifest, src]);

  function toWebPath(manifestFile) {
    const idx = manifestFile.indexOf('/public');
    if (idx !== -1) return manifestFile.slice(idx + '/public'.length);
    // fallback: if file already looks like a web path
    if (manifestFile.startsWith('/')) return manifestFile;
    return '/' + manifestFile;
  }

  if (!candidates) {
    // fallback: plain img (lazy)
    return <img src={src} alt={alt} loading="lazy" className={className} style={style} {...imgProps} />;
  }

  const avifSrcSet = candidates.avif.map(v => `${v.url} ${v.w}w`).join(', ');
  const webpSrcSet = candidates.webp.map(v => `${v.url} ${v.w}w`).join(', ');
  // pick a fallback src (largest webp if present)
  const fallback = (candidates.webp.length ? candidates.webp[candidates.webp.length - 1].url : src);

  return (
    <picture>
      {avifSrcSet && <source type="image/avif" srcSet={avifSrcSet} sizes={sizes} />}
      {webpSrcSet && <source type="image/webp" srcSet={webpSrcSet} sizes={sizes} />}
      <img src={fallback} alt={alt} loading="lazy" className={className} style={style} {...imgProps} />
    </picture>
  );
}
