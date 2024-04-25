import { error, fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import type { Audio, Script, ScriptPatchBody } from '$lib/types';

export const load: PageServerLoad = async ({ params, fetch }) => {
  const fetchScript = await fetch(`/api/optiscapes/${params.title}/script`)
  if (fetchScript.status !== 200) throw error(fetchScript.status, fetchScript.statusText);

  const fetchAudio = await fetch(`/api/optiscapes/${params.title}/audio`)
  if (fetchAudio.status !== 200) throw error(fetchAudio.status, fetchAudio.statusText);
  
  const script = await fetchScript.json() as Script
  const audio = await fetchAudio.json() as Audio
  return { script, audio }
}


export const actions = {
	default: async ({ params, request, fetch }) => {
    const form = await request.formData()
    const type = form.get('type') as keyof Script
    const file = form.get('file') as File
    const src = file?.name || form.get('src') as string
    const start = form.get('start') as string
    const end = form.get('end') as string
    
    if (!type || !src || !start)
      return fail(400)
      
    // Upload audio file
    if (form.has('file')) {
      const fetchAudio = await fetch(`/api/optiscapes/${params.title}/audio?category=${type}&file=${file.name}`, {
        method: 'POST',
        body: await file.arrayBuffer()
      })
      if (fetchAudio.status !== 204) throw error(fetchAudio.status, fetchAudio.statusText);
    }

    // Update script
    const body: ScriptPatchBody = {
      type,
      keyframeRange: { src, start, end },
    }
    
    const updateScript = await fetch(`/api/optiscapes/${params.title}/script`, { 
      body: JSON.stringify(body),
      method: 'PATCH'
    })
    
    if (updateScript.status !== 204) return fail(400)
    
    return { success: true }
	},
} satisfies Actions;