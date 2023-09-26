<script lang="ts">
	import { createEventDispatcher } from "svelte";
	import { onMount } from "svelte";
	import type { Attributes, Side } from "$lib/types";
	import FactionsData from "$lib/data/factions.json";
	import { info } from "$lib/store";

	export let side: Side;

	const dispatch = createEventDispatcher();

	let data: Attributes = $info[side];
</script>

<div>
	<h2>{side}</h2>

	<select bind:value={data.faction}>
		{#each FactionsData.filter((obj) => obj.side === side) as faction}
			<option
				value={faction.slug}
				selected={faction.name === data.faction}>{faction.name}</option
			>
		{/each}
	</select>

	<select bind:value={data.id}>
		<option value={data.id}>{data.id}</option>
	</select>

	<label>
		<span>Clicks</span>
		<input type="number" bind:value={data.clicks} />
	</label>

	<label>
		<span>Credits</span>
		<input type="number" bind:value={data.credits} />
	</label>

	<label style="padding: 0.5rem; border: 1px solid green">
		{data.highlight.active}
		<input type="checkbox" bind:checked={data.highlight.active} />
	</label>

	<button
		on:click={() => {
			dispatch("playerdata", data);
		}}>Deploy</button
	>
</div>
