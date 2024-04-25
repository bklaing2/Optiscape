import storage from '$lib/util/storage';
import type { PageLoad } from './$types';
import { error } from '@sveltejs/kit';
import ePub from 'epubjs'

export const ssr = false

export const load: PageLoad = async ({ params, url, data, fetch }) => {
  const fetchEpub = await fetch(`/api/optiscapes/${params.title}/epub`)
  if (fetchEpub.status !== 200) throw error(fetchEpub.status, fetchEpub.statusText);

  const epub = ePub(await fetchEpub.arrayBuffer())

  await epub.ready
  epub.locations.generate(1000)
  const metadata = {
    id: epub.packaging.metadata.identifier,
    title: epub.packaging.metadata.title,
    author: epub.packaging.metadata.creator,
    coverUrl: await epub.coverUrl()
  }
  
  const history = storage.loadEditHistory()
  const location = url.searchParams.get('location') ?? history[params.title]
  
  return {
    metadata,
    epub,
    script: data.script,
    audio: data.audio,
    location
  }
}