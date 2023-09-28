<script lang="ts">
	import { playerData } from "$lib/store";
	import { onMount } from "svelte";
	import Card from "./Card.svelte";
	import IconClick from "$lib/assets/icons/click.svg";
	import IconCredit from "$lib/assets/icons/credit.svg";

	let width: number = 10;

	onMount(() => {});
</script>

<section class="flex flex-row justify-items-center" style="--width: {width}vw;">
	{#if $playerData.corp.cards && $playerData.corp.cards.length > 0}
		{#each $playerData.corp.cards as code}
			<Card {code} />
		{/each}
	{/if}
</section>

<style>
	section {
		max-height: 30vh;
	}
</style>
