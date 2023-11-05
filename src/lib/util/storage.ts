import type { Book } from '$lib/book/Book.svelte'

function updateHistory (book: Book, history: Book[]) {
  if (!book) return
  const index = history.findIndex(b => b.id === book.id)
  
  if (index >= 0) history.splice(index, 1)
  history.unshift(book)
  
  return history
}


const storage = {
  updateHistory
}


export default storage