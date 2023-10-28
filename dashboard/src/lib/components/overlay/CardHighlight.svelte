<script lang="ts">
	import { playerOneData, playerTwoData } from "$lib/store";
	import Card from "../Card.svelte";
	import type {
		PlayerSide as TPlayerSide,
		Highlight as THighlight,
		GameSide as TGameSide,
	} from "$lib/types";
	import { find_faction_by_id } from "$lib/utils";
	import { fly } from "svelte/transition";

	export let player: TPlayerSide;
	export let data: THighlight;
	export let side: TGameSide;

	$: align = player === "playerOne" ? "left" : "right"; // data.align;

	let displayState: boolean = false;

	let dynamicElements: Array<{
		code: string;
		state: "in" | "out";
		flip?: boolean;
	}> = [];
	let index: number = 0;
	let transition: number = 300;
	let previous: string;
	let previousDisplay: boolean = displayState;

	const queue = (code: string) => {
		// Handle toggling while there's an active card
		// if (displayState !== previousDisplay) {
		// 	return;
		// }

		// If queued code is the same as the previous, exit early (do nothing)
		if (code === previous) {
			return;
		}

		// If code is not set or undefined, deactivate highlight, reset previous and animate last card out
		if (!code || code === "undefined") {
			console.error("here 2");
			displayState = false;
			previous = "";
			dynamicElements[dynamicElements.length - 1].state = "out";
			return;
		}

		dynamicElements = [
			...dynamicElements,
			{
				code: code,
				state: "in",
				flip: false,
			},
		];

		dynamicElements = dynamicElements.map((obj, index, array) => ({
			...obj,
			state: index === array.length - 1 ? "in" : "out",
			// flip: index === array.length - 1 ? false : true,
		}));

		// Wait for card to appear on screen (flipped), before flipping over to reveal the card
		// setTimeout(() => {
		// 	dynamicElements[dynamicElements.length - 1].flip = true;
		// }, transition * 2);

		previous = code;
		index++;
	};

	const display = () => {
		previousDisplay = displayState;
		displayState = data.active;

		// if (!displayState && dynamicElements.length > 0) {
		// 	dynamicElements[dynamicElements.length - 1].state = "out";
		// }
	};

	$: data.active, display();
	$: data.cards, queue(data.cards.at(-1));
</script>

<div
	class="highlight highlight--{align} {displayState
		? 'highlight--active'
		: ''}"
	style="--transition: {transition}ms;"
>
	{#each dynamicElements as { code, state, flip }}
		<div
			class="highlight__card highlight__card--{state} {flip
				? 'highlight__card--flip'
				: ''}"
			in:fly={{
				delay: 400,
				x: align === "left" ? "-100%" : "100%",
				duration: transition,
			}}
		>
			<Card {code} {side} />
		</div>
	{/each}
</div>

<style lang="scss">
	.highlight {
		display: flex;
		margin-bottom: 210px;
		transition: var(--transition) ease;
		position: relative;
		bottom: 0;
		transition-delay: var(--transition);

		&--left {
			transform: translateX(-200%);
			left: 0;
			place-content: flex-start;
			place-items: flex-end;
			margin-left: 50px;

			.highlight__card {
				left: 0;
			}

			.highlight__card--out {
				transform: translateX(-200%);
			}
		}

		&--right {
			transform: translateX(200%);
			right: 0;
			place-content: flex-end;
			place-items: flex-end;
			margin-right: 50px;

			.highlight__card {
				right: 0;
			}

			.highlight__card--out {
				transform: translateX(200%);
			}
		}

		&--active {
			transition-delay: 0;
			transform: translateX(0%);
		}

		&__card {
			flex: 0 0 100%;
			width: 280px;
			transition: var(--transition) ease;
			z-index: 5;
			position: absolute;
			bottom: 0;
			--transform: rotateY(-180deg);

			// &--flip {
			// 	--transform: rotateY(0deg);
			// }

			&--out {
				--transform: rotateY(-180deg);
				transition-delay: calc(var(--transition) / 1.5);
				z-index: 1;
			}

			&--in {
				--transform: rotateY(
					0deg
				); // Comment out if you want flip on 'in' state
				transform: translateX(0%);
				opacity: 1;
			}

			:global(.card) {
				width: inherit;
			}
		}
	}
</style>
