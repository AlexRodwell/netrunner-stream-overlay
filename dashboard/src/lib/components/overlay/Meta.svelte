<script lang="ts">
	import { default as Side } from "$components/overlay/MetaSide.svelte";
</script>

<section class="meta">
	<Side player="playerOne" />
	<Side player="playerTwo" />
</section>

<style lang="scss">
	.meta {
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		grid-column: 1/-1;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
	}
</style>
