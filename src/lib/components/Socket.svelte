<script lang="ts">
	import { PUBLIC_WEBSOCKET } from "$env/static/public";
	import { onMount } from "svelte";
	import { globalData, playerData, timerData } from "$lib/store";

	let socket: WebSocket;
	let connection: boolean = false;

	onMount(() => {
		socket = new WebSocket(PUBLIC_WEBSOCKET);

		// Recieve and parse data from websocket
		socket.addEventListener("message", (event) => {
			let data = JSON.parse(event.data);

			let type = data._type;

			if (type === "player") {
				delete data["_type"];
				$playerData = data;
			} else if (type === "timer") {
				delete data["_type"];
				$timerData = data;
			} else if (type === "global") {
				delete data["_type"];
				$globalData = data;
			}

			console.log(type);
			console.log(data);
		});

		setInterval(() => {
			connection = socket.readyState === 1;

			// Refresh page if websocket connection is lost
			// if (!connection) {
			// 	window.location.reload();
			// }
		}, 2000);
	});
</script>

<slot />
