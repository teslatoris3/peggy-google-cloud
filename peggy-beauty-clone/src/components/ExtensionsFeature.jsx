import { Link } from 'react-router-dom'

function ExtensionsFeature() {
  return (
    <section className="mt-12 bg-[#F7E6E2]">
      <div className="mx-auto max-w-7xl px-6 py-16 grid gap-6 md:grid-cols-2 items-center">
        <div>
          <p className="text-sm uppercase tracking-wide text-primary">Toronto's Expertise</p>


          <h2 className="mt-2 text-3xl md:text-4xl font-heading">Signature Makeup Services</h2>

          <p className="mt-4 text-muted-text max-w-lg">
            Professional makeup services for bridal, special events, and editorial moments. Peggy creates flattering, long-wear looks using high-quality products and custom colour techniques to suit your skin and occasion.
          </p>

          <ul className="mt-6 space-y-2 list-inside list-disc text-muted-text max-w-md">
            <li>Bridal and event makeup</li>
            <li>Soft-glam, evening, and editorial looks</li>
            <li>Airbrush and long-wear application options</li>
          </ul>

          <Link to="/services" className="mt-6 inline-flex items-center rounded bg-primary px-6 py-2 text-sm font-semibold text-deep-black">
            View services
          </Link>
        </div>

        <div className="flex justify-center md:justify-end">
          <img src="/images/services/makeup.jpg" alt="Makeup services" className="w-full max-w-md rounded-lg object-cover shadow-sm" />
        </div>
      </div>
    </section>
  )
}

export default ExtensionsFeature
