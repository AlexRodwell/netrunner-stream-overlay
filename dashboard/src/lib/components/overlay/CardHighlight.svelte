<script lang="ts">
	import { playerOneData, playerTwoData } from "$lib/store";
	import Card from "../Card.svelte";
	import type {
		PlayerSide as TPlayerSide,
		HighlightGroup as THighlightGroup,
		GameSide as TGameSide,
	} from "$lib/types";
	import { find_faction_by_id } from "$lib/utils";
	import { fly } from "svelte/transition";
	import { globalData } from "$lib/store";

	export let player: TPlayerSide;
	export let data: THighlightGroup;
	export let side: TGameSide;

	type TType = "primary" | "secondary";

	$: align = player === "playerOne" ? "left" : "right"; // data.align;

	let display_state: boolean = false;

	let dynamicElements: {
		[key in TType]: Array<{
			code: string;
			state: "in" | "out";
			flip?: boolean;
		}>;
	} = {
		primary: [],
		secondary: [],
	};
	let index: number = 0;
	let transition: number = 300;
	let previous: {
		[key in TType]: string;
	} = {
		primary: "",
		secondary: "",
	};

	const queue = (code: string, type: TType = "primary") => {
		// If queued code is the same as the previous, exit early (do nothing)
		if (code === previous[type]) {
			return;
		}

		// If code is not set or undefined, deactivate highlight, reset previous and animate last card out
		if (
			(!code || code === "undefined") &&
			dynamicElements[type].length > 0
		) {
			display_state = false;
			previous[type] = "";
			dynamicElements[type][dynamicElements[type].length - 1].state =
				"out";
			return;
		}

		dynamicElements[type] = [
			...dynamicElements[type],
			{
				code: code,
				state: "in",
				flip: false,
			},
		];

		dynamicElements[type] = dynamicElements[type].map(
			(obj, index, array) => ({
				...obj,
				state: index === array.length - 1 ? "in" : "out",
			}),
		);

		previous[type] = code;
		index++;
	};

	const display = (state: boolean, type: TType = "primary") => {
		if (dynamicElements[type].length > 0) {
			if (!state) {
				// Animate out last active card
				dynamicElements[type][dynamicElements[type].length - 1].state =
					"out";

				// Clean up {#each} HTML (remove all previous HTML elements, except the last) if dislay is equals false (hidden)
				setTimeout(() => {
					dynamicElements[type] = [
						dynamicElements[type][dynamicElements[type].length - 1],
					];
				}, transition);
			} else {
				dynamicElements[type][dynamicElements[type].length - 1].state =
					"in";
			}
		}
	};

	$: data.primary.active, display(data.primary.active, "primary");
	$: data.primary.cards,
		queue(data.primary.cards[data.primary.cards.length - 1], "primary");

	$: data.secondary.active, display(data.secondary.active, "secondary");
	$: data.secondary.cards,
		queue(
			data.secondary.cards[data.secondary.cards.length - 1],
			"secondary",
		);
</script>

<div class="highlight highlight--{align}" style="--transition: {transition}ms;">
	{#each dynamicElements.primary as { code, state, flip }}
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

<div
	class="highlight-secondary highlight-secondary--{align}"
	style="--transition: {transition}ms;"
>
	{#each dynamicElements.secondary as { code, state, flip }}
		<div
			class="highlight-secondary__card highlight-secondary__card--{state} {flip
				? 'highlight-secondary__card--flip'
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
	// Primary

	.highlight {
		@apply flex mb-[210px] [transition:var(--transition)] relative bottom-0 [transition-delay:var(--transition)];

		&--left {
			@apply left-0;
			place-content: flex-start;
			place-items: flex-end;
			margin-left: 50px;

			.highlight__card {
				@apply left-0;
			}

			.highlight__card--out {
				transform: translateX(-200%);
			}
		}

		&--right {
			@apply right-0;
			place-content: flex-end;
			place-items: flex-end;
			margin-right: 50px;

			.highlight__card {
				@apply right-0;
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

	// Secondary

	.highlight-secondary {
		@apply absolute flex mb-[210px] [transition:var(--transition)] [transition-delay:var(--transition)] w-[260px] bottom-[70px];

		&--left {
			@apply left-0 origin-bottom-left rotate-3;

			.highlight-secondary__card {
				@apply left-[370px];
			}

			.highlight-secondary__card--out {
				transform: translateX(-90%) scale(0.9);
				opacity: 0;
			}
		}

		&--right {
			@apply right-0 origin-bottom-right -rotate-3;

			.highlight-secondary__card {
				@apply right-[370px];
			}

			.highlight-secondary__card--out {
				transform: translateX(90%) scale(0.9);
				opacity: 0;
			}
		}

		&__card {
			flex: 0 0 100%;
			width: 300px;
			transition:
				var(--transition) ease,
				scale 0ms;
			z-index: 5;
			position: absolute;
			bottom: 0;
			// --transform: rotateY(-180deg);

			&--out {
				// --transform: rotateY(-180deg);
				transition-delay: calc(var(--transition) / 1.5);
				z-index: 1;
			}

			&--in {
				// --transform: rotateY(0deg);
				@apply translate-x-0;
				opacity: 1;
			}

			:global(.card) {
				width: inherit;
			}
		}
	}
</style>
