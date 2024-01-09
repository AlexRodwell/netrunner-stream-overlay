<script lang="ts">
	import { spring } from "svelte/motion";

	export let count: number;
	export let align: "left" | "right";

	const displayed_count = spring();
	$: displayed_count.set(count);
	$: offset = modulo($displayed_count, 1);

	function modulo(n: number, m: number) {
		// handle negative numbers
		return ((n % m) + m) % m;
	}
</script>

<div class="counter">
	<div
		class="counter__digits"
		style="transform: translate(0, {100 * offset}%)"
	>
		<span
			class="counter__number counter__number--hidden"
			aria-hidden="true"
			{align}>{Math.floor($displayed_count + 1)}</span
		>
		<span class="counter__number" {align}
			>{Math.floor($displayed_count)}</span
		>
	</div>
</div>

<style lang="scss">
	.counter {
		width: 48px;
		height: 48px;
		overflow: hidden;
		text-align: center;
		position: relative;
		mask-image: linear-gradient(
			transparent 0%,
			black 21%,
			black 79%,
			transparent 100%
		);
		mask-mode: alpha;

		&__digits {
			position: absolute;
			width: 100%;
			height: 100%;
		}

		&__number {
			position: absolute;
			display: flex;
			font-weight: 400;
			color: var(--color-theme-1);
			align-items: center;
			// justify-content: center;
			width: 100%;
			text-align: center;

			&--hidden {
				top: -100%;
				user-select: none;
			}
		}
	}
</style>
