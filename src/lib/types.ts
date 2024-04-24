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