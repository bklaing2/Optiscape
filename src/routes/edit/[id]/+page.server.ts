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
    const percentageStart = form.get('percentageStart') as string
    const percentageEnd = form.get('percentageEnd') as string

    if (!category || !source || !start || !percentageStart) return fail(400)


    // Update script
    const body: Partial<Keyframe> = {
      category,
      source,
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