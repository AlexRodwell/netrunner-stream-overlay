<script lang="ts">
	import { onMount } from "svelte";
	import { info } from "$lib/store";
	import Cards from "$lib/components/Cards.svelte";
	import Overlay from "$lib/components/Overlay.svelte";

	let socket: WebSocket;

	onMount(() => {
		socket = new WebSocket("ws://localhost:8080");

		// Recover previously stored data from localStorage
		$info = {
			corp: JSON.parse(localStorage.getItem("corp")),
			runner: JSON.parse(localStorage.getItem("runner")),
		};

		socket.addEventListener("message", (event) => {
			console.log("recieved websocket connection...");

			let data = JSON.parse(event.data);

			if (data["corp"]) {
				$info["corp"] = data["corp"];
				localStorage.setItem("corp", JSON.stringify(data["corp"]));
			} else {
				$info["runner"] = data["runner"];
				localStorage.setItem("runner", JSON.stringify(data["runner"]));
			}
		});
	});
</script>

<Overlay />

<main class="flex flex-col justify-center items-center gap-4 p-20">
	<Cards />
</main>
