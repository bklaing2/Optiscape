import { existsSync } from 'fs'
import fs from 'fs/promises'
import path from 'path'
import type { Config } from '@sveltejs/adapter-vercel';
import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { AUDIO_CATEGORIES, OPTISCAPES_DIR } from '$lib/constants';
import type { Audio } from '$lib/types';

export const config: Config = {
	runtime: 'nodejs18.x',
};

export const GET: RequestHandler = async ({ params, url, setHeaders }) => {
  const { searchParams } = url
  const category = searchParams.get('category')
  const file = searchParams.get('file')

  if (category && file) {
    const filePath = path.resolve(OPTISCAPES_DIR, params.title, 'audio', category, file)
    if (!existsSync(filePath)) error(404, 'File not found')
    const data = await fs.readFile(filePath);
    
    setHeaders({
      'content-type': 'audio/mpeg',
      'content-disposition': `attachment; filename="${file}"`,
    })
    
    return new Response(data)
  }


  const audio: Audio = { sfx: [], ambience: [], music: [] }
  await Promise.all(AUDIO_CATEGORIES.map(async c => {
    const filePath = path.resolve(OPTISCAPES_DIR, params.title, 'audio', c)
    audio[c] = await fs.readdir(filePath);
  }))

  return json(audio)
}


export const POST: RequestHandler = async ({ params, url, request }) => {
  const { searchParams } = url
  const category = searchParams.get('category') as string
  const file = searchParams.get('file') as string

  if (!category || !file) error(400, 'Missing category or file')

  const dirPath = path.resolve(OPTISCAPES_DIR, params.title, 'audio', category)
  if (!existsSync(dirPath)) error(404, 'Cannot write to this location')

  const filePath = path.resolve(dirPath, file)
  if (existsSync(filePath)) error(409, 'File already exists')
  await fs.writeFile(filePath, new Uint8Array(await request.arrayBuffer()));
  
  return json(undefined, { status: 204 })
}