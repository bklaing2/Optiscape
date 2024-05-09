<script lang="ts">
	export let href: string;
	export let className = '';
	export let id = '';
</script>

<a {href} {id} class={`text-zinc-800/50 text-sm ${className}`}>
	<slot>see all →</slot>
</a>

