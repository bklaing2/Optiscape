import fs from 'fs/promises'
import path from 'path'
import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { AUDIO_CATEGORIES, OPTISCAPES_DIR } from '$lib/constants';
import type { Script, ScriptPatchBody } from '$lib/types';


export const GET: RequestHandler = async ({ params, setHeaders }) => {
  const filePath = path.resolve(OPTISCAPES_DIR, params.title, 'script.json')
  const data = await fs.readFile(filePath, 'utf-8');
  const script = JSON.parse(data) as Script

  AUDIO_CATEGORIES.forEach(c => {
    script[c] = script[c].map(kf => ({ ...kf, src: `/api/optiscapes/${params.title}/audio?category=${c}&file=${kf.src}` })) as never
  })
  
  setHeaders({
    'content-type': 'application/json',
    'content-disposition': `attachment; filename="${params.title}.json"`,
  })
  
  return json(script)
}


export const PATCH: RequestHandler = async ({ params, request }) => {
  const { type, keyframeRange } = await request.json() as ScriptPatchBody
  const { end, ...keyframe  } = keyframeRange
  
  if (type !== 'sfx' && type !== 'ambience' && type !== 'music') error(400, 'Invalid type')
  if (!keyframeRange.start || (type !== 'sfx' && !end)) error(400, 'Invalid keyframe')


  const filePath = path.resolve(OPTISCAPES_DIR, params.title, 'script.json')
  const data = await fs.readFile(filePath, 'utf-8')
  
  const script = JSON.parse(data) as Script
  script[type].push((type === 'sfx' ? keyframe : keyframeRange) as never)
  
  const updatedScript = JSON.stringify(script, null, 2);
  await fs.writeFile(filePath, updatedScript, 'utf-8')
  
  return json(undefined, { status: 204 })
}