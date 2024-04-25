import type { Contents } from "epubjs";
import type { AUDIO_CATEGORIES } from "./constants";

export type AudioCategory = typeof AUDIO_CATEGORIES[number]

export type Keyframe = { src: string; start: string }
export type KeyframeRange = Keyframe & { end: string }

export type Script = {
  sfx: Keyframe[]
  ambience: KeyframeRange[]
  music: KeyframeRange[]
}

export type Audio = Record<AudioCategory, string[]>

type Location = {
  cfi: string
  href: string // href of the containing section
  index: number // Index of the section in the TOC
  displayed: { page: number; total: number } // Current and total number of pages in the section
  location: number
  percentage: number
}

export type Relocated = {
  start: Location
  end: Location
  atStart?: true
  atEnd?: true
}

export type Selected = string
export type Selection = {
  range: string
  start: string
  end: string
}

export type CPM = {
  data: number[]
  windowSize: number
  outlierCount: number
}


export interface PageTurned {
  start: string
  end: string
  contents: Contents
}



export type ScriptPatchBody = {
  type: AudioCategory
  keyframeRange: KeyframeRange
}