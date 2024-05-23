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

<div
	class="w-[48px] h-[48px] overflow-hidden text-center relative [mask-image:linear-gradient(_transparent_0%,_black_21%,_black_79%,_transparent_100%_)]"
>
	<div
		class="absolute w-full h-full"
		style="transform: translate(0, {100 * offset}%)"
	>
		<span class="number -top-full select-none" aria-hidden="true" {align}
			>{Math.floor($displayed_count + 1)}</span
		>
		<span class="number" {align}>{Math.floor($displayed_count)}</span>
	</div>
</div>

<style lang="postcss">
	.number {
		@apply absolute flex font-normal items-center w-full h-full text-center;
	}
</style>
