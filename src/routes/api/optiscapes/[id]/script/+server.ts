import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import type { DBKeyframe } from '$lib/types/types';


export const GET: RequestHandler = async ({ params, url, locals }) => {
  const { supabase } = locals
  const { searchParams } = url
  const start = searchParams.get('start')
  const end = searchParams.get('end')

  const response = await supabase
    .from('keyframes')
    .select('*')
    .eq('book_id', params.id)
    .gte('start_percentage', start)
    .lte('end_percentage', end)
    .order('start_percentage', { ascending: true })
    .order('end_percentage', { ascending: true })
    
  if (response.error) error(500, response.error.message)
  return json(response.data)
}


export const POST: RequestHandler = async ({ locals, params, request }) => {
  const { supabase } = locals

  const kf = await request.json() as DBKeyframe
  
  if (kf.category !== 'sfx' && kf.category !== 'ambience' && kf.category !== 'music') error(400, 'Invalid type')
  if (!kf.start || (kf.category !== 'sfx' && !kf.end)) error(400, 'Invalid keyframe')

  const response = await supabase
    .from('keyframes')
    .insert({ ...kf, book_id: params.id })
    
  if (response.error) error(500, response.error.message)
  return json(undefined, { status: 204 })
}