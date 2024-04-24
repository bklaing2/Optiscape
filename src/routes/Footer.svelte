<script lang="ts">
	import GithubLogo from 'virtual:icons/logos/github-icon'
	export let signedIn: boolean
</script>

<footer class="flex justify-center items-center gap-8 p-8">
  <ul class="flex gap-8">
		<li><a href="/" class="flex gap-1 hover:text-amber-900"><img src="favicon.png" alt="optiscape icon" class="w-5"/>Optiscape</a></li>
		<li><a href="https://github.com/bklaing2/optiscape" class="flex gap-1 hover:text-amber-900"><GithubLogo style="fill: gray;" />GitHub</a></li>
		<li><a href="https://buymeacoffee.com/autofy" class="flex gap-1 hover:text-amber-900"><span>🍕</span>Support the site!</a></li>
		
		{#if signedIn}
			<li><form action="/auth/sign-out" method="post" class="ignore">
				<button class="sign-out" type="submit">sign out</button>
			</form></li>
		{/if}
  </ul>
</footer>


<!-- <style>

	.sign-out { color: gray; }

</style> -->