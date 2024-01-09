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

	let svgText: SVGTextContentElement;
	let svgCounter: SVGPathElement;

	const dispatch = createEventDispatcher();

	const deploy = () => {
		console.log(timer);
		dispatch("timer", timer);
	};

	const startCounter = () => {
		let currentValue = 0;
		const increment = 251.2 / timer.count; // Calculate the increment value

		const interval = setInterval(() => {
			if (currentValue >= 251.2) {
				clearInterval(interval); // Stop the interval when the maximum value is reached
			} else {
				currentValue += increment;
				svgCounter.style.strokeDasharray = `${currentValue}px 251.2px`;
			}
		}, 100); // Update every 10 milliseconds
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

			{#if timer.action === "set"}
				<svg id="animated" viewBox="0 0 100 100">
					<circle cx="50" cy="50" r="45" fill="#FDB900"></circle>
					<path
						bind:this={svgCounter}
						id="progress"
						stroke-linecap="round"
						stroke-width="5"
						stroke="#fff"
						fill="none"
						d="M50 10
           a 40 40 0 0 1 0 80
           a 40 40 0 0 1 0 -80"
					>
					</path>
					<text
						id="count"
						x="50"
						y="50"
						text-anchor="middle"
						dy="7"
						font-size="20"
						bind:this={svgText}
					></text>
					<desc>Created with Snap</desc><defs></defs></svg
				>
			{/if}

			<Button
				on:click={() => {
					timer.action = "set";
					timer.prev = new Date();
					startCounter();
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
