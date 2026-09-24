import AgeGate from './components/AgeGate'
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
import Newsletter from './components/Newsletter'
import NewsletterPopup from './components/NewsletterPopup'
import OrderPage from './pages/OrderPage'
import PrivacyPage from './pages/PrivacyPage'

const SECTIONS = {
  hero: Hero,
  manifesto: Manifesto,
  flavours: FlavourJourney,
  personalities: Personalities,
  format: Format,
  moments: Moments,
  worlds: Worlds,
  newsletter: Newsletter,
  statement: Statement,
  footer: Footer,
} as const

export default function App() {
  // Two standalone routes beside the home page.
  const path = window.location.pathname.replace(/\/+$/, '')
  const Page = path === '/order' ? OrderPage : path === '/privacy' ? PrivacyPage : null
  if (Page) {
    return (
      <>
        <Grain />
        <AgeGate />
        <Page />
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
      <AgeGate />
      <Nav />
      <main>
        <Hero />
        <Manifesto />
        <FlavourJourney />
        <Personalities />
        <Format />
        <Moments />
        <Worlds />
        <Newsletter />
        <Statement />
      </main>
      <Footer />
      <NewsletterPopup />
    </>
  )
}
