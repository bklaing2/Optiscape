<script lang="ts">
	import type { PageData } from './$types';
	import type { Keyframe } from '$lib/keyframe/Keyframe.svelte'
	import sounds from '$lib/util/sounds';
  
	import cfi from '$lib/util/cfi'
  import bookUtil from '$lib/util/book'
	import { updateHistory, updateReadingRate } from '$lib/util/storage.js'
	import Reader, { type CfiLocation } from '$lib/book/Reader.svelte'


	export let data: PageData
	$: ({ saveData, metadata, epub, script, readingRate } = data)
	
	let startTime = Number.NEGATIVE_INFINITY


	function onPageTurn ({ start, end }: CfiLocation) {
		saveData.location = start
		saveData.percentage = epub.locations.percentageFromCfi(end)
		updateHistory(saveData)

		// Update reading rate
		handleReadingRate(start, end)
		updateReadingRate(readingRate)

		clearPendingKeyframes()
		handleKeyframes(start, end)
	}

	async function handleReadingRate (start: string, end: string) {
		// Calculate reading rate
		const elapsedMinutes = (Date.now() - startTime) / 60000
		if (elapsedMinutes > 0.25 && elapsedMinutes < 10)
			readingRate.push(characterCount / elapsedMinutes)


		// Set up next reading rate
		startTime = Date.now()
		characterCount = await cfi.countChars(start, end, epub)
	}

  
	let keyframes: Keyframe[] = []
	let pendingKeyframes: NodeJS.Timeout[] = []
  
  
	function clearPendingKeyframes () {
		pendingKeyframes.forEach(clearTimeout)
		pendingKeyframes = []
	}

	async function handleKeyframes (start: string, end: string) {
		keyframes.forEach(async kf => {
			if (cfi.inRange(kf.start, start, end))
				startKeyframe(kf, start)

			if (cfi.inRange(kf.end, start, end))
				endKeyframe(kf, start)
		})
	}






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



	let characterCount: number


	async function startKeyframe (kf: Keyframe, start: string) {
		const offset = await cfi.countChars(start, kf.start, epub)
		const delay = offset / readingRate.Average * 60000

		const t = setTimeout (() => {
			switch (kf.type) {
				case 'music':
					sounds.changeMusic(kf.src)
					break

				case 'ambience':
					sounds.addAmbience(kf.src)
					break

				case 'sfx':
					sounds.playSfx(kf.src)
					break
			}
		}, delay)

		pendingKeyframes.push(t)
	}

	async function endKeyframe (kf: Keyframe, start: string) {
		const offset = await cfi.countChars(start, kf.end, epub)
		const delay = offset / readingRate.Average * 60000

		setTimeout (() => {
			switch (kf.type) {
				case 'music':
					if (sounds.currentlyPlaying === kf.src) sounds.changeMusic('')
					break

				case 'ambience':
					sounds.removeAmbience(kf.src)
					break
			}
		}, delay)
	}
</script>


<svelte:head>
	<title>Reading {metadata.title}</title>
	<meta name="description" content="About this app" />
</svelte:head>

<svelte:window on:beforeunload={epub.destroy} />

<Reader
	{epub}
	location={saveData.location}
	on:pageTurned={e => onPageTurn(e.detail)}
/>
