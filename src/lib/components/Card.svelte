<script lang="ts">
	import { fly } from "svelte/transition";
	import type { Side } from "$lib/types";
	type ExtendedSide = Side | false;

	import { slugify } from "$lib/utils";

	import BackCorporation from "$lib/assets/cards/nsg-corp.png";
	import BackRunner from "$lib/assets/cards/nsg-runner.png";

	// export let title: string;
	export let code: string;
	export let side: ExtendedSide = false;

	let back = side === "Corporation" ? BackCorporation : BackRunner;

	$: url = `https://static.nrdbassets.com/v1/large/{code}.jpg`.replace(
		"{code}",
		code
	);
</script>

<div class="card card--{slugify(side)}">
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
