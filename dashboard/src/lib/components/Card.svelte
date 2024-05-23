<script lang="ts">
	import type { GameSide } from "$lib/types";
	import BACK_CORPORATION from "$lib/assets/cards/nsg-corp.png";
	import BACK_RUNNER from "$lib/assets/cards/nsg-runner.png";

	// export let title: string;
	export let code: string;
	export let side: GameSide | string | false = false;
	export let glow: boolean = true;

	$: back = side === "corp" ? BACK_CORPORATION : BACK_RUNNER;

	$: url = `https://card-images.netrunnerdb.com/v1/large/{code}.jpg`.replace(
		"{code}",
		code,
	);
</script>

<div
	class="aspect-[64/89] [transform-style:preserve-3d] flex transition-[calc(var(--transition)*1.5)] ease-linear delay-[var(--transition-delay,0ms)] [transform:var(--transform)] {glow
		? 'card--glow'
		: ''} {$$props['class']}"
>
	<div
		class="face {glow
			? '[filter:drop-shadow(0px_0px_20px_rgba(255,255,255,0.3))]'
			: ''}"
	>
		<!-- svelte-ignore a11y-missing-attribute -->
		<img class="image" src={url} />
	</div>
	{#if side}
		<div class="face [transform:rotateY(180deg)]">
			<!-- svelte-ignore a11y-missing-attribute -->
			<img class="image" src={back} />
		</div>
	{/if}
</div>

<style lang="postcss">
	.face {
		@apply absolute h-full w-full text-center [backface-visibility:hidden] overflow-hidden rounded-[4%];
	}

	.image {
		@apply w-full h-full object-fill inline-block;
	}
</style>
