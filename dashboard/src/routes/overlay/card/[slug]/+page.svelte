<script lang="ts">
	import type { PageData } from "./$types";
	import CardHighlight from "$components/overlay/CardHighlight.svelte";

	export let data: PageData;

	$: player = data.player === "playerOne" ? $playerOneData : $playerTwoData;
</script>

<main class="h-screen flex flex-row items-end">
	<CardHighlight player={data.player} data={player} side={player.side} />
</main>
