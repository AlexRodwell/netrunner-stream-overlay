<script lang="ts">
	import { PUBLIC_WEBSOCKET } from "$env/static/public";

	import { onMount } from "svelte";
	import Preview from "$components/dashboard/Preview.svelte";
	import ResetState from "$components/dashboard/ResetState.svelte";
	import FlipPlayers from "$components/dashboard/FlipPlayers.svelte";
	import Timer from "$components/dashboard/Timer.svelte";
	import GlobalSettings from "$components/dashboard/GlobalSettings.svelte";
	import Actions from "$components/dashboard/ui/Actions.svelte";
	import SaveConfig from "$components/dashboard/SaveConfig.svelte";
	import Connection from "$components/dashboard/Connection.svelte";
	import {
		globalData,
		playerOneData,
		playerTwoData,
		timerData,
		deploy,
	} from "$lib/store";
	import type {
		GlobalData as TGlobalData,
		PlayerData as TPlayerData,
		TimerData as TTimerData,
	} from "$lib/types";

	export let socketSend: Function;

	let socket: WebSocket;
	let global: TGlobalData = $globalData;
	let timer: TTimerData = $timerData;

	onMount(() => {
		socket = new WebSocket(PUBLIC_WEBSOCKET);
	});

	const updateGlobal = () => {
		socketSend("global", global);
	};

	const updateTimer = (newData: TTimerData) => {
		timer = newData;
		socketSend("timer", timer);
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

		$playerOneData = {
			...$playerOneData,
			...{
				player: {
					...$playerOneData.player,
					wins: 0,
				},
				...($playerOneData.decks.corp.active
					? corpDefault
					: runnerDefault),
			},
		};
		socketSend("playerOne", $playerOneData);

		$playerTwoData = {
			...$playerTwoData,
			...{
				player: {
					...$playerTwoData.player,
					wins: 0,
				},
				...($playerTwoData.decks.corp.active
					? corpDefault
					: runnerDefault),
			},
		};
		socketSend("playerTwo", $playerTwoData);
	};

	const flipGameState = () => {
		// Store existing player dat a
		const playerOne = $playerOneData;
		const playerTwo = $playerTwoData;

		// Assign player data in reverse order
		$playerOneData = playerTwo;
		$playerTwoData = playerOne;

		// Send data to websocket
		socketSend("playerOne", $playerOneData);
		socketSend("playerTwo", $playerTwoData);
	};

	const saveConfig = () => {
		const blob = new Blob(
			[
				JSON.stringify(
					{
						global: global,
						player: {
							playerOne: $playerOneData,
							playerTwo: $playerTwoData,
						},
					},
					null,
					2
				),
			],
			{
				type: "application/json",
			}
		);

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

	const importConfig = (data: {
		global?: TGlobalData;
		player?: TPlayerData;
	}) => {
		if (data.global) {
			global = data.global;
			socketSend("global", global);
		}

		if (data.player) {
			player = data.player;
			socketSend("player", player);
		}
	};
</script>

<header>
	<Actions>
		<GlobalSettings on:global={updateGlobal} />
		<Timer
			on:timer={(event) => {
				updateTimer(event.detail);
			}}
		/>
		<Preview title="Overlay" url="/overlay" button="Preview overlay" />
		<ResetState on:reset={resetGameState} />
		<FlipPlayers on:flip={flipGameState} />
		<SaveConfig
			on:save={saveConfig}
			on:import={(event) => importConfig(event.detail)}
		/>
	</Actions>
	<Actions>
		{#if $deploy.type === "manual"}
			<button
				on:click={() => {
					$deploy.proceed = true;
					socketSend("many", [
						{
							type: "global",
							data: global,
						},
						{
							type: "timer",
							data: timer,
						},
						{
							type: "playerOne",
							data: playerOneData,
						},
						{
							type: "playerTwo",
							data: playerTwoData,
						},
					]);
				}}>Deploy</button
			>
		{/if}

		<Connection />
	</Actions>
</header>

<style lang="scss">
	header {
		position: sticky;
		top: 0;
		padding: 1rem;
		background-color: rgba(3, 3, 3, 0.85);
		backdrop-filter: blur(5px);
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		grid-column: 1/-1;
		border-bottom: 1px solid #202020;
		z-index: 1;
	}
</style>
