<!-- src/routes/Search.svelte -->
<script lang="ts">
	import { createEventDispatcher, getContext } from "svelte";
	import { playerData } from "$lib/store";
	import type {
		PlayerAttributes as TPlayerAttributes,
		Side as TSide,
	} from "$lib/types";
	import CardsData from "$lib/data/cards.json";
	import Card from "../Card.svelte";
	import ICON_CREDIT from "$lib/assets/icons/NSG_CREDIT.svg";
	import ICON_MEMORY from "$lib/assets/icons/NSG_Mu.svg";
	import Fuse from "fuse.js";
	import Button from "./ui/Button.svelte";

	const dispatch = createEventDispatcher();

	const fuse = new Fuse(CardsData.data, {
		keys: ["title", "stripped_title", "flavor"],
	});

	let side: TSide = getContext("side");
	$: player = $playerData[side];
	let searchText = "";
	// let results: Array<TCard> = [];
	let results: any = [];
	let previous: string | null = player?.highlight.previous || null;
	$: selected = player?.highlight.current || "";

	function filterItems() {
		const searchTextLowerCase = searchText;

		results = fuse.search(searchTextLowerCase).slice(0, 6);
	}

	function cardSelected(code: string) {
		previous = selected;

		// Remove card if selected is clicked again
		if (selected === code) {
			selected = null;
		} else {
			selected = code;
		}

		// Multiple ID's
		// else if (limit === "uncapped") {
		// 	selected = [...selected, code];
		// }
		// // Singular ID
		// else {
		// 	selected = [code];
		// }

		dispatch("card", {
			current: selected,
			previous: previous,
		});
	}
</script>

<h1>{side} - {JSON.stringify(player.highlight)}</h1>

{#if selected}
	<p>
		Currently selected: {CardsData.data.find(
			(card) => card.code === selected
		)?.stripped_title} ({selected})
	</p>
{/if}

<section class="search">
	<div
		class="search__selected {!selected ? 'search__selected--disabled' : ''}"
	>
		{#if selected}
			<Card code={selected} />
		{/if}
	</div>
	<div class="search__wrapper">
		<input
			type="text"
			bind:value={searchText}
			placeholder="Search..."
			on:input={filterItems}
		/>

		<div class="search__results">
			{#each results.slice(0, 6) as { item: card }}
				<Button
					class="search__results__item {selected === card.code
						? 'search__results__item--active'
						: ''}"
					on:click={() => {
						cardSelected(card.code);
					}}
				>
					<div class="search__results__item__card">
						<Card code={card.code} />
					</div>
					<div>
						<strong>{card.stripped_title}</strong>

						{#if false}
							{#if card.side_code}
								<p>
									<!-- <img src={} /> -->
									Side: {card.side_code}
								</p>
							{/if}

							{#if card.cost}
								<p>
									<!-- svelte-ignore a11y-missing-attribute -->
									<img class="icon" src={ICON_CREDIT} />
									cost: {card.cost}
								</p>
							{/if}

							{#if card.memory_cost}
								<p>
									<!-- svelte-ignore a11y-missing-attribute -->
									<img class="icon" src={ICON_MEMORY} />
									memory_cost: {card.memory_cost}
								</p>
							{/if}

							{#if card.deck_limit}
								<p>
									<!-- <img src={} /> -->
									Deck limit: {card.deck_limit}
								</p>
							{/if}
						{/if}
					</div>
				</Button>
			{/each}
		</div>
	</div>
</section>

<style lang="scss">
	.search {
		display: grid;
		grid-template-columns: 140px 1fr;
		gap: 1rem;
		transition: 120ms ease;

		&:hover {
			grid-template-columns: 80px 4fr;

			.search__selected {
				mask-image: linear-gradient(
					to right,
					black 0%,
					transparent 100%
				);
			}
		}

		&__selected {
			height: 100%;
			position: relative;
			z-index: -1;
			width: 140px;
			height: auto;
			aspect-ratio: 64/89;
			mask-image: linear-gradient(to right, black 0%, black 100%);

			&--disabled {
				border: 1px dashed #282828;
				background: #121212;
				border-radius: 4%;
			}

			:global(.card) {
				position: absolute;
				left: 0;
				top: 0;
				width: 100%;
			}
		}

		&__wrapper {
			display: grid;
			gap: 0.5rem;
			align-items: flex-start;
		}

		&__results {
			display: flex; // grid;
			gap: 1rem;
			flex-direction: row;
			// grid-template-columns: repeat(2, minmax(0, 1fr));

			&__item {
				display: grid;
				gap: 0.5rem;
				// grid-template-columns: max(60px) 4fr;
				align-items: flex-end;
				width: 100%;
				padding: 0.5rem;
				padding-bottom: unset;
				border-radius: 2px;
				border: 1px solid #262626;
				background-color: #202020;
				color: #fff;
				text-align: left;

				&__card {
					position: relative;
					height: 100%;
					overflow: hidden;

					// :global(.card) {
					// 	position: absolute;
					// 	top: 0;
					// 	left: 0;
					// 	right: 0;
					// 	width: 100%;
					// }

					+ div {
						padding-bottom: 0.5rem;
					}
				}

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
	}
</style>
