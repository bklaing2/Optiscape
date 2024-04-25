import type { PageLoad } from './$types';
import storage from '$lib/util/storage';

export const ssr = false

export const load: PageLoad = ({ data }) => {
  const history = storage.loadHistory()
  const isCurrentlyReading = history.length > 0 && (history[0].percentage || 0) < 0.98
  
  return {
    currentlyReading: isCurrentlyReading ? history[0] : undefined, 
    history: isCurrentlyReading ? history.toSpliced(0, 1) : history,
    optiscapes: data.optiscapes
  }
}