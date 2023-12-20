<!-- src/routes/Search.svelte -->
<script lang="ts">
	import { createEventDispatcher } from "svelte";
	import { netrunnerDB } from "$lib/store";
	import type { GameSide as TGameSide, Card as TCard } from "$lib/types";
	import Card from "../Card.svelte";
	import Fuse from "fuse.js";

	const dispatch = createEventDispatcher();

	export let side: TGameSide;

	let previous_side = side;

	// If user swaps side, empty results array
	$: if (previous_side !== side) {
		results = [];
	}

	let searchText: string = "";
	let results: any = [];
	let selected: any;

	function filterItems() {
		results = new Fuse(
			$netrunnerDB.data.filter(
				(card: TCard) =>
					card.attributes.side_id === side &&
					card.attributes.card_type_id === `${side}_identity`,
			),
			{
				// Filter by title and stripped_title
				keys: ["attributes.title", "attributes.stripped_title"],
			},
		)
			.search(searchText)
			.slice(0, 8);
	}
</script>

<section class="search">
	<div class="search__wrapper">
		<input
			type="text"
			bind:value={searchText}
			placeholder="Search..."
			on:input={filterItems}
		/>

		<div class="id">
			{#each results as { item: card }}
				<div class="id__item">
					<input
						type="radio"
						name="id_{side}"
						bind:group={selected}
						on:change={() => {
							dispatch("change", selected);
						}}
						value={card.attributes.stripped_title}
					/>
					<div class="id__item__count">
						{card.attributes.stripped_title}
					</div>
				</div>
			{/each}
		</div>
	</div>
</section>

<style lang="scss">
	.id {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 0.5rem;

		&__item {
			position: relative;
			cursor: pointer;

			&__count {
				border-radius: 0.125rem;
				display: flex;
				flex-direction: row;
				align-items: center;
				justify-content: center;
				text-align: center;
				gap: 0.5rem;
				padding: 0.5rem;
				background: #121212;
			}

			input[type="radio"] {
				opacity: 0;

				&:checked ~ .id__item__count {
					background: #fff;
					color: #000;
				}
			}

			input[type="radio"],
			&:after {
				position: absolute;
				width: 100%;
				height: 100%;
			}

			&:after {
				content: "";
			}

			&:checked:after {
				background: red;
			}
		}
	}
</style>
