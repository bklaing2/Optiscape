import { PUBLIC_SUPABASE_URL } from "$env/static/public";
import { decode, encode } from "url-safe-base64";


export function EncodeEpubUrl(epubUrl: string) {
  const urlEnd = epubUrl.split('/').slice(4).join('/')
  const base64 = btoa(urlEnd)
  const safeBase64 = encode(base64)
  return safeBase64
}

export function DecodeEpubUrl(safeBase64: string) {
  const base64 = decode(safeBase64)
  const epubUrl = atob(base64)
  return 'https://standardebooks.org/ebooks/' + epubUrl
}


export function GetCoverUrl(epubUrl: string) {
  return epubUrl.split('/').slice(0, -1).join('/') + '/cover-thumbnail.jpg'
}
