<script lang="ts">
	import type { PageData } from './$types';

	import BookView from '$lib/book/Book.svelte'
	import BookList from '$lib/book/List.svelte'
	import SeeAll from '$lib/buttons/SeeAll.svelte';

	export let data: PageData
	$: ({ currentlyReading, history = [], optiscapes = [] } = data)
</script>

<svelte:head>
	<title>Optiscape</title>
	<meta name="description" content="Svelte demo app" />
</svelte:head>




<div class="grid grid-rows-[repeat(4,_max-content)] grid-cols-[max-content_1fr_max-content] items-end gap-8 gap-x-32 h-full mx-auto">

	{#if currentlyReading}<h2 class="text-lg">Currently Reading</h2>{/if}
	{#if history.length > 0}
		<h2>History</h2>
		<SeeAll href="/history" className="col-start-3" />
	{/if}
	
	{#if currentlyReading}<BookView book={currentlyReading} height={250} className="row-start-2 mb-32"/>{/if}

	{#if history.length > 0}
		<BookList books={history} className="col-span-2 mb-32" />
	{/if}	

	<h2 class="col-start-1 col-span-2">Optiscape books</h2>
	<SeeAll href="/books" />

	<BookList books={optiscapes} height={180} className="col-span-full" />

</div>
