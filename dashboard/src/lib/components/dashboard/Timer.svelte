<script lang="ts">
	import { createEventDispatcher } from "svelte";
	import Modal from "$components/dashboard/ui/Modal.svelte";
	import Card from "$components/dashboard/ui/Card.svelte";
	import { timerData } from "$lib/store";
	import type { TimerData as TTimerData } from "$lib/types";
	import Button from "./ui/Button.svelte";

	// Icons
	import ICON_CLICKS from "$lib/assets/icons/NSG_CLICK.svg";
	import ICON_CREDITS from "$lib/assets/icons/NSG_CREDIT.svg";
	import ICON_AGENDAS from "$lib/assets/icons/NSG_AGENDA.svg";
	import { Timer } from "lucide-svelte";

	let timer: TTimerData = $timerData;

	const dispatch = createEventDispatcher();

	const deploy = () => {
		console.log(timer);
		dispatch("timer", timer);
	};

	$: display = false;
</script>

<label>
	<Button
		variant="outline"
		on:click={() => {
			display = true;
		}}
	>
		<Timer size={16} slot="icon" />
		Timer
	</Button>
	{#if display}
		<Modal bind:display>
			<h2 slot="header">Timer</h2>
			<label>
				<span>Timer (minutes)</span>
				<input type="number" bind:value={timer.count} />
			</label>
			<Button
				on:click={() => {
					timer.action = "set";
					timer.prev = new Date();
					deploy();
				}}>Start timer</Button
			>
			<Button
				on:click={() => {
					timer.action = "clear";
					timer.prev = new Date();
					deploy();
				}}
				style="background: #242424; border: #242424; color: #fff;"
				>Clear timer</Button
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
