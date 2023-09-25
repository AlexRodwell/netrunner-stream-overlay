<script lang="ts">
	import Input from "$lib/components/ui/input/input.svelte";
	import Label from "$lib/components/ui/label/label.svelte";
	import { Button } from "$lib/components/ui/button";
	import * as Card from "$lib/components/ui/card";
	import * as Select from "$lib/components/ui/select";
	import IconClick from "$lib/assets/icons/click.svg";
	import IconCredit from "$lib/assets/icons/credit.svg";
	import type { Attributes } from "$lib/types";
	import FactionsData from "$lib/data/factions.json";
	import CardsData from "$lib/data/cards.json";
	import { onMount } from "svelte";
	import SearchCards from "$lib/components/dashboard/SearchCards.svelte";

	export let title: "Corporation" | "Runner";
	let socket: WebSocket;

	onMount(() => {
		socket = new WebSocket("ws://localhost:8080"); // Connect to your WebSocket server
	});

	let max_clicks = title === "Runner" ? 3 : 4;

	let data: Attributes =
		title == "Corporation"
			? {
					name: "Jinteki",
					clicks: 3,
					credits: 5,
					cards: [],
			  }
			: {
					name: "Anarch",
					clicks: 4,
					credits: 5,
					cards: [],
			  };

	function submit() {
		console.log(data);
		socket.send(
			title == "Corporation"
				? JSON.stringify({ corp: data })
				: JSON.stringify({ runner: data })
		);
	}

	$: factions = FactionsData.filter((obj) => obj.side === title);
</script>

<Card.Root>
	<Card.Header>
		<Card.Title>{title}</Card.Title>
	</Card.Header>
	<Card.Content>
		<!-- <Side side="corp" bind:data={data} />
			<Side side="runner" bind:data={data.runner} /> -->
		<form>
			<div class="grid w-full items-center gap-4">
				<div class="flex flex-col space-y-1.5">
					<Select.Root
						onSelectedChange={(e) => (data.name = e.value)}
					>
						<Select.Trigger>
							<Select.Value placeholder="Select Faction" />
						</Select.Trigger>
						<Select.Content>
							{#each factions as faction, index}
								<Select.Item value={faction.name}>
									<img class="w-[20px]" src={faction.logo} />
									{faction.name}
								</Select.Item>
							{/each}
						</Select.Content>
					</Select.Root>
				</div>

				<div class="flex flex-col space-y-1.5">
					<Label
						for="name"
						class="flex flex-row justify-content-start items-center gap-1"
					>
						<img class="fill-white w-3.5 h-3.5" src={IconClick} />
						Clicks
					</Label>
					<div class="flex flex-row gap-2">
						<Input
							type="number"
							min={1}
							max={max_clicks}
							bind:value={data.clicks}
						/>
						<Button
							variant="outline"
							on:click={() => {
								data.clicks - 1 >= 0 ? data.clicks-- : false;
							}}>-</Button
						>
						<Button
							variant="outline"
							on:click={() => {
								data.clicks + 1 <= max_clicks
									? data.clicks++
									: false;
							}}>+</Button
						>
					</div>
				</div>
				<div class="flex flex-col space-y-1.5">
					<Label
						for="name"
						class="flex flex-row justify-content-start items-center gap-1"
					>
						<img class="fill-white w-3.5 h-3.5" src={IconCredit} />
						Credits
					</Label>
					<div class="flex flex-row gap-2">
						<Input type="number" bind:value={data.credits} />
						<Button
							variant="outline"
							on:click={() => {
								data.credits - 1 >= 0 ? data.credits-- : false;
							}}>-</Button
						>
						<Button
							variant="outline"
							on:click={() => {
								data.credits++;
							}}>+</Button
						>
					</div>
				</div>

				<div class="flex flex-col space-y-1.5">
					<Label
						for="name"
						class="flex flex-row justify-content-start items-center gap-1"
					>
						Cards
					</Label>
					<SearchCards />
				</div>
			</div>
		</form>
	</Card.Content>
	<Card.Footer class="flex justify-between">
		<!-- <Button variant="outline">Cancel</Button> -->
		<Button on:click={submit}>Deploy</Button>
	</Card.Footer>
</Card.Root>
