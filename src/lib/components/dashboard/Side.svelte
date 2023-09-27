<script lang="ts">
	import { createEventDispatcher } from "svelte";
	import { onMount } from "svelte";
	import type { Attributes, Side } from "$lib/types";
	import CardsData from "$lib/data/cards.json";
	import FactionsData from "$lib/data/factions.json";
	import { info } from "$lib/store";
	import Container from "$lib/components/dashboard/Container.svelte";
	import Search from "$lib/components/dashboard/Search.svelte";

	export let side: Side;

	const dispatch = createEventDispatcher();

	let data: Attributes = $info[side];

	function filterIdentitiesByFaction() {
		const filteredFactionData = FactionsData.filter(
			(faction) => faction.side === side
		);

		// Filter CardsData.data based on the filtered faction list
		return CardsData.data.filter((obj) => {
			const matchingFaction = filteredFactionData.find(
				(faction) => faction.code === obj.faction_code
			);
			return obj.type_code === "identity" && matchingFaction;
		});
	}
</script>

<section>
	<h2>{side}</h2>

	<label>
		<span>Faction</span>
		<select bind:value={data.faction}>
			{#each FactionsData.filter((obj) => obj.side === side) as faction}
				<option
					value={faction.slug}
					selected={faction.name === data.faction}
					>{faction.name}</option
				>
			{/each}
		</select>
	</label>

	<label>
		<span>ID</span>
		<select bind:value={data.id}>
			{#each filterIdentitiesByFaction() as identity}
				<option value={identity.code}>{identity.stripped_title}</option>
			{/each}
		</select>
	</label>

	<Container title="Clicks" level={3}>
		<label>
			<span>Amount</span>
			<input type="number" bind:value={data.clicks.amount} />
		</label>

		<label>
			<span>Display</span>
			<input type="checkbox" bind:checked={data.clicks.active} />
		</label>
	</Container>

	<Container title="Credits" level={3}>
		<label>
			<span>Amount</span>
			<input type="number" bind:value={data.credits.amount} />
		</label>

		<label>
			<span>Display</span>
			<input type="checkbox" bind:checked={data.credits.active} />
		</label>
	</Container>

	<Container title="Display card" level={3}>
		<label style="padding: 0.5rem; border: 1px solid green">
			{data.highlight.active}
			<input type="checkbox" bind:checked={data.highlight.active} />
		</label>

		<Search
			limit={1}
			on:card={(event) => {
				data.highlight.code = event.detail[0];
			}}
		/>
	</Container>

	<button
		on:click={() => {
			dispatch("playerdata", data);
		}}>Deploy</button
	>
</section>

<style lang="scss">
	section {
		display: grid;
		gap: 1.5rem;
		padding: 2rem;
		border: 1px solid #202020;
		border-radius: 8px;
		align-content: flex-start;
	}

	label,
	section > div {
		display: grid;
		gap: 0.5rem;
	}
</style>
