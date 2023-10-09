<script lang="ts">
	import { createEventDispatcher } from "svelte";
	import { timerData } from "$lib/store";
	import type { TimerData as TTimerData } from "$lib/types";

	const dispatch = createEventDispatcher();

	let timer: TTimerData = $timerData;

	const deploy = () => {
		console.log(timer);
		dispatch("timer", timer);
	};
</script>

<section>
	<label>
		<span>Timer (minutes)</span>
		<input type="number" bind:value={timer.count} />
	</label>
	<button
		on:click={() => {
			timer.action = "set";
			timer.prev = new Date();
			deploy();
		}}>Start timer</button
	>
	<button
		on:click={() => {
			timer.action = "clear";
			timer.prev = new Date();
			deploy();
		}}
		style="background: #242424; border: #242424; color: #fff;"
		>Clear timer</button
	>
</section>

<style lang="scss">
	section {
		display: flex;
		flex-direction: row;
		align-items: center;
		gap: 1rem;
	}
</style>
