import fs from 'fs/promises'
import type { Config } from '@sveltejs/adapter-vercel';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { OPTISCAPES_DIR } from '$lib/constants';

export const config: Config = {
	runtime: 'nodejs18.x',
};

export const GET: RequestHandler = async () => {
	const optiscapes = await fs.readdir(OPTISCAPES_DIR)
	return json(optiscapes.map(title => ({ title })))
};