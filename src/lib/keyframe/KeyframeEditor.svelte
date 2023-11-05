<script lang="ts">
  import { createEventDispatcher } from 'svelte'
	import type { Keyframe } from './Keyframe.svelte'
	import Modal from '../../routes/about/Modal.svelte'


  const dispatch = createEventDispatcher<{ update: Keyframe, delete: Keyframe }>()
  
  
  let keyframe: Keyframe
  let show = false

  export function edit (kf: Keyframe) {
    keyframe = kf
    show = true
  }


  function onUpdate () {
    dispatch('update', keyframe)
    show = false
  }

  function onDelete () {
    dispatch('delete', keyframe)
    show = false
  }


  const sounds = {
    music: getNames(import.meta.glob('/static/music/*.mp3')),
    ambience: getNames(import.meta.glob('/static/ambience/*.mp3')),
    sfx: getNames(import.meta.glob('/static/sfx/*.mp3'))
  }


  function handleOptionChange(event: any) { keyframe.type = event.target.value }
  function handleMusicChange(event: any) { keyframe.src = event.target.value }

  

  function getNames (files: Record<string, () => Promise<unknown>>) {
    const names: string[] = []

    for (const modulePath in files) {
      const split = modulePath.split('/')
      const name = split[split.length - 1]

      names.push(name)
    }

    return names
  }
</script>

{#if keyframe}
  <Modal bind:show>
    <h2 slot="header" class="snippet">{keyframe.snippet}</h2>

    <div>
      <select bind:value={keyframe.type} on:change={handleOptionChange}>
        <option value="music">Music</option>
        <option value="ambience">Ambience</option>
        <option value="sfx">SFX</option>
      </select>

      <select bind:value={keyframe.src} on:change={handleMusicChange}>
        {#each sounds[keyframe.type] as name }
          <option value={`/${keyframe.type}/${name}`}>{name}</option>
        {/each}
      </select>
    </div>

    <div>
      <p>Start: <input bind:value={keyframe.start} class="cfi"></p>
      <p>End: <input bind:value={keyframe.end} class="cfi"></p>
    </div>

    <button on:click={onDelete}>Delete</button>
    <button on:click={onUpdate}>Update</button>
  </Modal>
{/if}

<style>
  .snippet {
		text-align: start;

		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}

  .cfi {
    width: 100%;
  }
</style>