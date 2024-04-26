import type { SearchResults } from "$lib/types/freesound"

export async function Search (query: string) {
  if (query === '') return { sounds: [], count: 0 }
  const response = await fetch(`/api/sounds?query=${query}`)
  return await response.json() as SearchResults
}