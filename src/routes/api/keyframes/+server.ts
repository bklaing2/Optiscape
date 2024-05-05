import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import type { Keyframe } from '$lib/types/types';

export const POST: RequestHandler = async ({ locals, request }) => {
	const { supabase } = locals

	const kf = await request.json() as Keyframe

	if (kf.category !== 'sfx' && kf.category !== 'ambience' && kf.category !== 'music') error(400, 'Invalid type')
	if (!kf.start || (kf.category !== 'sfx' && !kf.end)) error(400, 'Invalid keyframe')
	if (kf.end && kf.end_percentage < kf.start_percentage) error(400, 'End must be greater than start')

	const response = await supabase
		.from('keyframes')
		.insert({ ...kf })
		.select('*')
		.limit(1)
		.single()

	if (response.error) error(500, response.error.message)
	return json(response.data, { status: 200 })
}
