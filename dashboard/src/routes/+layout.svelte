<script lang="ts">
	import "../app.scss";
	import { PUBLIC_WEBSOCKET } from "$env/static/public";
	import { onMount } from "svelte";
	import {
		globalData,
		playerOneData,
		playerTwoData,
		timerData,
	} from "$lib/store";
	import Loading from "$components/Loading.svelte";
	import { page } from "$app/stores";
	import { fetch_cards } from "$lib/utils";

	let socket: WebSocket;

	onMount(async () => {
		socket = new WebSocket(PUBLIC_WEBSOCKET);
		console.info("✔️ Window loaded");

		// TODO: Fix, this does not properly await the fetch_cards logic, so there's a chance it breaks
		setTimeout(() => {
			$globalData.websocket.status = socket.readyState === 1;
		}, 2000);

		// Persistant storage
		["global", "playerOne", "playerTwo", "timer"].forEach((type) => {
			const store = localStorage.getItem(type);

			if (store && typeof JSON.parse(store) === "object") {
				console.info(
					`✔️ Loaded %c${type}%cdata from localStorage`,
					"background: blue",
				);

				// Update svelte store with cached (localStorage) data
				switch (type) {
					case "global":
						$globalData = JSON.parse(store);
						break;
					case "playerOne":
						$playerOneData = JSON.parse(store);
						break;
					case "playerTwo":
						$playerTwoData = JSON.parse(store);
						break;
					case "timer":
						$timerData = JSON.parse(store);
						break;
				}
			}
		});

		// Recieve and parse data from websocket
		socket.addEventListener("message", (event) => {
			console.log(
				"recieving websocket connection...",
				JSON.parse(event.data),
			);

			let data = JSON.parse(event.data);
			let type = data._type;
			delete data["_type"];

			if (type === "playerOne") {
				localStorage.setItem("playerOne", JSON.stringify(data));
				$playerOneData = data;
			} else if (type === "playerTwo") {
				localStorage.setItem("playerTwo", JSON.stringify(data));
				$playerTwoData = data;
			} else if (type === "timer") {
				localStorage.setItem("timer", JSON.stringify(data));
				$timerData = data;
			} else if (type === "global") {
				localStorage.setItem("global", JSON.stringify(data));
				$globalData = data;
			}
		});
	});
</script>

<svelte:head>
	<meta name="viewport" content="width=device-width, initial-scale=1.0" />
	<link rel="preconnect" href="https://static.nrdbassets.com/" />
</svelte:head>

{#await fetch_cards()}
	<div class="initialising">
		<Loading
			fill={$page.url.pathname !== "/dashboard" ? "black" : "white"}
			size="2rem"
		/>
		<h2>Initialising</h2>
	</div>
{:then}
	<slot />
{:catch}
	<div class="initialising">
		<h2>Error</h2>
	</div>
{/await}

<style lang="scss">
	.initialising {
		width: 100vw;
		height: 100vh;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		text-align: center;
		gap: 0.5rem;
	}
</style>
