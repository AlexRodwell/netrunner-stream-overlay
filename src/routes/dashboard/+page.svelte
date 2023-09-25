<script lang="ts">
	import { onMount } from "svelte";
	import cards from "$lib/data/cards.json";
	import { info } from "$lib/store";

	import * as Card from "$lib/components/ui/card";
	import { Button } from "$lib/components/ui/button";
	import type { PlayerData } from "$lib/types";
	import Side from "$lib/components/dashboard/Side.svelte";

	let selected: string[] = [];

	let data: Object<{ [key: "corp" | "runner"]: PlayerData }> = {
		corp: {
			clicks: 3,
			credits: 5,
			cards: selected,
		},
		runner: {
			clicks: 4,
			credits: 5,
			cards: [],
		},
	};

	// let socket: WebSocket;
	// onMount(() => {
	// 	socket = new WebSocket("ws://localhost:8080"); // Connect to your WebSocket server
	// });
</script>

<main>
	<div class=" grid grid-cols-2 gap-8">
		<Card.Root class="col-span-full">
			<Card.Header>
				<Card.Title>Command Center</Card.Title>
			</Card.Header>
			<Card.Content>
				<Button>Deploy</Button>
				<Button variant="outline">Undo changes</Button>
				<Button variant="outline">Reset counters</Button>
			</Card.Content>
		</Card.Root>
		<Side title="Corporation" bind:data={data.corp} />
		<Side title="Runner" bind:data={data.runner} />
	</div>

	{JSON.stringify(selected)}

	<!-- <div class="cards">
		{#each cards.data.slice(0, 15) as { title, code }, i}
			<img
				src={`https://static.nrdbassets.com/v1/large/{code}.jpg`.replace(
					"{code}",
					code
				)}
				alt={title}
				on:click={(e) => {
					if (!data.corp.cards.includes(code)) {
						e.target.classList.add("active");
						data.corp.cards = [...data.corp.cards, code];
					} else {
						e.target.classList.remove("active");
						data.corp.cards = [...data.corp.cards, code];
						data.corp.cards = data.corp.cards.filter(
							(e) => e !== code
						);
					}
				}}
			/>
		{/each}
	</div> -->
</main>

<style>
	main {
		width: 100vw;
		min-height: 100vh;
		padding: 5vw;
		gap: 1.5rem;
	}

	.cards {
		display: grid;
		grid-template-columns: repeat(6, 1fr);
		align-items: flex-start;
		align-content: flex-start;
	}

	p {
		grid-column: 1/-1;
		text-align: center;
	}

	:global(img.active) {
		transform: scale(1.05);
		border: 2px solid red;
		opacity: 1;
	}
</style>
