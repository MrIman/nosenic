import { useEffect, useState } from 'react'
import Logo from './Logo'
import { CONTACT_EMAIL } from '../data/nosenic'

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
    // iOS Safari ignores overflow on body alone, so lock the root too.
    const roots = [document.documentElement, document.body]
    roots.forEach((node) => (node.style.overflow = open ? 'hidden' : ''))
    if (!open) return

    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => {
      roots.forEach((node) => (node.style.overflow = ''))
      window.removeEventListener('keydown', onKey)
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
            className="group -my-3 flex items-baseline gap-2.5 py-3"
            aria-label="NoseNic — home"
          >
            <Logo
              title=""
              className="block h-[20px] w-auto self-center text-bone sm:h-[24px]"
            />
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
              aria-controls="mobile-menu"
              className="-mr-2.5 flex size-11 cursor-pointer flex-col items-center justify-center gap-[5px] lg:hidden"
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
        id="mobile-menu"
        // Invisible while closed, so keep its links out of the tab order too.
        inert={!open}
        className={`fixed inset-0 z-40 flex flex-col justify-center gap-2 overflow-y-auto bg-ink/97 px-6 py-24 backdrop-blur-xl transition-opacity duration-300 lg:hidden ${
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
        <a
          href={`mailto:${CONTACT_EMAIL}`}
          className="mt-8 inline-block self-start py-2 text-[16px] text-bone"
        >
          {CONTACT_EMAIL}
        </a>
        <p className="text-[13px]" style={{ color: 'var(--muted)' }}>
          18+ only · NoseNic / Nasal Inhaler Series
        </p>
      </div>
    </>
  )
}
