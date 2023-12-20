<script lang="ts">
	import "../app.scss";
	import { PUBLIC_WEBSOCKET } from "$env/static/public";
	import { onMount } from "svelte";
	import {
		netrunnerDB,
		globalData,
		playerOneData,
		playerTwoData,
		timerData,
	} from "$lib/store";
	import api from "$lib/data/api.json";
	import Loading from "$components/Loading.svelte";
	import { page } from "$app/stores";

	let socket: WebSocket;
	let initialising: boolean = true;

	onMount(async () => {
		socket = new WebSocket(PUBLIC_WEBSOCKET);

		window.addEventListener("load", async () => {
			console.info("✔️ Window loaded");

			try {
				const response = await fetch(api.endpoint + api.cards);

				if (!response.ok) {
					throw new Error("Network response was not ok");
				}

				const data = await response.json();

				initialising = false;
				$netrunnerDB = data;
			} catch (error) {
				console.error("Error fetching data:", error);
			}

			$globalData.websocket.status = socket.readyState === 1;

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
		});

		setInterval(() => {
			// console.info(
			// 	"Socket connection:",
			// 	socket.readyState === 1 ? "✔️ Connected" : "❌ Disconnected"
			// );

			$globalData.websocket.status = socket.readyState === 1;
		}, 1000);

		// Recieve and parse data from websocket
		socket.addEventListener("message", (event) => {
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

{#if !initialising}
	<slot />
{:else}
	<div class="initialising">
		<Loading
			fill={$page.url.pathname !== "/dashboard" ? "black" : "white"}
			size="2rem"
		/>
		<h2>Initialising</h2>
	</div>
{/if}

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
