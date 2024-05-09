<script lang="ts">
	import type { PageData } from './$types';

	import BookView from '$lib/book/Book.svelte';
	import BookList from '$lib/book/List.svelte';
	import SeeAll from '$lib/buttons/SeeAll.svelte';

	export let data: PageData;
	$: ({ currentlyReading, history = [], optiscapes = [] } = data);
</script>

<svelte:head>
	<title>Optiscape</title>
	<meta name="description" content="Svelte demo app" />
</svelte:head>

<div id="main" class="items-end gap-8 gap-x-32 max-w-full">
	{#if currentlyReading}
		<h2 id="currently-reading-label" class="text-lg">Currently Reading</h2>
	{/if}

	{#if history.length > 0}
		<h2 id="history-label">History</h2>
		<div id="history-see-all" class="justify-self-end"><SeeAll href="/history" /></div>
	{/if}

	{#if currentlyReading}
		<div id="currently-reading" class="w-min">
			<BookView book={currentlyReading} height={250} className="mb-32" />
		</div>
	{/if}

	{#if history.length > 0}
		<div id="history"><BookList books={history} className="mb-32" /></div>
	{/if}

	<h2 id="books-label">Optiscape books</h2>
	<div id="books-see-all" class="justify-self-end"><SeeAll href="/books" /></div>

	<div id="books">
		<BookList books={optiscapes} height={181} />
	</div>
</div>

<style>
	#main {
		display: grid;
		grid-template-areas:
			'currently-reading-label history-label history-see-all'
			'currently-reading history history'
			'books-label books-label books-see-all'
			'books books books';

		grid-auto-rows: min-content;
		grid-template-columns: max-content 1fr 1fr;
	}

	#currently-reading-label {
		grid-area: currently-reading-label;
	}
	#currently-reading {
		grid-area: currently-reading;
	}

	#history-label {
		grid-area: history-label;
	}
	#history-see-all {
		grid-area: history-see-all;
	}
	#history {
		grid-area: history;
	}

	#books-label {
		grid-area: books-label;
	}
	#books-see-all {
		grid-area: books-see-all;
	}
	#books {
		grid-area: books;
	}

	@media only screen and (max-width: 1000px) {
		#main {
			grid-template-areas:
				'currently-reading-label currently-reading-label'
				'currently-reading currently-reading'
				'history-label history-see-all'
				'history history'
				'books-label books-see-all'
				'books books';

			grid-template-rows: min-content;
			grid-template-columns: max-content 1fr;
		}
	}
</style>
