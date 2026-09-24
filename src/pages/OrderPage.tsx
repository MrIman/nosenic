import { useEffect, useMemo, useRef, useState } from 'react'
import PageHeader from '../components/PageHeader'
import { FLAVOURS } from '../data/nosenic'
import {
  EMPTY_ORDER,
  ORDER_INBOX,
  emptyLines,
  orderCsv,
  orderReference,
  orderText,
  type OrderDetails,
  type OrderLine,
} from '../data/order'

type Status = 'idle' | 'sending' | 'sent' | 'manual'

const FIELD =
  'mt-2 block w-full rounded-sm border bg-transparent px-4 py-3 text-[16px] text-bone outline-none transition-colors duration-200 placeholder:text-bone/30 focus:border-[color:var(--accent-ink)]'

function Field({
  label,
  hint,
  children,
}: {
  label: string
  hint?: string
  children: React.ReactNode
}) {
  return (
    <label className="block">
      <span className="eyebrow" style={{ color: 'var(--muted)' }}>
        {label}
      </span>
      {children}
      {hint && (
        <span className="mt-1 block text-[12px]" style={{ color: 'var(--muted)' }}>
          {hint}
        </span>
      )}
    </label>
  )
}

export default function OrderPage() {
  const [details, setDetails] = useState<OrderDetails>(EMPTY_ORDER)
  const [lines, setLines] = useState<OrderLine[]>(emptyLines)
  const [status, setStatus] = useState<Status>('idle')
  const reference = useRef(orderReference()).current

  useEffect(() => {
    document.title = 'Order form — NoseNic'
  }, [])

  const total = lines.reduce((sum, line) => sum + line.units, 0)
  const text = useMemo(() => orderText(reference, details, lines), [reference, details, lines])

  const set = <K extends keyof OrderDetails>(key: K, value: OrderDetails[K]) =>
    setDetails((previous) => ({ ...previous, [key]: value }))

  const setUnits = (id: string, units: number) =>
    setLines((previous) =>
      previous.map((line) =>
        line.id === id ? { ...line, units: Math.max(0, Math.round(units) || 0) } : line,
      ),
    )

  /** Steps off the latest value, so quick repeated taps each count. */
  const bumpUnits = (id: string, delta: number) =>
    setLines((previous) =>
      previous.map((line) =>
        line.id === id ? { ...line, units: Math.max(0, line.units + delta) } : line,
      ),
    )

  const download = () => {
    const blob = new Blob([orderCsv(reference, details, lines)], {
      type: 'text/csv;charset=utf-8',
    })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${reference}.csv`
    link.click()
    URL.revokeObjectURL(url)
  }

  const mailto = `mailto:${ORDER_INBOX}?subject=${encodeURIComponent(
    `NoseNic order ${reference} — ${details.company || 'new customer'}`,
  )}&body=${encodeURIComponent(text)}`

  const submit = async (event: React.FormEvent) => {
    event.preventDefault()
    if (total < 1) return
    setStatus('sending')
    try {
      const response = await fetch('/api/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reference, details, lines, text }),
      })
      const body = await response.json().catch(() => null)
      // Any failure falls back to sending from the customer's own mail app,
      // so a missing mail key never leaves an order stranded.
      setStatus(response.ok && body?.ok ? 'sent' : 'manual')
    } catch {
      setStatus('manual')
    }
  }

  return (
    <div className="min-h-svh">
      <PageHeader />

      <main className="mx-auto w-full max-w-3xl px-5 pb-24 pt-12 sm:px-8 sm:pt-16">
        <p className="eyebrow" style={{ color: 'var(--accent-ink)' }}>
          Order form · {reference}
        </p>
        <h1 className="display mt-4 text-[clamp(34px,7vw,64px)]">Place an order.</h1>
        <p
          className="mt-5 max-w-[52ch] text-[16px] leading-relaxed"
          style={{ color: 'var(--muted)' }}
        >
          Fill in your company details, set the quantity for each flavour and send. The order
          goes straight to {ORDER_INBOX} and we come back to you with a proforma invoice.
        </p>

        {status === 'sent' ? (
          <section
            className="mt-10 rounded-sm border p-6 sm:p-8"
            style={{ borderColor: 'var(--accent)' }}
          >
            <h2 className="display text-[clamp(22px,3vw,30px)]">Order sent.</h2>
            <p className="mt-3 text-[16px] leading-relaxed" style={{ color: 'var(--muted)' }}>
              Reference <span className="text-bone">{reference}</span>. We have it at{' '}
              {ORDER_INBOX} and will reply to {details.email}.
            </p>
            <button
              type="button"
              onClick={download}
              className="mt-6 inline-flex h-12 items-center rounded-full border px-6 text-[15px] transition-colors duration-200 hover:bg-bone hover:text-ink"
              style={{ borderColor: 'var(--line)' }}
            >
              Download a copy (CSV)
            </button>
          </section>
        ) : (
          <form onSubmit={submit} className="mt-12">
            <fieldset className="border-t pt-8" style={{ borderColor: 'var(--line)' }}>
              <legend className="display pr-4 text-[clamp(20px,2.4vw,26px)]">
                Your company
              </legend>
              <div className="mt-6 grid gap-6 sm:grid-cols-2">
                <Field label="Company name">
                  <input
                    required
                    name="company"
                    autoComplete="organization"
                    value={details.company}
                    onChange={(event) => set('company', event.target.value)}
                    className={FIELD}
                    style={{ borderColor: 'var(--line)' }}
                    placeholder="E-ciggbolaget AB"
                  />
                </Field>
                <Field label="VAT / TIN">
                  <input
                    required
                    name="vat"
                    value={details.vat}
                    onChange={(event) => set('vat', event.target.value)}
                    className={FIELD}
                    style={{ borderColor: 'var(--line)' }}
                    placeholder="SE556853006601"
                  />
                </Field>
                <Field label="Invoice address">
                  <textarea
                    required
                    name="invoiceAddress"
                    rows={3}
                    autoComplete="street-address"
                    value={details.invoiceAddress}
                    onChange={(event) => set('invoiceAddress', event.target.value)}
                    className={FIELD}
                    style={{ borderColor: 'var(--line)' }}
                    placeholder="Street, postcode, city"
                  />
                </Field>
                <Field label="Country">
                  <input
                    required
                    name="country"
                    autoComplete="country-name"
                    value={details.country}
                    onChange={(event) => set('country', event.target.value)}
                    className={FIELD}
                    style={{ borderColor: 'var(--line)' }}
                    placeholder="Sweden"
                  />
                </Field>
              </div>
            </fieldset>

            <fieldset className="mt-12 border-t pt-8" style={{ borderColor: 'var(--line)' }}>
              <legend className="display pr-4 text-[clamp(20px,2.4vw,26px)]">Contact</legend>
              <div className="mt-6 grid gap-6 sm:grid-cols-2">
                <Field label="Contact person">
                  <input
                    required
                    name="contactName"
                    autoComplete="name"
                    value={details.contactName}
                    onChange={(event) => set('contactName', event.target.value)}
                    className={FIELD}
                    style={{ borderColor: 'var(--line)' }}
                  />
                </Field>
                <Field label="Email">
                  <input
                    required
                    type="email"
                    name="email"
                    autoComplete="email"
                    inputMode="email"
                    value={details.email}
                    onChange={(event) => set('email', event.target.value)}
                    className={FIELD}
                    style={{ borderColor: 'var(--line)' }}
                  />
                </Field>
                <Field label="Phone">
                  <input
                    required
                    type="tel"
                    name="phone"
                    autoComplete="tel"
                    inputMode="tel"
                    value={details.phone}
                    onChange={(event) => set('phone', event.target.value)}
                    className={FIELD}
                    style={{ borderColor: 'var(--line)' }}
                  />
                </Field>
                <Field label="Packaging language" hint="Optional — e.g. EN, PL, SE.">
                  <input
                    name="language"
                    value={details.language}
                    onChange={(event) => set('language', event.target.value)}
                    className={FIELD}
                    style={{ borderColor: 'var(--line)' }}
                  />
                </Field>
              </div>
            </fieldset>

            <fieldset className="mt-12 border-t pt-8" style={{ borderColor: 'var(--line)' }}>
              <legend className="display pr-4 text-[clamp(20px,2.4vw,26px)]">Delivery</legend>
              <div className="mt-6 grid gap-6 sm:grid-cols-2">
                <Field label="Delivery address" hint="Leave empty to use the invoice address.">
                  <textarea
                    name="deliveryAddress"
                    rows={3}
                    value={details.deliveryAddress}
                    onChange={(event) => set('deliveryAddress', event.target.value)}
                    className={FIELD}
                    style={{ borderColor: 'var(--line)' }}
                  />
                </Field>
                <Field label="Transport">
                  <select
                    name="transport"
                    value={details.transport}
                    onChange={(event) =>
                      set('transport', event.target.value as OrderDetails['transport'])
                    }
                    className={FIELD}
                    style={{ borderColor: 'var(--line)' }}
                  >
                    <option value="shipping">Shipped by NoseNic</option>
                    <option value="pickup">Customer pickup</option>
                  </select>
                </Field>
              </div>
            </fieldset>

            <fieldset className="mt-12 border-t pt-8" style={{ borderColor: 'var(--line)' }}>
              <legend className="display pr-4 text-[clamp(20px,2.4vw,26px)]">Quantities</legend>
              <p className="mt-2 text-[14px]" style={{ color: 'var(--muted)' }}>
                Units per flavour, in steps of 100. Leave a flavour at zero to skip it.
              </p>

              <ul className="mt-6">
                {lines.map((line, index) => {
                  const flavour = FLAVOURS[index]
                  return (
                    <li
                      key={line.id}
                      className="flex flex-wrap items-center gap-x-4 gap-y-3 border-t py-4"
                      style={{ borderColor: 'var(--line)' }}
                    >
                      <span
                        aria-hidden="true"
                        className="size-3 shrink-0 rounded-full"
                        style={{ background: flavour.accent }}
                      />
                      <span className="min-w-[10ch] flex-1 text-[16px]">{line.name}</span>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => bumpUnits(line.id, -100)}
                          aria-label={`Fewer ${line.name}`}
                          className="size-11 cursor-pointer rounded-full border transition-colors duration-200 hover:bg-bone hover:text-ink"
                          style={{ borderColor: 'var(--line)' }}
                        >
                          &minus;
                        </button>
                        <input
                          type="number"
                          min={0}
                          /* The − / + buttons move by 100; the field's own
                             arrows should match. Typed values stay free. */
                          step={100}
                          inputMode="numeric"
                          aria-label={`${line.name} units`}
                          value={line.units || ''}
                          placeholder="0"
                          onChange={(event) => setUnits(line.id, Number(event.target.value))}
                          className="h-11 w-24 rounded-sm border bg-transparent px-3 text-center text-[16px] text-bone outline-none focus:border-[color:var(--accent-ink)]"
                          style={{ borderColor: 'var(--line)' }}
                        />
                        <button
                          type="button"
                          onClick={() => bumpUnits(line.id, 100)}
                          aria-label={`More ${line.name}`}
                          className="size-11 cursor-pointer rounded-full border transition-colors duration-200 hover:bg-bone hover:text-ink"
                          style={{ borderColor: 'var(--line)' }}
                        >
                          +
                        </button>
                      </div>
                    </li>
                  )
                })}
              </ul>

              <p
                className="flex items-center justify-between border-t py-4 text-[16px]"
                style={{ borderColor: 'var(--line)' }}
              >
                <span style={{ color: 'var(--muted)' }}>Total</span>
                <span className="display text-[clamp(20px,3vw,28px)]">{total} units</span>
              </p>
            </fieldset>

            <fieldset className="mt-12 border-t pt-8" style={{ borderColor: 'var(--line)' }}>
              <legend className="display pr-4 text-[clamp(20px,2.4vw,26px)]">Notes</legend>
              <Field label="Anything else we should know?">
                <textarea
                  name="notes"
                  rows={4}
                  value={details.notes}
                  onChange={(event) => set('notes', event.target.value)}
                  className={FIELD}
                  style={{ borderColor: 'var(--line)' }}
                  placeholder="Payment terms, delivery date, distributor…"
                />
              </Field>
            </fieldset>

            {status === 'manual' && (
              <div
                className="mt-10 rounded-sm border p-5 text-[15px] leading-relaxed sm:p-6"
                style={{ borderColor: 'var(--accent)' }}
              >
                <p>
                  We could not send it from here. Your order is filled in and ready — send it
                  from your own mail app, or download it and attach it to an email to{' '}
                  {ORDER_INBOX}.
                </p>
                <div className="mt-5 flex flex-wrap gap-3">
                  <a
                    href={mailto}
                    className="inline-flex h-12 items-center rounded-full px-6 text-[15px] font-medium text-ink"
                    style={{ background: 'var(--accent)' }}
                  >
                    Open in mail app
                  </a>
                  <button
                    type="button"
                    onClick={() => navigator.clipboard?.writeText(text)}
                    className="inline-flex h-12 cursor-pointer items-center rounded-full border px-6 text-[15px] transition-colors duration-200 hover:bg-bone hover:text-ink"
                    style={{ borderColor: 'var(--line)' }}
                  >
                    Copy order
                  </button>
                  <button
                    type="button"
                    onClick={download}
                    className="inline-flex h-12 cursor-pointer items-center rounded-full border px-6 text-[15px] transition-colors duration-200 hover:bg-bone hover:text-ink"
                    style={{ borderColor: 'var(--line)' }}
                  >
                    Download CSV
                  </button>
                </div>
              </div>
            )}

            <div className="mt-10 flex flex-wrap items-center gap-4">
              <button
                type="submit"
                disabled={status === 'sending' || total < 1}
                className="inline-flex h-14 cursor-pointer items-center rounded-full px-8 text-[16px] font-medium text-ink transition-opacity duration-200 disabled:cursor-not-allowed disabled:opacity-40"
                style={{ background: 'var(--accent)' }}
              >
                {status === 'sending' ? 'Sending…' : 'Send order'}
              </button>
              <span className="text-[14px]" style={{ color: 'var(--muted)' }}>
                {total < 1 ? 'Add at least one flavour.' : `Goes to ${ORDER_INBOX}`}
              </span>
            </div>
          </form>
        )}

        <p
          className="mt-16 border-t pt-6 text-[12px] leading-relaxed"
          style={{ borderColor: 'var(--line)', color: 'var(--muted)' }}
        >
          <span className="font-medium text-bone/90">
            Warning: This product contains nicotine. Nicotine is an addictive chemical.
          </span>{' '}
          Trade orders only, for businesses and adults 18+.
        </p>
      </main>
    </div>
  )
}
