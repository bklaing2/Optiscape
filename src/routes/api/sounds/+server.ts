import { json, fail } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { FREESOUND_KEY } from '$env/static/private';
import type { SearchResults, SoundList } from '$lib/types/freesound';

// const FIELDS = 

export const GET: RequestHandler = async ({ url }) => {
  const { searchParams } = url
  const query = searchParams.get('query')

  if (query) {
    const response = await fetch(`https://freesound.org/apiv2/search/text/?query=${query}&token=${FREESOUND_KEY}&fields=name,previews`)
    
    if (response.status !== 200) fail(response.status)

    const soundList = await response.json() as SoundList
    const data: SearchResults = {
      sounds: soundList.results.map(s => ({ name: s.name, url: s.previews['preview-hq-mp3'] })),
      count: soundList.count,
      next: soundList.next,
      previous: soundList.previous
    }
    return json(data)
  }

  return json({})
}