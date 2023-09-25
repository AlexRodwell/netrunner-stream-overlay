<script lang="ts">
	import { info } from "$lib/store";
	import { onMount } from "svelte";
	import Card from "./Card.svelte";
	import IconClick from "$lib/assets/icons/click.svg";
	import IconCredit from "$lib/assets/icons/credit.svg";

	let width: number = 10;

	onMount(() => {
		/*
		info.subscribe((data) => {
			if (data?.cards) {
				let items = data?.cards.length;

				let radius = 0; // Adjust the radius of the arc
				let arcAngleRadians = (40 * Math.PI) / 280;
				let angleStep = arcAngleRadians / (items - 1);

				width = items > 4 ? 80 / items : 10;

				data?.cards.forEach((code, index) => {
					let element = document.querySelector(
						`img[data-id="${code}"]`
					);

					// const angle = index * angleStep - arcAngleRadians / 2;

					const position = index - (items - 1) / 2; // Calculate the position relative to the center
					const rotation = index * angleStep - arcAngleRadians / 2;
					const displacement =
						(items - rotation - Math.abs(position)) * 20; // Adjust the multiplier as needed

					if (element) {
						element.style.transform = `translateY(-${displacement}px) rotate(${rotation}rad)`;
					}
				});
			}
		});
		*/
	});
</script>

<section class="flex flex-row justify-items-center" style="--width: {width}vw;">
	{#if $info.corp.cards && $info.corp.cards.length > 0}
		{#each $info.corp.cards as code}
			<Card {code} />
		{/each}
	{/if}
</section>

<style>
	section {
		max-height: 30vh;
	}
</style>
