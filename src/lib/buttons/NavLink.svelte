<script lang="ts">
	import { page } from '$app/stores'

  export let href: string
  export let hidden = false
  $: active = $page.url.pathname === href
</script>

<li aria-current={active ? 'page' : undefined}>
  <a
    {href}
    class="py-2 px-5 rounded-full border hover:text-amber-900 hover:bg-orange-200/50 {active ? 'bg-orange-200/30  border-amber-900/20' : 'border-transparent'} {hidden && 'invisible'}"
  >
    <slot />
  </a>
</li>