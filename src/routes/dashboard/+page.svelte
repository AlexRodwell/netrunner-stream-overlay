<script lang="ts">
	import { onMount } from "svelte";
	import cards from "$lib/data/cards.json";
	import { info } from "$lib/store";
	import type { PlayerData, Side as TSide, Attributes } from "$lib/types";
	import Side from "$lib/components/dashboard/Side.svelte";

	// import { wsSend } from "$lib/utils";

	let socket: WebSocket;
	let data: PlayerData = $info;

	onMount(() => {
		socket = new WebSocket("ws://localhost:8080"); // Connect to your WebSocket server
	});

	const update = (side: TSide, newData: Attributes) => {
		data[side] = {
			...data[side],
			...newData,
		};

		socket.send(JSON.stringify(data));
	};
</script>

<div>
	<h1>Command Center</h1>
	<button>deploy all</button>
	<button>undo changes</button>
	<button>reset counters (new game)</button>
</div>

<div style="padding: 1rem; border: 1px solid red;">
	<Side
		side="Corporation"
		on:playerdata={(event) => {
			update("Corporation", event.detail);
		}}
	/>
</div>

<div style="padding: 1rem; border: 1px solid red;">
	<Side
		side="Runner"
		on:playerdata={(event) => {
			update("Runner", event.detail);
		}}
	/>
</div>

<style>
	main {
		width: 100vw;
		min-height: 100vh;
		padding: 5vw;
		gap: 1.5rem;
		background: #030303;
	}

	.cards {
		display: grid;
		grid-template-columns: repeat(6, 1fr);
		align-items: flex-start;
		align-content: flex-start;
	}

	p {
		grid-column: 1/-1;
		text-align: center;
	}

	:global(img.active) {
		transform: scale(1.05);
		border: 2px solid red;
		opacity: 1;
	}
</style>
