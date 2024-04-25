import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';


export const GET: RequestHandler = async ({ locals }) => {
	const { supabase } = locals
	const response = await supabase
		.from('books')
		.select('*')

	if (response.error) error(500, response.error.message)
	return json(response.data)
};