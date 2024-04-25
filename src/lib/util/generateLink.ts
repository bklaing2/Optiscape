import { PUBLIC_SUPABASE_URL } from "$env/static/public";

export function getEpubLink (bookId: string) {
  return `${PUBLIC_SUPABASE_URL}/storage/v1/object/public/optiscapes/${bookId}/book.epub`
}

export function getAudioLink (bookId: string, category: string, file: string) {
  return `${PUBLIC_SUPABASE_URL}/storage/v1/object/public/optiscapes/${bookId}/${category}/${file}`
}