import fs from 'fs/promises'
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { OPTISCAPES_DIR } from '$lib/constants';


export const GET: RequestHandler = async () => {
	const optiscapes = await fs.readdir(OPTISCAPES_DIR)
	return json(optiscapes.map(title => ({ title })))
};