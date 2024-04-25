import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ fetch }) => {
  const response = await fetch('/api/optiscapes')
  return { optiscapes: await response.json()}
};