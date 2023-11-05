<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import BookView, { type Book } from './Book.svelte'

  const dispatch = createEventDispatcher<{ seeAll: undefined }>();

  export let books: Book[]
  export let height: number = 200
  export let vertical = false
</script>


<div class="container" style:flex-direction={vertical ? 'column' : 'row'} >
  {#each books as book (book.id)}
    <BookView {book} on:click {height} />
  {/each}

  {#if books.length > 0}
    <button class="see-all" on:click={() => dispatch('seeAll')}>See all →</button>
  {/if}
</div>


<style>
  .container {
    width: 100%;
    height: 100%;

    padding-top: 20px;
    padding-bottom: 15px;

    display: flex;
    align-items: center;
    gap: 15px;

    overflow: scroll;
  }

  .see-all {
    height: 100px;
    padding: 1rem;

    color: white;
    background-color: darkgray;
    
    border: none;
    border-top-left-radius: 2px;
    border-bottom-left-radius: 2px;
    border-top-right-radius: 8px;
    border-bottom-right-radius: 8px;

    text-wrap: nowrap;
    
    text-shadow: 2px 1px 2px black;
    box-shadow: 6px 4px 4px gray;

    cursor: pointer;
    transition: all 0.1s ease-in-out;
  }

  .see-all:hover {
    text-shadow: 1px 1px 1px black;
    box-shadow: 3px 1px 1px gray;
  }

  .see-all:active {
    text-shadow: -1px -1px 3px black;
    /* box-shadow: 6px 4px 4px gray inset; */
  }
</style>