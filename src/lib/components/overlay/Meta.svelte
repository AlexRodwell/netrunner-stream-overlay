<script lang="ts">
	import { info } from "$lib/store";
	import { default as Side } from "$lib/components/overlay/MetaSide.svelte";
</script>

<div
	style="position: absolute; top: 0; left: 50%; transform: translateX(-50%); padding: 0.5rem; background: #242424; max-width: 50vw; overflow: hidden;"
>
	<h2>DEBUG:</h2>
	<pre>{JSON.stringify($info)}</pre>
</div>

<section class="meta">
	<Side
		id={$info["Corporation"].id}
		faction={$info["Corporation"].faction}
		align="left"
		clicks={$info["Corporation"].clicks}
		credits={$info["Corporation"].credits}
	/>

	<div class="meta__brand">
		<h1
			style="font-size: 1rem; line-height: 1.1; font-family: 'Comic Sans MS'; text-align: center; color: blue;"
		>
			East Anglia Champs
		</h1>
	</div>

	<Side
		id={$info["Runner"].id}
		faction={$info["Runner"].faction}
		align="right"
		clicks={$info["Runner"].clicks}
		credits={$info["Runner"].credits}
	/>
</section>

<style lang="scss">
	.meta {
		grid-column: 1/-1;
		display: grid;
		grid-template-columns: 1fr 1fr 1fr;
		align-items: center;

		&__brand {
		}
	}
</style>
