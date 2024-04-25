<script lang="ts">
	import { createEventDispatcher } from 'svelte'

  export let show = false
  export let marker: 'ambience' | 'music' | undefined

  
  const dispatch = createEventDispatcher<{
    sfxClicked: undefined,
    ambienceStartClicked: undefined,
    ambienceEndClicked: undefined,
    musicStartClicked: undefined,
    musicEndClicked: undefined,
  }>()

  $: text = marker ? `Set ${marker} end` : 'Add...'
</script>


{#if show}
  <div class="py-4 px-8 absolute bottom-0 right-0 mx-auto bg-slate-700 rounded-tl-2xl text-white text-center flex flex-col gap-2">
    <span class="text-slate-500">{text}</span>
    {#if !marker}<button on:click={() => dispatch('sfxClicked')} class="py-2 px-6 rounded-full hover:bg-slate-900">SFX</button>{/if}
    {#if !marker}<button on:click={() => dispatch('ambienceStartClicked')} class="py-2 px-6 rounded-full hover:bg-slate-900">Ambience (start)</button>{/if}
    {#if marker === 'ambience'}<button on:click={() => dispatch('ambienceEndClicked')} class="py-2 px-6 rounded-full hover:bg-slate-900">Ambience (end)</button>{/if}
    {#if !marker}<button on:click={() => dispatch('musicStartClicked')} class="py-2 px-6 rounded-full hover:bg-slate-900">Music (start)</button>{/if}
    {#if marker === 'music'}<button on:click={() => dispatch('musicEndClicked')} class="py-2 px-6 rounded-full hover:bg-slate-900">Music (end)</button>{/if}
  </div>
{/if}