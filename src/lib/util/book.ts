import ePub from "epubjs"
import type { Book } from "$lib/book/Book.svelte"



function getNames (files: Record<string, () => Promise<unknown>>) {
  const names: string[] = []

  for (const modulePath in files) {
    const split = modulePath.split('/')
    const name = split[split.length - 1]

    names.push(name)
  }

  return names
}


async function getInfo (book: ReturnType<typeof ePub>) {
  await book.ready

  const meta = book.packaging.metadata

  const bookInfo: Book = {
    id: meta.identifier,
    title: meta.title,
    author: meta.creator,
    coverUrl: await book.coverUrl()
  }

  return bookInfo
}


export function getAllBookTitles () {
  const files = getNames(import.meta.glob('/static/books/*.epub'))
  return files.map(n => n.split('.')[0])
}




export async function getAllBooks () {
  const books: Book[] = []

  await Promise.all(getAllBookTitles().map(async name => {
    // const book = new BookEpub(`/books/${name}`, { openAs: '' })
    // book.open(`/books/${name}.epub`)
    const book = ePub(`/books/${name}.epub`)
    await book.ready

    const meta = book.packaging.metadata

    const bookInfo: Book = {
      id: meta.identifier,
      title: meta.title,
      author: meta.creator,
      coverUrl: await book.coverUrl()
    }

    books.push(bookInfo)
  }))

  return books
}




const book = {
  getInfo,
  getAllBooks
}

export default book