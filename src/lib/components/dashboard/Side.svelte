<script lang="ts">
	import { createEventDispatcher } from "svelte";
	import type { PlayerAttributes, Side } from "$lib/types";
	import CardsData from "$lib/data/cards.json";
	import FactionsData from "$lib/data/factions.json";
	import { playerData } from "$lib/store";
	import Container from "$lib/components/dashboard/Container.svelte";
	import Search from "$lib/components/dashboard/Search.svelte";
	import ICON_CLICKS from "$lib/assets/icons/NSG_CLICK.svg";
	import ICON_CREDITS from "$lib/assets/icons/NSG_CREDIT.svg";
	import ICON_AGENDAS from "$lib/assets/icons/NSG_AGENDA.svg";

	export let side: Side;

	const dispatch = createEventDispatcher();

	let data: PlayerAttributes = $playerData[side];

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

	let selected_faction: string | boolean = false;

	$: {
		if (data?.faction) {
			let _faction = FactionsData.find(
				(faction) => faction.code === data?.faction
			);

			selected_faction = `${_faction.name} (${_faction.side})`;
		} else {
			selected_faction = false;
		}
	}
</script>

<section class="side">
	<header class="side__header side__item side__item--span">
		<h3>
			{#if data?.player?.name}
				{data.player.name}
			{:else}
				{side}
			{/if}
		</h3>
		<p>
			{#if selected_faction}
				{selected_faction}
			{/if}
		</p>
	</header>

	<section class="side__options">
		<Container title="Player" level={3}>
			<label class="side__item side__item--span">
				<span>Player name</span>
				<input type="text" bind:value={data.player.name} />
			</label>

			<!-- Pronouns -->
			<label class="side__item side__item--span">
				<span>Player pronouns (optional)</span>
				<input type="text" bind:value={data.player.pronoun} />
			</label>
		</Container>

		<Container title="Identity" level={3}>
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
		</Container>

		<Container title="Win counter" level={3}>
			<div class="wins">
				{#each ["0", "1", "2"] as item}
					<label class="wins__item">
						<input
							type="radio"
							name="wins_{side}"
							bind:group={data.player.wins}
							value={item}
						/>
						<div class="wins__item__count">
							{item}
						</div>
					</label>
				{/each}
			</div>
		</Container>

		<Container title="Clicks" level={3} icon={ICON_CLICKS}>
			<label>
				<!-- <span>Amount</span> -->
				<input type="number" bind:value={data.clicks.amount} />
			</label>

			<label class="checkbox" slot="toggle">
				<!-- <span>Display</span> -->
				<input type="checkbox" bind:checked={data.clicks.active} />
				<span class="checkbox__mark" />
			</label>
		</Container>

		<Container title="Credits" level={3} icon={ICON_CREDITS}>
			<label>
				<!-- <span>Amount</span> -->
				<input type="number" bind:value={data.credits.amount} />
			</label>

			<label class="checkbox" slot="toggle">
				<!-- <span>Display</span> -->
				<input type="checkbox" bind:checked={data.credits.active} />
				<span class="checkbox__mark" />
			</label>
		</Container>

		<Container title="Agendas" level={3} icon={ICON_AGENDAS}>
			<label>
				<!-- <span>Amount</span> -->
				<input type="number" bind:value={data.agendas.amount} />
			</label>

			<label class="checkbox" slot="toggle">
				<!-- <span>Display</span> -->
				<input type="checkbox" bind:checked={data.agendas.active} />
				<span class="checkbox__mark" />
			</label>
		</Container>

		<div class="side__item side__item--span">
			<Container title="Display card" level={3}>
				<label class="checkbox" slot="toggle">
					<input
						type="checkbox"
						bind:checked={data.highlight.active}
					/>
					<span class="checkbox__mark" />
				</label>

				<Search
					limit={1}
					on:card={(event) => {
						data.highlight.code = event.detail[0];
					}}
				/>
			</Container>
		</div>

		<button
			class="side__deploy"
			on:click={() => {
				dispatch("playerdata", data);
			}}>Deploy</button
		>
	</section>
</section>

<style lang="scss">
	.side {
		border: 1px solid #202020;
		border-radius: 8px;
		align-content: flex-start;
		overflow: hidden;

		&__header,
		&__options {
			padding: 1rem;
		}

		&__header {
			background-color: #202020;
		}

		&__options {
			display: grid;
			grid-template-columns: repeat(3, minmax(0, 1fr));
			gap: 1rem;
		}

		&__item {
			&--span {
				grid-column: 1/-1;
			}
		}

		&__deploy {
			grid-column: 1/-1;
		}
	}

	.wins {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 0.5rem;

		&__item {
			position: relative;
			cursor: pointer;

			&__count {
				border-radius: 0.125rem;
				display: flex;
				flex-direction: row;
				align-items: center;
				justify-content: center;
				text-align: center;
				gap: 0.5rem;
				padding: 0.5rem;
				background: #121212;
			}

			input[type="radio"] {
				opacity: 0;

				&:checked ~ .wins__item__count {
					background: #fff;
					color: #000;
				}
			}

			input[type="radio"],
			&:after {
				position: absolute;
				width: 100%;
				height: 100%;
			}

			&:after {
				content: "";
			}

			&:checked:after {
				background: red;
			}
		}
	}

	label:not(.checkbox),
	section > div {
		display: grid;
		gap: 0.5rem;
	}
</style>
