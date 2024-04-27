import { fail } from '@sveltejs/kit';
import type { Actions } from './$types';
import type { Keyframe } from '$lib/types/types';


export const actions = {
	default: async ({ params, request, fetch }) => {
    const form = await request.formData()
    const category = form.get('category') as Keyframe['category']
    const source = form.get('source') as string
    const start = form.get('start') as string
    const end = form.get('end') as string
    const percentageStart = parseFloat(form.get('percentageStart') as string)
    const percentageEnd = parseFloat(form.get('percentageEnd') as string)

    if (!category || !source || !start || !percentageStart) return fail(400)

    const flipped = percentageStart > percentageEnd

    // Update script
    const body: Partial<Keyframe> = {
      category,
      source,
      start: flipped ? end : start,
      end: flipped ? start : end,
      start_percentage: flipped ? percentageEnd : percentageStart,
      end_percentage: flipped ? percentageStart : percentageEnd
    }

    const updateScript = await fetch(`/api/optiscapes/${params.id}/script`, { 
      body: JSON.stringify(body),
      method: 'POST'
    })

    if (updateScript.status !== 204) return fail(400)

    return { success: true }
	},
} satisfies Actions;