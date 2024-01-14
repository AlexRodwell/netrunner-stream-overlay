<script lang="ts">
	import {
		PUBLIC_WEBSOCKET_CONNECTION,
		PUBLIC_WEBSOCKET_URL,
	} from "$env/static/public";
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

	let websocket = PUBLIC_WEBSOCKET_CONNECTION.toLowerCase() === "true";

	onMount(() => {
		if (websocket) {
			socket = new WebSocket(PUBLIC_WEBSOCKET_URL);
		}
	});

	/*

	const hold_json = () => {};

	const deploy_data = (
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

		// if (new Date() > new Date($deploy.last)) {
		// 	console.log("here 1");
		// 	$deploy.proceed = true;
		// }

		if ($deploy.proceed) {

			["global", "playerOne", "playerTwo", "timer"].forEach((type) => {

				if (
					Object.keys(
						JSON.parse(localStorage.getItem(`hold_${type}`)),
					).length === 0
				)
					return;

				const data = JSON.parse(localStorage.getItem(`hold_${type}`));

				console.log("========================");
				console.log("type", type);
				console.log(data);

				if (websocket) {
					try {
						socket.send(
							JSON.stringify({
								_type: type,
								...data,
							}),
						);
					} catch (error) {
						alert("Failed to update data via websocket");
					}
				}

				// Update the real value
				localStorage.setItem(type, JSON.stringify(data));
			});

			// Set deploy proceed state to false after a manual deployment
			if ($deploy.type === "manual") {
				$deploy.proceed = false;
			}
		} else {
			$deploy.last = new Date().toISOString();
		}
	};

	const update = (newData: PlayerAttributes, player_side: TPlayerSide) => {
		// console.info(
		// 	`Updating player %c${player_side}:`,
		// 	`background: ${
		// 		player_side === players.one ? "blue" : "red"
		// 	}; color: white;`,
		// 	newData,
		// );
		player[player_side] = newData;
		updateThreatLevel();

		deploy_data(player_side, player);
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

	*/

	const swap_deck = (swap: {
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
			store_data({
				type: "playerOne",
				data: $playerOneData,
			});
			store_data({
				type: "playerTwo",
				data: $playerTwoData,
			});
		} else {
			$playerTwoData.side = swap.selected.active;
			$playerOneData.side = swap.selected.inactive;
			$playerTwoData.decks[swap.selected.active].active = true;
			$playerTwoData.decks[swap.selected.inactive].active = false;
			$playerOneData.decks[swap.selected.active].active = false;
			$playerOneData.decks[swap.selected.inactive].active = true;
			store_data({
				type: "playerTwo",
				data: $playerTwoData,
			});
			store_data({
				type: "playerOne",
				data: $playerOneData,
			});
		}
	};

	///////////////////////////////////////////////////////////////////
	// NEW DATA HANDLER

	type DataTypeMap = {
		global: TGlobalData;
		playerOne: TPlayerAttributes;
		playerTwo: TPlayerAttributes;
		timer: TTimerData;
	};

	const store_data = (incoming: {
		type: keyof DataTypeMap;
		data: DataTypeMap[keyof DataTypeMap];
	}) => {
		const { type, data } = incoming;

		// Store data locally
		localStorage.setItem(`hold_${type}`, JSON.stringify(data));

		// Return early if proceed is not true, it will always be true for automatic, and only true for manual when the deploy button is clicked
		if ($deploy.proceed !== true) return;

		// if ($deploy.type === "manual") {
		// 	console.log("manual");
		// 	// deploy_data();
		// 	deploy_data();
		// } else {
		// 	console.log("automatic");
		// 	deploy_data();
		// }

		deploy_data();

		// Handle deploy state

		// Call a seperate function that actually deploys the data
	};

	const deploy_data = () => {
		["global", "playerOne", "playerTwo", "timer"].forEach((type) => {
			// Return if hold_ value does not exist in localStorage
			if (
				localStorage.getItem(`hold_${type}`) === null ||
				Object.keys(JSON.parse(localStorage.getItem(`hold_${type}`)))
					.length === 0
			) {
				console.log(`${type} hold data is empty, skipping...`);
				return;
			}

			const hold = JSON.parse(localStorage.getItem(`hold_${type}`));

			if (websocket) {
				try {
					socket.send(
						JSON.stringify({
							_type: type,
							...hold,
						}),
					);
				} catch (error) {
					alert("Failed to update data via websocket");
				}
			}

			// Update the real value
			localStorage.setItem(type, JSON.stringify(hold));

			// Remove hold value
			// localStorage.removeItem(`hold_${type}`);

			// Set deploy proceed state to false after a manual deployment
			if ($deploy.type === "manual") {
				$deploy.proceed = false;
			}
		});
	};
</script>

<main class="dashboard">
	<!-- Pass the deploy_data function as a property to header, so we can utilise the socket, without having to create a new WebSocket -->
	<Header update={store_data} />
	<section class="dashboard__content">
		<Player
			update={store_data}
			name="playerOne"
			on:swap_deck={(event) => swap_deck(event.detail)}
		/>
		<Player
			update={store_data}
			name="playerTwo"
			on:swap_deck={(event) => swap_deck(event.detail)}
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
