import type { PageLoad } from './$types';
import ePub from 'epubjs'
import storage from '$lib/util/storage.js';
import type { Book } from '$lib/types/types';
import { getEpubLink } from '$lib/util/generateLink';

export const ssr = false

export const load: PageLoad = async ({ params, url }) => {
  const epub = ePub(getEpubLink(params.id))

  await epub.ready
  epub.locations.generate(1000)

  const metadata = {
    id: epub.packaging.metadata.identifier,
    title: epub.packaging.metadata.title,
    author: epub.packaging.metadata.creator,
    coverUrl: await epub.coverUrl()
  }

  const history = storage.loadHistory()
  const saved: Book = history.find(b => params.id === b.id) ?? { id: params.id }

  return {
    epub,
    location: url.searchParams.get('location') ?? saved.location,
    metadata,
    readingRate: storage.loadReadingRate()
  }
}
