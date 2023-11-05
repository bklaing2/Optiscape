<script lang="ts">
  import { onMount } from 'svelte'
	import { Book as EpubBook, Rendition } from 'epubjs'

	import type { Keyframe } from '$lib/keyframe/Keyframe.svelte'
  
	// import KeyframeView, { type Keyframe } from './Keyframe.svelte'
	// import KeyframeEditor from './KeyframeEditor.svelte'

	import Reader from '$lib/book/Reader.svelte'
	import Timeline from '$lib/keyframe/Timeline.svelte'

  export let data
	let book: EpubBook = new EpubBook()
	let rendition: Rendition


	let keyframes: Keyframe[] = []
  
  
	// Load the book
	onMount(() => {
		loadData()
		return unload
	})

	// // Add keyframe
	// rendition.on("selected", async (cfiRange: string) => {
	// 	const range = await book.getRange(cfiRange)
	// 	const [ start, end ] = cfi.split(cfiRange)

	// 	const keyframe: Keyframe = {
  //     id: Date.now(),
  //     type: 'music',
	// 		src: '',
	// 		snippet: range.toString(),
	// 		start: start,
  //     end: end
  //   }

	// 	// keyframeEditor.edit(keyframe)
	// })





	function loadData () {
		let  storedData = localStorage.getItem('keyframes')
		if (storedData) keyframes = JSON.parse(storedData)
	}

	async function saveData () {
		localStorage.setItem('keyframes', JSON.stringify(keyframes))
	}

	async function unload () {
		await saveData()
	}
</script>


<svelte:head>
	<title>Edit</title>
	<meta name="description" content="About this app" />
</svelte:head>

<svelte:window on:unload={unload} />


<Reader
	title={data.title}
	on:loaded={e => ({ book, rendition } = e.detail)}
/>

<Timeline
	{book}
	bind:keyframes
	on:chapter={e => {
		if (!rendition) return
		rendition.display(e.detail.href)
	}}
	/>
