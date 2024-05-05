import type { Keyframe } from "$lib/types/types";

export const COLORS: { [category in Keyframe['category']]: string } = {
  sfx: 'orange',
  ambience: 'green',
  music: '#AB8DF8',
}
