<script lang="ts">
	import type { Counter } from "$lib/types";
	import { createEventDispatcher } from "svelte";
	import { Button } from "$lib/components/ui/button";
	import { Input } from "$lib/components/ui/input";
	import { Label } from "$lib/components/ui/label";

	const dispatch = createEventDispatcher();

	export let label: string;
	export let data: Counter;
	export let min: number = 0;
	export let max: number = 99;
</script>

<div class="flex flex-row items-center gap-1">
	<Input
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

	<Button
		variant="outline"
		on:click={() => {
			data.amount - 1 >= min ? data.amount-- : null;
			dispatch("count", data.amount);
		}}>-</Button
	>
	<Button
		variant="outline"
		on:click={() => {
			data.amount + 1 <= max ? data.amount++ : null;
			dispatch("count", data.amount);
		}}>+</Button
	>
</div>
