<script lang="ts">
	import { onMount } from "svelte";
	import { info } from "$lib/store";
	import { default as PlayerMeta } from "$lib/components/overlay/Meta.svelte";
	import { default as CardHightlight } from "$lib/components/overlay/Highlight.svelte";
	import Loading from "$lib/components/Loading.svelte";

	let socket: WebSocket;

	onMount(() => {
		socket = new WebSocket("ws://localhost:8080");

		socket.addEventListener("message", (event) => {
			// console.log("recieved websocket connection...");

			// console.clear();
			let data = JSON.parse(event.data);
			console.log(data);

			$info = data;
		});
	});
</script>

{#if $info}
	<main class="wrapper">
		<CardHightlight
			align="left"
			code={$info["Corporation"].highlight.code}
			active={$info["Corporation"].highlight.active}
			side="Corporation"
		/>
		<CardHightlight
			align="right"
			code={$info["Runner"].highlight.code}
			active={$info["Runner"].highlight.active}
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

<video
	style="width: 100vw; height: 100vh; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); object-fit: cover; z-index: -1"
	autoplay
	muted
	loop
>
	<source src="https://static.rodwell.dev/netrunner.mp4" type="video/mp4" />
</video>

<!-- <main class="flex flex-col justify-center items-center gap-4 p-20">
	<Cards />
</main> -->

<style lang="scss">
	.wrapper {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		grid-template-rows: 1fr auto;
		width: 100vw;
		height: 100vh;
		padding: 2rem;
		overflow: hidden;

		&--loading {
			display: flex;
			place-content: center;
			place-items: center;
			flex-direction: column;
			gap: 1rem;
		}
	}
</style>
