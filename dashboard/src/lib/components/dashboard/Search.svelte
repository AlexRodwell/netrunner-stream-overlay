<!-- src/routes/Search.svelte -->
<script lang="ts">
	import { createEventDispatcher } from "svelte";
	import type { Card as TCard } from "$lib/types";
	import CardsData from "$lib/data/cards.json";
	import Card from "../Card.svelte";
	import ICON_CREDIT from "$lib/assets/icons/NSG_CREDIT.svg";
	import ICON_MEMORY from "$lib/assets/icons/NSG_Mu.svg";

	export let limit: 1 | "uncapped" = 1; // Define how many cards can be selected

	const dispatch = createEventDispatcher();

	let searchText = "";
	let results: Array<TCard> = [];
	let selected: string[] | string = []; // Handle either an array of strings (codes) or a singular code (string)

	function filterItems() {
		const searchTextLowerCase = searchText.toLowerCase();

		results = CardsData.data.filter((item) =>
			item.stripped_title.toLowerCase().includes(searchTextLowerCase)
		);
	}

	function cardSelected(code: string) {
		// Remove card if selected is clicked again
		if (selected.includes(code)) {
			selected = [];
		}

		// Multiple ID's
		if (limit === "uncapped") {
			selected = [...selected, code];
		}
		// Singular ID
		else {
			selected = [code];
		}

		dispatch("card", selected);
	}
</script>

{#if selected.length > 0}
	<p>
		Currently selected: {CardsData.data.find(
			(card) => card.code === selected[0]
		)?.stripped_title} ({selected[0]})
	</p>
{/if}

<input
	type="text"
	bind:value={searchText}
	placeholder="Search..."
	on:input={filterItems}
/>

<div class="search">
	{#if selected.length > 0}
		<div class="search__active">
			{#each selected as code}
				<Card {code} />
			{/each}
		</div>
	{/if}

	{#each results.slice(0, 6) as item (item.code)}
		<!-- Use a unique identifier as the key -->
		<button
			class="search__item {selected.includes(item.code)
				? 'search__item--active'
				: ''}"
			on:click={() => {
				cardSelected(item.code);
			}}
		>
			<Card code={item.code} />
			<div>
				<strong>{item.stripped_title}</strong>

				{#if item.side_code}
					<p>
						<!-- <img src={} /> -->
						Side: {item.side_code}
					</p>
				{/if}

				{#if item.cost}
					<p>
						<!-- svelte-ignore a11y-missing-attribute -->
						<img class="icon" src={ICON_CREDIT} />
						cost: {item.cost}
					</p>
				{/if}

				{#if item.memory_cost}
					<p>
						<!-- svelte-ignore a11y-missing-attribute -->
						<img class="icon" src={ICON_MEMORY} />
						memory_cost: {item.memory_cost}
					</p>
				{/if}

				{#if item.deck_limit}
					<p>
						<!-- <img src={} /> -->
						Deck limit: {item.deck_limit}
					</p>
				{/if}
			</div>
		</button>
	{/each}
</div>

<style lang="scss">
	.search {
		display: grid;
		gap: 0.5rem;
		grid-template-columns: repeat(2, minmax(0, 1fr));

		&__item {
			display: grid;
			gap: 0.5rem;
			grid-template-columns: max(60px) 4fr;
			width: 100%;
			padding: 0.5rem;
			border-radius: 2px;
			border: 1px solid #262626;
			background-color: #202020;
			color: #fff;
			text-align: left;

			&--active {
				background: red;
			}

			&:not(&--active):hover {
				background-color: #282828;
			}
		}

		&__active {
			width: 180px;
		}

		img {
			width: 100%;
		}

		.icon {
			width: 1rem;
			height: 1rem;
		}

		&__no {
			grid-column: 1/-1;
			width: 100%;
			display: flex;
			flex-direction: row;
			justify-content: center;
			align-items: center;
			gap: 0.5rem;
		}

		:global(.loading) {
			width: 1.5rem;
			height: 1.5rem;
			border-width: 0.125rem;
		}
	}
</style>
