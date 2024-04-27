<script>
	import Header from './Header.svelte';
	import "../app.css";
	import './styles.css';
	import Footer from './Footer.svelte';
</script>

<div class="grid grid-rows-[min-content_minmax(min-content,_1fr)_min-content] gap-8 pb-16 h-full max-w-4xl mx-auto">
	<Header />

	<main class="w-svw max-w-4xl flex flex-col px-4 box-border"><slot /></main>

	<Footer signedIn={false} />
</div>