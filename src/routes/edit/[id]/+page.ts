import type { PageLoad } from './$types';
import { getEpubLink } from '$lib/util/generateLink';
import storage from '$lib/util/storage';
import ePub from 'epubjs'

export const ssr = false

export const load: PageLoad = async ({ params, url, data }) => {
  const epub = ePub(getEpubLink(params.id))

  await epub.ready
  epub.locations.generate(1000)

  const metadata = {
    id: epub.packaging.metadata.identifier,
    title: epub.packaging.metadata.title,
    author: epub.packaging.metadata.creator,
    coverUrl: await epub.coverUrl()
  }
  
  const history = storage.loadEditHistory()
  const location = url.searchParams.get('location') ?? history[params.id]
  
  return {
    metadata,
    epub,
    audio: data.audio,
    location
  }
}