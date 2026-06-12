import { Link } from 'react-router-dom'

import OptimizedImage from './OptimizedImage'
import { getServiceBookingUrl } from '../config/booking'

function ServiceCard({ id, order, title, description, features, image }) {
  return (
    <article className="rounded-3xl border border-gray-100 bg-white overflow-hidden shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-md">
      {image && (
        <div className="relative h-40 w-full sm:h-44">
          <OptimizedImage src={image} alt={title} className="h-full w-full object-cover" />
          <div className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-sm font-semibold">{order}</div>
        </div>
      )}

      <div className="p-5 sm:p-6">
        <h3 className="text-2xl sm:text-3xl font-semibold mb-4">{title}</h3>
        <p className="text-sm sm:text-base md:text-lg text-muted-text leading-7 sm:leading-8">{description}</p>
      {features?.length ? (
        <ul className="mt-5 space-y-3 text-sm text-muted-text">
          {features.map((feature) => (
            <li key={feature} className="flex gap-3">
              <span className="mt-1 inline-flex h-2.5 w-2.5 rounded-full bg-primary" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      ) : null}

        <div className="mt-6">
          {(() => {
            const url = getServiceBookingUrl(title)
            const open = (e) => { e.preventDefault(); console.log('DEBUG booking url:', url); window.open(url, '_blank') }
            return (
              <a href={url} onClick={open} className="inline-flex items-center gap-2 rounded bg-primary px-4 py-2 text-sm font-semibold text-deep-black" rel="noopener noreferrer">
                Book Now
              </a>
            )
          })()}
        </div>
      </div>
    </article>
  )
}

export default ServiceCard
