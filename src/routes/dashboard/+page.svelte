<script lang="ts">
	import { onMount } from "svelte";
	import cards from "$lib/data/cards.json";
	import { globalData, playerData, timerData } from "$lib/store";
	import type {
		GlobalData as TGlobalData,
		PlayerData as TPlayerData,
		TimerData as TTimerData,
		Side as TSide,
		PlayerAttributes,
	} from "$lib/types";
	import Side from "$lib/components/dashboard/Side.svelte";
	import Loading from "$lib/components/Loading.svelte";
	import Container from "$lib/components/dashboard/Container.svelte";

	let socket: WebSocket;
	let player: TPlayerData = $playerData;
	let global: TGlobalData = $globalData;
	let timer: TTimerData = $timerData;
	let connection: boolean = false;

	onMount(() => {
		// Connect to websocket server
		socket = new WebSocket("ws://localhost:8080");

		// Check if connection to websocket server is alive
		setInterval(() => {
			connection = socket.readyState === 1;
		}, 500);
	});

	const updatePlayer = (side: TSide, newData: PlayerAttributes) => {
		player[side] = {
			...player[side],
			...newData,
		};

		socket.send(
			JSON.stringify({
				_type: "player",
				...player,
			})
		);
	};

	const updateGlobal = (newData: TGlobalData) => {
		global = newData;
		socket.send(
			JSON.stringify({
				_type: "global",
				...global,
			})
		);
	};

	const updateTimer = (newData: TTimerData) => {
		timer = newData;
		socket.send(
			JSON.stringify({
				_type: "timer",
				...timer,
			})
		);
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
		<Container title="Command Center (WIP, none of these work)" level={2}>
			<h1 />
			<button>deploy all</button>
			<button>undo changes</button>
			<button>reset counters (new game)</button>
		</Container>
	</div>

	<div class="dashboard__command">
		<Container title="Global settings" level={3}>
			<label>
				<span>Side (on overlay)</span>
				<select
					bind:value={global.direction}
					on:change={(event) => updateGlobal(global)}
				>
					<option value="ltr" selected>Left to right</option>
					<option value="rtl">Right to left (reverse)</option>
				</select>
			</label>

			<div
				style="display: flex; flex-direction: row; align-items: center; gap: 1rem;"
			>
				<label>
					<span>Timer (seconds)</span>
					<input type="number" bind:value={timer.count} />
				</label>
				<button
					on:click={() => {
						timer.action = "set";
						timer.prev = new Date();
						updateTimer(timer);
					}}>Start timer</button
				>
				<button
					on:click={() => {
						timer.action = "clear";
						timer.prev = new Date();
						updateTimer(timer);
					}}
					style="background: #242424; border: #242424; color: #fff;"
					>Clear timer</button
				>
			</div>
		</Container>
	</div>

	<Side
		side="Corporation"
		on:playerdata={(event) => {
			updatePlayer("Corporation", event.detail);
		}}
	/>

	<Side
		side="Runner"
		on:playerdata={(event) => {
			updatePlayer("Runner", event.detail);
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
