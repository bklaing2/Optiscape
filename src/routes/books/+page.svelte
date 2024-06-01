<script lang="ts">
	import type { PageData } from './$types';
	import BookList from '$lib/book/List.svelte';
	import { page } from '$app/stores';

	export let data: PageData;
	$: ({ streamed } = data);
	$: searchParams = $page.url.searchParams;
	$: showEditIcon = searchParams.has('edit');
	$: query = searchParams.get('query');
</script>

<form action="/books" class="contents">
	{#each [...searchParams.entries()].filter(([k]) => k !== 'query') as [key, value]}
		<input type="hidden" name={key} {value} />
	{/each}
	<input
		type="text"
		name="query"
		placeholder="Search books"
		value={query}
		class="bg-orange-200/60 border border-amber-900/0 w-full h-min mb-6 px-8 py-4 rounded-full outline-none placeholder:text-slate-600 focus:border-amber-900/20 transition"
	/>
</form>

{#await streamed.books}
	Loading books...
{:then books}
	{#if books.length > 0}
		<BookList {books} height={180} {showEditIcon} className="flex-wrap justify-center" />
	{:else}
		<!-- <p>No books found</p> -->
	{/if}
{/await}
