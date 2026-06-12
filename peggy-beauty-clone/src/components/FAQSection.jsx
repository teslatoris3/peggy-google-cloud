import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

const faqs = [
  {
    question: 'What makes Peggy Beauty the best salon in North York?',
    answer:
      'Peggy Beauty combines advanced colour and makeup artistry with a luxury guest experience focused on healthy, natural-looking results.',
  },
  {
    question: 'What types of makeup services do you offer?',
    answer:
      'We offer bridal, evening, soft-glam, and editorial makeup services, including airbrush and long-wear techniques tailored to skin tone and event needs.',
  },
  {
    question: 'How do I maintain balayage between appointments?',
    answer:
      'Use salon-quality color-safe products, reduce heat styling, book gloss or toner refreshes, and follow your stylist’s at-home care plan.',
  },
  {
    question: 'Do you offer consultations?',
    answer:
      'Yes. Consultations help us understand your goals, assess your hair, recommend the right service, and provide accurate timing and pricing.',
  },
  {
    question: 'Can you book for weddings or special events?',
    answer:
      'Yes. Our team can support special event styling and bridal beauty requests with advance booking and a tailored appointment plan.',
  },
  {
    question: 'What is balayage and why is it popular?',
    answer:
      'Balayage is a hand-painted highlighting technique loved for its soft dimension, natural grow-out, and custom sun-kissed finish.',
  },
  {
    question: 'Can you match my hair color exactly?',
    answer:
      'Our color specialists carefully assess tone, depth, and condition to create the closest possible match while protecting the integrity of your hair.',
  },
]

function FAQSection() {
  const [openIndex, setOpenIndex] = useState(0)

  return (
    <section id="faq" className="mx-auto max-w-7xl px-6 py-12">
      <h2 className="text-2xl font-heading" style={{ fontSize: 'var(--faq-title-size)' }}>Frequently Asked Questions</h2>

      <div className="mt-6 grid gap-4">
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index

          return (
            <article key={faq.question} className="rounded-lg border bg-white p-4">
              <button aria-expanded={isOpen} className="flex w-full items-center justify-between" onClick={() => setOpenIndex(isOpen ? null : index)} type="button">
                <span className="faq-question font-medium">{faq.question}</span>
                <motion.span animate={{ rotate: isOpen ? 45 : 0 }} transition={{ duration: 0.22 }} className="faq-icon">+</motion.span>
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.26 }}
                    style={{ overflow: 'hidden' }}
                  >
                    <p className="mt-3 text-muted-text" style={{ fontSize: 'var(--faq-answer-size)' }}>{faq.answer}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </article>
          )
        })}
      </div>
    </section>
  )
}

export default FAQSection
