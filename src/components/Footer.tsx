const NAV = [
  { href: '#flavours', label: 'Flavours' },
  { href: '#personalities', label: 'Personalities' },
  { href: '#format', label: 'Format' },
  { href: '#moments', label: 'Moments' },
  { href: '#worlds', label: 'Worlds' },
]

export default function Footer() {
  return (
    <footer className="px-5 pb-10 sm:px-8 lg:px-10">
      <div
        className="flex flex-col gap-6 border-t py-10 sm:flex-row sm:items-start sm:justify-between"
        style={{ borderColor: 'var(--line)' }}
      >
        <div>
          <p className="display text-[22px]">
            Nose<span style={{ color: 'var(--accent-ink)' }}>Nic</span>
          </p>
          <p className="eyebrow mt-2 text-[10px]" style={{ color: 'var(--muted)' }}>
            Nasal Inhaler Series / Breaking Flavour
          </p>
        </div>

        <nav className="flex flex-wrap gap-x-6 gap-y-2">
          {NAV.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-[13px] text-bone/70 transition-colors duration-200 hover:text-bone"
            >
              {item.label}
            </a>
          ))}
        </nav>
      </div>

      <div
        className="flex flex-col gap-4 border-t py-8 text-[13px] leading-relaxed sm:flex-row sm:items-start sm:justify-between"
        style={{ borderColor: 'var(--line)', color: 'var(--muted)' }}
      >
        <p className="max-w-[62ch]">
          <strong className="font-bold text-bone">
            Warning: This product contains nicotine. Nicotine is an addictive chemical.
          </strong>{' '}
          For adults 18+ only. Not for use by non-smokers, pregnant or breastfeeding women.
          Product information follows the final approved packaging.
        </p>
        <p className="shrink-0 sm:text-right">
          &copy; {new Date().getFullYear()} NoseNic
          <br />
          Company details / product information to follow.
        </p>
      </div>
    </footer>
  )
}
