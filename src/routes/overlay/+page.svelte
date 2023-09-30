<script lang="ts">
	import { globalData, playerData } from "$lib/store";
	import Socket from "$lib/components/Socket.svelte";
	import { default as PlayerMeta } from "$lib/components/overlay/Meta.svelte";
	import { default as CardHightlight } from "$lib/components/overlay/Highlight.svelte";
	import Loading from "$lib/components/Loading.svelte";
	import OVERLAY from "$lib/assets/overlay.png";
</script>

<Socket>
	{#if $playerData}
		<main class="wrapper">
			<CardHightlight
				align="left"
				code={$playerData["Corporation"].highlight.code}
				active={$playerData["Corporation"].highlight.active}
				side="Corporation"
			/>
			<CardHightlight
				align="right"
				code={$playerData["Runner"].highlight.code}
				active={$playerData["Runner"].highlight.active}
				side="Runner"
			/>
			<PlayerMeta />

			{#if $globalData.overlay}
				<img class="wrapper__overlay" src={OVERLAY} />
			{/if}
		</main>
	{:else}
		<main class="wrapper wrapper--loading">
			<Loading />
			<p>Awaiting data...</p>
		</main>
	{/if}
</Socket>

<style lang="scss">
	.wrapper {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		grid-template-rows: 1fr auto;
		width: 1920px; // 100vw;
		height: 1080px; // 100vh;
		padding: 82px 90px;
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
