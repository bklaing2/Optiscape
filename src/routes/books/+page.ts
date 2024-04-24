import type { PageLoad } from './$types';
import { getAllBooks } from '$lib/util/book';

export const ssr = false

export const load: PageLoad = async () => ({ books: await getAllBooks() })