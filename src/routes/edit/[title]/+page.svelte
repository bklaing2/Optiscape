<script lang="ts">
  import { onMount } from 'svelte'
	import type { PageData } from './$types';
	import { Book as EpubBook, Rendition } from 'epubjs'

	import type { Keyframe } from '$lib/keyframe/Keyframe.svelte'
  
	// import KeyframeEditor from './KeyframeEditor.svelte'

	import Reader from '$lib/book/Reader.svelte'
	import Timeline from '$lib/keyframe/Timeline.svelte'
	import type { Selection } from '$lib/types';
	import KeyframeEditor from '$lib/keyframe/KeyframeEditor.svelte';
	

	export let data: PageData
	$: ({ metadata, epub, script } = data)


	let book: EpubBook = new EpubBook()
	let rendition: Rendition


	let keyframes: Keyframe[] = []
  
	async function AddKeyframe (selection: Selection) {
	 	const range = await book.getRange(selection.range)
		const keyframe: Keyframe = {
      id: Date.now(),
      type: 'music',
			src: '',
			snippet: range.toString(),
			start: selection.start,
      end: selection.end
    }

		// keyframeEditor.edit(keyframe)
  }

</script>


<svelte:head>
	<title>Editing {metadata.title}</title>
	<meta name="description" content="About this app" />
</svelte:head>

<svelte:window on:beforeunload={epub.destroy} />



<Reader {epub} on:selected={e => AddKeyframe(e.detail)} />


<Timeline
	book={epub}
	bind:keyframes
	on:chapter={e => {
		if (!rendition) return
		rendition.display(e.detail.href)
	}}
/>

<KeyframeEditor />