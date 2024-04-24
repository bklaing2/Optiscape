import fs from 'fs/promises'
import path from 'path'
import type { RequestHandler } from './$types';
import { OPTISCAPES_DIR } from '$lib/constants';


export const GET: RequestHandler = async ({ params, setHeaders }) => {
  const filePath = path.resolve(OPTISCAPES_DIR, params.title, 'script.json')
  const data = await fs.readFile(filePath);
  
  setHeaders({
    'content-type': 'application/json',
    'content-disposition': `attachment; filename="${params.title}.json"`,
  })
  
  return new Response(data)
}