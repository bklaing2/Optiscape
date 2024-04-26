<script lang="ts">
	import { page } from '$app/stores';
	import type { PageData } from './$types';
	import type { Keyframe, PageTurned, Selection } from '$lib/types/types';
	import { updateEditHistory } from '$lib/util/storage';
	import KeyframeEditor from '$lib/keyframe/KeyframeEditor.svelte';
	import Reader from '$lib/book/Reader.svelte'
	

	export let data: PageData
	$: ({ metadata, epub, location } = data)
	let showTooltip = false

	let showKeyframeEditor = false
  let keyframe: Partial<Keyframe & { start_snippet: string; end_snippet: string }> = {}

	async function AddKeyframe (selection: Selection) {
		const range = await epub.getRange(selection.range)	
		const snippet = range.toString()

		if (!keyframe.start) {
			keyframe.start = selection.start
			keyframe.start_percentage = epub.locations.percentageFromCfi(selection.start)
			keyframe.start_snippet= snippet
		} else {
			keyframe.end = selection.end
			keyframe.end_percentage = epub.locations.percentageFromCfi(selection.end)
			keyframe.end_snippet = snippet
		}
		
		showKeyframeEditor = true
  }

	function onPageTurn ({ start }: PageTurned) {
		$page.url.searchParams.set('location', start)
		updateEditHistory($page.params.id, start)
	}
</script>


<svelte:head>
	<title>Editing: {metadata.title}</title>
	<meta name="description" content="About this app" />
</svelte:head>

<svelte:window on:beforeunload={epub.destroy} />



<Reader
	{epub}
	{location}
	on:clicked={() => showTooltip = false}
	on:selected={e => AddKeyframe(e.detail)}
	on:pageTurned={e => onPageTurn(e.detail)}
/>

<KeyframeEditor bind:show={showKeyframeEditor} bind:keyframe={keyframe} />

{#if keyframe.category && keyframe.category !== 'sfx'}
<div class="absolute top-0 right-0 bg-slate-600 text-white py-2 px-10 rounded-full shadow select-none">
	Adding {keyframe.category} ...
</div>
{/if}