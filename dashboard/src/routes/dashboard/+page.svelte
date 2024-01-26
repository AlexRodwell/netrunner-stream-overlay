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
	import * as Card from "$lib/components/ui/card";

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

		// Deploy data (taken from held localStorage data)
		deploy_data();
	};

	const deploy_data = () => {
		console.clear();

		["global", "playerOne", "playerTwo", "timer"].forEach((type) => {
			// Return if hold_ value does not exist in localStorage
			if (
				localStorage.getItem(`hold_${type}`) === "undefined" ||
				localStorage.getItem(`hold_${type}`) === null ||
				Object.keys(JSON.parse(localStorage.getItem(`hold_${type}`)))
					.length === 0
			) {
				console.info(`Skipping ${type}`);
				return;
			}

			const hold = JSON.parse(localStorage.getItem(`hold_${type}`));
			console.info(`Deploying ${type} data:`, hold);

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
			localStorage.removeItem(`hold_${type}`);

			// Set deploy proceed state to false after a manual deployment
			if ($deploy.type === "manual") {
				$deploy.proceed = false;
			}
		});
	};
</script>

<main class="w-screen min-h-screen grid grid-rows-[auto_1fr]">
	<!-- Pass the deploy_data function as a property to header, so we can utilise the socket, without having to create a new WebSocket -->
	<Header update={store_data} />
	<section class="grid grid-cols-1 md:grid-cols-2 p-4 gap-4">
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
