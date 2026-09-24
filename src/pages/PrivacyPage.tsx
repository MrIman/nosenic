import { useEffect } from 'react'
import PageHeader from '../components/PageHeader'
import { CONTACT_EMAIL } from '../data/nosenic'

/** Filled in by NoseNic before launch; shown highlighted so nothing ships blank. */
const TODO = ({ children }: { children: React.ReactNode }) => (
  <mark
    className="rounded-sm px-1.5 py-0.5"
    style={{ background: 'var(--accent)', color: '#08080a' }}
  >
    {children}
  </mark>
)

const UPDATED = '24 September 2026'

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-12 border-t pt-8" style={{ borderColor: 'var(--line)' }}>
      <h2 className="display text-[clamp(20px,2.4vw,28px)]">{title}</h2>
      <div
        className="mt-4 space-y-4 text-[16px] leading-relaxed"
        style={{ color: 'var(--muted)' }}
      >
        {children}
      </div>
    </section>
  )
}

export default function PrivacyPage() {
  useEffect(() => {
    document.title = 'Privacy policy — NoseNic'
  }, [])

  return (
    <div className="min-h-svh">
      <PageHeader />

      <main className="mx-auto w-full max-w-3xl px-5 pb-24 pt-12 sm:px-8 sm:pt-16">
        <p className="eyebrow" style={{ color: 'var(--accent-ink)' }}>
          Legal
        </p>
        <h1 className="display mt-4 text-[clamp(34px,7vw,64px)]">Privacy policy</h1>
        <p className="mt-5 text-[14px]" style={{ color: 'var(--muted)' }}>
          Last updated {UPDATED}
        </p>

        <p
          className="mt-8 rounded-sm border p-5 text-[15px] leading-relaxed"
          style={{ borderColor: 'var(--accent)' }}
        >
          <strong className="text-bone">Draft for review.</strong> The highlighted parts need
          NoseNic&rsquo;s own details, and the whole text should be checked by a lawyer before
          launch — this is a nicotine product sold across several markets.
        </p>

        <Section title="Who we are">
          <p>
            This website is run by <TODO>[legal company name]</TODO>, registered at{' '}
            <TODO>[registered address]</TODO>, company number <TODO>[company number]</TODO>, VAT{' '}
            <TODO>[VAT number]</TODO> (&ldquo;NoseNic&rdquo;, &ldquo;we&rdquo;). We are the data
            controller for the personal data described here. Write to us at{' '}
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="underline underline-offset-2 hover:text-bone"
            >
              {CONTACT_EMAIL}
            </a>
            .
          </p>
        </Section>

        <Section title="What we collect and why">
          <p>
            <span className="text-bone">Order form.</span> Company name, VAT or tax number,
            invoice and delivery address, country, contact name, email, phone, packaging
            language, quantities and your notes. We use it to price, confirm and fulfil your
            order, and to issue invoices. Legal basis: performance of a contract, or steps taken
            at your request before entering one; invoicing data is also kept to meet accounting
            law.
          </p>
          <p>
            <span className="text-bone">Newsletter.</span> Your email address, plus the fact and
            time of your consent. Legal basis: consent, which you may withdraw at any time.
          </p>
          <p>
            <span className="text-bone">Hosting records.</span> Our host keeps short-lived
            technical logs (IP address, request, user agent) to run and secure the site. Legal
            basis: our legitimate interest in a working, secure website.
          </p>
          <p>
            We do not run advertising trackers or analytics on this site, and we do not profile
            you or make automated decisions about you.
          </p>
        </Section>

        <Section title="Cookies and local storage">
          <p>
            We set no advertising or analytics cookies. The site stores one item in your
            browser&rsquo;s local storage to remember that you confirmed you are 18 or over, so
            it does not ask again. You can clear it at any time in your browser settings.
          </p>
        </Section>

        <Section title="Who else sees your data">
          <p>
            We share data only with the suppliers who run this site for us: our hosting provider
            Vercel Inc. and our email provider <TODO>[email provider — Resend]</TODO>. Order
            details also reach our accountants, carriers and, where relevant, our manufacturing
            partner, so your order can be produced, invoiced and delivered. We never sell your
            data.
          </p>
          <p>
            Some of these suppliers are outside the European Economic Area. Where that is the
            case, transfers rely on the European Commission&rsquo;s standard contractual clauses
            or an adequacy decision.
          </p>
        </Section>

        <Section title="How long we keep it">
          <p>
            Orders and invoicing records:{' '}
            <TODO>[retention period — commonly 5 or 6 years]</TODO> as required by tax and
            accounting law. Enquiries that do not lead to an order: up to 24 months. Newsletter:
            until you unsubscribe, plus a short record of the withdrawal.
          </p>
        </Section>

        <Section title="Your rights">
          <p>
            You can ask us for a copy of your data, to correct or delete it, to restrict or
            object to how we use it, and to receive it in a portable form. Where we rely on
            consent, you can withdraw it at any time — that does not affect what we did before.
            Email{' '}
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="underline underline-offset-2 hover:text-bone"
            >
              {CONTACT_EMAIL}
            </a>
            . You also have the right to complain to your data protection authority; ours is{' '}
            <TODO>[supervisory authority]</TODO>.
          </p>
        </Section>

        <Section title="Age restriction">
          <p>
            This site is for adults aged 18 or over and for trade customers. We do not knowingly
            collect data from anyone under 18. If you believe a minor has given us data, write
            to us and we will delete it.
          </p>
        </Section>

        <Section title="Changes">
          <p>
            If we change this policy we will update the date at the top of the page and, where
            the change matters, tell newsletter subscribers by email.
          </p>
        </Section>

        <p
          className="mt-12 border-t pt-6 text-[12px] leading-relaxed"
          style={{ borderColor: 'var(--line)', color: 'var(--muted)' }}
        >
          <span className="font-medium text-bone/90">
            Warning: This product contains nicotine. Nicotine is an addictive chemical.
          </span>{' '}
          For adults 18+ only.
        </p>
      </main>
    </div>
  )
}
