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
  // Dev affordance: ?only=worlds renders a single section at scroll 0 so it can
  // be inspected without driving the whole page.
  if (import.meta.env.DEV) {
    const only = new URLSearchParams(window.location.search).get('only')
    const Section = only ? SECTIONS[only as keyof typeof SECTIONS] : undefined
    if (Section) {
      return (
        <>
          <Grain />
          <main>
            <Section />
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
