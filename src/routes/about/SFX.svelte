<script lang="ts">
	import { onMount } from "svelte"

	export let src: string
  export let loop = false
	let player: HTMLAudioElement

	// onMount(() => {
	// 	player.volume = 0.5
	// })

	$: {
    if (src) {
      player.load()
      player.play()
    }
	}


  export function play (_src: any) {
    
  }
</script>

<audio bind:this={player}>
	<source src={src} type="audio/mp3" />
</audio>