<script lang="ts">
	import type { Book } from '$lib/types/types';
	import BookView from '$lib/book/Book.svelte';

	export let books: Book[];
	export let edit = false;
	export let showEditIcon = false;
	export let height: number = 200;
	export let vertical = false;
	export let className = '';
</script>

<div
	class="flex items-center gap-4 w-full p-4 container overflow-x-scroll overflow-y-clip
	{className}"
	style:flex-direction={vertical ? 'column' : 'row'}
>
	{#each books as book}
		<BookView {book} {height} {edit} {showEditIcon} />
	{/each}
</div>
