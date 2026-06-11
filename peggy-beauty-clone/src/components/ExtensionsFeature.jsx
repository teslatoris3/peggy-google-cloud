import OptimizedImage from './OptimizedImage'
import { ArrowRight, Check } from 'lucide-react'

function ExtensionsFeature() {
  return (
    <section className="mt-12 bg-[#F7E6E2]">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <article className="grid items-center gap-6 md:grid-cols-2">
          <div className="order-1 md:order-0">
            <OptimizedImage src="/images/balayage.png" alt="Balayage salon service" className="rounded-lg object-cover w-full h-[420px] md:h-[520px]" />
          </div>

          <div className="brand-card" style={{ padding: '1.5rem' }}>
            <p className="text-sm text-primary">Balayage</p>
            <h3 className="mt-2 text-2xl font-semibold">Balayage & Dimension Colouring</h3>
            <p className="mt-3 text-sm text-muted-text">Custom freehand balayage and highlighting to create natural, sun-kissed dimension with minimal upkeep. We tailor placement, tone, and processing to protect hair health and deliver a seamless, lived-in finish.</p>
            <ul className="mt-4 grid gap-2">
              <li className="flex items-start gap-2 text-sm"><Check size={16} aria-hidden="true" />Freehand balayage and hand-painted highlights</li>
              <li className="flex items-start gap-2 text-sm"><Check size={16} aria-hidden="true" />Face-framing & money-piece placement</li>
              <li className="flex items-start gap-2 text-sm"><Check size={16} aria-hidden="true" />Toning, glossing and colour-refresh services</li>
              <li className="flex items-start gap-2 text-sm"><Check size={16} aria-hidden="true" />Low-maintenance root blends and regrowth strategies</li>
            </ul>
            <button disabled className="mt-6 inline-flex items-center gap-2 rounded bg-primary px-4 py-2 text-deep-black font-semibold opacity-60 cursor-not-allowed">Book a Consultation <ArrowRight size={16} /></button>
          </div>
        </article>
      </div>
    </section>
  )
}

export default ExtensionsFeature
