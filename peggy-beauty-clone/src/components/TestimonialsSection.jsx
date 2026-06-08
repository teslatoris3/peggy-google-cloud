import { Star } from 'lucide-react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'
import './testimonials.css'

const testimonials = [
  {
    quote: 'Stellar service and a phenomenal hair transformation. My color has never looked this dimensional.',
    name: 'Jacqueline Macchione',
    service: 'Haircut, color & styling',
    image: '/images/gallery/photos/img_3750.png',
  },
  {
    quote: 'I am beyond thrilled. The salon is warm, polished, and my balayage looks beautiful.',
    name: 'Franca Baud',
    service: 'Hairstyle & balayage',
    image: '/images/gallery/photos/img_3914.png',
  },
  {
    quote: 'My bridal makeup looked flawless and lasted all day. The team made the process effortless.',
    name: 'Maya Ismail',
    service: 'Bridal Makeup',
    image: '/images/gallery/photos/img_4293.png',
  },
  {
    quote: 'The team understood exactly what I wanted and created a glossy, healthy blonde result.',
    name: 'Samantha Reed',
    service: 'Balayage blonde',
    image: '/images/gallery/photos/img_3176.jpg',
  },
]

function TestimonialsSection() {
  return (
    <section className="py-12" id="testimonials">
      <div className="max-w-6xl mx-auto text-center">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary sm:tracking-[0.28em]">Testimonials</p>
          <h2 className="mt-2 text-[36px] md:text-[48px] font-heading">Our clients say</h2>
      </div>

      <div className="mt-10 max-w-6xl mx-auto px-4">
        <Swiper
          autoplay={{ delay: 5200, disableOnInteraction: false, pauseOnMouseEnter: true }}
          breakpoints={{ 0: { slidesPerView: 1 } }}
          loop
          speed={800}
          modules={[Autoplay, Pagination]}
          pagination={{ clickable: true }}
          className="testimonial-swiper"
        >
          {testimonials.map((testimonial) => (
            <SwiperSlide key={testimonial.name}>
              <article
                className="testimonial-card group rounded-[28px] bg-white p-10 md:p-12 shadow-[0_10px_30px_rgba(0,0,0,0.06)] overflow-hidden"
                style={{ borderRadius: '28px', overflow: 'hidden', WebkitClipPath: 'inset(0 round 28px)', clipPath: 'inset(0 round 28px)' }}
              >
                <div className="flex flex-col md:flex-row items-center gap-8">
                  <div className="md:w-3/5 text-left">
                    <div className="flex items-center gap-3 text-yellow-500">
                      {[...Array(5)].map((_, index) => (
                        <Star key={index} size={22} fill="currentColor" aria-hidden="true" className="transition-colors duration-200 group-hover:text-[#C9A96E]" />
                      ))}
                    </div>
                    <p className="mt-4 text-[28px] md:text-[40px] italic leading-[1.02] tracking-tight text-[#111111]">“{testimonial.quote}”</p>
                    <div className="mt-6 text-[15px] md:text-[18px] text-muted-text tracking-wide"><strong>{testimonial.name}</strong><span className="ml-3">{testimonial.service}</span></div>
                  </div>

                  <div className="md:w-2/5">
                    <div
                      className="h-80 md:h-[520px] w-full overflow-hidden rounded-[28px] bg-offwhite-cream"
                      style={{ borderRadius: '28px', overflow: 'hidden', WebkitClipPath: 'inset(0 round 28px)', clipPath: 'inset(0 round 28px)' }}
                    >
                      <img
                        src={testimonial.image}
                        alt={`${testimonial.service} result`}
                        className="h-full w-full object-cover testimonial-image transition-transform duration-700 group-hover:scale-105"
                        style={{ borderRadius: '28px', display: 'block', objectFit: 'cover', WebkitClipPath: 'inset(0 round 28px)', clipPath: 'inset(0 round 28px)' }}
                      />
                    </div>
                  </div>
                </div>
              </article>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  )
}

export default TestimonialsSection

