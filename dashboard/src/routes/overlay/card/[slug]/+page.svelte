<script lang="ts">
	import type { PageData } from "./$types";
	import CardHighlight from "$components/overlay/CardHighlight.svelte";

	export let data: PageData;

	$: player = data.player === "playerOne" ? $playerOneData : $playerTwoData;
</script>

<main>
	<CardHighlight player={data.player} data={player} side={player.side} />
</main>

<style lang="scss">
	main {
		height: 100vh;
		display: flex;
		flex-direction: row;
		align-items: flex-end;
	}
</style>
