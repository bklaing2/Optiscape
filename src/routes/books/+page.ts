import type { PageLoad } from './$types';
import type { Book } from '$lib/book/Book.svelte';

export const load: PageLoad = ({ data }) => {
  return { optiscapes: data.optiscapes as Book[] }
}