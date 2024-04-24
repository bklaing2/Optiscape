import type { Book } from '$lib/book/Book.svelte'
import RollingAverage, { type IRollingAverage } from './rollingAverage'

export function loadHistory (): Book[] {
  const history = localStorage.getItem('history')
  return history ? JSON.parse(history) : []
}


export function updateHistory (book: Book) {
  if (!book.percentage || book.percentage < 0.01) return

  const history = loadHistory()
  const index = history.findIndex(b => b.title === book.title)
  
  if (index >= 0) history.splice(index, 1)
  history.unshift(book)
  
  localStorage.setItem('history', JSON.stringify(history))
}


export function loadReadingRate (): RollingAverage {
  const cpm = localStorage.getItem('cpm')
  if (!cpm) return new RollingAverage()

  const { data, windowSize, outlierCount } = JSON.parse(cpm) as IRollingAverage
  return new RollingAverage(data, windowSize, outlierCount)
}


export function updateReadingRate (readingRate: RollingAverage) {
  localStorage.setItem('readingRate', JSON.stringify(readingRate))
}

const storage = {
  updateHistory,
  loadHistory,
  loadReadingRate,
  updateReadingRate
}

export default storage