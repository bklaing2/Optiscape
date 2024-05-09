<script lang="ts">
	import type { PageData } from './$types';
	import BookList from '$lib/book/List.svelte';

	export let data: PageData;
	$: ({ optiscapes } = data);
</script>

<h1>Edit a book</h1>

<p class="mt-8">
	When you have a book open in edit mode, simply select the start of the section of text where you
	would like to add audio. An option will appear to select SFX, ambience, or music. If you are
	adding ambience or music, you then select where the audio should stop. You may then search for and
	submit the sound.
	<br /><br />
	Please be mindful that sounds are added for everyone who visits the site, like a wiki. Similarly, if
	you delete an existing sound from the book it is deleted for everyone.
</p>

<a href="/books?edit" class="mt-8 underline mx-auto text-lg">Browse books to edit</a>
