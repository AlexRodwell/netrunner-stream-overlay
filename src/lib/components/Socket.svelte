<script lang="ts">
	import { onMount } from "svelte";
	import { globalData, playerData, timerData } from "$lib/store";

	let socket: WebSocket;
	let connection: boolean = false;

	onMount(() => {
		// Connect to websocket server
		socket = new WebSocket("ws://localhost:8080");

		// Recieve and parse data from websocket
		socket.addEventListener("message", (event) => {
			let data = JSON.parse(event.data);

			let type = data._type;

			if (type === "player") {
				delete data["_type"];
				console.log(data);
				$playerData = data;
			} else if (type === "timer") {
				delete data["_type"];
				console.log(data);
				$timerData = data;
			} else if (type === "global") {
				delete data["_type"];
				console.log(data);
				$globalData = data;
			}
		});

		setInterval(() => {
			connection = socket.readyState === 1;

			// Refresh page if websocket connection is lost
			if (!connection) {
				window.location.reload();
			}
		}, 2000);
	});
</script>

<slot />
