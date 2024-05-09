import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';

import xmldom from "xmldom";
import { XML } from 'r2-utils-js/dist/es8-es2017/src/_utils/xml-js-mapper'
import { OPDS } from 'r2-opds-js/dist/es8-es2017/src/opds/opds1/opds'
import { EntryToBook } from '$lib/util/misc';


export const load: PageServerLoad = async ({ locals }) => {
  const { fetchBooks } = locals

  const response = await fetchBooks(`https://standardebooks.org/feeds/opds/all`)
  if (response.status !== 200) error(response.status, response.statusText)

  const xmlDom = new xmldom.DOMParser().parseFromString(await response.text())
  if (!xmlDom || !xmlDom.documentElement) error(500, 'Error parsing XML')

  const feed = XML.deserialize<OPDS>(xmlDom, OPDS);

  return { optiscapes: feed.Entries.slice(0, 10).map(EntryToBook) }
};
