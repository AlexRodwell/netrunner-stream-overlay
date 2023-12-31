<script lang="ts">
	import { createEventDispatcher } from "svelte";
	import type { PlayerAttributes, Side, GameSide } from "$lib/types";
	import CardsData from "$lib/data/cards.json";
	import FactionsData from "$lib/data/factions.json";
	import { playerData } from "$lib/store";
	import Container from "$lib/components/dashboard/Container.svelte";
	import Search from "$lib/components/dashboard/Search.svelte";
	import ICON_CLICKS from "$lib/assets/icons/NSG_CLICK.svg";
	import ICON_CREDITS from "$lib/assets/icons/NSG_CREDIT.svg";
	import ICON_AGENDAS from "$lib/assets/icons/NSG_AGENDA.svg";
	import Counter from "./Counter.svelte";
	import { find_faction_by_id } from "$lib/utils";

	export let side: Side;

	const dispatch = createEventDispatcher();

	// let data: PlayerAttributes = $playerData[side];

	$: data = $playerData[side];

	function filterIdentitiesByFaction() {
		const filteredArray = CardsData.data.filter((item, index, self) => {
			// Filter items with type_code equal to 'identity'
			return (
				item.type_code === "identity" &&
				self.findIndex(
					(i) => i.stripped_title === item.stripped_title
				) === index
			);
		});

		// return filteredArray;

		const sorted = filteredArray.sort((a: string, b: string) => {
			const nameA = a["stripped_title"].toLowerCase();
			const nameB = b["stripped_title"].toLowerCase();

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

	const deploy = () => {
		console.log(data);
		dispatch("playerdata", data);
	};

	const togglePlayerID = (side: GameSide, checked: boolean) => {
		let opposite: GameSide =
			side === "corporation" ? "runner" : "corporation";

		data.decks[side].active = checked;
		data.decks[opposite].active = !checked;

		dispatch("deckSwap");
	};

	$: faction = find_faction_by_id(
		data.decks.corporation.active
			? data.decks.corporation.id
			: data.decks.runner.id
	);
</script>

<section class="side">
	<header class="side__header side__item side__item--span">
		<div>
			<h3>
				{#if data?.player?.name}
					{data.player.name}
				{:else}
					{side}
				{/if}
			</h3>
			{#if faction?.name && faction?.side}
				<p>
					{faction.name} ({faction.side})
				</p>
			{/if}
		</div>

		{#if faction?.logo}
			<img class="side__faction" src={faction.logo} />
		{/if}
	</header>

	<section class="side__options">
		<Container title="Player" level={3}>
			<label class="side__item side__item--span">
				<span>Player name</span>
				<input type="text" bind:value={data.player.name} />
			</label>

			<!-- Pronouns -->
			<label class="side__item side__item--span">
				<span>Player pronouns</span>
				<input type="text" bind:value={data.player.pronoun} />
			</label>
		</Container>

		<Container title="Identity" level={3}>
			<label>
				<span>Corporation ID</span>
				<div class="id-selection">
					<label class="checkbox">
						<input
							type="checkbox"
							bind:checked={data.decks.corporation.active}
							on:click={(event) => {
								togglePlayerID(
									"corporation",
									event.target.checked
								);
							}}
						/>
						<span class="checkbox__mark" />
					</label>
					<select
						bind:value={data.decks.corporation.id}
						on:change={deploy}
					>
						<!-- {#each sortAlphabetically(filterIdentitiesByFaction(), "stripped_title") as identity} -->
						{#each filterIdentitiesByFaction() as identity}
							FactionsData
							<option value={identity.stripped_title}
								>{identity.stripped_title}</option
							>
						{/each}
					</select>
				</div>
			</label>
			<label>
				<span>Runner ID</span>
				<div class="id-selection">
					<label class="checkbox">
						<input
							type="checkbox"
							bind:checked={data.decks.runner.active}
							on:click={(event) => {
								togglePlayerID("runner", event.target.checked);
							}}
						/>
						<span class="checkbox__mark" />
					</label>
					<select
						bind:value={data.decks.runner.id}
						on:change={deploy}
					>
						<!-- {#each sortAlphabetically(filterIdentitiesByFaction(), "stripped_title") as identity} -->
						{#each filterIdentitiesByFaction() as identity}
							FactionsData
							<option value={identity.stripped_title}
								>{identity.stripped_title}</option
							>
						{/each}
					</select>
				</div>
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

		<Container
			title={`Clicks ${
				data.clicks.amount > 0 ? `(${data.clicks.amount})` : ""
			}`}
			level={3}
			icon={ICON_CLICKS}
		>
			<Counter
				data={data.clicks}
				on:count={(event) => {
					data.clicks.amount = event.detail;
				}}
			/>
		</Container>

		<Container
			title={`Credits ${
				data.credits.amount > 0 ? `(${data.credits.amount})` : ""
			}`}
			level={3}
			icon={ICON_CREDITS}
		>
			<Counter
				data={data.credits}
				on:count={(event) => {
					data.credits.amount = event.detail;
				}}
			/>
		</Container>

		<Container
			title={`Agendas ${
				data.agendas.amount > 0 ? `(${data.agendas.amount})` : ""
			}`}
			level={3}
			icon={ICON_AGENDAS}
		>
			<Counter
				data={data.agendas}
				on:count={(event) => {
					data.agendas.amount = event.detail;
				}}
			/>
		</Container>

		<div class="side__item side__item--span">
			<Container
				title={`Display card ${
					data.highlight.active
						? `<span style="color: red;">(VISIBLE)</span>`
						: ""
				}`}
				level={3}
			>
				<label class="checkbox" slot="toggle">
					<input
						type="checkbox"
						bind:checked={data.highlight.active}
						on:click={(event) => {
							data.highlight.active = event.target.checked;
							deploy();
						}}
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

		<button class="side__deploy" on:click={deploy}>Deploy</button>
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
			display: grid;
			grid-template-columns: 1fr auto;
			align-items: center;
			background-color: #202020;
		}

		&__faction {
			aspect-ratio: 1/1;
			width: 42px;
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

	.id-selection {
		display: flex;
		flex-direction: row;
	}
</style>
