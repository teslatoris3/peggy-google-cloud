import { motion } from 'framer-motion'
import SEO from '../components/SEO'
import products from '../data/products'

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, delay: i * 0.07 },
  }),
}

function ProductCard({ product, index }) {
  const hasSaving = product.origPrice > product.salonPrice

  return (
    <motion.div
      custom={index}
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-40px' }}
      className="flex flex-col rounded-2xl border border-primary/20 bg-white overflow-hidden shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="relative overflow-hidden bg-offwhite-cream aspect-[3/4]">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover object-center"
          loading="lazy"
        />
        {hasSaving && (
          <div className="absolute top-3 left-3 bg-primary text-deep-black text-xs font-bold px-2 py-1 rounded">
            Save ${product.origPrice - product.salonPrice}
          </div>
        )}
      </div>

      <div className="flex flex-col flex-1 p-4 gap-2">
        <h3 className="font-heading text-lg font-semibold text-charcoal leading-snug">
          {product.name}
        </h3>

        <div className="mt-auto flex items-end gap-3">
          <div className="flex flex-col">
            <span className="text-xs text-muted-text mb-0.5">Reg. (incl. tax)</span>
            <span className="text-sm line-through text-muted-text">${product.origPrice}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-primary font-semibold mb-0.5">Salon Price</span>
            <span className="text-2xl font-bold text-deep-black">${product.salonPrice}</span>
          </div>
        </div>

        <p className="text-xs text-muted-text">
          Available in-salon only &middot; <strong className="text-deep-black">NO TAX</strong>
        </p>
      </div>
    </motion.div>
  )
}

function Products() {
  const meta = {
    title: 'Products — Peggy Beauty',
    description: 'Shop professional beauty products available exclusively in-salon at Peggy Beauty. Discounted salon prices, no tax.',
    url: 'https://example.com/products',
    image: '/images/hero.png',
  }

  return (
    <>
      <SEO {...meta} />
      <section className="page">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h1 className="text-3xl md:text-4xl font-heading font-bold brand-heading-color">
            Our Products
          </h1>
          <p className="mt-3 text-muted-text">
            Professional beauty products available exclusively in-salon.
            <br />
            Prices shown are discounted salon prices — <strong className="text-deep-black">NO TAX</strong> applied at checkout.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {products.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>

        <div className="mt-10 rounded-2xl border border-primary/20 bg-white p-6 text-center">
          <p className="text-muted-text text-sm">
            All products are sold in-salon only. Visit us or call{' '}
            <a href="tel:+14165187979" className="text-primary font-semibold hover:underline">
              +1 (416) 518-7979
            </a>{' '}
            to check availability.
          </p>
        </div>
      </section>
    </>
  )
}

export default Products
