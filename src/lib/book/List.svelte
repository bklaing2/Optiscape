<script lang="ts">
	import type { Book } from '$lib/types/types';
	import BookView from '$lib/book/Book.svelte';

	export let books: Book[];
	export let edit = false;
	export let height: number = 200;
	export let vertical = false;
	export let className = '';
</script>

<div
	class={`flex items-center gap-4 w-full container overflow-scroll ${className}`}
	style:flex-direction={vertical ? 'column' : 'row'}
>
	{#each books as book}
		<BookView {book} {height} {edit} />
	{/each}
</div>
