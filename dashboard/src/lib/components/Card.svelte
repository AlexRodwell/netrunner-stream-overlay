<script lang="ts">
	import { fly } from "svelte/transition";
	import type { GameSide } from "$lib/types";

	import { slugify } from "$lib/utils";

	import BACK_CORPORATION from "$lib/assets/cards/nsg-corp.png";
	import BACK_RUNNER from "$lib/assets/cards/nsg-runner.png";

	// export let title: string;
	export let code: string;
	export let side: GameSide | string;

	let back = side === "Corporation" ? BACK_CORPORATION : BACK_RUNNER;

	$: url = `https://card-images.netrunnerdb.com/v1/large/{code}.jpg`.replace(
		"{code}",
		code
	);
</script>

<div class="card">
	<div class="card__front">
		<!-- svelte-ignore a11y-missing-attribute -->
		<img src={url} />
	</div>
	{#if side}
		<div class="card__back">
			<!-- svelte-ignore a11y-missing-attribute -->
			<img src={back} />
		</div>
	{/if}
</div>

<style lang="scss">
	.card {
		aspect-ratio: 64/89;
		transform-style: preserve-3d;
		display: flex;
		transition: 600ms ease;
		transition-delay: 300ms;
		transform: var(--transform);

		&__front,
		&__back {
			position: absolute;
			height: 100%;
			width: 100%;
			text-align: center;
			backface-visibility: hidden;
			overflow: hidden;
			border-radius: 4%;
			overflow: hidden;
		}

		&__front {
			filter: drop-shadow(0px 0px 20px rgba(255, 255, 255, 0.3));
		}

		&__back {
			transform: rotateY(180deg);
		}

		img {
			width: 100%;
			height: 100%;
			object-fit: fill;
			display: inline-block;
		}
	}
</style>
