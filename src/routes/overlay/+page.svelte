<script lang="ts">
	import { playerData } from "$lib/store";
	import Socket from "$lib/components/Socket.svelte";
	import { default as PlayerMeta } from "$lib/components/overlay/Meta.svelte";
	import { default as CardHightlight } from "$lib/components/overlay/Highlight.svelte";
	import Loading from "$lib/components/Loading.svelte";
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
		padding: 2rem;
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
	}
</style>
