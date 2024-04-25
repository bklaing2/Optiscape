import fs from 'fs/promises'
import path from 'path'
import type { Config } from '@sveltejs/adapter-vercel';
import type { RequestHandler } from './$types';
import { OPTISCAPES_DIR } from '$lib/constants';

export const config: Config = {
	runtime: 'nodejs18.x',
};

export const GET: RequestHandler = async ({ params, setHeaders }) => {
  const filePath = path.resolve(OPTISCAPES_DIR, params.title, 'book.epub')
  const data = await fs.readFile(filePath);
  
  setHeaders({
    'content-type': 'application/epub+zip',
    'content-disposition': `attachment; filename="${params.title}.epub"`,
  })
  
  return new Response(data)
}