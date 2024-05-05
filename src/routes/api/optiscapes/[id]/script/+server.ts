import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';


export const GET: RequestHandler = async ({ params, url, locals }) => {
  const { supabase } = locals
  const { searchParams } = url
  const start = searchParams.get('start')
  const end = searchParams.get('end')

  const response = await supabase
    .from('keyframes')
    .select('*')
    .eq('book_id', params.id)
    .or(`and(start_percentage.gte.${start},start_percentage.lte.${end}),and(end_percentage.gte.${start},end_percentage.lte.${end})`)
    .order('start_percentage', { ascending: true })
    .order('end_percentage', { ascending: true })

  if (response.error) error(500, response.error.message)
  return json(response.data)
}

