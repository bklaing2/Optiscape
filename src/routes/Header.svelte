<script>
	import { page } from '$app/stores';
	import NavLink from '$lib/buttons/NavLink.svelte';

	$: reading = $page.url.pathname.includes('/read/');
</script>

<header class="flex flex-wrap justify-center items-baseline gap-8 my-6 mx-auto">
	<div class="px-5">
		<!-- <img src="favicon.jpg" alt="optiscape icon" class="h-8 aspect-square"/> -->
		<a href="/" class="text-xl text-amber-900">Optiscape</a>
	</div>

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
