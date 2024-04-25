import { error, fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import type { Audio, DBKeyframe, Script } from '$lib/types/types';

export const load: PageServerLoad = async ({ params, fetch }) => {
  const fetchAudio = await fetch(`/api/optiscapes/${params.id}/audio`)
  if (fetchAudio.status !== 200) throw error(fetchAudio.status, fetchAudio.statusText);
  const audio = await fetchAudio.json() as Audio
  return { audio }
}


export const actions = {
	default: async ({ params, request, fetch }) => {
    const form = await request.formData()
    const type = form.get('type') as keyof Script
    const file = form.get('file') as File
    const src = file?.name || form.get('src') as string
    const start = form.get('start') as string
    const end = form.get('end') as string
    const percentageStart = form.get('percentageStart') as string
    const percentageEnd = form.get('percentageEnd') as string

    if (!type || !src || !start) return fail(400)

    // Upload audio file
    if (form.has('file')) {
      const fetchAudio = await fetch(`/api/optiscapes/${params.id}/audio?category=${type}&file=${file.name}`, {
        method: 'POST',
        body: await file.arrayBuffer()
      })
      if (fetchAudio.status !== 204) throw error(fetchAudio.status, fetchAudio.statusText);
    }

    // Update script
    const body: Partial<DBKeyframe> = {
      category: type,
      source: src,
      start,
      end,
      start_percentage: parseFloat(percentageStart),
      end_percentage: parseFloat(percentageEnd)
    }

    const updateScript = await fetch(`/api/optiscapes/${params.id}/script`, { 
      body: JSON.stringify(body),
      method: 'POST'
    })

    if (updateScript.status !== 204) return fail(400)

    return { success: true }
	},
} satisfies Actions;