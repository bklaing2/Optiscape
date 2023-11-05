<script lang="ts">
	import { onMount } from 'svelte'
	import { goto } from '$app/navigation'

	import { getAllBooks } from '$lib/util/book'
	import BookView, { type Book } from '$lib/book/Book.svelte'
	import BookList from '$lib/book/List.svelte'


	let history: Book[] = []
	let currentlyReading: Book | undefined

	$: if (history.length > 0 && history[0].percentage && history[0].percentage > 0.01 && history[0].percentage < 0.98)
		currentlyReading = history[0]


	onMount(() => {
		loadData()
		return saveData
	})


	function onBookClick ({ detail: book }: CustomEvent<Book>) {
		const title = book.title.replaceAll(' ', '-').toLowerCase()
		goto(`/read/${title}`)
	}


	function loadData () {
		let data = localStorage.getItem('history')
		if (data) history = JSON.parse(data)
	}

	function saveData () {
		localStorage.setItem('history', JSON.stringify(history))
	}
</script>

<svelte:head>
	<title>Optiscape</title>
	<meta name="description" content="Svelte demo app" />
</svelte:head>



<h1>Optiscape</h1>

<div class="dashboard">
	{#if currentlyReading}
		<section class="row" style:grid-area="currently-reading">
			<h2 class="sideways">Currently Reading</h2>
			<BookView book={currentlyReading} on:click={onBookClick} height={250} />
		</section>
	{/if}

	{#if history.length > 0}
		<section class="row" style:grid-area="history">
			<h2 class="sideways" style:flex-grow={0}>History</h2>

			<BookList books={currentlyReading ? history.toSpliced(0, 1) : history} on:click={onBookClick} on:seeAll={() => {}} />
		</section>
	{/if}


	<section class="row" style:grid-area="other">
		<h2 class="sideways" style:flex-grow={0}>Optiscape books</h2>

		{#await getAllBooks()}
			<p>Loading...</p>
		{:then books}
			<BookList {books} on:click={onBookClick} on:seeAll={() => {}} height={180} />
		{/await}
	</section>
</div>




<style>
	.dashboard {
		width: 100%;

		display: flex;
		flex-direction: column;
		/* grid-template-columns: minmax(0, 1fr);
		grid-template-rows: 200px 200px 200px;
		grid-template-areas:
			"currently-reading"
			"history"
			"other"; */

		gap: 50px;
		row-gap: 50px;
	}

	.row {
		height: 100%;
		display: flex;
		align-items: center;
	}

	/* .column {
		display: flex;
		flex-direction: column;
		align-items: center;
	} */
	
	.sideways {
		text-align: center;
		writing-mode: tb-rl;
		transform: rotate(-180deg);
	}
</style>
