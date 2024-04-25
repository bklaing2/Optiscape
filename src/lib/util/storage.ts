import type { Book } from '$lib/book/Book.svelte'
import RollingAverage, { type IRollingAverage } from './rollingAverage'

export function loadHistory (): Book[] {
  const history = localStorage.getItem('history')
  return history ? JSON.parse(history) : []
}


export function updateHistory (title: Book['title'], location: Book['location'], percentage: Book['percentage']) {
  if (!percentage || percentage < 0.01) return

  const history = loadHistory()
  const index = history.findIndex(b => b.title === title)
  
  if (index >= 0) history.splice(index, 1)
  history.unshift({ title, location, percentage })
  
  localStorage.setItem('history', JSON.stringify(history))
}

export function loadEditHistory (): Record<Book['title'], Book['location']> {
  const editHistory = localStorage.getItem('editHistory')
  return editHistory ? JSON.parse(editHistory) : {}
}


export function updateEditHistory (title: Book['title'], location: Book['location']) {
  const editHistory = loadEditHistory()
  editHistory[title] = location
  
  localStorage.setItem('editHistory', JSON.stringify(editHistory))
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
  updateEditHistory,
  loadEditHistory,
  loadReadingRate,
  updateReadingRate
}

export default storage