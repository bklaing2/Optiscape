<script lang="ts">
	import { page } from '$app/stores';
	import type { PageData } from './$types';
	import type { Keyframe, PageTurned, Selection } from '$lib/types/types';
	import { updateEditHistory } from '$lib/util/storage';
	import { COLORS } from '$lib/util/keyframe';
	import cfi from '$lib/util/cfi';
	import KeyframeEditor from '$lib/keyframe/KeyframeEditor.svelte';
	import Reader from '$lib/book/Reader.svelte';
	import Tooltip from '$lib/keyframe/Tooltip.svelte';
	import Timeline from '$lib/keyframe/Timeline.svelte';
	import type { NavItem } from 'epubjs';

	export let data: PageData;
	$: ({ metadata, epub, keyframes, location } = data);

	let reader: Reader;

	let selecting = false;
	let selectionBounds = {} as {
		down?: { x: number; y: number };
		up?: { x: number; y: number };
	};

	let showTooltip = false;

	let showKeyframeEditor = false;
	let keyframe: Partial<Keyframe & { start_snippet: string; end_snippet: string }> = {};

	function OnPageTurn({ start }: PageTurned) {
		$page.url.searchParams.set('location', start);
		updateEditHistory($page.params.id, start);
	}

	function OnChapterClicked(chapter: NavItem) {
		reader.Display(chapter.href);
	}

	async function OnKeyframeAdded(keyframe: Keyframe) {
		const start_range = await epub.getRange(keyframe.start);
		const start_snippet = start_range.toString();
		let end_snippet: string | undefined = undefined;

		if (keyframe.end) {
			const end_range = await epub.getRange(keyframe.end);
			end_snippet = end_range.toString();
		}

		const kf = { ...keyframe, start_snippet, end_snippet };
		data = { ...data, keyframes: [...keyframes, kf] };
	}

	function OnKeyframeClicked({
		keyframe,
		marker
	}: {
		keyframe: Keyframe;
		marker: 'start' | 'end';
	}) {
		// const range = marker === 'end' && keyframe.end ? keyframe.end : keyframe.start;
		const [start] = cfi.split(keyframe.start);
		const [_, end] = cfi.split(keyframe.end || keyframe.start);
		const range = cfi.toRange(start, end);

		reader.ClearHighlights();
		reader.Display(marker === 'start' ? start : end);
		reader.Highlight(range, COLORS[keyframe.category]);
	}

	function OnKeyframeDeleted(keyframe: Keyframe) {
		reader.RemoveHighlight(keyframe.start);
		if (keyframe.end) reader.RemoveHighlight(keyframe.end);

		data = { ...data, keyframes: keyframes.filter((kf) => kf.id !== keyframe.id) };
		console.log(keyframes);
	}

	function OnSelectionStart(x: number, y: number) {
		showTooltip = false;
		selecting = true;
		selectionBounds = { down: { x, y } };
	}

	function OnSelectionMove(x: number, y: number) {
		if (!selecting || !selectionBounds.down) return;
		selectionBounds.up = { x, y };
	}

	function OnSelectionEnd(x: number, y: number) {
		if (!selecting || !selectionBounds.down) return;
		selectionBounds.up = { x, y };
		selecting = false;
	}

	async function OnSelected(selection: Selection) {
		if (!selectionBounds.down || !selectionBounds.up) return;

		showTooltip = true;

		const range = await epub.getRange(selection.range);
		const snippet = range.toString();

		if (!keyframe.start) {
			keyframe.start = selection.range;
			keyframe.start_percentage = epub.locations.percentageFromCfi(selection.start);
			keyframe.start_snippet = snippet;
		} else {
			keyframe.end = selection.range;
			keyframe.end_percentage = epub.locations.percentageFromCfi(selection.end);
			keyframe.end_snippet = snippet;
		}
	}

	function HandleTooltipClick(
		type: 'sfx' | 'ambienceStart' | 'ambienceEnd' | 'musicStart' | 'musicEnd'
	) {
		if (type === 'sfx') {
			keyframe.category = 'sfx';
			if (keyframe.start) reader.Highlight(keyframe.start, COLORS.sfx);
			showKeyframeEditor = true;
			return;
		}

		if (type === 'ambienceStart') {
			keyframe.category = 'ambience';
			if (keyframe.start) reader.Highlight(keyframe.start, COLORS.ambience);
			showTooltip = false;
			return;
		}

		if (type === 'ambienceEnd') {
			keyframe.category = 'ambience';
			if (keyframe.end) reader.Highlight(keyframe.end, COLORS.ambience);
			showTooltip = false;
			showKeyframeEditor = true;
			return;
		}

		if (type === 'musicStart') {
			keyframe.category = 'music';
			if (keyframe.start) reader.Highlight(keyframe.start, COLORS.music);
			showTooltip = false;
			return;
		}

		if (type === 'musicEnd') {
			keyframe.category = 'music';
			if (keyframe.end) reader.Highlight(keyframe.end, COLORS.music);
			showTooltip = false;
			showKeyframeEditor = true;
			return;
		}
	}

	function OnDiscarded() {
		if (keyframe.start) reader.RemoveHighlight(keyframe.start);
		if (keyframe.end) reader.RemoveHighlight(keyframe.end);
		keyframe = { type: '', src: '' } as any;
		showTooltip = false;
	}
</script>

<svelte:head>
	<title>Editing: {metadata.title}</title>
	<meta name="description" content="About this app" />
</svelte:head>

<svelte:window
	on:beforeunload={epub.destroy}
	on:mousemove={(e) => OnSelectionMove(e.screenX, e.screenY)}
	on:mousedown={undefined}
	on:mouseup={(e) => OnSelectionEnd(e.screenX, e.screenY)}
/>

<Reader
	{epub}
	{location}
	bind:this={reader}
	on:pageTurned={(e) => OnPageTurn(e.detail)}
	on:selected={(e) => OnSelected(e.detail)}
	on:mousemove={(e) => OnSelectionMove(e.detail.x, e.detail.y)}
	on:mousedown={(e) => OnSelectionStart(e.detail.x, e.detail.y)}
	on:mouseup={(e) => OnSelectionEnd(e.detail.x, e.detail.y)}
/>

<KeyframeEditor
	bind:keyframe
	bind:show={showKeyframeEditor}
	on:discarded={OnDiscarded}
	on:keyframeAdded={(e) => OnKeyframeAdded(e.detail)}
/>

<hr class="w-full my-6 border-slate-400" />

{#await epub.loaded.navigation then}
	<Timeline
		{keyframes}
		book={epub}
		on:chapterClicked={(e) => OnChapterClicked(e.detail)}
		on:keyframeClicked={(e) => OnKeyframeClicked(e.detail)}
		on:keyframeDeleted={(e) => OnKeyframeDeleted(e.detail)}
	/>
{/await}

<Tooltip
	{keyframe}
	show={showTooltip}
	x={selectionBounds.up?.x}
	y={Math.min(selectionBounds.down?.y || 0, selectionBounds.up?.y || 0)}
	on:click={(e) => HandleTooltipClick(e.detail)}
/>

{#if keyframe.category && keyframe.category !== 'sfx'}
	<div
		class="absolute top-0 right-0 bg-slate-600 text-white py-2 px-10 rounded-full shadow select-none"
	>
		Adding {keyframe.category} ...
	</div>
{/if}
