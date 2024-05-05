<script lang="ts">
	import type { Book } from 'epubjs';
	import type { Keyframe } from '$lib/types/types';
	import TimelineSection from './TimelineSection.svelte';
	import cfi from '$lib/util/cfi';

	export let keyframes: (Keyframe & { start_snippet: string; end_snippet?: string })[];
	export let book: Book;

	$: SectionKeyframes = async () => {
		const percentages = await Promise.all(
			book.navigation.toc.map(async (c) =>
				book.locations.percentageFromCfi(await cfi.fromHref(c.href, book))
			)
		);

		return keyframes.reduce(
			(kfs, kf) => {
				for (const [i, percentage] of percentages.entries()) {
					if (percentage < kf.start_percentage) continue;

					kfs[i - 1].push(kf);
					break;
				}

				return kfs;
			},
			percentages.map((_) => [] as typeof keyframes)
		);
	};
</script>

{#await SectionKeyframes() then sectionedKeyframes}
	<div
		class="grid grid-cols-[min-content_min-content_1fr_1fr_min-content] gap-4 justify-items-start"
	>
		{#each book.navigation.toc as chapter, i (chapter.id)}
			<TimelineSection
				{chapter}
				keyframes={sectionedKeyframes[i]}
				on:chapterClicked
				on:keyframeClicked
				on:keyframeDeleted
			/>
		{/each}
	</div>
{/await}
