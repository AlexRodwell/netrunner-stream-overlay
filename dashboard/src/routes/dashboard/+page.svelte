<script lang="ts">
	import Socket from "$lib/components/Socket.svelte";
	import { PUBLIC_WEBSOCKET } from "$env/static/public";
	import { onMount, setContext } from "svelte";
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
	import ResetState from "$lib/components/dashboard/ResetState.svelte";

	// Icons
	import ICON_CLICKS from "$lib/assets/icons/NSG_CLICK.svg";
	import ICON_CREDITS from "$lib/assets/icons/NSG_CREDIT.svg";
	import ICON_AGENDAS from "$lib/assets/icons/NSG_AGENDA.svg";
	import Timer from "$lib/components/dashboard/Timer.svelte";
	import GlobalSettings from "$lib/components/dashboard/GlobalSettings.svelte";
	import Actions from "$lib/components/dashboard/ui/Actions.svelte";
	import SaveConfig from "$lib/components/dashboard/SaveConfig.svelte";

	let socket: WebSocket;
	let global: TGlobalData = $globalData;
	let player: TPlayerData = $playerData;
	let timer: TTimerData = $timerData;

	$: connection = $globalData.websocket.status;

	onMount(() => {
		socket = new WebSocket(PUBLIC_WEBSOCKET);
	});

	const updatePlayer = (newData: PlayerAttributes, player_side: TSide) => {
		console.log(newData);
		player[player_side] = newData;
		updateThreatLevel();

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

	const updateAll = () => {
		let data = {
			_type: "all",
			player: player,
			timer: timer,
			global: global,
		};

		console.log("update all", data);
		updateThreatLevel();

		socket.send(JSON.stringify(data));
	};

	const updateThreatLevel = () => {
		const playerOneAgendas = player.playerOne.agendas.amount;
		const playerTwoAgendas = player.playerTwo.agendas.amount;

		global.agendas_count =
			playerOneAgendas > playerTwoAgendas
				? playerOneAgendas
				: playerTwoAgendas;
	};

	const resetGameState = () => {
		const corpDefault = {
			clicks: {
				amount: 3,
			},
			credits: {
				amount: 5,
			},
			agendas: {
				amount: 0,
			},
		};

		const runnerDefault = {
			clicks: {
				amount: 4,
			},
			credits: {
				amount: 5,
			},
			agendas: {
				amount: 0,
			},
		};

		const sides: TSide[] = ["playerOne", "playerTwo"];

		sides.forEach((playerKey) => {
			const deck = {
				player: {
					...player[playerKey].player,
					wins: 0,
				},
				...(player[playerKey].decks.corp.active
					? corpDefault
					: runnerDefault),
			};

			player[playerKey] = {
				...player[playerKey],
				...deck,
			};
		});

		socket.send(
			JSON.stringify({
				_type: "player",
				...player,
			})
		);
	};

	const saveConfig = () => {
		const blob = new Blob([JSON.stringify(player, null, 2)], {
			type: "application/json",
		});

		// Create a URL for the Blob
		const url = URL.createObjectURL(blob);

		// Create a link element for downloading
		const downloadLink = document.createElement("a");
		downloadLink.href = url;
		downloadLink.download = "data.json"; // Set the filename

		// Trigger a click event on the link to start the download
		downloadLink.click();

		// Clean up by revoking the URL (prevents memory leaks)
		URL.revokeObjectURL(url);
	};

	const swapDeck = () => {
		if (player.playerOne.decks.corp.active === true) {
			player.playerOne.decks.corp.active = false;
			player.playerOne.decks.runner.active = true;
			player.playerTwo.decks.corp.active = true;
			player.playerTwo.decks.runner.active = false;
		} else {
			player.playerOne.decks.corp.active = true;
			player.playerOne.decks.runner.active = false;
			player.playerTwo.decks.corp.active = false;
			player.playerTwo.decks.runner.active = true;
		}

		socket.send(
			JSON.stringify({
				_type: "player",
				...player,
			})
		);
	};
</script>

<main class="dashboard">
	<header class="dashboard__header">
		<p class="connection connection--{connection ? 'active' : 'inactive'}">
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
		<Actions>
			<GlobalSettings on:global={updateGlobal} />
			<Timer
				on:timer={(event) => {
					updateTimer(event.detail);
				}}
			/>
			<Preview title="Overlay" url="/overlay" button="Preview overlay" />
			<ResetState on:reset={resetGameState} />
			<SaveConfig on:save={saveConfig} />
		</Actions>
	</header>

	<section class="dashboard__widgets">
		<div>
			<Side
				side="playerOne"
				on:playerdata={(event) => {
					updatePlayer(event.detail, "playerOne");
				}}
				on:deckSwap={swapDeck}
			/>
		</div>

		<div>
			<Side
				side="playerTwo"
				on:playerdata={(event) => {
					updatePlayer(event.detail, "playerTwo");
				}}
				on:deckSwap={swapDeck}
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
		min-height: 100vh;

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
			display: grid;
			grid-template-columns: repeat(1, minmax(0, 1fr));
			// grid-template-rows: auto 1fr;

			@media (min-width: 1580px) {
				grid-template-columns: repeat(
					2,
					minmax(0, 1fr)
				); // 1fr 2fr 2fr;
			}

			> div {
				padding: 2rem;

				&:not(:last-of-type) {
					border-right: 1px solid #202020;
				}
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
