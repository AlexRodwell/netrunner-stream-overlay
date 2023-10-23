<script lang="ts">
	import { PUBLIC_WEBSOCKET } from "$env/static/public";
	import { onMount } from "svelte";
	import { globalData, playerData, deploy } from "$lib/store";
	import type {
		GlobalData as TGlobalData,
		PlayerData as TPlayerData,
		TimerData as TTimerData,
		Side as TSide,
		PlayerAttributes,
	} from "$lib/types";
	import Side from "$lib/components/dashboard/Side.svelte";
	import Header from "$lib/components/dashboard/Header.svelte";

	let socket: WebSocket;
	let global: TGlobalData = $globalData;
	let player: TPlayerData = $playerData;

	onMount(() => {
		socket = new WebSocket(PUBLIC_WEBSOCKET);
	});

	const socketSend = (
		type: "many" | "global" | "player" | "timer",
		json:
			| Array<{
					type: string;
					data: TGlobalData | TPlayerData | TTimerData;
			  }>
			| TGlobalData
			| TPlayerData
			| TTimerData
	) => {
		console.log("-------------------------------------");
		console.info("type", $deploy.type);
		console.log("proceed", $deploy.proceed);

		if (type === "many" && Array.isArray(json)) {
			json.forEach(({ type, data }) => {
				socket.send(
					JSON.stringify({
						_type: type,
						...data,
					})
				);
			});
		} else if (
			$deploy.type === "automatic" ||
			($deploy.type === "manual" && $deploy.proceed)
		) {
			console.warn("firing socket");
			socket.send(
				JSON.stringify({
					_type: type,
					...json,
				})
			);
		}

		$deploy.proceed = false;
	};

	const updatePlayer = (newData: PlayerAttributes, player_side: TSide) => {
		console.info(
			`Updating player %c${player_side}:`,
			`background: ${
				player_side === "playerOne" ? "blue" : "red"
			}; color: white;`,
			newData
		);
		player[player_side] = newData;
		updateThreatLevel();

		socketSend("player", player);
	};

	const updateThreatLevel = () => {
		const playerOneAgendas = player.playerOne.agendas.amount;
		const playerTwoAgendas = player.playerTwo.agendas.amount;

		global.agendas_count =
			playerOneAgendas > playerTwoAgendas
				? playerOneAgendas
				: playerTwoAgendas;
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

		socketSend("player", player);
	};
</script>

<main class="dashboard">
	<Header {socketSend} />

	<section class="dashboard__content">
		<Side
			side="playerOne"
			on:playerdata={(event) => {
				updatePlayer(event.detail, "playerOne");
			}}
			on:deckSwap={swapDeck}
		/>

		<Side
			side="playerTwo"
			on:playerdata={(event) => {
				updatePlayer(event.detail, "playerTwo");
			}}
			on:deckSwap={swapDeck}
		/>
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
