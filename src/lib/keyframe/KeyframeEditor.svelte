<script lang="ts">
  import { page } from '$app/stores';  
  import type { Audio } from '$lib/types'
	import type { Keyframe } from './Keyframe.svelte'
	import Modal from '$lib/Modal.svelte'

  export let show = false
  export let keyframe: Partial<Keyframe>
  export let sounds: Audio

  let audio: HTMLAudioElement
  let files: FileList, fileInput: HTMLInputElement

  $: hasSource = !!keyframe.src || files?.length 
  $: canAdd = hasSource && ((keyframe.type === 'sfx' && !!keyframe.cfiStart) || (!!keyframe.cfiStart && !!keyframe.cfiEnd))
  $: addButtonText =
    !keyframe.type ? 'Choose audio type' :
    !hasSource ? 'Choose/Upload audio' :
    keyframe.type !== 'sfx' && !keyframe.cfiEnd ? 'Select end range' :
    'Add'


  function handleCategoryChange(event: any) {
    keyframe.type = event.target.value
    keyframe.src = ''
  }

  async function handleMusicChange(event: any) {
    keyframe.src = event.target.value
    audio.src = `/api/optiscapes/${$page.params.title}/audio/?category=${keyframe.type}&file=${keyframe.src}`
  }

  function OnDiscard () {
    keyframe = { type: '', src: '' } as any
    fileInput.value = ''
    show = false
  }
</script>


<form method="POST" enctype="multipart/form-data">
  <Modal bind:show>
    <h2 slot="header" class="text-white text-center text-2xl col-span-full drop-shadow">Add Keyframe</h2>

    <div class="flex flex-col col-span-full">
      <select name="type" bind:value={keyframe.type} on:change={handleCategoryChange} class={`bg-transparent outline-none ${keyframe.type ? 'text-black' : 'text-slate-700'}`}>
        <option value="" disabled selected>Select audio type...</option>
        <option value="sfx">SFX</option>
        <option value="ambience">Ambience</option>
        <option value="music">Music</option>
      </select>

      <select name="src" bind:value={keyframe.src} on:change={handleMusicChange} class={`bg-transparent outline-none mt-6 ${keyframe.src ? 'text-black' : 'text-slate-700'} ${!keyframe.type && 'invisible'}`}>
        <option value="" disabled selected>Select audio source...</option>
        {#if keyframe.type}
          {#each sounds[keyframe.type] as name }
            <option value={name}>{name}</option>
          {/each}
        {/if}
      </select>
      <audio bind:this={audio} controls class={`mt-6 bg-orange-200/30  border-amber-900/20 rounded-full border hover:bg-orange-200/50 ${!keyframe.src && 'invisible'}`}></audio>

      <label for="file-input" class={`bg-transparent outline-none mt-6 text-slate-700 ${!keyframe.type && 'invisible'}`}>Or upload file...</label>
      <input
        type="file"
        bind:files
        bind:this={fileInput}
        id="file-input"
        name="file"
        accept="audio/mp3"
        class={`
          block
          text-slate-700
          file:py-2 file:px-5
          file:bg-orange-200/30 file:hover:bg-orange-200/50
          file:rounded-full
          file:border-none
          file:hover:text-amber-900
          placeholder:bg-orange-200/30
          border-none
          outline-none
          cursor-pointer file:cursor-pointer
          ${!keyframe.type && 'invisible'}
        `}
      >


      <span class="text-xs mt-10">Snippet</span>
      <span class="text-xs text-slate-700 truncate">{keyframe.snippetStart || ''}{keyframe.snippetEnd || ''}</span>

      <span class="text-xs mt-2">CFI range</span>
      <span class="text-xs text-slate-700">{keyframe.cfiStart || ''}{keyframe.cfiEnd ? ' - ' : ''}{keyframe.cfiEnd || ''}</span>
      <input name="start" value={keyframe.cfiStart} type="hidden" />
      <input name="end" value={keyframe.cfiEnd} type="hidden" />
    </div>

		<button slot="left button" class="text-rose-700" on:click={OnDiscard} type="button">Discard</button>
    <button slot="right button" class="disabled:text-slate-600" disabled={!canAdd}>{addButtonText}</button>
  </Modal>
</form>