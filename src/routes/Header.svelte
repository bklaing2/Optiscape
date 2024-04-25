<script>
	import NavLink from '$lib/buttons/NavLink.svelte';
</script>

<header class="grid grid-cols-[min-content_1fr_min-content] justify-items-center items-baseline my-6 mx-8">
	<div class="flex gap-2 items-baseline">
		<!-- <img src="favicon.jpg" alt="optiscape icon" class="h-8 aspect-square"/> -->
		<a href="/" class="text-xl text-amber-900">Optiscape</a>
	</div>

	<nav>
		<ul class="flex gap-4">
			<NavLink href="/">Home</NavLink>
			<NavLink href="/books">Books</NavLink>
			<!-- <NavLink href="/about">About</NavLink> -->
			<!-- <NavLink href="/sverdle">Contribute</NavLink> -->
		</ul>
	</nav>
</header>
