<script lang="ts">
	import { page } from '$app/stores';

	export let href: string;
	export let hidden = false;
	export let active: boolean | undefined = undefined;
	$: isActive = active !== undefined ? active : $page.url.pathname === href;
</script>

<li aria-current={active ? 'page' : undefined}>
	<a
		{href}
		data-sveltekit-noscroll
		class="py-2 px-5 rounded-full border hover:text-amber-900 hover:bg-orange-200/50 {isActive
			? 'bg-orange-200/30  border-amber-900/20'
			: 'border-transparent'} {hidden && 'hidden'}"
	>
		<slot />
	</a>
</li>
