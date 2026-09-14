/** Every string here comes from the NoseNic communication brief. */

export const CONTACT_EMAIL = 'info@nosenic.com'

export type FlavourId =
  | 'limoncello'
  | 'blueberry-ice'
  | 'red-hot'
  | 'winter-green'
  | 'cola-ice'
  | 'cherry-ice'
  | 'double-mint'

export interface Flavour {
  id: FlavourId
  name: string
  character: [string, string, string]
  /** Short version, written for the website. */
  short: string
  /** Full marketing description. */
  description: string
  mood: string[]
  /** Brand colour of the variant — used for fills and large areas. */
  accent: string
  /** Lighter cut of the same hue that clears 4.5:1 on the near-black page. */
  ink: string
}

export const FLAVOURS: Flavour[] = [
  {
    id: 'limoncello',
    name: 'Limoncello',
    character: ['ZESTY', 'CITRUS', 'BRIGHT'],
    short: 'Bright. Zesty. Citrus. A vibrant citrus experience with a fresh, lively character.',
    description:
      'A bright and zesty citrus experience inspired by the unmistakable character of limoncello. Vibrant, fresh and full of citrus personality.',
    mood: ['CITRUS', 'SUN', 'ITALY', 'BRIGHT', 'VIBRANT', 'FRESH'],
    accent: '#E9C512',
    ink: '#EFCE2C',
  },
  {
    id: 'blueberry-ice',
    name: 'Blueberry Ice',
    character: ['ICY', 'BERRY', 'BOLD'],
    short: 'Bold berry. Cool finish. A juicy blueberry experience with an icy edge.',
    description:
      'A juicy blueberry experience combined with a cool icy character. Rich berry notes meet a crisp, refreshing finish.',
    mood: ['BLUEBERRY', 'ICE', 'COOL', 'JUICY', 'DEEP BLUE', 'BOLD'],
    accent: '#5B45D6',
    ink: '#9C8DF7',
  },
  {
    id: 'red-hot',
    name: 'Red Hot',
    character: ['HOT', 'SPICY', 'BOLD'],
    short: 'Hot. Spicy. Bold. A striking cinnamon experience with a cool aromatic twist.',
    description:
      'A bold spicy experience built around a distinctive cinnamon character with a cool aromatic edge. Intense, warm and unmistakably Red Hot.',
    mood: ['RED', 'FIRE', 'SPICE', 'CINNAMON', 'HEAT', 'CONTRAST'],
    accent: '#E8341C',
    ink: '#FF6A52',
  },
  {
    id: 'winter-green',
    name: 'Winter Green',
    character: ['COOL', 'FRESH', 'BOLD'],
    short: 'Cool. Fresh. Bold. A crisp wintergreen experience with a clean, cooling character.',
    description:
      'A classic cool and fresh experience built around a powerful wintergreen character. Crisp, aromatic and unmistakably refreshing.',
    mood: ['WINTER', 'GREEN', 'FROST', 'COOL', 'FRESH', 'CRISP'],
    accent: '#10A37F',
    ink: '#2ECCA2',
  },
  {
    id: 'cola-ice',
    name: 'Cola Ice',
    character: ['RICH', 'FIZZY', 'ICY'],
    short: 'Rich. Fizzy. Icy. A bold cola-inspired experience with a cool finish.',
    description:
      'A rich cola-inspired flavour with a fizzy character and a cool icy finish. Familiar, playful and unexpectedly refreshing.',
    mood: ['COLA', 'BUBBLES', 'ICE', 'RETRO', 'SODA', 'PLAYFUL'],
    accent: '#A96A2E',
    ink: '#D99C5C',
  },
  {
    id: 'cherry-ice',
    name: 'Cherry Ice',
    character: ['ICY', 'CHERRY', 'BOLD'],
    short: 'Bold cherry. Cool edge. A juicy cherry experience with an icy finish.',
    description:
      'A juicy cherry experience with a cool icy edge. Fruity character meets a crisp, refreshing finish.',
    mood: ['CHERRY', 'RED', 'JUICY', 'ICE', 'FRUIT', 'BOLD'],
    accent: '#DC1449',
    ink: '#FF5580',
  },
  {
    id: 'double-mint',
    name: 'Double Mint',
    character: ['COOL', 'FRESH', 'ICY'],
    short: 'Cool. Fresh. Icy. A crisp mint experience with a distinctly cool finish.',
    description:
      'A clean, intense mint experience built around a distinctly cool and icy character. Crisp, fresh and instantly recognisable.',
    mood: ['MINT', 'ICE', 'CRISP', 'FRESH', 'COOL', 'CLEAN'],
    accent: '#35B6E8',
    ink: '#5CC8F2',
  },
]

export interface World {
  id: string
  name: string
  /** Shown next to the world name in the marquee. */
  note: string
  /** A retail pouch exists in the mockup set for this world. */
  pouch: boolean
}

export const WORLDS: World[] = [
  { id: 'pop', name: 'POP', note: 'Grins & moustaches', pouch: true },
  { id: 'typographic', name: 'TYPOGRAPHIC', note: 'The NoseNic Times', pouch: true },
  { id: 'minimal', name: 'MINIMAL', note: 'Nothing but the mark', pouch: true },
  { id: 'street', name: 'STREET', note: 'Spray & stencil', pouch: false },
  { id: 'illustration', name: 'ILLUSTRATION', note: 'Splash lettering', pouch: true },
  { id: 'organic', name: 'ORGANIC', note: 'Porcelain creatures', pouch: true },
  { id: 'energy', name: 'ENERGY', note: 'Speed gradients', pouch: true },
  { id: 'domino', name: 'DOMINO', note: 'Dots only', pouch: true },
  { id: 'graphic', name: 'GRAPHIC', note: 'Abstract canvases', pouch: true },
  { id: 'pattern', name: 'PATTERN', note: 'Liquid maze', pouch: false },
]

export const MOMENTS = [
  { id: 'travel', name: 'TRAVEL', line: 'Take your flavour with you.' },
  { id: 'work', name: 'WORK', line: 'A sensory moment that fits your day.' },
  { id: 'commute', name: 'COMMUTE', line: 'Your flavour. Wherever you go.' },
  { id: 'break', name: 'BREAK', line: 'Make the moment your own.' },
  { id: 'social', name: 'SOCIAL', line: 'Bring your flavour into the moment.' },
  { id: 'everyday', name: 'EVERYDAY', line: 'A different flavour for every kind of day.' },
]

export const STEPS = [
  { no: '01', name: 'PLACE', line: 'Place the inhaler close to the nostrils.' },
  { no: '02', name: 'INHALE', line: 'Inhale gently.' },
  { no: '03', name: 'REPEAT', line: 'Repeat if required.' },
]

export const PRODUCT_TAGS = ['SENSORY', 'AROMATIC', 'DISCREET', 'SMOKE-FREE', 'ON-THE-GO']
export const FORMAT_TAGS = ['COMPACT', 'DISCREET', 'PORTABLE', 'SENSORY', 'SMOKE-FREE']

export const deviceSrc = (world: string, flavour: FlavourId) =>
  `/devices/${world}/${flavour}.webp`

/** Worlds with a 3D pouch render for every flavour (Mockup 3D/, scripts/build_packs.py). */
const FULL_PACK_WORLDS = ['typographic', 'street', 'illustration', 'energy', 'graphic']

/** 3D pouch worlds available for one flavour. Minimal is rendered for Winter Green only. */
export const packWorldsFor = (flavour: FlavourId) =>
  WORLDS.filter(
    (world) =>
      FULL_PACK_WORLDS.includes(world.id) ||
      (world.id === 'minimal' && flavour === 'winter-green'),
  )

export const packSrc = (world: string, flavour: FlavourId) => `/packs/${world}/${flavour}.webp`
