<script lang="ts">
	import GithubLogo from 'virtual:icons/logos/github-icon';
	export let signedIn: boolean;
</script>

<footer class="flex flex-col justify-center items-center gap-x-8 gap-y-4 p-8">
	<ul class="flex gap-8">
		<li>
			<a href="/" class="flex gap-1 hover:text-amber-900"
				><img src="favicon.jpg" alt="optiscape icon" class="w-5" />Optiscape</a
			>
		</li>
		<li>
			<a href="https://github.com/bklaing2/optiscape" class="flex gap-1 hover:text-amber-900"
				><GithubLogo style="fill: gray;" />GitHub</a
			>
		</li>
		<li>
			<a href="https://buymeacoffee.com/blaing" class="flex gap-1 hover:text-amber-900"
				><span>☕️</span>Support the site!</a
			>
		</li>

		{#if signedIn}
			<li>
				<button class="sign-out" type="submit">sign out</button>
			</li>
			<li />{/if}
	</ul>

	<ul class="contents">
		<li>
			<p class="text-slate-400">
				Books provided by <a href="https://standardebooks.org/" class="underline inline"
					>Standard Ebooks</a
				>
			</p>
		</li>
		<li>
			<p class="text-slate-400">
				Sounds provided by <a href="https://freesound.org/" class="underline inline">Freesound</a>
			</p>
		</li>
	</ul>
</footer>

<!-- <style>

	.sign-out { color: gray; }

</style> -->
