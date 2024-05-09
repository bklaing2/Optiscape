import { error, fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import type { Keyframe } from '$lib/types/types';

export const load: PageServerLoad = async ({ locals, params }) => {
	const { supabase } = locals

	const response = await supabase
		.from('keyframes')
		.select('*')
		.eq('book_id', params.id)

	if (response.error) error(500, response.error.message)

	return { keyframes: response.data }
};

export const actions = {
	create: async ({ params, request, fetch }) => {
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
			book_id: params.id,
			category,
			source,
			start: flipped ? end : start,
			end: category === 'sfx' ? undefined : flipped ? start : end,
			start_percentage: flipped ? percentageEnd : percentageStart,
			end_percentage: category === 'sfx' ? undefined : flipped ? percentageStart : percentageEnd
		}

		const postKeyframe = await fetch(`/api/keyframes`, {
			body: JSON.stringify(body),
			method: 'POST'
		})

		if (postKeyframe.status !== 200) return fail(400)

		return { success: true, keyframe: await postKeyframe.json() as Keyframe }
	},

	delete: async ({ request, fetch }) => {
		const form = await request.formData()
		const id = form.get('id')

		const deleteKeyframe = await fetch(`/api/keyframes/${id}`, {
			method: 'DELETE'
		})

		if (deleteKeyframe.status !== 204) return fail(400)
		return { success: true }
	}
} satisfies Actions;
