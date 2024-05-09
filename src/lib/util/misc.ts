import { Entry } from 'r2-opds-js/dist/es8-es2017/src/opds/opds1/opds-entry'
import type { Book } from '$lib/types/types';
import { EncodeEpubUrl, GetCoverUrl } from './generateLink';


export function EntryToBook(entry: Entry): Book {
  const epubUrl = entry.Links.find(l => l.Title === "Recommended compatible epub")?.Href
  if (!epubUrl) throw new Error('No epub link found')

  return {
    id: EncodeEpubUrl(epubUrl),
    title: entry.Title,
    author: entry.Authors[0].Name || '',
    coverUrl: GetCoverUrl(epubUrl),
    epubUrl: epubUrl
  }
}
