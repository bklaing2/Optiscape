import type { LayoutServerLoad } from './$types';
import { error } from '@sveltejs/kit';

import xmldom from "xmldom";
import { XML } from 'r2-utils-js/dist/es8-es2017/src/_utils/xml-js-mapper'
import { OPDS } from 'r2-opds-js/dist/es8-es2017/src/opds/opds1/opds'


export const load: LayoutServerLoad = async ({ locals, url }) => {
  const { fetchBooks } = locals
  const { searchParams } = url
  const category = searchParams.get('category') || ''
  const filter = searchParams.get('filter') || ''

  const categories = FetchCategories()
  const entries = FetchEntries(category)

  return { streamed: { categories, entries } }


  async function FetchCategories() {
    const response = await fetchBooks(`https://standardebooks.org/feeds/opds`)
    if (response.status !== 200) error(response.status, response.statusText)

    const xmlDom = new xmldom.DOMParser().parseFromString(await response.text())
    if (!xmlDom || !xmlDom.documentElement) error(500, 'Error parsing XML')

    const feed = XML.deserialize<OPDS>(xmlDom, OPDS);
    return feed.Entries
      .filter(e => e.Id.split('/').pop() !== 'all')
      .map(e => {
        const id = e.Id.split('/').pop() || ''
        return { id, text: id.replace(/-/g, ' ').toUpperCase() }
      })
  }


  async function FetchEntries(category: string) {
    if (!category || category === 'new-releases') return []

    const response = await fetchBooks(`https://standardebooks.org/feeds/opds/${category}`)
    if (response.status !== 200) error(response.status, response.statusText)

    const xmlDom = new xmldom.DOMParser().parseFromString(await response.text())
    if (!xmlDom || !xmlDom.documentElement) error(500, 'Error parsing XML')

    const feed = XML.deserialize<OPDS>(xmlDom, OPDS);
    return feed.Entries
      .map(e => ({ id: e.Id.split('/').pop() || '', text: e.Title }))
      .filter(e => !filter || e.text.toLowerCase().includes(filter.toLowerCase()))
  }
}
