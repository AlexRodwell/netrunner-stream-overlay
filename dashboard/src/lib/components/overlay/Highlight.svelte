<script lang="ts">
	import { playerData } from "$lib/store";
	import Card from "../Card.svelte";
	import type { Side } from "$lib/types";
	import { find_faction_by_id } from "$lib/utils";

	export let player: Side;

	$: data = $playerData[player];
	$: align = player === "playerOne" ? "left" : "right"; // data.align;
	$: side = find_faction_by_id(
		data.decks.corp.active ? data.decks.corp.id : data.decks.runner.id
	)?.side;

	$: code = data.highlight.current;
	$: active = data?.highlight.active && code?.length > 0;
</script>

<div class="highlight highlight--{align}">
	<div style="color: #fff; background: red; padding: 4px;">
		current: {data?.highlight.current} --- previous: {data?.highlight
			.previous}
	</div>

	<div
		class="highlight__card {active ? 'highlight__card--active' : ''}"
		{align}
	>
		<Card {code} {side} />
	</div>
</div>

<style lang="scss">
	.highlight {
		display: flex;
		padding-bottom: 210px;

		&--left {
			place-content: flex-start;
			place-items: flex-end;
			padding-left: 50px;
		}

		&--right {
			place-content: flex-end;
			place-items: flex-end;
			padding-right: 50px;
		}

		&__card {
			max-width: 300px;
			transition: 900ms ease;

			&[align="left"] {
				--transform: rotateY(-180deg);
				transform: translateX(-200%);
			}

			&[align="right"] {
				--transform: rotateY(180deg);
				transform: translateX(200%);
			}

			&--active {
				--transform: rotateY(0deg);
				transform: translateX(0);

				&[align="left"] {
					// --transform: rotateY(20deg);
					--transform: rotateY(0deg);
					transform: translateX(0%);
				}

				&[align="right"] {
					// --transform: rotateY(-20deg);
					--transform: rotateY(0deg);
					transform: translateX(0%);
				}
			}
		}

		:global(.card) {
			width: 300px;
		}
	}
</style>
