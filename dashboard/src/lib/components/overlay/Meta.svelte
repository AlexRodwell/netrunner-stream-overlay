<script lang="ts">
	import { default as Side } from "$lib/components/overlay/MetaSide.svelte";
</script>

<section class="meta">
	<Side player="playerOne" />
	<Side player="playerTwo" />
</section>

<style lang="scss">
	.meta {
		grid-column: 1/-1;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
	}
</style>
