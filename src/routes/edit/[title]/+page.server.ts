import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, fetch }) => {
  const fetchScript = await fetch(`/api/optiscapes/${params.title}/script`)
  if (fetchScript.status !== 200) throw error(fetchScript.status, fetchScript.statusText);

  const script = await fetchScript.json() as { music: unknown[]; ambience: unknown[]; sfx: unknown[]}
  return { script }
}