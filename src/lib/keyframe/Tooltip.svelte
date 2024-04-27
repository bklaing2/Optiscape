<script lang="ts">
	import type { Keyframe } from '$lib/types/types';
	import { createEventDispatcher } from 'svelte'
  
  export let keyframe: Partial<Keyframe>
  export let show = false

  export let x = 0;
  export let y = 0;

  $: yOffset = y - 138
  
  const dispatch = createEventDispatcher<{
    click: 'sfx' | 'ambienceStart' | 'ambienceEnd' | 'musicStart' | 'musicEnd'
  }>()

  $: addingAmbience = keyframe.category === 'ambience' && keyframe.start
  $: addingMusic = keyframe.category === 'music' && keyframe.start

  $: text = addingAmbience ? 'Set ambience end' : addingMusic ? 'Set music end' : 'Add...'
</script>


{#if show}
  <div class="py-4 px-8 absolute bg-slate-700 rounded-2xl text-white text-center flex flex-col gap-2 shadow-md translate-x-[-50%] translate-y-[-100%]" style:left="{x}px" style:top="{yOffset}px">
    <span class="text-slate-400">{text}</span>
    <hr class="border-slate-600">
    {#if !addingAmbience && !addingMusic}<button on:click={() => dispatch('click', 'sfx')} class="py-2 px-6 rounded-full hover:bg-slate-900">SFX</button>{/if}
    {#if !addingAmbience && !addingMusic}<button on:click={() => dispatch('click', 'ambienceStart')} class="py-2 px-6 rounded-full hover:bg-slate-900">Ambience (start)</button>{/if}
    {#if addingAmbience}<button on:click={() => dispatch('click', 'ambienceEnd')} class="py-2 px-6 rounded-full hover:bg-slate-900">Ambience (end)</button>{/if}
    {#if !addingAmbience && !addingMusic}<button on:click={() => dispatch('click', 'musicStart')} class="py-2 px-6 rounded-full hover:bg-slate-900">Music (start)</button>{/if}
    {#if addingMusic}<button on:click={() => dispatch('click', 'musicEnd')} class="py-2 px-6 rounded-full hover:bg-slate-900">Music (end)</button>{/if}
  </div>
{/if}