<script lang="ts">
	import "../app.pcss";
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
	let storage_keys: string[] = ["global", "playerOne", "playerTwo", "timer"];

	onMount(async () => {
		console.info("✔️ Window loaded");

		if (!localStorage.getItem("language")) {
			localStorage.setItem(
				"language",
				navigator.language.substring(0, 2),
			);
		}

		// If session token does not exist, clear localStorage, to ensure any old data is removed and does not cause any errors
		if (!sessionStorage.getItem("session_token")) {
			storage_keys.forEach((type) => {
				localStorage.removeItem(type);
			});

			// Store session token for later onMount reference
			sessionStorage.setItem(
				"session_token",
				Math.floor(Math.random() * Math.pow(10, 10)).toString(),
			);
		}

		// Persistant storage
		storage_keys.forEach((type) => {
			if (
				JSON.parse(localStorage.getItem(type)) !== null &&
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

				storage_keys.forEach((type) => {
					if (
						localStorage.getItem(type) === null ||
						Object.keys(JSON.parse(localStorage.getItem(type)))
							.length === 0
					) {
						console.log(`${type} data is funky, skipping...`);
						return;
					}

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
				});
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
