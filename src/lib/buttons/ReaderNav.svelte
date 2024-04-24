<script lang="ts">
  export let side: 'left' | 'right'
  export let hidden = false
</script>


<button
  id="prev"
  class={`
    grow
    py-1
    bg-orange-200/30
    border-y
    border-amber-800/10
    hover:bg-orange-300/20
    ${side === 'left' ? 'border-l' : 'border-r'}
    ${side === 'left' ? 'rounded-l-full' : 'rounded-r-full'}
    ${hidden && 'invisible'}
    select-none
  `}
  on:click
>
  {side === 'left' ? '‹' : '›'}
</button>