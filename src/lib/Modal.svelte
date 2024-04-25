<script lang="ts">
	export let show: boolean

	let dialog: HTMLDialogElement

	$: if (dialog && show) dialog.showModal()
	$: if (dialog && !show) dialog.close()
</script>

<!-- svelte-ignore a11y-click-events-have-key-events a11y-no-noninteractive-element-interactions -->
<dialog
	bind:this={dialog}
	on:close={() => (show = false)}
	on:click|self={() => dialog.close()}
	class="max-w-lg bg-orange-200/20 backdrop-blur rounded-3xl border-4 border-amber-900/60 backdrop:bg-slate-950/30"
>

	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<div on:click|stopPropagation class="p-4 grid grid-cols-2 gap-6">
		<slot name="header" />
		<hr class="col-start-1 col-span-full" />
		<slot />
		<hr class="col-start-1 col-span-full" />

		<slot name="left button" />
		<slot name="right button" />
	</div>
</dialog>

<style>
	dialog[open] {
		animation: zoom 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
	}
	@keyframes zoom {
		from {
			transform: scale(0.95);
		}
		to {
			transform: scale(1);
		}
	}
	dialog[open]::backdrop {
		animation: fade 0.2s ease-out;
	}
	@keyframes fade {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}
</style>
