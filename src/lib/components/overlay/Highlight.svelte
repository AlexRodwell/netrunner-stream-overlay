<script lang="ts">
	import { globalData } from "$lib/store";
	import Card from "../Card.svelte";
	import type { Side } from "$lib/types";

	export let align: "left" | "right";
	export let code: string;
	export let active: boolean;
	export let side: Side;

	$: reactive = active;
</script>

<div
	class="highlight highlight--{$globalData.direction === 'ltr'
		? align
		: align === 'left'
		? 'right'
		: 'left'}"
	style={$globalData.direction === "rtl" && align === "right"
		? "order: -2"
		: "order: -1"}
>
	<div
		class="highlight__card {reactive ? 'highlight__card--active' : ''}"
		{align}
	>
		<Card {code} {side} />
	</div>
</div>

<style lang="scss">
	.highlight {
		display: flex;
		padding-bottom: 4rem;

		&--left {
			place-content: flex-start;
			place-items: flex-end;
		}

		&--right {
			place-content: flex-end;
			place-items: flex-end;
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
