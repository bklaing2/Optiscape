import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { AUDIO_CATEGORIES } from '$lib/constants';
import type { Audio } from '$lib/types/types';


export const GET: RequestHandler = async ({ params, locals }) => {
  const { supabase } = locals

  const array = await Promise.all(AUDIO_CATEGORIES.map(async c => {
    const response = await supabase
      .storage
      .from('optiscapes')
      .list(`${params.id}/${c}`)

    if (response.error) error(500, response.error.message)
    return { category: c, files: response.data?.map(d => d.name) || [] }
  }))

  
  const audio = array.reduce((arr,  { category, files }) => ({ ...arr, [category]: files }), {} as Audio)
  return json(audio)
}


export const POST: RequestHandler = async ({ params, url, request, locals }) => {
  const { supabase } = locals

  const { searchParams } = url
  const category = searchParams.get('category') as string
  const file = searchParams.get('file') as string

  if (!category || !file) error(400, 'Missing category or file')
    
  const response = await supabase
    .storage
    .from('optiscapes')
    .upload(`${params.id}/${category}/${file}`, await request.arrayBuffer())

  if (response.error) error(500, response.error.message)
  return json(undefined, { status: 204 })
}