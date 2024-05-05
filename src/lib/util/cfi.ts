import { Book, EpubCFI } from 'epubjs'


function isRange(cfi: string) {
  return cfi.indexOf(',') >= 0
}

function inRange(target: string, start: string, end: string) {
  if (!target) return false

  const cfi = new EpubCFI()
  return cfi.compare(target, start) >= 0 && cfi.compare(target, end) <= 0
}

function toRange(start: string, end: string) {
  if (isRange(start)) throw new Error('Start CFI must not be a range')
  if (isRange(end)) throw new Error('End CFI must not be a range')

  const split = start.split('/')
  const base = `${split[0]}/${split[1]}/${split[2]}/${split[3]}`
  return `${base},${start.replace(base, '')},${end.replace(base, '')}`
}

function split(cfi: string) {
  if (!isRange(cfi)) return [cfi]
  return [start(cfi), end(cfi)]
}


function start(cfi: string) {
  if (!isRange(cfi)) return cfi

  const split = cfi.split(',')
  return `${split[0]}${split[1]})`
}

function end(cfi: string) {
  if (!isRange(cfi)) return cfi

  const split = cfi.split(',')
  return `${split[0]}${split[2]}`
}


async function countChars(start: string, end: string, book: Book) {
  const cfiRange = cfi.toRange(start, end)
  const range = await book.getRange(cfiRange)
  return range.toString().length
}


async function fromHref(href: string, book: Book) {
  const id = href.split('#')[1]

  const section = book.spine.get(href)
  await section.load(book.load.bind(book))
  const el = section.document.getElementById(id)
  return section.cfiFromElement(el as Element)
}


const cfi = {
  isRange,
  inRange,
  toRange,
  split,

  start,
  end,

  countChars,

  fromHref
}

export default cfi
