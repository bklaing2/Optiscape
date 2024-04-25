<script lang="ts">
	import { page } from '$app/stores';
	import type { PageData } from './$types';
	import type { PageTurned, Selection } from '$lib/types/types';
	import type { Keyframe } from '$lib/keyframe/Keyframe.svelte'
	import { updateEditHistory } from '$lib/util/storage';
	import KeyframeEditor from '$lib/keyframe/KeyframeEditor.svelte';
	import Reader from '$lib/book/Reader.svelte'
	

	export let data: PageData
	$: ({ metadata, epub, audio, location } = data)
	let showTooltip = false

	let showKeyframeEditor = false
	let keyframe: Partial<Keyframe> = {}

	async function AddKeyframe (selection: Selection) {
		const range = await epub.getRange(selection.range)	
		const snippet = range.toString()

		if (!keyframe.cfiStart) {
			keyframe.cfiStart = selection.start
			keyframe.percentageStart = epub.locations.percentageFromCfi(selection.start)
			keyframe.snippetStart = snippet
		} else {
			keyframe.cfiEnd = selection.end
			keyframe.percentageEnd = epub.locations.percentageFromCfi(selection.end)
			keyframe.snippetEnd = snippet
		}
		
		showKeyframeEditor = true
  }

	function onPageTurn ({ start }: PageTurned) {
		updateEditHistory($page.params.title, start)
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

<KeyframeEditor
	bind:show={showKeyframeEditor}
	bind:keyframe={keyframe}
	sounds={audio}
/>

{#if keyframe.type && keyframe.type !== 'sfx'}
<div class="absolute top-0 right-0 bg-slate-600 text-white py-2 px-10 rounded-full shadow select-none">
	Adding {keyframe.type} ...
</div>
{/if}