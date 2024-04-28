<script lang="ts">
	import { page } from '$app/stores';
	import type { PageData } from './$types';
	import type { Keyframe, PageTurned } from '$lib/types/types';
	import sounds from '$lib/util/sounds';
	import cfi from '$lib/util/cfi';
	import { updateHistory, updateReadingRate } from '$lib/util/storage.js';
	import Reader from '$lib/book/Reader.svelte';

	export let data: PageData;
	$: ({ location, metadata, epub, readingRate } = data);

	let characterCount: number;
	let startTime = Number.NEGATIVE_INFINITY;
	let pendingKeyframes = {
		start: [] as NodeJS.Timeout[],
		end: [] as { timeout: NodeJS.Timeout; kf: Keyframe }[]
	};

	function onPageTurn({ start, end }: PageTurned) {
		console.log('Page turned', start, end);
		location = start;
		$page.url.searchParams.set('location', start);
		updateHistory($page.params.id, start, epub.locations.percentageFromCfi(end));

		// Update reading rate
		handleReadingRate(start, end);
		updateReadingRate(readingRate);

		clearPendingKeyframes();
		handleKeyframes(start, end);
	}

	async function handleReadingRate(start: string, end: string) {
		// Calculate reading rate
		const elapsedMinutes = (Date.now() - startTime) / 60000;
		if (elapsedMinutes > 0.25 && elapsedMinutes < 10)
			readingRate.push(characterCount / elapsedMinutes);

		// Set up next reading rate
		startTime = Date.now();
		characterCount = await cfi.countChars(start, end, epub);
		updateReadingRate(readingRate);
	}

	async function handleKeyframes(start: string, end: string) {
		// Fetch key frames in range from db
		const startPercentage = epub.locations.percentageFromCfi(start);
		const endPercentage = epub.locations.percentageFromCfi(end);
		const response = await fetch(
			`/api/optiscapes/${$page.params.id}/script?start=${startPercentage}&end=${endPercentage}`
		);
		const script = (await response.json()) as Keyframe[];

		for (const kf of script) {
			startKeyframe(kf, start, end);
			endKeyframe(kf, start, end);
		}
	}

	async function startKeyframe(kf: Keyframe, start: string, end: string) {
		console.log('START KEY FRAME', kf.category);
		if (!cfi.inRange(kf.start, start, end)) return;

		const offset = await cfi.countChars(start, kf.start, epub);
		const delay = (offset / readingRate.Average) * 60000;

		const t = setTimeout(() => {
			console.log('KEY FRAME STARTED', kf);
			switch (kf.category) {
				case 'music':
					sounds.changeMusic(kf.source);
					break;

				case 'ambience':
					sounds.addAmbience(kf.source);
					break;

				case 'sfx':
					sounds.playSfx(kf.source);
					break;
			}
		}, delay);

		pendingKeyframes.start.push(t);
	}

	async function endKeyframe(kf: Keyframe, start: string, end: string) {
		console.log('END KEY FRAME', kf.category);
		if (!kf.end || !cfi.inRange(kf.end, start, end)) return;

		const offset = await cfi.countChars(start, kf.end, epub);
		const delay = (offset / readingRate.Average) * 60000;

		const t = setTimeout(() => onEndKeyFrame(kf), delay);
		pendingKeyframes.end.push({ timeout: t, kf });
	}

	function onEndKeyFrame(kf: Keyframe) {
		console.log('KEY FRAME ENDED', kf);
		switch (kf.category) {
			case 'music':
				sounds.endMusic(kf.source);
				break;

			case 'ambience':
				sounds.removeAmbience(kf.source);
				break;
		}
	}

	function clearPendingKeyframes() {
		pendingKeyframes.start.forEach(clearTimeout);
		pendingKeyframes.start = [];

		pendingKeyframes.end.forEach(({ timeout, kf }) => {
			clearTimeout(timeout);
			onEndKeyFrame(kf);
		});
	}
</script>

<svelte:head>
	<title>Reading: {metadata.title}</title>
	<meta name="description" content="About this app" />
</svelte:head>

<svelte:window on:beforeunload={epub.destroy} />

<Reader {epub} {location} on:pageTurned={(e) => onPageTurn(e.detail)} />

