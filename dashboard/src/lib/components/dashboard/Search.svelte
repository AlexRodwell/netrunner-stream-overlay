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

	const dispatch = createEventDispatcher();

	export let side: TGameSide;
	export let name: TPlayerSide;

	let previous_side = side;

	// If user swaps side, empty results array
	$: if (previous_side !== side) {
		results = [];
	}

	$: player = name === "playerOne" ? $playerOneData : $playerTwoData;
	let searchText: string = "";
	let results: any = [];
	let selected: string[] = [];

	function filterItems() {
		results = new Fuse(
			// Only return an array of cards for the current users side
			$netrunnerDB.data.filter(
				(card) => card.attributes.side_id === side,
			),
			{
				// Filter by title and stripped_title
				keys: ["attributes.title", "attributes.stripped_title"],
			},
		)
			.search(searchText)
			.slice(0, 8);
	}

	function queue(code: string) {
		if (selected.includes(code)) {
			selected = [];
		} else {
			selected = [code];
		}

		if (player.highlight.active) {
			dispatch("card", selected);
		}
	}
</script>

<section class="search">
	<div class="search__selected" data-disabled={!selected}>
		{#if player.highlight.cards && player.highlight.cards.at(-1)}
			<Card code={player.highlight.cards.at(-1)} glow={false} />
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
			{#each results as { item: card }}
				<button
					class="result {selected.includes(
						card.attributes.latest_printing_id,
					)
						? 'result--active'
						: ''}"
					on:click={() => queue(card.attributes.latest_printing_id)}
				>
					<Card
						code={card.attributes.latest_printing_id}
						glow={false}
					/>
					<div class="result__title">
						<p>{card.attributes.stripped_title}</p>
					</div>
				</button>
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
		margin-top: 0.5rem;

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
			// display: grid;
			// gap: 1rem;
			// flex-direction: row;
			// grid-template-columns: repeat(4, minmax(0, 1fr));
			display: flex;
			flex-direction: row;
			overflow-x: auto;
			overflow-y: hidden;
			scrollbar-width: thin;

			& :global(.search__results__item) {
				flex-direction: column;
			}

			& :global(.search__results__item > div:first-of-type) {
				width: 100%;
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

	.result {
		border: unset;
		background: unset;
		padding: unset;
		position: relative;
		align-items: flex-end;
		padding-bottom: unset;
		border-radius: 2px;
		color: #fff;
		text-align: left;
		flex: 0 0 180px;
		transition: 120ms ease;
		box-shadow: 0 0 1rem rgba(0, 0, 0, 0.75);
		overflow: hidden;
		z-index: 1;

		&:not(:first-of-type) {
			margin-left: -2rem;

			&:hover {
				// margin-left: 0.5rem;
			}
		}

		// &:hover {
		// 	flex: 0 0 240px;
		// }

		&:hover + & {
			margin-left: 0.5rem;
		}

		&__title {
			position: absolute;
			bottom: 0;
			left: 0;
			right: 0;
			padding: 4rem 3rem 1rem 1rem;
			z-index: 1;
			background: rgb(0, 0, 0);
			background: linear-gradient(
				0deg,
				rgba(0, 0, 0, 0.9) 30%,
				rgba(0, 0, 0, 0) 100%
			);
			font-size: 1rem;
			font-weight: bold;
		}

		&__cost {
			display: flex;
			flex-direction: row;
			align-items: center;
			gap: 0.25rem;

			img {
				width: 1.25rem;
				height: 1.25rem;
			}
		}

		&--active:after {
			content: "";
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);
			width: 100%;
			height: 100%;
			background: green;
			opacity: 0.35;
		}
	}
</style>
