<script lang="ts">
	import { createEventDispatcher } from "svelte";
	import Modal from "$lib/components/dashboard/ui/Modal.svelte";
	import Container from "$lib/components/dashboard/Container.svelte";
	import { timerData } from "$lib/store";
	import type { TimerData as TTimerData } from "$lib/types";

	// Icons
	import ICON_CLICKS from "$lib/assets/icons/NSG_CLICK.svg";
	import ICON_CREDITS from "$lib/assets/icons/NSG_CREDIT.svg";
	import ICON_AGENDAS from "$lib/assets/icons/NSG_AGENDA.svg";

	let timer: TTimerData = $timerData;

	const dispatch = createEventDispatcher();

	const deploy = () => {
		console.log(timer);
		dispatch("timer", timer);
	};

	$: display = false;
</script>

<label>
	<button
		on:click={() => {
			display = true;
		}}>Timer</button
	>
	{#if display}
		<Modal bind:display>
			<h2 slot="header">Timer</h2>
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
		</Modal>
	{/if}
</label>

<style lang="scss">
	section {
		display: flex;
		flex-direction: row;
		align-items: center;
		gap: 1rem;
	}
</style>
