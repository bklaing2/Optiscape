<script lang="ts">
  export let href: string
  export let className = ''
</script>
<a
  {href}
  class={`text-zinc-800/50 text-sm ${className}`}
>
  <slot>see all →</slot>
</a>