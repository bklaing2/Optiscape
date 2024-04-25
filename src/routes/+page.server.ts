import type { PageServerLoad } from './$types';
import type { Book } from '$lib/book/Book.svelte';

export const load: PageServerLoad = async ({ fetch }) => {
  const response = await fetch('/api/optiscapes')
  return { optiscapes: await response.json() as Book[] }
};