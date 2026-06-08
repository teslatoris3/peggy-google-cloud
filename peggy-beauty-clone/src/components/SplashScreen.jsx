import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

function SplashScreen({ onFinish }) {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    // Show splash for 2200ms then hide
    const timer = setTimeout(() => setVisible(false), 2200)
    return () => clearTimeout(timer)
  }, [])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.9 } }}
          onAnimationComplete={() => {
            if (!visible && onFinish) onFinish()
          }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#F7E6E2] splash-screen"
        >
          <div className="relative flex items-center justify-center">
            <img src="/images/hero-accent.svg" alt="ornament" className="absolute -top-6 opacity-50 splash-ornament" />

            <motion.img
              src="/images/logo.png"
              alt="Peggy Beauty"
              initial={{ y: 24, scale: 0.9, opacity: 0 }}
              animate={{ y: 0, scale: 1, opacity: 1 }}
              exit={{ y: -12, scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.9, ease: 'easeOut' }}
              className="splash-logo shadow-lg"
            />

            <motion.div
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.03 }}
              transition={{ duration: 0.9 }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default SplashScreen
