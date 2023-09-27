<script lang="ts">
	import { onMount } from "svelte";
	import cards from "$lib/data/cards.json";
	import { info } from "$lib/store";
	import type { PlayerData, Side as TSide, Attributes } from "$lib/types";
	import Side from "$lib/components/dashboard/Side.svelte";
	import Loading from "$lib/components/Loading.svelte";
	import Container from "$lib/components/dashboard/Container.svelte";

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

<main class="dashboard">
	<p class="connection connection--{connection ? 'active' : 'inactive'}">
		{#if connection}
			✔️ Connected to websocket
		{:else}
			<Loading />
			Connection lost, attempting to reconnect
		{/if}
	</p>

	<div class="dashboard__command">
		<Container>
			<h1>Command Center (WIP, none of these work)</h1>
			<button>deploy all</button>
			<button>undo changes</button>
			<button>reset counters (new game)</button>
		</Container>
	</div>

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
		overflow-x: hidden;
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

	.connection {
		padding: 1rem;
		border: 1px solid #262626;
		background: #202020;
		color: #fff;
		border-radius: 8px;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		grid-column: 1/-1;

		&--active {
			border-color: #2a6c21;
			background: rgb(30, 34, 27);
			background: linear-gradient(
				0deg,
				rgba(30, 34, 27, 1) 0%,
				rgba(46, 70, 43, 1) 100%
			);
		}

		&--inactive {
			border-color: #6c2121;
			background: rgb(34, 27, 27);
			background: linear-gradient(
				0deg,
				rgba(34, 27, 27, 1) 0%,
				rgba(112, 41, 41, 1) 100%
			);
		}

		:global(.loading) {
			width: 1rem;
			height: 1rem;
			border-width: 0.125rem;
		}
	}
</style>
