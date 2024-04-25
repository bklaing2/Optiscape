<script lang="ts">
  import BookView, { type Book } from './Book.svelte'

  export let books: Book[]
  export let height: number = 200
  export let vertical = false
  export let className = ''
</script>


<div class={`flex items-center gap-4 w-full container overflow-scroll ${className}`} style:flex-direction={vertical ? 'column' : 'row'} >
  {#each books as book}
    <BookView {book} {height} />
  {/each}
</div>
