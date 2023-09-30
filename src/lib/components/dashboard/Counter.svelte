<script lang="ts">
	import type { Counter } from "$lib/types";
	import { createEventDispatcher } from "svelte";

	const dispatch = createEventDispatcher();

	export let data: Counter;
</script>

<div class="counter">
	<input
		class="counter__input"
		type="number"
		bind:value={data.amount}
		on:change={() => {
			dispatch("count", data.amount);
		}}
	/>

	<button
		class="counter__button"
		on:click={() => {
			data.amount - 1 >= 0 ? data.amount-- : null;
			dispatch("count", data.amount);
		}}>-</button
	>
	<button
		class="counter__button"
		on:click={() => {
			data.amount++;
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
		}
	}
</style>
