<script lang="ts">
	import { page } from '$app/stores';
	import type { PageData } from './$types';
	import type { AudioCategory, Keyframe, KeyframeRange, PageTurned } from '$lib/types'
	import sounds from '$lib/util/sounds';
	import cfi from '$lib/util/cfi'
	import { updateHistory, updateReadingRate } from '$lib/util/storage.js'
	import Reader from '$lib/book/Reader.svelte'
  

	export let data: PageData
	$: ({ location, metadata, epub, script, readingRate } = data)

	let characterCount: number
	let startTime = Number.NEGATIVE_INFINITY
	let pendingKeyframes = {
		start: [] as NodeJS.Timeout[],
		end: [] as {
			timeout: NodeJS.Timeout,
			kf: KeyframeRange	
			type: AudioCategory
		}[]
	}
  
  

	function onPageTurn ({ start, end }: PageTurned) {
		$page.url.searchParams.set('location', start)
		updateHistory($page.params.title, start, epub.locations.percentageFromCfi(end))

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

	

	async function handleKeyframes (start: string, end: string) {
		const { sfx, ambience, music } = script

		for (const kf of sfx) {
			if (cfi.inRange(kf.start, start, end))
				startKeyframe(kf, 'sfx', start)
		}
		
		for (const kf of ambience) {
			if (cfi.inRange(kf.start, start, end))
				startKeyframe(kf, 'ambience', start)

			if (cfi.inRange(kf.end, start, end))
				endKeyframe(kf, 'ambience', start)
		}
		
		for (const kf of music) {
			if (cfi.inRange(kf.start, start, end))
				startKeyframe(kf, 'music', start)

			if (cfi.inRange(kf.end, start, end))
				endKeyframe(kf, 'music', start)
		}
	}
	

	async function startKeyframe (kf: Keyframe, type: AudioCategory, start: string) {
		const offset = await cfi.countChars(start, kf.start, epub)
		const delay = offset / readingRate.Average * 60000

		const t = setTimeout (() => {

			switch (type) {
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

		pendingKeyframes.start.push(t)
	}


	async function endKeyframe (kf: KeyframeRange, type: AudioCategory, start: string) {
		if (type === 'sfx') return

		const offset = await cfi.countChars(start, kf.end, epub)
		const delay = offset / readingRate.Average * 60000

		const t = setTimeout (() => onEndKeyFrame(kf, type), delay)
		pendingKeyframes.end.push({ timeout: t, kf, type})
	}

	function onEndKeyFrame (kf: KeyframeRange, type: AudioCategory) {

		switch (type) {
			case 'music':
				sounds.endMusic(kf.src)
				break

			case 'ambience':
				sounds.removeAmbience(kf.src)
				break
		}
	}
	
	
	function clearPendingKeyframes () {
		pendingKeyframes.start.forEach(clearTimeout)
		pendingKeyframes.start = []

		pendingKeyframes.end.forEach(({ timeout, kf, type }) => {
			clearTimeout(timeout)
			onEndKeyFrame(kf, type)
		})
	}
</script>


<svelte:head>
	<title>Reading: {metadata.title}</title>
	<meta name="description" content="About this app" />
</svelte:head>

<svelte:window on:beforeunload={epub.destroy} />

<Reader
	{epub}
	{location}
	on:pageTurned={e => onPageTurn(e.detail)}
/>
