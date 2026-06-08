import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./index.html', './app/**/*.{js,ts,jsx,tsx}', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#C9A96E',
        'deep-black': '#0A0A0A',
        'offwhite-cream': '#FAF7F2',
        charcoal: '#2C2C2C',
        'muted-text': '#6B6B6B',
      },
      fontFamily: {
        heading: ['var(--font-playfair)', 'serif'],
        sans: ['var(--font-inter)', 'ui-sans-serif', 'system-ui'],
      },
    },
  },
  plugins: [],
}

export default config
