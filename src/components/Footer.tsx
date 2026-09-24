import Logo from './Logo'
import { CONTACT_EMAIL } from '../data/nosenic'

const NAV = [
  { href: '#flavours', label: 'Flavours' },
  { href: '#personalities', label: 'Personalities' },
  { href: '#format', label: 'Format' },
  { href: '#moments', label: 'Moments' },
  { href: '#worlds', label: 'Worlds' },
  { href: '/order', label: 'Order form' },
]

export default function Footer() {
  return (
    <footer className="px-5 pb-8 sm:px-8 lg:px-10">
      <div
        className="grid gap-10 border-t pb-10 pt-12 sm:grid-cols-[minmax(0,1fr)_auto_auto] sm:gap-16"
        style={{ borderColor: 'var(--line)' }}
      >
        <Logo
          variant="lockup"
          title="NoseNic — Nicotine Nasal Inhaler"
          className="block h-11 w-auto self-start text-bone"
        />

        <nav aria-label="Footer">
          <p className="eyebrow mb-3" style={{ color: 'var(--muted)' }}>
            Explore
          </p>
          <ul className="grid grid-cols-2 gap-x-8 sm:grid-cols-1">
            {NAV.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="inline-block py-3 text-[14px] text-bone/70 sm:py-2 transition-colors duration-200 hover:text-bone"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <p className="eyebrow mb-3" style={{ color: 'var(--muted)' }}>
            Contact
          </p>
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="inline-block py-3 text-[16px] text-bone sm:py-2 transition-colors duration-200 hover:[color:var(--accent-ink)]"
          >
            {CONTACT_EMAIL}
          </a>
        </div>
      </div>

      <div
        className="flex flex-col gap-3 border-t pt-6 text-[12px] leading-relaxed sm:flex-row sm:items-start sm:justify-between sm:gap-10"
        style={{ borderColor: 'var(--line)', color: 'var(--muted)' }}
      >
        <p className="max-w-[70ch]">
          <span className="font-medium text-bone/90">
            Warning: This product contains nicotine. Nicotine is an addictive chemical.
          </span>{' '}
          For adults 18+ only. Not for use by non-smokers, pregnant or breastfeeding women.
          Product information follows the final approved packaging.
        </p>
        <p className="flex shrink-0 gap-x-4">
          <a
            href="/privacy"
            className="-my-3 py-3 transition-colors duration-200 hover:text-bone"
          >
            Privacy policy
          </a>
          <span>&copy; {new Date().getFullYear()} NoseNic</span>
        </p>
      </div>
    </footer>
  )
}
