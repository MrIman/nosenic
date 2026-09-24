import Grain from './components/Grain'
import Nav from './components/Nav'
import Hero from './components/Hero'
import Manifesto from './components/Manifesto'
import FlavourJourney from './components/FlavourJourney'
import Personalities from './components/Personalities'
import Format from './components/Format'
import Moments from './components/Moments'
import Worlds from './components/Worlds'
import Statement from './components/Statement'
import Footer from './components/Footer'
import OrderPage from './pages/OrderPage'

const SECTIONS = {
  hero: Hero,
  manifesto: Manifesto,
  flavours: FlavourJourney,
  personalities: Personalities,
  format: Format,
  moments: Moments,
  worlds: Worlds,
  statement: Statement,
  footer: Footer,
} as const

export default function App() {
  // Single extra route; anything under /order is the trade order form.
  if (window.location.pathname.replace(/\/+$/, '') === '/order') {
    return (
      <>
        <Grain />
        <OrderPage />
      </>
    )
  }

  // Dev affordance: ?only=worlds renders a single section at scroll 0 so it can
  // be inspected without driving the whole page.
  if (import.meta.env.DEV) {
    // Dev affordance: ?only=worlds (or ?only=statement,footer) renders just those
    // sections at scroll 0 so they can be inspected without driving the whole page.
    const only = new URLSearchParams(window.location.search).get('only')
    const picked = only
      ?.split(',')
      .map((name) => SECTIONS[name.trim() as keyof typeof SECTIONS])
      .filter(Boolean)
    if (picked?.length) {
      return (
        <>
          <Grain />
          <main>
            {picked.map((Section, index) => (
              <Section key={index} />
            ))}
          </main>
        </>
      )
    }
  }

  return (
    <>
      <Grain />
      <Nav />
      <main>
        <Hero />
        <Manifesto />
        <FlavourJourney />
        <Personalities />
        <Format />
        <Moments />
        <Worlds />
        <Statement />
      </main>
      <Footer />
    </>
  )
}
