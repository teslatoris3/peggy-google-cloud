import { Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
// FloatingBookButton removed per request (floating button hidden)
import Home from './pages/Home'
import About from './pages/About'
import Services from './pages/Services'
import Pricing from './pages/Pricing'
import Gallery from './pages/Gallery'
import Contact from './pages/Contact'
import AdminGallery from './pages/AdminGallery'
import Products from './pages/Products'
import SplashScreen from './components/SplashScreen'
import { useState } from 'react'

function App() {
  const [showSplash, setShowSplash] = useState(true)

  return (
    <div className="app-shell">
      {showSplash && <SplashScreen onFinish={() => setShowSplash(false)} />}
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/products" element={<Products />} />
          <Route path="/admin/gallery" element={<AdminGallery />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default App
