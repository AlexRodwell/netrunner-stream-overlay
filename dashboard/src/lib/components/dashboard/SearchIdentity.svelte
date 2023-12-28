<script lang="ts">
	import { createEventDispatcher } from "svelte";
	import { netrunnerDB } from "$lib/store";
	import type {
		PlayerSide as TPlayerSide,
		GameSide as TGameSide,
		Card as TCard,
	} from "$lib/types";
	import Card from "../Card.svelte";
	import Fuse from "fuse.js";
	import { find_faction_by_id } from "$lib/utils";

	const dispatch = createEventDispatcher();

	export let player: TPlayerSide;
	export let side: TGameSide;

	let idListActive: boolean = false;
	let previous_side = side;

	// If user swaps side, empty results array
	$: if (previous_side !== side) {
		results = [];
	}

	let searchText: string = "";
	let results: any = [];
	let selected: any;

	function filterItems() {
		idListActive = true;

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

		<div class="id {idListActive ? 'id--active' : ''}">
			{#each results as { item: card }}
				<div class="id__item">
					<input
						type="radio"
						name="id_{player}_{side}"
						bind:group={selected}
						on:change={() => {
							dispatch("change", selected);
						}}
						value={card.attributes.stripped_title}
					/>
					<div class="id__item__count">
						<!-- svelte-ignore a11y-missing-attribute -->
						<img
							class="id__item__logo"
							src={find_faction_by_id(
								card.attributes.stripped_title,
							)?.logo}
						/>
						{card.attributes.stripped_title}
					</div>
				</div>
			{/each}
		</div>
	</div>
</section>

<style lang="scss">
	.search {
		width: 100%;

		&__wrapper {
			position: relative;
		}

		input:focus,
		input:focus-within {
			+ .id {
				visibility: visible;
			}
		}
	}

	.id {
		visibility: hidden;
		display: grid;
		gap: 0.25rem;
		max-height: 360px;
		overflow-x: auto;
		position: absolute;
		width: 100%;
		z-index: 1;
		background: #242424;
		padding: 0.25rem;

		&--active {
			visibility: visible;
		}

		// &:empty {
		// 	display: none;
		// }

		&__item {
			position: relative;
			cursor: pointer;

			&__count {
				border-radius: 0.125rem;
				display: flex;
				flex-direction: row;
				align-items: center;
				justify-content: flex-start;
				text-align: left;
				gap: 0.5rem;
				padding: 0.5rem;
				background: #121212;
			}

			&__logo {
				width: 32px;
			}

			input[type="radio"] {
				opacity: 0;
				cursor: pointer;

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
