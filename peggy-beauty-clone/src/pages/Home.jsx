import HeroSlider from '../components/HeroSlider'
import FounderSection from '../components/FounderSection'
import ExtensionsFeature from '../components/ExtensionsFeature'
import ServicesShowcase from '../components/ServicesShowcase'
import TestimonialsSection from '../components/TestimonialsSection'
import VisitUsSection from '../components/VisitUsSection'
import FAQSection from '../components/FAQSection'
import ServiceCard from '../components/ServiceCard'
import SEO from '../components/SEO'

const featuredServices = [
  {
    title: 'Hair Styling',
    description: 'Cuts, blowouts, treatments, color, and occasion styling.',
    features: ['Precision cutting', 'Blowouts & finishing', 'Treatment plans', 'Event styling'],
  },
  {
    title: 'Nail Studio',
    description: 'Classic manicures, gel polish, nail art, and pedicures.',
    features: ['Classic & gel', 'Custom nail art', 'Long-lasting finishes', 'Hygienic prep'],
  },
  {
    title: 'Skin Care',
    description: 'Glow-focused facials, waxing, and personalized treatments.',
    features: ['Glow facials', 'Targeted treatments', 'Professional waxing', 'Homecare guidance'],
  },
]

function Home() {
  const meta = {
    title: 'Peggy Beauty — Salon for Hair, Nails & Makeup',
    description: 'Peggy Beauty provides professional hair, nail, and makeup services with expert stylists and personalized care. Book online or contact us to schedule.',
    url: 'https://example.com/',
    image: '/images/hero.png'
  }
  return (
    <>
      <SEO {...meta} />
      <div className="home">
      <HeroSlider />
      <FounderSection />
      <ExtensionsFeature />
      <ServicesShowcase />
      <TestimonialsSection />
      <VisitUsSection />
      <FAQSection />
      {/* Featured services removed per request */}
    </div>
    </>
  )
}

export default Home
