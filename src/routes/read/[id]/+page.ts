import type { PageLoad } from './$types';
import ePub from 'epubjs'
import storage from '$lib/util/storage.js';
import type { Book } from '$lib/types/types';
import { DecodeEpubUrl, GetCoverUrl } from '$lib/util/generateLink';

export const ssr = false

export const load: PageLoad = async ({ params, url }) => {
  const epubUrl = DecodeEpubUrl(params.id)
  const epub = ePub(epubUrl)

  await epub.ready
  epub.locations.generate(1000)

  const metadata: Book = {
    id: params.id,
    title: epub.packaging.metadata.title,
    author: epub.packaging.metadata.creator,
    coverUrl: GetCoverUrl(epubUrl),
    epubUrl
  }

  console.log(epub.packaging)
  console.log(metadata)
  console.log(await epub.coverUrl())

  const history = storage.loadHistory()
  const saved: Book = history.find(b => params.id === b.id) ?? metadata

  return {
    epub,
    location: url.searchParams.get('location') ?? saved.location,
    metadata,
    readingRate: storage.loadReadingRate()
  }
}
