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
	import { globalData } from "$lib/store";

	export let player: TPlayerSide;
	export let data: THighlight;
	export let side: TGameSide;

	$: align = player === "playerOne" ? "left" : "right"; // data.align;

	let display_state: boolean = false;

	let dynamicElements: Array<{
		code: string;
		state: "in" | "out";
		flip?: boolean;
	}> = [];
	let index: number = 0;
	let transition: number = 300;
	let previous: string;
	let previous_state: boolean = display_state;

	const queue = (code: string) => {
		// If queued code is the same as the previous, exit early (do nothing)
		if (code === previous) {
			return;
		}

		// If code is not set or undefined, deactivate highlight, reset previous and animate last card out
		if (!code || code === "undefined") {
			display_state = false;
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
		}));

		previous = code;
		index++;
	};

	const display = (state: boolean) => {
		previous_state = !state;

		if (dynamicElements.length > 0) {
			if (!state) {
				// Animate out last active card
				dynamicElements[dynamicElements.length - 1].state = "out";

				// Clean up {#each} HTML (remove all previous HTML elements, except the last) if dislay is equals false (hidden)
				setTimeout(() => {
					dynamicElements = [
						dynamicElements[dynamicElements.length - 1],
					];
				}, transition);
			} else {
				dynamicElements[dynamicElements.length - 1].state = "in";
			}
		}
	};

	$: data.active, display(data.active);
	$: data.cards, queue(data.cards[data.cards.length - 1]);
</script>

<div class="highlight highlight--{align}" style="--transition: {transition}ms;">
	{#each dynamicElements as { code, state, flip }}
		<div
			class="highlight__card highlight__card--{state} {flip
				? 'highlight__card--flip'
				: ''}"
			data-size={$globalData.card_size}
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

		&__card {
			flex: 0 0 100%;
			width: 280px;
			transition: var(--transition) ease;
			z-index: 5;
			position: absolute;
			bottom: 0;
			--transform: rotateY(-180deg);

			// &[data-size=small] {}

			&[data-size="medium"] {
				width: 360px;
			}

			&[data-size="large"] {
				width: 480px;
			}

			&--out {
				--transform: rotateY(-180deg);
				transition-delay: calc(var(--transition) / 1.5);
				z-index: 1;
			}

			&--in {
				--transform: rotateY(0deg);
				transform: translateX(0%);
				opacity: 1;
			}

			:global(.card) {
				width: inherit;
			}
		}
	}
</style>
