import type { PageServerLoad } from './$types';
import type { Book } from '$lib/types/types';

export const load: PageServerLoad = async ({ fetch }) => {
  const response = await fetch('/api/optiscapes')
  return { optiscapes: await response.json() as Book[] }
};
