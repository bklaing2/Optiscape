<script lang="ts">
	import type { PageData } from './$types';
	import BookList from '$lib/book/List.svelte'

	export let data: PageData
	$: ({ optiscapes } = data)
</script>


<h1>Optiscape books</h1>
<BookList books={optiscapes} height={180} className="col-span-full" />
