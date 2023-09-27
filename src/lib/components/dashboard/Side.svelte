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

	function sortAlphabetically(array: Array<{}>, key_value: string) {
		console.log(array);

		const sorted = array.sort((a: string, b: string) => {
			const nameA = a[key_value].toLowerCase();
			const nameB = b[key_value].toLowerCase();

			if (nameA < nameB) {
				return -1;
			}
			if (nameA > nameB) {
				return 1;
			}

			return 0; // Names are equal
		});

		return sorted;
	}
</script>

<section>
	<h2>{side}</h2>

	<label>
		<span>Player name</span>
		<input type="text" bind:value={data.player.name} />
	</label>

	<label>
		<span>Faction</span>
		<select bind:value={data.faction}>
			{#each FactionsData.filter((obj) => obj.side === side) as faction}
				<option
					value={faction.code}
					selected={faction.name === data.faction}
					>{faction.name}</option
				>
			{/each}
		</select>
	</label>

	<label>
		<span>ID</span>
		<select bind:value={data.id}>
			{#each sortAlphabetically(filterIdentitiesByFaction(), "stripped_title") as identity}
				<option value={identity.stripped_title}
					>{identity.stripped_title}</option
				>
			{/each}
		</select>
	</label>

	<Container title="Clicks" level={3}>
		<label>
			<span>Amount</span>
			<input type="number" bind:value={data.clicks.amount} />
		</label>

		<label class="checkbox">
			<span>Display</span>
			<input type="checkbox" bind:checked={data.clicks.active} />
			<span class="checkbox__mark" />
		</label>
	</Container>

	<Container title="Credits" level={3}>
		<label>
			<span>Amount</span>
			<input type="number" bind:value={data.credits.amount} />
		</label>

		<label class="checkbox">
			<span>Display</span>
			<input type="checkbox" bind:checked={data.credits.active} />
			<span class="checkbox__mark" />
		</label>
	</Container>

	<Container title="Display card" level={3}>
		<label class="checkbox">
			<input type="checkbox" bind:checked={data.highlight.active} />
			<span class="checkbox__mark" />
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

	label:not(.checkbox),
	section > div {
		display: grid;
		gap: 0.5rem;
	}
</style>
