<script lang="ts" context="module">
	export type Keyframe = {
		id: number
		type: 'music' | 'ambience' | 'sfx'
		src: string
		snippet: string
		start: string
		end: string
	};
</script>

<script lang="ts">
	import { createEventDispatcher } from 'svelte'

	const dispatch = createEventDispatcher()

  export let keyframe: Keyframe
</script>


<div class="container">
	<button
		class="snippet"
		on:click={() => dispatch('click', keyframe)}
		>
		{keyframe.snippet}
	</button>

	<div class="buttons">
		<button on:click={() => dispatch('edit', keyframe)}>edit</button>
		<button on:click={() => dispatch('delete', keyframe)}>X</button>
	</div>
</div>

<style>
	.container {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.snippet {
		flex-grow: 1;

		background-color: unset;
		border: 1px solid gray;
		border-radius: 2px;

		text-align: start;

		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;

		cursor: pointer;
	}

	.snippet:active {
		background-color: gray;
	}

	.buttons {
		min-width: max-content;
	}
</style>