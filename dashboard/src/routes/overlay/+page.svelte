<script lang="ts">
	import { playerData } from "$lib/store";
	import { default as PlayerMeta } from "$lib/components/overlay/Meta.svelte";
	import { default as CardHightlight } from "$lib/components/overlay/Highlight.svelte";
	import Loading from "$lib/components/Loading.svelte";
	import { onMount } from "svelte";

	// onMount(() => {
	// 	if (localStorage.getItem("global")) {
	// 		localStorage.setItem("global", "");
	// 	}
	//
	// 	if (localStorage.getItem("player")) {
	// 		localStorage.setItem("player", "");
	// 	}
	//
	// 	if (localStorage.getItem("timer")) {
	// 		localStorage.setItem("timer", "");
	// 	}
	// });
</script>

{#if $playerData}
	<main class="wrapper">
		<CardHightlight player="playerOne" />
		<CardHightlight player="playerTwo" />
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
		width: 100vw; // 1920px;;
		height: 100vh; // 1080px;;
		overflow: hidden;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		position: absolute;
		outline: 1px solid red;

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
