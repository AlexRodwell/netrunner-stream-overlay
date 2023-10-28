<script lang="ts">
	import { timerData } from "$lib/store";
	import { onDestroy } from "svelte";

	let intervalId: number;
	let current_count: number;
	let display = false;

	const startCountdown = (count: number) => {
		current_count = count * 60;

		intervalId = setInterval(() => {
			if (current_count === 0) {
				clearInterval(intervalId);
			} else {
				current_count -= 1;
			}
		}, 1000);
	};

	// Clear the interval when the component is destroyed
	onDestroy(() => {
		clearInterval(intervalId);
	});

	function formatTime(seconds) {
		const minutes = Math.floor(seconds / 60);
		const remainingSeconds = seconds % 60;
		const formattedMinutes = minutes < 10 ? minutes : minutes;
		const formattedSeconds =
			remainingSeconds < 10 ? `0${remainingSeconds}` : remainingSeconds;
		return `${formattedMinutes}:${formattedSeconds}`;
	}

	$: action = $timerData.action;
	$: count = $timerData.count;
	$: update = $timerData.prev;

	$: {
		if (count > 0 && action !== "clear") {
			clearInterval(intervalId);
			display = true;
			startCountdown(count);
		} else {
			display = false;
		}
	}
</script>

{#if display}
	<section class="timer">
		{formatTime(current_count)}
	</section>
{/if}

<style lang="scss">
	.timer {
		width: 100vw;
		height: 100vh;
		padding: 1rem;
		display: flex;
		place-items: center;
		justify-content: center;
		text-align: center;
		font-size: 38px;
		color: #fff;
		position: relative;

		&__background {
			width: 100%;
			height: 100%;
			object-fit: contain;
			position: absolute;
			z-index: -1;
		}
	}

	:global(body) {
		color: #000;
	}
</style>
