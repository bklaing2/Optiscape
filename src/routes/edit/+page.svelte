<script lang="ts">
	import type { PageData } from './$types';
	import BookList from '$lib/book/List.svelte';

	export let data: PageData;
	$: ({ optiscapes } = data);
</script>

<h1>Edit a book</h1>
<BookList edit books={optiscapes} height={180} className="col-span-full" />
