import { CONTACT_EMAIL, FLAVOURS, type FlavourId } from './nosenic'

export interface OrderLine {
  id: FlavourId
  name: string
  units: number
}

export interface OrderDetails {
  company: string
  vat: string
  invoiceAddress: string
  country: string
  contactName: string
  email: string
  phone: string
  deliveryAddress: string
  /** 'shipping' = we arrange it, 'pickup' = the customer collects. */
  transport: 'shipping' | 'pickup'
  /** Packaging language, as in the reference sheet's "Language version". */
  language: string
  notes: string
}

export const EMPTY_ORDER: OrderDetails = {
  company: '',
  vat: '',
  invoiceAddress: '',
  country: '',
  contactName: '',
  email: '',
  phone: '',
  deliveryAddress: '',
  transport: 'shipping',
  language: '',
  notes: '',
}

export const emptyLines = (): OrderLine[] =>
  FLAVOURS.map((flavour) => ({ id: flavour.id, name: flavour.name, units: 0 }))

export const ORDER_INBOX = CONTACT_EMAIL

/** NN-YYMMDD-XXXX, quoted in the subject line and shown to the customer. */
export function orderReference(now = new Date()) {
  const stamp = now.toISOString().slice(2, 10).replace(/-/g, '')
  const tail = Math.random().toString(36).slice(2, 6).toUpperCase()
  return `NN-${stamp}-${tail}`
}

const label = (details: OrderDetails) =>
  details.transport === 'pickup' ? 'Customer pickup' : 'Shipped by NoseNic'

/** Plain-text order, used for the email body, the clipboard and mailto. */
export function orderText(reference: string, details: OrderDetails, lines: OrderLine[]) {
  const ordered = lines.filter((line) => line.units > 0)
  const total = ordered.reduce((sum, line) => sum + line.units, 0)

  return [
    `NoseNic order form — ${reference}`,
    '',
    'COMPANY',
    `Company: ${details.company}`,
    `VAT / TIN: ${details.vat}`,
    `Invoice address: ${details.invoiceAddress.replace(/\n/g, ', ')}`,
    `Country: ${details.country}`,
    '',
    'CONTACT',
    `Name: ${details.contactName}`,
    `Email: ${details.email}`,
    `Phone: ${details.phone}`,
    '',
    'DELIVERY',
    `Address: ${details.deliveryAddress.replace(/\n/g, ', ') || '(same as invoice address)'}`,
    `Transport: ${label(details)}`,
    `Packaging language: ${details.language || '(not specified)'}`,
    '',
    'ORDER',
    ...ordered.map((line) => `${line.name}: ${line.units} units`),
    `TOTAL: ${total} units`,
    '',
    'NOTES',
    details.notes || '(none)',
  ].join('\n')
}

export function orderCsv(reference: string, details: OrderDetails, lines: OrderLine[]) {
  const cell = (value: string | number) => `"${String(value).replace(/"/g, '""')}"`
  const rows: (string | number)[][] = [
    ['Reference', reference],
    ['Company', details.company],
    ['VAT / TIN', details.vat],
    ['Invoice address', details.invoiceAddress],
    ['Country', details.country],
    ['Contact', details.contactName],
    ['Email', details.email],
    ['Phone', details.phone],
    ['Delivery address', details.deliveryAddress],
    ['Transport', label(details)],
    ['Packaging language', details.language],
    ['Notes', details.notes],
    [],
    ['Flavour', 'Units'],
    ...lines.filter((line) => line.units > 0).map((line) => [line.name, line.units]),
    ['TOTAL', lines.reduce((sum, line) => sum + line.units, 0)],
  ]
  return rows.map((row) => row.map(cell).join(',')).join('\r\n')
}
