<script lang="ts">
  import { onMount } from 'svelte'
	import type { Book as EpubBook } from 'epubjs'
	// import RollingAverage from '$lib/util/rollingAverage'
	// import KeyframeView, { type Keyframe } from './Keyframe.svelte'
	// import KeyframeEditor from './KeyframeEditor.svelte'
	// import sounds from '$lib/util/sounds';
  
	import cfi from '$lib/util/cfi'
  import bookUtil from '$lib/util/book'
	import storage from '$lib/util/storage.js'
	import type { Book } from '$lib/book/Book.svelte'
	import Reader from '$lib/book/Reader.svelte'

  export let data
	let book: EpubBook



  let history: Book[] = []


  let bookInfo: Book
  
	let keyframes: Keyframe[] = []
	let pendingKeyframes: NodeJS.Timeout[] = []
  
	// const cpm = new RollingAverage(5)
  

	// onMount(() => {
	// 	loadData()
	// 	return saveData
	// })

	// // Handle CPM and Keyframes
	// rendition.on('relocated', async ({ start: { cfi: start }, end: { cfi: end } }: any) => {
  //   bookInfo.cfi = start
  //   const percentage = book.locations.percentageFromCfi(end)
  //   if (percentage) bookInfo.percentage = percentage
	// 	// handleCPM(start, end)

	// 	// clearPendingKeyframes()
	// 	// handleKeyframes(start, end)
	// })

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



	let startTime = Number.NEGATIVE_INFINITY
	let characterCount: number

	// async function handleCPM (start: string, end: string) {
	// 	// Calculate reading rate
	// 	const elapsedMinutes = (Date.now() - startTime) / 60000
	// 	if (elapsedMinutes > 0.25 && elapsedMinutes < 10)
	// 		cpm.push(characterCount / elapsedMinutes)


	// 	// Set up next reading rate
	// 	startTime = Date.now()
	// 	characterCount = await cfi.countChars(start, end, book)
	// }


	// async function handleKeyframes (start: string, end: string) {
	// 	keyframes.forEach(async kf => {
	// 		if (cfi.inRange(kf.start, start, end))
	// 			startKeyframe(kf, start)

	// 		if (cfi.inRange(kf.end, start, end))
	// 			endKeyframe(kf, start)
	// 	})
	// }


	// async function startKeyframe (kf: Keyframe, start: string) {
	// 	const offset = await cfi.countChars(start, kf.start, book)
	// 	const delay = offset / cpm.Average * 60000

	// 	const t = setTimeout (() => {
	// 		switch (kf.type) {
	// 			case 'music':
	// 				sounds.changeMusic(kf.src)
	// 				break

	// 			case 'ambience':
	// 				sounds.addAmbience(kf.src)
	// 				break

	// 			case 'sfx':
	// 				sounds.playSfx(kf.src)
	// 				break
	// 		}
	// 	}, delay)

	// 	pendingKeyframes.push(t)
	// }

	// async function endKeyframe (kf: Keyframe, start: string) {
	// 	const offset = await cfi.countChars(start, kf.end, book)
	// 	const delay = offset / cpm.Average * 60000

	// 	setTimeout (() => {
	// 		switch (kf.type) {
	// 			case 'music':
	// 				if (sounds.currentlyPlaying === kf.src) sounds.changeMusic('')
	// 				break

	// 			case 'ambience':
	// 				sounds.removeAmbience(kf.src)
	// 				break
	// 		}
	// 	}, delay)
	// }

	// function clearPendingKeyframes () {
	// 	pendingKeyframes.forEach(clearTimeout)
	// 	pendingKeyframes = []
	// }




	// window.addEventListener('unload', async () => {
	// 	await saveData()
	// })

	function loadData () {
    let storedData = localStorage.getItem('history')
		if (storedData) history = JSON.parse(storedData)


    const info = history.find(b => data.title === b.title.replaceAll(' ', '-').toLowerCase())
    if (info) bookInfo = info
    // else bookUtil.getInfo(book).then(b => bookInfo = b)

		storedData = localStorage.getItem('keyframes')
		if (storedData) keyframes = JSON.parse(storedData)

		// data = localStorage.getItem('cpm')
		// if (data) cpm = JSON.parse(data)


		// rendition.on('started', () => {
		// 	const cfi = bookInfo.cfi
		// 	if (!cfi) return

		// 	rendition.display(cfi)
		// })
	}

	async function saveData () {
    storage.updateHistory(bookInfo, history)
    
    localStorage.setItem('history', JSON.stringify(history))
		localStorage.setItem('keyframes', JSON.stringify(keyframes))
		// localStorage.setItem('cpm', JSON.stringify(cpm))
	}
</script>


<svelte:head>
	<title>Read</title>
	<meta name="description" content="About this app" />
</svelte:head>


<Reader
	title={data.title}
	on:loaded={e => book = e.detail.book}
/>
