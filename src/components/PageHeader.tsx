import Logo from './Logo'

/** Slim header for the standalone pages (order form, privacy policy). */
export default function PageHeader() {
  return (
    <header
      className="flex items-center justify-between border-b px-5 py-5 sm:px-8 lg:px-10"
      style={{ borderColor: 'var(--line)' }}
    >
      <a href="/" aria-label="NoseNic — home" className="-my-3 block py-3">
        <Logo title="" className="block h-[22px] w-auto text-bone" />
      </a>
      <a
        href="/"
        className="-my-3 py-3 text-[14px] text-bone/70 transition-colors duration-200 hover:text-bone"
      >
        &larr; Back to site
      </a>
    </header>
  )
}
