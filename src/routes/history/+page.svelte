<script lang="ts">
	import type { PageData } from './$types';
	import BookList from '$lib/book/List.svelte'

	export let data: PageData
	$: ({ history } = data)
</script>


<h1>Optiscape books</h1>
<BookList books={history} height={180} className="col-span-full" />

