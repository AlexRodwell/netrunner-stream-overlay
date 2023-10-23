<script lang="ts">
	import "../app.scss";
	import { PUBLIC_WEBSOCKET } from "$env/static/public";
	import { onMount, setContext } from "svelte";
	import { globalData, playerData, timerData } from "$lib/store";

	let socket: WebSocket;

	onMount(() => {
		// if ("serviceWorker" in navigator) {
		// 	navigator.serviceWorker
		// 		.register("/service-worker.js")
		// 		.then((registration) => {
		// 			const serviceWorker = registration.active;

		// 			if (serviceWorker) {
		// 				console.log("here");

		// 				serviceWorker.addEventListener("message", (event) => {
		// 					const data = event.data;
		// 					console.log(data);

		// 					// Check for the status message from the service worker
		// 					if (data.status) {
		// 						if (data.status === "connected") {
		// 							console.log("WebSocket connected");
		// 							$globalData.websocket.status = true;
		// 						} else if (data.status === "disconnected") {
		// 							console.log("WebSocket disconnected");
		// 							$globalData.websocket.status = false;
		// 						}
		// 					}
		// 				});
		// 			}
		// 		});
		// }

		socket = new WebSocket(PUBLIC_WEBSOCKET);
		// setContext("websocket", socket);

		window.addEventListener("load", () => {
			$globalData.websocket.status = socket.readyState === 1;

			if (localStorage.getItem("global")) {
				$globalData = JSON.parse(localStorage.getItem("global"));
			}

			if (localStorage.getItem("player")) {
				$playerData = JSON.parse(localStorage.getItem("player"));
			}

			if (localStorage.getItem("timer")) {
				$timerData = JSON.parse(localStorage.getItem("timer"));
			}
		});

		setInterval(() => {
			// console.info(
			// 	"Socket connection:",
			// 	socket.readyState === 1 ? "✔️ Connected" : "❌ Disconnected"
			// );

			// if (socket.readyState !== 1) {
			// 	location.reload();
			// }

			$globalData.websocket.status = socket.readyState === 1;
		}, 500);

		// Recieve and parse data from websocket
		socket.addEventListener("message", (event) => {
			let data = JSON.parse(event.data);
			let type = data._type;
			delete data["_type"];

			if (type === "all") {
				$playerData = data.player;
				localStorage.setItem("player", JSON.stringify(data.player));
				$timerData = data.timer;
				localStorage.setItem("timer", JSON.stringify(data.timer));
				$globalData = data.global;
				localStorage.setItem("global", JSON.stringify(data.global));
			} else if (type === "player") {
				localStorage.setItem("player", JSON.stringify(data));
				$playerData = data;
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

<slot />
