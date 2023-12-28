<script lang="ts">
	import { PUBLIC_WEBSOCKET } from "$env/static/public";
	import { onMount } from "svelte";
	import {
		globalData,
		playerOneData,
		playerTwoData,
		deploy,
	} from "$lib/store";
	import type {
		PlayerAttributes as TPlayerAttributes,
		GlobalData as TGlobalData,
		TimerData as TTimerData,
		PlayerSide as TPlayerSide,
		GameSide as TGameSide,
	} from "$lib/types";
	import Player from "$components/dashboard/Player.svelte";
	import Header from "$components/dashboard/Header.svelte";

	let socket: WebSocket;
	let global: TGlobalData = $globalData;

	let players: {
		[key in "one" | "two"]: TPlayerSide;
	} = {
		one: "playerOne",
		two: "playerTwo",
	};

	onMount(() => {
		socket = new WebSocket(PUBLIC_WEBSOCKET);
	});

	const socketSend = (
		type: "many" | "global" | "playerOne" | "playerTwo" | "timer",
		json:
			| Array<{
					type: string;
					data: TGlobalData | TPlayerAttributes | TTimerData;
			  }>
			| TGlobalData
			| TPlayerAttributes
			| TTimerData,
	) => {
		try {
			if (type === "many" && Array.isArray(json)) {
				json.forEach(({ type, data }) => {
					socket.send(
						JSON.stringify({
							_type: type,
							...data,
						}),
					);
				});
			} else if (
				$deploy.type === "automatic" ||
				($deploy.type === "manual" && $deploy.proceed)
			) {
				socket.send(
					JSON.stringify({
						_type: type,
						...json,
					}),
				);
			}
		} catch (error) {
			alert("Failed to update");
		}

		$deploy.proceed = false;
	};

	const updatePlayer = (
		newData: PlayerAttributes,
		player_side: TPlayerSide,
	) => {
		console.info(
			`Updating player %c${player_side}:`,
			`background: ${
				player_side === players.one ? "blue" : "red"
			}; color: white;`,
			newData,
		);
		player[player_side] = newData;
		updateThreatLevel();

		socketSend(player_side, player);
	};

	const updateThreatLevel = () => {
		const playerOneAgendas: TPlayerAttributes =
			player[players.one].agendas.amount;
		const playerTwoAgendas: TPlayerAttributes =
			player[players.two].agendas.amount;

		global.agendas_count =
			playerOneAgendas > playerTwoAgendas
				? playerOneAgendas
				: playerTwoAgendas;
	};

	const swapDeck = (swap: {
		currentPlayer: TPlayerSide;
		selected: {
			active: TGameSide;
			inactive: TGameSide;
		};
	}) => {
		if (swap.currentPlayer === "playerOne") {
			$playerOneData.side = swap.selected.active;
			$playerTwoData.side = swap.selected.inactive;
			$playerOneData.decks[swap.selected.active].active = true;
			$playerOneData.decks[swap.selected.inactive].active = false;
			$playerTwoData.decks[swap.selected.active].active = false;
			$playerTwoData.decks[swap.selected.inactive].active = true;
			socketSend("playerOne", $playerOneData);
			socketSend("playerTwo", $playerTwoData);
		} else {
			$playerTwoData.side = swap.selected.active;
			$playerOneData.side = swap.selected.inactive;
			$playerTwoData.decks[swap.selected.active].active = true;
			$playerTwoData.decks[swap.selected.inactive].active = false;
			$playerOneData.decks[swap.selected.active].active = false;
			$playerOneData.decks[swap.selected.inactive].active = true;
			socketSend("playerTwo", $playerTwoData);
			socketSend("playerOne", $playerOneData);
		}
	};
</script>

<main class="dashboard">
	<!-- Pass the socketSend function as a property to header, so we can utilise the socket, without having to create a new WebSocket -->
	<Header {socketSend} />
	<section class="dashboard__content">
		<Player
			{socketSend}
			name="playerOne"
			on:playerdata={(event) => {
				updatePlayer(event.detail, "playerOne");
			}}
			on:deckSwap={(event) => {
				swapDeck(event.detail);
			}}
		/>
		<Player
			{socketSend}
			name="playerTwo"
			on:playerdata={(event) => {
				updatePlayer(event.detail, "playerTwo");
			}}
			on:deckSwap={(event) => {
				swapDeck(event.detail);
			}}
		/>
	</section>
</main>

<style lang="scss">
	:global(html) {
		scroll-behavior: smooth;
		font-size: 16px; // Fallback for clamp()
		font-size: clamp(
			0.875rem,
			0.8092rem + 0.2632vw,
			1.125rem
		); // Scales between 400-800px https://clamp.font-size.app/
	}

	:global(body) {
		color: #fff;
		background: #030303;
		overflow-x: hidden;
	}

	.dashboard {
		width: 100vw;
		min-height: 100vh;
		display: grid;
		grid-template-rows: auto 1fr;

		&__content {
			display: grid;
			grid-template-columns: repeat(1, minmax(0, 1fr));

			@media (min-width: 1200px) {
				grid-template-columns: repeat(2, minmax(0, 1fr));
			}

			:global(.side) {
				padding: 1.5rem;
			}

			:global(.side:first-of-type) {
				border-right: 1px solid #202020;
			}
		}
	}
</style>
