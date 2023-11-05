<script lang="ts">
	import { createEventDispatcher } from 'svelte'
	import type { Book, NavItem } from 'epubjs'
	import cfi from '$lib/util/cfi'
  import type { Keyframe } from './Keyframe.svelte'

  export let keyframes: Keyframe[]
  export let book: Book

  const dispatch = createEventDispatcher<{
    chapter: NavItem,
  }>()
  
  $: music = keyframes.filter(kf => kf.type === 'music')
  $: ambience = keyframes.filter(kf => kf.type === 'ambience')
  $: sfx = keyframes.filter(kf => kf.type === 'sfx')

  $: book.loaded.navigation.then(async n => {
    console.log(n)
    const cfis = await Promise.all(n.toc.map(async c => await cfi.fromHref(c.href, book)))
    console.log(cfis)
  })
</script>

{#await book.loaded.navigation}
  <p>Loading Timeline...</p>
{:then navigation} 
  <table>
    <th>
      {#each navigation.toc as chapter (chapter.id) }
        <td>
          <button on:click={() => dispatch('chapter', chapter)}>{chapter.label}</button>
        </td>
      {/each}
    </th>
  </table>
{/await}


