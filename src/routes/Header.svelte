<script>
	import { page } from '$app/stores';
	import NavLink from '$lib/buttons/NavLink.svelte';

	$: reading = $page.url.pathname.includes('/read/');
</script>

<header class="flex flex-wrap justify-center items-center gap-8 my-6 mx-auto">
	<a href="/" class="px-5 flex items-center gap-2 text-xl text-amber-900">
		<img src="/favicon.png" alt="optiscape icon" class="h-8 aspect-square" />
		Optiscape
	</a>

	<nav class="contents">
		<ul class="flex flex-wrap gap-x-1 justify-center">
			<NavLink href="/">Home</NavLink>
			<NavLink href="/books">Books</NavLink>
			<NavLink href="/edit">Edit</NavLink>
			<NavLink href="/about">About</NavLink>
			<NavLink href="/edit/{$page.params.id}" hidden={!reading}>Edit this book!</NavLink>
		</ul>
	</nav>
</header>
