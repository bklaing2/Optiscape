<script lang="ts">
	import type { Book } from '$lib/types/types';

	export let book: Book;
	export let edit = false;
	export let showEditIcon = false;
	export let height = 200;
	export let className = '';

	$: percentage = book.percentage ? book.percentage : -1;
	$: href = `/${edit ? 'edit' : 'read'}/${book.id}`;
</script>

<div class={`relative ${className}`}>
	<a
		{href}
		class="book"
		style:background-image={`url(${book.coverUrl})`}
		style:height={`${height}px`}
	>
		<div class="details">
			<h3 class="text title">{book.title}</h3>
			<p class="text author">{book.author}</p>
		</div>
	</a>

	<a
		href="/edit/{book.id}"
		style:display={showEditIcon ? undefined : 'none'}
		class="absolute -bottom-2 -right-2 bg-white/30 rounded-full z-10 w-8 h-8 text-center align-middle flex items-center justify-center backdrop-blur-sm border border-amber-900/20 hover:backdrop-blur-3xl transition-all"
		>✏️</a
	>

	{#if percentage > 0.01 && percentage < 0.98}
		<div class="percentage">
			<progress value={percentage} max="1" class="bar"> {`${percentage * 100}%`} </progress>
		</div>
	{/if}
</div>

<style>
	.book {
		width: 100%;
		aspect-ratio: 5.5/8.5 auto;
		position: relative;

		box-sizing: content-box;

		padding: 0;
		padding-left: 0px;

		background-color: black;

		border: none;
		border-top-left-radius: 2px;
		border-bottom-left-radius: 2px;
		border-top-right-radius: 8px;
		border-bottom-right-radius: 8px;

		box-shadow: 1px 1px 1px gray, 3px 1px white, 5px 3px black, 6px 4px 4px gray;

		background-size: contain;

		z-index: 0;
		cursor: pointer;

		transition: all 0.1s ease-in-out, z-index 0s 0.01s;
	}

	.book:hover {
		z-index: 10;

		box-shadow: 1px 1px 1px gray, 3px 1px white, 5px 3px black, 8px 6px 6px gray;

		transform: translateY(-15px) rotateZ(-2deg);
	}

	.book:active {
		box-shadow: 1px 1px 1px gray, 3px 1px white, 5px 3px black, 6px 4px 2px gray;

		filter: brightness(0.9);
	}

	/* .book:hover .details {
    width: 150px;
    background: rgba(75, 75, 75, 0.9);
  }

  .book:hover .text {
    flex-grow: 0;
  }
   */

	.details {
		width: 100%;
		height: 100%;

		padding-left: 10px;
		padding-right: 10px;
		padding-top: 15px;
		padding-bottom: 15px;

		display: flex;
		flex-direction: column;
		gap: 0.75rem;

		background: rgba(75, 75, 75, 0.7);
		border-radius: 6px;
		border-top-left-radius: 2px;
		border-bottom-left-radius: 2px;

		transition: all 0.25s ease-in-out, z-index 1s 1s;
	}

	.text {
		width: 100%;

		margin: 0;
		padding: 0;

		flex-grow: 0;

		color: white;
		text-align: center;
		text-shadow: 2px 1px 2px black;

		overflow: hidden;
		transition: all 0.25s ease-in-out;
	}

	.title {
		flex-grow: 1;

		font-size: 1rem;
		line-height: 1rem;
	}

	.author {
		color: lightgray;

		font-size: 0.75em;
		line-height: 0.75rem;
	}

	.percentage {
		position: absolute;

		bottom: -2px;
		left: 4px;
		right: 4px;

		filter: drop-shadow(2px 1px 5px black);
		z-index: 11;
	}

	.bar {
		width: 100%;
	}
</style>
