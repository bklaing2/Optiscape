<script lang="ts">
	import { page } from '$app/stores';
	import type { PageData } from './$types';
	import type { Keyframe, PageTurned, Selection } from '$lib/types/types';
	import { updateEditHistory } from '$lib/util/storage';
	import KeyframeEditor from '$lib/keyframe/KeyframeEditor.svelte';
	import Reader from '$lib/book/Reader.svelte'
	import Tooltip from '$lib/keyframe/Tooltip.svelte';
	

	export let data: PageData
	$: ({ metadata, epub, location } = data)

	let reader: Reader

	let selecting = false
	let selectionBounds = {} as {
		down?: { x: number, y: number}
		up?: { x: number, y: number}
	}
	
	let showTooltip = false

	let showKeyframeEditor = false
  let keyframe: Partial<Keyframe & {
		start_range: string
		end_range: string
		start_snippet: string
		end_snippet: string
	}> = {}

	function onPageTurn ({ start }: PageTurned) {
		$page.url.searchParams.set('location', start)
		updateEditHistory($page.params.id, start)
	}

	function OnSelectionStart (x: number, y: number) {
		showTooltip = false
		selecting = true
		selectionBounds = { down: { x, y } }
	}

	function OnSelectionMove (x: number, y: number) {
		if (!selecting || !selectionBounds.down) return
		selectionBounds.up = { x, y }
	}

	function OnSelectionEnd (x: number, y: number) {
		if (!selecting || !selectionBounds.down) return
		selectionBounds.up = { x, y }
		selecting = false
	}

	async function OnSelected (selection: Selection) {
		if (!selectionBounds.down || !selectionBounds.up) return
		
		showTooltip = true

		const range = await epub.getRange(selection.range)	
		const snippet = range.toString()

		if (!keyframe.start) {
			keyframe.start = selection.start
			keyframe.start_percentage = epub.locations.percentageFromCfi(selection.start)
			keyframe.start_range = selection.range
			keyframe.start_snippet = snippet
		} else {
			keyframe.end = selection.end
			keyframe.end_percentage = epub.locations.percentageFromCfi(selection.end)
			keyframe.end_range = selection.range
			keyframe.end_snippet = snippet
		}
	}

	function HandleTooltipClick (type: 'sfx' | 'ambienceStart' | 'ambienceEnd' | 'musicStart' | 'musicEnd') {
		if (type === 'sfx') {
			keyframe.category = 'sfx'
			if (keyframe.start_range) reader.Highlight(keyframe.start_range, 'orange')
			showKeyframeEditor = true
			return
		}

		if (type === 'ambienceStart') {
			keyframe.category = 'ambience'
			if (keyframe.start_range) reader.Highlight(keyframe.start_range, 'green')
			showTooltip = false
			return
		}

		if (type === 'ambienceEnd') {
			keyframe.category = 'ambience'
			if (keyframe.end_range) reader.Highlight(keyframe.end_range, 'green')
			showTooltip = false
			showKeyframeEditor = true
			return
		}

		if (type === 'musicStart') {
			keyframe.category = 'music'
			if (keyframe.start_range) reader.Highlight(keyframe.start_range, '#AB8DF8')
			showTooltip = false
			return
		}

		if (type === 'musicEnd') {
			keyframe.category = 'music'
			if (keyframe.end_range) reader.Highlight(keyframe.end_range, '#AB8DF8')
			showTooltip = false
			showKeyframeEditor = true
			return
		}
	}

	function OnDiscarded () {
		if (keyframe.start_range) reader.RemoveHighlight(keyframe.start_range)
		if (keyframe.end_range)	reader.RemoveHighlight(keyframe.end_range)
    keyframe = { type: '', src: '' } as any
		showTooltip = false
	}
</script>


<svelte:head>
	<title>Editing: {metadata.title}</title>
	<meta name="description" content="About this app" />
</svelte:head>

<svelte:window
	on:beforeunload={epub.destroy}
	on:mousemove={e => OnSelectionMove(e.screenX, e.screenY)}
	on:mousedown={undefined}
	on:mouseup={e => OnSelectionEnd(e.screenX, e.screenY)}
/>



<Reader
	{epub}
	{location}
	bind:this={reader}
	on:pageTurned={e => onPageTurn(e.detail)}
	on:selected={e => OnSelected(e.detail)}
	on:mousemove={e => OnSelectionMove(e.detail.x, e.detail.y)}
	on:mousedown={e => OnSelectionStart(e.detail.x, e.detail.y)}
	on:mouseup={e => OnSelectionEnd(e.detail.x, e.detail.y)}
/>

<KeyframeEditor
	bind:keyframe={keyframe}
	bind:show={showKeyframeEditor}
	on:discarded={OnDiscarded}
/>

<Tooltip
	{keyframe}
	show={showTooltip}
	x={selectionBounds.up?.x}
	y={Math.min(selectionBounds.down?.y || 0, selectionBounds.up?.y || 0)}
	on:click={e => HandleTooltipClick(e.detail)}
/>

{#if keyframe.category && keyframe.category !== 'sfx'}
  <div class="absolute top-0 right-0 bg-slate-600 text-white py-2 px-10 rounded-full shadow select-none">
		Adding {keyframe.category} ...
	</div>
{/if}