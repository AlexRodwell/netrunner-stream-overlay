<script lang="ts">
	import "../app.pcss";
	// import "../app.scss";
	import {
		PUBLIC_WEBSOCKET_CONNECTION,
		PUBLIC_WEBSOCKET_URL,
	} from "$env/static/public";
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
		console.info("✔️ Window loaded");

		// Persistant storage
		["global", "playerOne", "playerTwo", "timer"].forEach((type) => {
			if (
				Object.keys(JSON.parse(localStorage.getItem(type))).length === 0
			)
				return;

			const store = JSON.parse(localStorage.getItem(type));

			if (store && typeof store === "object") {
				// console.info(
				// 	`✔️ Loaded %c${type}%cdata from localStorage`,
				// 	"background: blue",
				// );

				// Update svelte store with cached (localStorage) data
				if (store) {
					switch (type) {
						case "global":
							$globalData = store;
							break;
						case "playerOne":
							$playerOneData = store;
							break;
						case "playerTwo":
							$playerTwoData = store;
							break;
						case "timer":
							$timerData = store;
							break;
					}
				}
			}
		});

		// Recieve and parse data from websocket
		if (PUBLIC_WEBSOCKET_CONNECTION.toLowerCase() === "true") {
			socket = new WebSocket(PUBLIC_WEBSOCKET_URL);

			// TODO: Fix, this does not properly await the fetch_cards logic, so there's a chance it breaks
			setTimeout(() => {
				$globalData.websocket.status = socket.readyState === 1;
			}, 2000);

			socket.addEventListener("message", (event) => {
				console.log(
					"recieving websocket connection...",
					JSON.parse(event.data),
				);

				let data = JSON.parse(event.data);
				let type = data._type;
				delete data["_type"];

				if (type === "playerOne") {
					// localStorage.setItem("playerOne", JSON.stringify(data));
					$playerOneData = data;
				} else if (type === "playerTwo") {
					// localStorage.setItem("playerTwo", JSON.stringify(data));
					$playerTwoData = data;
				} else if (type === "timer") {
					// localStorage.setItem("timer", JSON.stringify(data));
					$timerData = data;
				} else if (type === "global") {
					// localStorage.setItem("global", JSON.stringify(data));
					$globalData = data;
				}
			});
		}

		//
		else {
			window.addEventListener("storage", () => {
				console.info("localStorage change detected");

				["global", "playerOne", "playerTwo", "timer"].forEach(
					(type) => {
						const store = JSON.parse(localStorage.getItem(type));

						if (store) {
							switch (type) {
								case "global":
									$globalData = store;
									break;
								case "playerOne":
									$playerOneData = store;
									break;
								case "playerTwo":
									$playerTwoData = store;
									break;
								case "timer":
									$timerData = store;
									break;
							}
						}
					},
				);
			});
		}
	});
</script>

<svelte:head>
	<meta name="viewport" content="width=device-width, initial-scale=1.0" />
	<link rel="preconnect" href="https://static.nrdbassets.com/" />
</svelte:head>

{#await fetch_cards()}
	{#if !$page.url.pathname.includes("/overlay")}
		<div
			class="w-[100vw] h-[100vh] flex flex-col justify-center items-center text-center gap-2"
		>
			<Loading fill="white" size="2rem"></Loading>
			<h2>Initialising</h2>
		</div>
	{/if}
{:then}
	<slot />
{/await}
