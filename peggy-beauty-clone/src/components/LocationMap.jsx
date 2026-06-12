function LocationMap({
  title = 'Find Peggy Beauty',
  query = 'Peggy Beauty North York Toronto',
  caption = 'Visit us in North York, Toronto.',
  className = '',
}) {
  const mapSrc = `https://www.google.com/maps?q=${encodeURIComponent(query)}&z=15&output=embed`
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`

  return (
    <section className={`overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm ${className}`}>
      <div className="grid gap-0 md:grid-cols-[1.05fr_0.95fr]">
        <div className="p-6 md:p-8">
          <p className="text-sm uppercase tracking-wide text-primary">Location</p>
          <h3 className="mt-2 text-2xl font-semibold text-deep-black">{title}</h3>
          <p className="mt-3 text-sm leading-7 text-muted-text">{caption}</p>
          <p className="mt-4 text-sm leading-7 text-muted-text">
            Use the map to get directions, check the surrounding area, and plan your visit before your appointment.
          </p>
          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center rounded bg-primary px-4 py-2 text-sm font-semibold text-deep-black"
          >
            Open in Google Maps
          </a>
        </div>

        <div className="relative min-h-[320px] bg-[#f6f1eb]">
          <iframe
            title={title}
            src={mapSrc}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="absolute inset-0 h-full w-full border-0"
          />
        </div>
      </div>
    </section>
  )
}

export default LocationMap
