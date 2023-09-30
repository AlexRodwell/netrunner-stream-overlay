<script lang="ts">
	import type { Counter } from "$lib/types";

	export let data: Counter;
</script>

<div class="counter">
	<input class="counter__input" type="number" bind:value={data.amount} />

	<button
		class="counter__button"
		on:click={() => {
			data.amount - 1 >= 0 ? data.amount-- : null;
		}}>-</button
	>
	<button
		class="counter__button"
		on:click={() => {
			data.amount++;
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
