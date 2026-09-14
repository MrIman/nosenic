import { useEffect, useState } from 'react'

const LINKS = [
  { href: '#flavours', label: 'Flavours' },
  { href: '#personalities', label: 'Personalities' },
  { href: '#format', label: 'Format' },
  { href: '#moments', label: 'Moments' },
  { href: '#worlds', label: 'Worlds' },
]

export default function Nav() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      setScrolled(window.scrollY > 40)
      setProgress(max > 0 ? window.scrollY / max : 0)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${
          scrolled ? 'bg-ink/72 backdrop-blur-xl' : 'bg-transparent'
        }`}
      >
        <div
          className="h-px origin-left"
          style={{ background: 'var(--accent)', transform: `scaleX(${progress})` }}
          aria-hidden="true"
        />

        <div className="flex items-center justify-between px-5 py-4 sm:px-8 lg:px-10">
          <a
            href="#top"
            className="group flex items-baseline gap-2.5"
            aria-label="NoseNic — home"
          >
            <span className="display text-[20px] leading-none sm:text-[24px]">
              Nose<span style={{ color: 'var(--accent-ink)' }}>Nic</span>
            </span>
            <span
              className="eyebrow hidden text-[10px] xl:inline"
              style={{ color: 'var(--muted)' }}
            >
              Nasal Inhaler Series
            </span>
          </a>

          <nav className="hidden items-center gap-8 lg:flex">
            {LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-[13px] tracking-wide text-bone/70 transition-colors duration-200 hover:text-bone"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <span
              className="hidden rounded-full border px-2.5 py-1 text-[11px] font-bold tracking-widest sm:inline-block"
              style={{ borderColor: 'var(--line)', color: 'var(--muted)' }}
            >
              18+
            </span>
            <a
              href="#flavours"
              className="hidden rounded-full px-5 py-2 text-[13px] font-medium text-ink transition-opacity duration-200 hover:opacity-80 lg:inline-block"
              style={{ background: 'var(--accent)' }}
            >
              Find your flavour
            </a>
            <button
              type="button"
              onClick={() => setOpen((value) => !value)}
              aria-label={open ? 'Close menu' : 'Open menu'}
              aria-expanded={open}
              className="flex cursor-pointer flex-col gap-[5px] p-1 lg:hidden"
            >
              <span
                className={`h-[1.5px] w-6 bg-bone transition-transform duration-300 ${
                  open ? 'translate-y-[6.5px] rotate-45' : ''
                }`}
              />
              <span
                className={`h-[1.5px] w-6 bg-bone transition-opacity duration-300 ${
                  open ? 'opacity-0' : 'opacity-100'
                }`}
              />
              <span
                className={`h-[1.5px] w-6 bg-bone transition-transform duration-300 ${
                  open ? '-translate-y-[6.5px] -rotate-45' : ''
                }`}
              />
            </button>
          </div>
        </div>
      </header>

      <div
        className={`fixed inset-0 z-40 flex flex-col justify-center gap-2 bg-ink/97 px-6 backdrop-blur-xl transition-opacity duration-300 lg:hidden ${
          open ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      >
        {LINKS.map((link, index) => (
          <a
            key={link.href}
            href={link.href}
            onClick={() => setOpen(false)}
            className="display border-b py-4 text-[36px]"
            style={{ borderColor: 'var(--line)' }}
          >
            <span className="eyebrow mr-4 align-middle" style={{ color: 'var(--accent-ink)' }}>
              0{index + 1}
            </span>
            {link.label}
          </a>
        ))}
        <p className="mt-8 text-[12px]" style={{ color: 'var(--muted)' }}>
          NoseNic / Nasal Inhaler Series / Breaking Flavour
        </p>
      </div>
    </>
  )
}
