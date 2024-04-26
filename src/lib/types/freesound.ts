export interface SoundInstance {
  name: string
  previews: {
    'preview-hq-mp3': string,
    'preview-hq-ogg': string,
    'preview-lq-mp3': string,
    'preview-lq-ogg': string
  }
}

export interface SoundList {
  results: SoundInstance[]
  count: number
  next?: string
  previous?: string
}

export interface SearchResults {
  sounds: { name: string, url: string }[]
  count: number
  next?: string
  previous?: string
}