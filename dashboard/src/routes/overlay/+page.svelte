<script lang="ts">
	import { netrunnerDB, playerOneData, playerTwoData } from "$lib/store";
	import { default as PlayerMeta } from "$components/overlay/Meta.svelte";
	import CardHighlight from "$components/overlay/CardHighlight.svelte";
	import Loading from "$components/Loading.svelte";
	import Commentators from "$components/overlay/Commentators.svelte";
</script>

{#if $netrunnerDB && $playerOneData && $playerTwoData}
	<main class="wrapper">
		<Commentators />
		<CardHighlight
			player="playerOne"
			data={$playerOneData.highlight}
			side={$playerOneData.side}
		/>
		<CardHighlight
			player="playerTwo"
			data={$playerTwoData.highlight}
			side={$playerTwoData.side}
		/>
		<PlayerMeta />
	</main>
{:else}
	<main
		class="wrapper flex place-content-center place-items-center flex-col gap-4"
	>
		<Loading />
		<p>Awaiting data...</p>
	</main>
{/if}

<style lang="scss">
	.wrapper {
		@apply grid grid-cols-2 grid-rows-[1fr_auto] w-screen h-screen overflow-hidden relative;
	}
</style>
