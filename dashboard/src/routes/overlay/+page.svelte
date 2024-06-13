<script lang="ts">
	import {
		globalData,
		netrunnerDB,
		playerOneData,
		playerTwoData,
	} from "$lib/store";
	import CardHighlight from "$components/overlay/CardHighlight.svelte";
	import Loading from "$components/Loading.svelte";
	import Commentators from "$components/overlay/Commentators.svelte";
	import layout from "$lib/data/layout.json";
	import { default as Side } from "$components/overlay/MetaSide.svelte";
	import type { ThemeClasses as TThemeClasses } from "$lib/types";

	const theme: TThemeClasses = layout[$globalData.overlay.layout];

	$: {
		import(`$lib/styles/${$globalData.overlay.layout}.css`)
			.catch(error => {
				console.error(`Failed to import CSS file: ${error}`);
			});
	}
</script>

{#if $netrunnerDB && $playerOneData && $playerTwoData}
	<main class="wrapper" style="--padding: 2.5vw;">
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
		<section
			class="absolute bottom-0 left-0 right-0 col-[1/-1] flex flex-row justify-between items-center"
		>
			<Side player="playerOne" {theme} />
			<Side player="playerTwo" {theme} />
		</section>
	</main>
{:else}
	<main
		class="wrapper flex place-content-center place-items-center flex-col gap-4"
	>
		<Loading />
		<p>Awaiting data...</p>
	</main>
{/if}

<style lang="postcss">
	.wrapper {
		@apply grid grid-cols-2 grid-rows-[1fr_auto] w-screen h-screen overflow-hidden relative;
	}
</style>
