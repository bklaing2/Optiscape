<script lang="ts">
	import { onMount } from 'svelte'
	import ePub from 'epubjs'

	import RollingAverage from '$lib/util/rollingAverage'
	import KeyframeView, { type Keyframe } from '../../lib/keyframe/Keyframe.svelte'
	import KeyframeEditor from '../../lib/keyframe/KeyframeEditor.svelte'
	import sounds from '$lib/util/sounds';

	import cfi from '$lib/util/cfi'


	let keyframes: Keyframe[] = []
	let pendingKeyframes: NodeJS.Timeout[] = []

	const cpm = new RollingAverage(5)


	// Load the book
	// var book = ePub('/books/arthur-conan-doyle_the-casebook-of-sherlock-holmes.epub')
	// var book = ePub('/books/jules-verne_journey-to-the-center-of-the-earth_f-a-malleson.epub')
	var book = ePub('https://standardebooks.org/ebooks/edgar-allan-poe/short-fiction/downloads/edgar-allan-poe_short-fiction.epub')
	var rendition = book.renderTo("viewer", { width: "100%", height: 600 })
	rendition.display()

	onMount(() => {
		loadData()
		return saveData
	})


	let keyframeEditor: KeyframeEditor

	

	function updateKeyframe (keyframe: Keyframe) {
		let exists = false

		keyframes = keyframes.map(kf => {
			if (kf.id !== keyframe.id) return kf
			exists = true
			return keyframe
		})

		if (!exists) keyframes = [ ...keyframes, keyframe ]
	}

	function removeKeyframe (keyframe: Keyframe) {
		keyframes = keyframes.filter(kf => kf.id !== keyframe.id)
	}




	book.ready.then(() => {
		const next = document.getElementById('next')
		const prev = document.getElementById('prev')
		if (!next || !prev) return

		next.addEventListener('click', () => rendition.next(), false)
		prev.addEventListener('click', () => rendition.prev(), false)
	})

	// Handle CPM and Keyframes
	rendition.on('relocated', async ({ start: { cfi: start }, end: { cfi: end } }: any) => {
		handleCPM(start, end)

		clearPendingKeyframes()
		handleKeyframes(start, end)
	})

	// Handle button visibility
	rendition.on('relocated', ({ atEnd, atStart }: any) => {
		const next = document.getElementById('next')
		const prev = document.getElementById('prev')
		if (!next || !prev) return

		next.style.visibility = atEnd ? 'hidden' : 'visible'
		prev.style.visibility = atStart ? 'hidden' : 'visible'
	})

	// Add keyframe
	rendition.on("selected", async (cfiRange: string) => {
		const range = await book.getRange(cfiRange)
		const [ start, end ] = cfi.split(cfiRange)

		const keyframe: Keyframe = {
      id: Date.now(),
      type: 'music',
			src: '',
			snippet: range.toString(),
			start: start,
      end: end
    }

		keyframeEditor.edit(keyframe)
	})



	let startTime = Number.NEGATIVE_INFINITY
	let characterCount: number

	async function handleCPM (start: string, end: string) {
		// Calculate reading rate
		const elapsedMinutes = (Date.now() - startTime) / 60000
		if (elapsedMinutes > 0.25 && elapsedMinutes < 10)
			cpm.push(characterCount / elapsedMinutes)


		// Set up next reading rate
		startTime = Date.now()
		characterCount = await cfi.countChars(start, end, book)
	}


	async function handleKeyframes (start: string, end: string) {
		keyframes.forEach(async kf => {
			if (cfi.inRange(kf.start, start, end))
				startKeyframe(kf, start)

			if (cfi.inRange(kf.end, start, end))
				endKeyframe(kf, start)
		})
	}


	async function startKeyframe (kf: Keyframe, start: string) {
		const offset = await cfi.countChars(start, kf.start, book)
		const delay = offset / cpm.Average * 60000

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
		const offset = await cfi.countChars(start, kf.end, book)
		const delay = offset / cpm.Average * 60000

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

	function clearPendingKeyframes () {
		pendingKeyframes.forEach(clearTimeout)
		pendingKeyframes = []
	}







	// function getAllChapters (book: Book) {
	// 	const chapters: Section[] = []
	// 	book.spine.each((s: Section, i, arr) => chapters.push(s))
	// 	return chapters
	// }


	window.addEventListener('unload', () => {
		book.destroy()
		saveData()
	})

	function loadData () {
		let data = localStorage.getItem('keyframes')
		if (data) keyframes = JSON.parse(data)

		// data = localStorage.getItem('cpm')
		// if (data) cpm = JSON.parse(data)


		rendition.on('started', () => {
			const cfi = localStorage.getItem('currentLocation')
			if (!cfi) return

			rendition.display(cfi)
		})
	}

	function saveData () {
		localStorage.setItem('keyframes', JSON.stringify(keyframes))
		localStorage.setItem('cpm', JSON.stringify(cpm))
		localStorage.setItem('currentLocation', (rendition.currentLocation() as any).start.cfi)
	}
</script>


<svelte:head>
	<title>About</title>
	<meta name="description" content="About this app" />
</svelte:head>

<div class="container">
	<div class="book">
		<div id="viewer" class="renderer"></div>

		<div class="row">
			<button id="prev" class="grow">‹</button>
			<button on:click={() => sounds.toggle()}>{'⏵/⏸'}</button>
			<button id="next" class="grow">›</button>
		</div>

	</div>

	<div class="keyframes">
		<h2>Keyframes</h2>

		{#each keyframes as keyframe (keyframe.id) }
			<KeyframeView
				{keyframe}
				on:click={() => rendition.display(keyframe.start)}
				on:edit={() => keyframeEditor.edit(keyframe)}
				on:delete={() => removeKeyframe(keyframe)}
			/>
		{/each}
	</div>
</div>



<KeyframeEditor
	bind:this={keyframeEditor}
	on:update={(e) => updateKeyframe(e.detail)}
	on:delete={(e) => removeKeyframe(e.detail)}
/>


<style>
	.container {
		display: grid;
		grid-template-columns: 75% 25%;
		grid-gap: 10px; 
	}

	.row {
		display: flex;
	}

	.grow {
		flex-grow: 1;
	}
</style>
