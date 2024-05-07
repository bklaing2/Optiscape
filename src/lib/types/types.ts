import type { Contents } from "epubjs";

export interface Book {
  id: string
  location?: string
  percentage?: number
};


export interface Keyframe {
  id: number;
  book_id: string;
  category: "sfx" | "ambience" | "music";
  source: string;
  start: string;
  end: string | null;
  end_percentage: number;
  start_percentage: number;
}


// epubjs types
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

export interface PageTurned {
  start: string
  end: string
  contents: Contents
}
