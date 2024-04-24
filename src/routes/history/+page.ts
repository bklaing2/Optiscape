import type { PageLoad } from './$types';
import storage from '$lib/util/storage';

export const ssr = false

export const load: PageLoad = async () => ({ history: storage.loadHistory() })