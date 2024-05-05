<script lang="ts">
	import type { NavItem } from 'epubjs';
	import { createEventDispatcher } from 'svelte';
	import type { Keyframe } from '$lib/types/types';
	import { enhance } from '$app/forms';
	import Audio from '$lib/buttons/Audio.svelte';

	export let chapter: NavItem;
	export let keyframes: (Keyframe & { start_snippet: string; end_snippet?: string })[];
	let expanded = false;

	const dispatch = createEventDispatcher<{
		chapterClicked: NavItem;
		keyframeClicked: { keyframe: (typeof keyframes)[number]; marker: 'start' | 'end' };
		keyframeDeleted: (typeof keyframes)[number];
	}>();

	function OnDelete(keyframe: (typeof keyframes)[number]) {
		return async () => {
			dispatch('keyframeDeleted', keyframe);
		};
	}
</script>

<div class="w-full flex flex-row col-span-full">
	<button
		on:click={() => (expanded = !expanded)}
		class="w-8 h-8 p-1 aspect-square rounded-full hover:bg-orange-200/50"
		>{expanded ? '▽' : '▷'}</button
	>
	<button
		on:click={() => dispatch('chapterClicked', chapter)}
		class="grow text-left py-1 px-4 rounded-full hover:bg-orange-200/50"
	>
		{chapter.label}
	</button>
</div>

{#if expanded}
	{#each keyframes as kf}
		<span class="col-start-1 pl-12 text-slate-400">
			{kf.category}
		</span>
		<Audio src={kf.source} />
		<button
			class="truncate max-w-full"
			on:click={() => dispatch('keyframeClicked', { keyframe: kf, marker: 'start' })}
		>
			{kf.start_snippet}
		</button>
		<button
			class="truncate max-w-full"
			on:click={() => dispatch('keyframeClicked', { keyframe: kf, marker: 'end' })}
			dir="rtl"
		>
			{kf.end_snippet || ''}
		</button>
		<form action="?/delete" method="POST" use:enhance={() => OnDelete(kf)}>
			<input type="hidden" name="id" value={kf.id} />
			<button>🗑️</button>
		</form>
	{:else}
		<p class="col-span-full pl-12 text-slate-400">No keyframes</p>
	{/each}
{/if}
