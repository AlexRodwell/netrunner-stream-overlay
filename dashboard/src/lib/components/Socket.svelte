<script lang="ts">
	import { PUBLIC_WEBSOCKET } from "$env/static/public";
	import { beforeUpdate, onMount } from "svelte";
	import { globalData, playerData, timerData } from "$lib/store";

	let socket: WebSocket;
	let connection: boolean = false;

	beforeUpdate(() => {
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

	onMount(() => {
		socket = new WebSocket(PUBLIC_WEBSOCKET);

		// Recieve and parse data from websocket
		socket.addEventListener("message", (event) => {
			let data = JSON.parse(event.data);
			let type = data._type;

			if (type === "player") {
				delete data["_type"];
				localStorage.setItem("player", JSON.stringify(data));
				$playerData = data;
			} else if (type === "timer") {
				delete data["_type"];
				localStorage.setItem("timer", JSON.stringify(data));
				$timerData = data;
			} else if (type === "global") {
				delete data["_type"];
				localStorage.setItem("global", JSON.stringify(data));
				$globalData = data;
			}
		});
	});
</script>

<slot />
