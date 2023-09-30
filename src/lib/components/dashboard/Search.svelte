<!-- src/routes/Search.svelte -->
<script lang="ts">
	import { createEventDispatcher } from "svelte";
	import CardsData from "$lib/data/cards.json";
	import Card from "../Card.svelte";
	import Loading from "../Loading.svelte";

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
			<Card code={item.code} />
			{item.stripped_title}
		</button>
	{:else}
		<div class="search__no">
			<Loading />
			<p>Waitng for input</p>
		</div>
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
