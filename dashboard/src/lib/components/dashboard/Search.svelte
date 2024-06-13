<script lang="ts">
	import { createEventDispatcher } from "svelte";
	import { netrunnerDB, playerOneData, playerTwoData } from "$lib/store";
	import type {
		Card as TCard,
		PlayerAttributes as TPlayerAttributes,
		GameSide as TGameSide,
		PlayerSide as TPlayerSide,
	} from "$lib/types";
	import Card from "../Card.svelte";
	import Fuse from "fuse.js";
	import { Input } from "$lib/components/ui/input";
	import { Label } from "$lib/components/ui/label";

	const dispatch = createEventDispatcher();

	export let side: TGameSide;
	export let name: TPlayerSide;
	export let type: "primary" | "secondary";

	let previous_side = side;

	// If user swaps side, empty results array
	$: if (previous_side !== side) {
		results = [];
	}

	$: player = name === "playerOne" ? $playerOneData : $playerTwoData;
	let searchText: string = "";
	let results: any = [];
	let selected: string[] = [];

	const filter = () => {
		results = new Fuse($netrunnerDB.data.filter((i: any) => true), {
			keys: ["attributes.title", "attributes.stripped_title"]
		})
		.search(searchText)
		.slice(0, 8);
	}
</script>

<section class="grid grid-cols-[1fr,3fr] gap-6">
	<div>
		<Card code={player.highlight[type].current} glow={false} class="sticky top-16" />
	</div>
	<div class="grid gap-4">
		<Input
			type="text"
			bind:value={searchText}
			placeholder="Search..."
			on:input={filter}
		/>

		<div class="grid grid-cols-4 gap-4">
			{#each results as { item: card }}
				<button
					class="grid content-start {selected.includes(
						card.attributes.latest_printing_id,
					)
						? 'result--active'
						: ''}"
					on:click={() => dispatch("card", card.attributes.latest_printing_id)}
				>
					<Card
						code={card.attributes.latest_printing_id}
						glow={false}
					/>
					<p class="text-left line-clamp-2">{card.attributes.stripped_title}</p>
				</button>
			{/each}
		</div>
	</div>
</section>