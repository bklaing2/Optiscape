<script lang="ts">
  export let src: string
  let audio: HTMLAudioElement
  let isPlaying = false

  function OnClick () {
    if (isPlaying) {
      audio.pause()
      audio.currentTime = 0
    }
    else audio.play()

    isPlaying = !isPlaying
  }
</script>



<button on:click={OnClick} type="button" class="select-none">{isPlaying ? '⏸' : '▶️'}</button>
<audio {src} bind:this={audio}></audio>