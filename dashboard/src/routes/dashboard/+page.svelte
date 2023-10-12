<script lang="ts">
	import { PUBLIC_WEBSOCKET } from "$env/static/public";
	import { onMount } from "svelte";
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
	import Column from "$lib/components/dashboard/ui/Column.svelte";
	import Preview from "$lib/components/dashboard/Preview.svelte";

	// Icons
	import ICON_CLICKS from "$lib/assets/icons/NSG_CLICK.svg";
	import ICON_CREDITS from "$lib/assets/icons/NSG_CREDIT.svg";
	import ICON_AGENDAS from "$lib/assets/icons/NSG_AGENDA.svg";
	import Timer from "$lib/components/dashboard/Timer.svelte";

	let socket: WebSocket;
	let global: TGlobalData = $globalData;
	let player: TPlayerData = $playerData;
	let timer: TTimerData = $timerData;
	let connection: boolean = false;

	onMount(() => {
		socket = new WebSocket(PUBLIC_WEBSOCKET);

		// Check if connection to websocket server is alive
		setInterval(() => {
			connection = socket.readyState === 1;

			// Refresh page if websocket connection is lost
			// if (!connection) {
			// 	window.location.reload();
			// }
		}, 500);
	});

	const updatePlayer = (newData: PlayerAttributes, player_side: TSide) => {
		player[player_side] = newData;

		socket.send(
			JSON.stringify({
				_type: "player",
				...player,
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

	const updateGlobal = () => {
		socket.send(
			JSON.stringify({
				_type: "global",
				...global,
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
			<!-- <button>deploy all</button>
			<button>undo changes</button>
			<button>reset counters (new game)</button> -->
			<button>Preview overlay</button>
		</div>
	</header>

	<section class="dashboard__widgets">
		<Column>
			<Container title="GLOBAL" level={3} columns={2}>
				<Container title="Name" level={4}>
					<label class="checkbox">
						<span>{global.name ? "On" : "Off"}</span>
						<input
							type="checkbox"
							bind:checked={global.name}
							on:click={(e) => {
								global.name = e.target.checked;
								updateGlobal();
							}}
						/>
						<span class="checkbox__mark" />
					</label>
				</Container>

				<Container title="Faction" level={4}>
					<label class="checkbox">
						<span>{global.faction ? "On" : "Off"}</span>
						<input
							type="checkbox"
							bind:checked={global.faction}
							on:click={(e) => {
								global.faction = e.target.checked;
								updateGlobal();
							}}
						/>
						<span class="checkbox__mark" />
					</label>
				</Container>

				<Container title="Id" level={4}>
					<label class="checkbox">
						<span>{global.id ? "On" : "Off"}</span>
						<input
							type="checkbox"
							bind:checked={global.id}
							on:click={(e) => {
								global.id = e.target.checked;
								updateGlobal();
							}}
						/>
						<span class="checkbox__mark" />
					</label>
				</Container>

				<Container title="Clicks" level={4} icon={ICON_CLICKS}>
					<label class="checkbox">
						<span>{global.clicks ? "On" : "Off"}</span>
						<input
							type="checkbox"
							bind:checked={global.clicks}
							on:click={(e) => {
								global.clicks = e.target.checked;
								updateGlobal();
							}}
						/>
						<span class="checkbox__mark" />
					</label>
				</Container>

				<Container title="Credits" level={4} icon={ICON_CREDITS}>
					<label class="checkbox">
						<span>{global.credits ? "On" : "Off"}</span>
						<input
							type="checkbox"
							bind:checked={global.credits}
							on:click={(e) => {
								global.credits = e.target.checked;
								updateGlobal();
							}}
						/>
						<span class="checkbox__mark" />
					</label>
				</Container>

				<Container title="Agendas" level={4} icon={ICON_AGENDAS}>
					<label class="checkbox">
						<span>{global.agendas ? "On" : "Off"}</span>
						<input
							type="checkbox"
							bind:checked={global.agendas}
							on:click={(e) => {
								global.agendas = e.target.checked;
								updateGlobal();
							}}
						/>
						<span class="checkbox__mark" />
					</label>
				</Container>

				<Container title="Overlay opacity" level={4}>
					<label>
						<span>Opacity ({global.overlay.opacity * 100}%)</span>
						<input
							type="range"
							min="0"
							max="1"
							value={global.overlay.opacity}
							step="0.01"
							on:change={(e) => {
								global.overlay.opacity = e.target.value;
								updateGlobal();
							}}
						/>
					</label>
				</Container>

				<Preview
					title="Overlay"
					url="/overlay"
					button="Preview overlay"
				/>
			</Container>

			<Container title="TIMER" level={3}>
				<Timer
					on:timer={(event) => {
						updateTimer(event.detail);
					}}
				/>
			</Container>
		</Column>

		<div>
			<Side
				side="playerOne"
				on:playerdata={(event) => {
					updatePlayer(event.detail, "playerOne");
				}}
			/>
		</div>

		<div>
			<Side
				side="playerTwo"
				on:playerdata={(event) => {
					updatePlayer(event.detail, "playerTwo");
				}}
			/>
		</div>
	</section>
</main>

<style lang="scss">
	:global(body) {
		color: #fff;
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

		// &__global {
		// 	grid-column: 1/-1;
		// }

		&__widgets {
			gap: 1.5rem;
			display: grid;
			grid-template-columns: repeat(1, minmax(0, 1fr));
			// grid-template-rows: auto 1fr;
			padding: 2rem;

			@media (min-width: 1580px) {
				grid-template-columns: 1fr 2fr 2fr;
			}
		}

		&__preview {
			width: 100%;
			aspect-ratio: 16/9;
			display: flex;

			iframe {
				width: 400px;
				height: 1080px;
			}
		}

		&__command {
			grid-column: 1/-1;
		}
	}

	.connection {
		padding: 0.5rem;
		border: 1px solid #262626;
		background: #202020;
		color: #fff;
		border-radius: 4px;
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
