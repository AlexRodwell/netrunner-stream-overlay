<script lang="ts">
	import type { Counter } from "$lib/types";
	import { createEventDispatcher } from "svelte";

	const dispatch = createEventDispatcher();

	export let data: Counter;
	export let min: number = 0;
	export let max: number = 99;
</script>

<div class="counter">
	<input
		class="counter__input"
		type="number"
		bind:value={data.amount}
		on:change={(event) => {
			if (Number(event.target.value) > max) {
				data.amount = max;
			}

			if (Number(event.target.value) < min) {
				data.amount = min;
			}

			dispatch("count", data.amount);
		}}
		{min}
		{max}
	/>

	<button
		class="counter__button"
		on:click={() => {
			data.amount - 1 >= min ? data.amount-- : null;
			dispatch("count", data.amount);
		}}>-</button
	>
	<button
		class="counter__button"
		on:click={() => {
			data.amount + 1 <= max ? data.amount++ : null;
			dispatch("count", data.amount);
		}}>+</button
	>
</div>

<style lang="scss">
	.counter {
		display: flex;
		flex-direction: row;
		align-items: center;
		gap: 0.5rem;

		&__input {
			width: 100%;
		}

		&__button {
			aspect-ratio: 1/1;
			display: flex;
			justify-content: center;
			align-items: center;
			height: 100%;
			background-color: #202020;
			color: #ffffff;
			border-color: #323232;
		}
	}
</style>
