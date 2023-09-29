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

			// Refresh page if websocket connection is lost
			if (!connection) {
				window.location.reload();
			}
		}, 500);
	});

	type TExtendedSide = Side | false;
	const updatePlayer = (
		newData: PlayerAttributes,
		side: TExtendedSide = false
	) => {
		if (side) {
			player[side] = {
				...player[side],
				...newData,
			};
		}

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
	<header class="dashboard__header">
		<h1>Dashboard</h1>

		<div class="dashboard__actions">
			<p
				class="connection connection--{connection
					? 'active'
					: 'inactive'}"
			>
				{#if connection}
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="24"
						height="24"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="3"
						stroke-linecap="round"
						stroke-linejoin="round"
						class="lucide lucide-check"
						><polyline points="20 6 9 17 4 12" /></svg
					>
					Connected to websocket
				{:else}
					<Loading />
					Connection lost, attempting to reconnect
				{/if}
			</p>
			<button>deploy all</button>
			<button>undo changes</button>
			<button>reset counters (new game)</button>
		</div>
	</header>

	<section class="dashboard__widgets">
		<div class="dashboard__global">
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
				updatePlayer(event.detail, "Corporation");
			}}
		/>

		<Side
			side="Runner"
			on:playerdata={(event) => {
				updatePlayer(event.detail, "Runner");
			}}
		/>
	</section>
</main>

<style lang="scss">
	:global(body) {
		background: #030303;
		overflow-x: hidden;
	}

	.dashboard {
		width: 100vw;

		&__header {
			position: sticky;
			top: 0;
			padding: 1rem 2rem;
			background-color: rgba(3, 3, 3, 0.85);
			backdrop-filter: blur(5px);
			display: flex;
			flex-direction: row;
			justify-content: space-between;
			align-items: center;
			grid-column: 1/-1;
			border-bottom: 1px solid #202020;
		}

		&__actions {
			display: flex;
			flex-direction: row;
			justify-content: flex-end;
			align-items: center;
			gap: 0.5rem;
		}

		&__global {
			grid-column: 1/-1;
		}

		&__widgets {
			gap: 1.5rem;
			display: grid;
			grid-template-columns: repeat(2, minmax(0, 1fr));
			grid-template-rows: auto 1fr;
			padding: 2rem;
		}

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
