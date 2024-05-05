import type { PageLoad } from './$types';
import { getEpubLink } from '$lib/util/generateLink';
import cfi from '$lib/util/cfi'
import storage from '$lib/util/storage';
import ePub from 'epubjs'

export const ssr = false

export const load: PageLoad = async ({ data, params, url }) => {
  const epub = ePub(getEpubLink(params.id))

  await epub.ready
  await epub.locations.generate(1000)

  const keyframes = await Promise.all(data.keyframes.map(async kf => {
    const startRange = await epub.getRange(kf.start)
    const endRange = kf.end ? await epub.getRange(kf.end) : undefined

    return {
      ...kf,
      start_snippet: startRange.toString(),
      end_snippet: endRange ? endRange.toString() : undefined,
    }
  }))

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
    keyframes,
    location
  }
}
