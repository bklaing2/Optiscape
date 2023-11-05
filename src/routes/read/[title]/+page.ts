import { getAllBookTitles } from '$lib/util/book';
import { error } from '@sveltejs/kit';


export function load({ params }) {
  const titles = getAllBookTitles()
  const title = titles.find(title => title.replaceAll(' ', '-').toLowerCase() === params.title)

  if (!title) throw error(404, 'Not found');
  return { title: title }
}