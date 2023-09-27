<!-- src/routes/Search.svelte -->
<script lang="ts">
	import { createEventDispatcher } from "svelte";
	import CardsData from "$lib/data/cards.json";
	import Card from "../Card.svelte";

	export let limit: 1 | "uncapped" = 1; // Define how many cards can be selected

	const dispatch = createEventDispatcher();

	let searchText = "";
	let results = [];
	let selected: string[] | string = []; // Handle either an array of strings (codes) or a singular code (string)

	function filterItems() {
		const searchTextLowerCase = searchText.toLowerCase();

		results = CardsData.data.filter((item) =>
			item.stripped_title.toLowerCase().includes(searchTextLowerCase)
		);
	}

	function cardSelected(code: string) {
		console.log(limit);

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

{JSON.stringify(selected)}

<input
	type="text"
	bind:value={searchText}
	placeholder="Search..."
	on:input={filterItems}
/>

<div class="search">
	{#each results as item (item.code)}
		<!-- Use a unique identifier as the key -->
		<button
			class="search__item {selected.includes(item.code)
				? 'search__item--active'
				: ''}"
			on:click={() => {
				cardSelected(item.code);
			}}
		>
			<Card code={item.code} side="Runner" />
			{item.stripped_title}
		</button>
	{:else}
		<p>No results found</p>
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

		img {
			width: 100%;
		}
	}
</style>
