<script lang="ts">
	import { info } from "$lib/store";
	import { default as Side } from "$lib/components/overlay/MetaSide.svelte";
</script>

<section class="meta">
	<Side
		player={$info["Corporation"].player.name}
		id={$info["Corporation"].id}
		faction={$info["Corporation"].faction}
		align="left"
		clicks={$info["Corporation"].clicks}
		credits={$info["Corporation"].credits}
	/>

	<div class="meta__brand">
		<!-- Branding to go here, or in stream overlay -->
	</div>

	<Side
		player={$info["Runner"].player.name}
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
