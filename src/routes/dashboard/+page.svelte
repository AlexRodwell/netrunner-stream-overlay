<script lang="ts">
	import { onMount } from "svelte";
	import cards from "$lib/data/cards.json";
	import { info } from "$lib/store";
	import type { PlayerData, Side as TSide, Attributes } from "$lib/types";
	import Side from "$lib/components/dashboard/Side.svelte";

	let socket: WebSocket;
	let data: PlayerData = $info;
	let connection: boolean = false;

	onMount(() => {
		// Connect to websocket server
		socket = new WebSocket("ws://localhost:8080");

		// Check if connection to websocket server is alive
		setInterval(() => {
			connection = socket.readyState === 1;
		}, 500);
	});

	const update = (side: TSide, newData: Attributes) => {
		data[side] = {
			...data[side],
			...newData,
		};

		socket.send(JSON.stringify(data));
	};
</script>

Connection to Websocket server: {connection}

<main class="dashboard">
	<section class="dashboard__command">
		<h1>Command Center</h1>
		<button>deploy all</button>
		<button>undo changes</button>
		<button>reset counters (new game)</button>
	</section>

	<Side
		side="Corporation"
		on:playerdata={(event) => {
			update("Corporation", event.detail);
		}}
	/>

	<Side
		side="Runner"
		on:playerdata={(event) => {
			update("Runner", event.detail);
		}}
	/>
</main>

<style lang="scss">
	:global(body) {
		background: #030303;
	}

	.dashboard {
		width: 100vw;
		padding: 5vw;
		gap: 1.5rem;
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		grid-template-rows: auto 1fr;

		&__command {
			grid-column: 1/-1;
		}
	}
</style>
