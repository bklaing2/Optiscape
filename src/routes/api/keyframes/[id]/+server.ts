import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const DELETE: RequestHandler = async ({ locals, params }) => {
	const { supabase } = locals

	const response = await supabase
		.from('keyframes')
		.delete()
		.eq('id', params.id)

	if (response.error) error(500, response.error.message)
	return json(undefined, { status: 204 })
}
