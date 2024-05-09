import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';

import xmldom from "xmldom";
import { XML } from 'r2-utils-js/dist/es8-es2017/src/_utils/xml-js-mapper'
import { OPDS } from 'r2-opds-js/dist/es8-es2017/src/opds/opds1/opds'
import { EntryToBook } from '$lib/util/misc';


export const load: PageServerLoad = async ({ locals, url }) => {
  const { fetchBooks } = locals
  const { searchParams } = url
  const category = searchParams.get('category') || ''
  const entry = searchParams.get('entry') || ''
  const query = searchParams.get('query') || ''

  const books = await FetchBooks(category, entry)

  return { books }


  async function FetchBooks(category: string, entry: string) {
    if (category === 'new-releases') entry = ''
    else if (category && !entry) return []

    if (!category) {
      category = 'all'
      entry = ''
    }

    const response = await fetchBooks(`https://standardebooks.org/feeds/opds/${category}/${entry}${query ? '?query=' + query : ''}`)
    if (response.status !== 200) error(response.status, response.statusText)

    const xmlDom = new xmldom.DOMParser().parseFromString(await response.text())
    if (!xmlDom || !xmlDom.documentElement) error(500, 'Error parsing XML')

    const feed = XML.deserialize<OPDS>(xmlDom, OPDS);
    // console.log(feed.Entries[0])
    return feed.Entries?.map(EntryToBook)
      .filter(b => !query || b.title.toLowerCase().includes(query.toLowerCase()) || b.author.toLowerCase().includes(query.toLowerCase()))
      || []
  }
}
