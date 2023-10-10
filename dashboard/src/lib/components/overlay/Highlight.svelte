<script lang="ts">
	import { playerData } from "$lib/store";
	import Card from "../Card.svelte";
	import type { Side } from "$lib/types";
	import { find_faction_by_id } from "$lib/utils";

	export let player: Side;

	$: data = $playerData[player];
	$: align = data.align;
	$: side = find_faction_by_id(data.id).side;
</script>

<div class="highlight highlight--{align}">
	<div
		class="highlight__card {data?.highlight.active
			? 'highlight__card--active'
			: ''}"
		{align}
	>
		<Card code={data?.highlight.code} {side} />
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
