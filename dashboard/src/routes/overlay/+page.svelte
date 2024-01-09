<script lang="ts">
	import { netrunnerDB, playerOneData, playerTwoData } from "$lib/store";
	import { default as PlayerMeta } from "$components/overlay/Meta.svelte";
	import CardHightlight from "$components/overlay/CardHighlight.svelte";
	import Loading from "$components/Loading.svelte";
	import Commentators from "$components/overlay/Commentators.svelte";
</script>

{#if $netrunnerDB && $playerOneData && $playerTwoData}
	<main class="wrapper">
		<!-- <h1 style="position: absolute; top: 1rem; left: 1rem; color: #fff;">
			commentators: {$globalData.overlay.commentators}
		</h1> -->
		<Commentators />
		<CardHightlight
			player="playerOne"
			data={$playerOneData.highlight}
			side={$playerOneData.side}
		/>
		<CardHightlight
			player="playerTwo"
			data={$playerTwoData.highlight}
			side={$playerTwoData.side}
		/>
		<PlayerMeta />
	</main>
{:else}
	<main class="wrapper wrapper--loading">
		<Loading />
		<p>Awaiting data...</p>
	</main>
{/if}

<style lang="scss">
	.wrapper {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		grid-template-rows: 1fr auto;
		width: 100vw; //  var(--width, 100vw);
		height: 100vh; //  var(--height, 100vh);
		overflow: hidden;
		position: relative;

		&--loading {
			display: flex;
			place-content: center;
			place-items: center;
			flex-direction: column;
			gap: 1rem;
		}

		&__overlay {
			position: absolute;
			width: 100%;
			height: 100%;
			object-fit: fill;
			z-index: -1;
		}
	}
</style>
