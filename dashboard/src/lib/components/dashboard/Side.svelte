<script lang="ts">
	import { createEventDispatcher } from "svelte";
	import type {
		PlayerAttributes,
		Card as TCard,
		Side as TSide,
		GameSide as TGameSide,
	} from "$lib/types";
	import CardsData from "$lib/data/cards.json";
	import FactionsData from "$lib/data/factions.json";
	import { playerData } from "$lib/store";
	import Container from "$lib/components/dashboard/Container.svelte";
	import Search from "$lib/components/dashboard/Search.svelte";
	import ICON_CLICKS from "$lib/assets/icons/NSG_CLICK.svg";
	import ICON_CREDITS from "$lib/assets/icons/NSG_CREDIT.svg";
	import ICON_AGENDAS from "$lib/assets/icons/NSG_AGENDA.svg";
	import Counter from "./Counter.svelte";
	import { find_faction_by_id, get_flag_by_iso_code } from "$lib/utils";
	import JSON_COUNTRIES from "world_countries_lists/data/countries/en/countries.json";
	import Card from "../Card.svelte";

	export let side: TSide;

	const dispatch = createEventDispatcher();

	// let data: PlayerAttributes = $playerData[side];

	$: data = $playerData[side];

	function filterIdentitiesByFaction(_side: TGameSide) {
		// Filter card data to return an array of unique ID's (findIndex), that has a type_code of "identity" and side_code of corp or runner
		const identities = CardsData.data.filter((item, index, self) => {
			return (
				item.type_code === "identity" &&
				item.side_code === _side &&
				self.findIndex(
					(i) => i.stripped_title === item.stripped_title
				) === index
			);
		});

		// Sort alphabetically
		const alphabetical = identities.sort((a: TCard, b: TCard) => {
			const prev = a.stripped_title.toLowerCase();
			const next = b.stripped_title.toLowerCase();

			if (prev < next) {
				return -1;
			}
			if (prev > next) {
				return 1;
			}

			return 0; // Names are equal
		});

		return alphabetical;
	}

	const deploy = () => {
		console.log(data);
		dispatch("playerdata", data);
	};

	const togglePlayerID = (side: GameSide, checked: boolean) => {
		let opposite: GameSide = side === "corp" ? "runner" : "corp";

		data.decks[side].active = checked;
		data.decks[opposite].active = !checked;

		dispatch("deckSwap");
	};

	$: faction = find_faction_by_id(
		data.decks.corp.active ? data.decks.corp.id : data.decks.runner.id
	);
</script>

<section class="side">
	<header class="side__header side__item side__item--span">
		{#if faction?.logo}
			<img class="side__faction" src={faction.logo} />
		{/if}

		<div>
			<span
				>{side === "playerOne"
					? "Player One (left)"
					: "Player Two (right)"}</span
			>
			<h2>
				{#if data?.player?.name}
					{data.player.name}
				{:else}
					{side}
				{/if}
				{#if faction?.name && faction?.side}
					&mdash;
					<span>
						{faction.name} ({faction.side})
					</span>
				{/if}
			</h2>
		</div>
	</header>

	<section class="side__options">
		<Container title="Player" level={3}>
			<label class="side__item side__item--span">
				<span>Player name</span>
				<input
					type="text"
					bind:value={data.player.name}
					on:input={deploy}
				/>
			</label>

			<!-- Pronouns -->
			<label class="side__item side__item--span">
				<span>Player pronouns</span>
				<input
					type="text"
					bind:value={data.player.pronoun}
					on:input={deploy}
				/>
			</label>

			<!-- Country -->
			<label>
				<span>Country</span>
				<select bind:value={data.player.country} on:change={deploy}>
					<option value="" />
					<option value="not_representing">🏳️ Not representing</option
					>
					{#each JSON_COUNTRIES as country}
						<option value={country.alpha2}>
							<!-- Dark magic unicode conversion -->
							{country.name}
							{get_flag_by_iso_code(country.alpha2).icon}
						</option>
					{/each}
				</select>
			</label>
		</Container>

		<Container title="Identity" level={3} icon={faction.logo}>
			<label>
				<span> Corporation ID </span>
				<div class="id-selection">
					<label class="checkbox">
						<input
							type="checkbox"
							bind:checked={data.decks.corp.active}
							on:click={(event) => {
								togglePlayerID("corp", event.target.checked);
							}}
						/>
						<span class="checkbox__mark" />
					</label>
					<select bind:value={data.decks.corp.id} on:change={deploy}>
						{#each filterIdentitiesByFaction("corp") as identity}
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
						{#each filterIdentitiesByFaction("runner") as identity}
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
				{#each [0, 1, 2] as item}
					<label class="wins__item">
						<input
							type="radio"
							name="wins_{side}"
							bind:group={data.player.wins}
							on:change={deploy}
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
					deploy();
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
					deploy();
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
					deploy();
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
						deploy();
					}}
				/>
			</Container>
		</div>
	</section>
</section>

<style lang="scss">
	.side {
		// border: 1px solid #202020;
		// border-radius: 8px;
		align-content: flex-start;
		overflow: hidden;
		display: grid;
		gap: 1rem;

		&__header,
		&__options {
			//padding: 1rem;
		}

		&__header {
			display: grid;
			grid-template-columns: auto 1fr;
			gap: 0.5rem;
			align-items: center;
			// background-color: #202020;
			// padding: 1rem;
		}

		&__faction {
			aspect-ratio: 1/1;
			width: 4rem;
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
