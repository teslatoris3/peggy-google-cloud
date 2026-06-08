function Footer() {
  return (
    <>
    <footer className="bg-deep-black text-offwhite-cream">
      <div className="h-4 border-y border-primary/35" style={{ backgroundImage: "repeating-linear-gradient(135deg, rgba(201,169,110,.95) 0 1px, transparent 1px 14px)" }} />

      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center border border-primary text-2xl font-heading text-primary">P</span>
            <div>
              <div className="font-heading text-2xl">Peggy Beauty</div>
              <div className="text-sm text-offwhite-cream/70">Hair • Nails • Skin • Makeup</div>
            </div>
          </div>

          <div className="mt-8 grid w-full gap-6 md:grid-cols-3">
            <a href="https://www.instagram.com/peggybeauty.salon" target="_blank" rel="noreferrer" className="flex items-center justify-center gap-3 text-sm text-offwhite-cream/75">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                <path d="M7.75 2h8.5C19.097 2 21 3.903 21 6.25v11.5C21 20.097 19.097 22 16.25 22h-8.5C4.903 22 3 20.097 3 17.75V6.25C3 3.903 4.903 2 7.75 2zm4.25 5.5a4.25 4.25 0 1 0 0 8.5 4.25 4.25 0 0 0 0-8.5zm5.25-.75a1.05 1.05 0 1 1 0 2.1 1.05 1.05 0 0 1 0-2.1z" />
              </svg>
              @peggybeauty.salon
            </a>

            <a href="mailto:Pegahzokaie@yahoo.com" className="flex items-center justify-center gap-3 text-sm text-offwhite-cream/75">
              <svg width="18" height="14" viewBox="0 0 24 18" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                <path d="M2 4.5A2.5 2.5 0 0 1 4.5 2h15A2.5 2.5 0 0 1 22 4.5v9A2.5 2.5 0 0 1 19.5 16H4.5A2.5 2.5 0 0 1 2 13.5v-9z" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M4.5 4L12 8.5 19.5 4" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Pegahzokaie@yahoo.com
            </a>

            <a href="https://www.facebook.com/share/1BXrvBoe1u/?mibextid=wwXIfr" target="_blank" rel="noreferrer" className="flex items-center justify-center gap-3 text-sm text-offwhite-cream/75">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                <path d="M22 12.07C22 6.48 17.52 2 11.93 2S1.86 6.48 1.86 12.07c0 4.99 3.66 9.13 8.44 9.88v-6.99H8.2v-2.88h2.06V9.49c0-2.03 1.2-3.15 3.03-3.15.88 0 1.8.16 1.8.16v2h-1.03c-1.02 0-1.33.63-1.33 1.28v1.55h2.26l-.36 2.88h-1.9v6.99c4.78-.75 8.44-4.89 8.44-9.88z" />
              </svg>
              Facebook
            </a>
          </div>
        </div>
      </div>

      
    </footer>
      <div className="bg-deep-black text-offwhite-cream/90 border-t border-primary/10">
        <div className="mx-auto max-w-7xl px-6 py-3 text-center text-sm">
          <p className="mb-0">Developed by <a href="mailto:amirfarhangkhojasteh@gmail.com" className="text-offwhite-cream/75">amirfarhangkhojasteh@gmail.com</a></p>
        </div>
      </div>
    </>
  )
}

export default Footer
