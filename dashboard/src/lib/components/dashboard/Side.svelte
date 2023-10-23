<script lang="ts">
	import { createEventDispatcher, setContext } from "svelte";
	import type {
		PlayerAttributes,
		Card as TCard,
		Side as TSide,
		GameSide as TGameSide,
	} from "$lib/types";
	import CardsData from "$lib/data/cards.json";
	import FactionsData from "$lib/data/factions.json";
	import { globalData, playerData } from "$lib/store";
	import Container from "$lib/components/dashboard/Container.svelte";
	import Search from "$lib/components/dashboard/Search.svelte";
	import ICON_CLICKS from "$lib/assets/icons/NSG_CLICK.svg";
	import ICON_CREDITS from "$lib/assets/icons/NSG_CREDIT.svg";
	import ICON_AGENDAS from "$lib/assets/icons/NSG_AGENDA.svg";
	import Counter from "./Counter.svelte";
	import { find_faction_by_id, get_flag_by_iso_code } from "$lib/utils";
	import JSON_COUNTRIES from "world_countries_lists/data/countries/en/countries.json";

	export let side: TSide;
	setContext("side", side);

	const dispatch = createEventDispatcher();

	// let data: PlayerAttributes = $playerData[side];

	$: global = $globalData;
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
		dispatch("playerdata", data);
	};

	const togglePlayerID = (side: GameSide, checked: boolean) => {
		let opposite: GameSide = side === "corp" ? "runner" : "corp";

		data.decks[side].active = checked;
		data.decks[opposite].active = !checked;

		dispatch("deckSwap");
	};

	$: disabled = (active: boolean) => {
		return !active ? "disabled" : "";
	};

	$: faction = find_faction_by_id(
		data.decks.corp.active ? data.decks.corp.id : data.decks.runner.id
	);
</script>

<section class="side" data-uid={side}>
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
		<Container
			data-uid="side"
			title="Identity"
			level={3}
			icon={faction.logo}
			className="side__item--wide"
		>
			<label data-uid="side-corp">
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
			<label data-uid="side-runner">
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

		<Container title="Player" level={3} className="side__item--wide">
			<Container columns={2} outline={false}>
				<!-- Name -->
				<label data-uid="name" class="side__item">
					<span>Player name</span>
					<input
						type="text"
						bind:value={data.player.name}
						on:input={deploy}
					/>
				</label>

				<!-- Pronouns -->
				<label data-uid="pronouns" class="side__item">
					<span>Pronouns</span>
					<input
						type="text"
						bind:value={data.player.pronoun}
						on:input={deploy}
						placeholder="they/them"
					/>
				</label>
			</Container>

			<!-- Wins -->
			<label data-uid="wins" class={disabled(global.wins)}>
				<span>Wins</span>
				<div class="wins">
					{#each [0, 1, 2] as item}
						<div class="wins__item">
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
						</div>
					{/each}
				</div>
			</label>

			<!-- Country -->
			<label data-uid="country">
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

		<Container
			data-uid="clicks"
			title={`Clicks ${
				data.clicks.amount > 0 ? `(${data.clicks.amount})` : ""
			}`}
			level={3}
			icon={ICON_CLICKS}
			className={disabled(global.clicks)}
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
			data-uid="credits"
			title={`Credits ${
				data.credits.amount > 0 ? `(${data.credits.amount})` : ""
			}`}
			level={3}
			icon={ICON_CREDITS}
			className={disabled(global.credits)}
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
			data-uid="agendas"
			title={`Agendas ${
				data.agendas.amount > 0 ? `(${data.agendas.amount})` : ""
			}`}
			level={3}
			icon={ICON_AGENDAS}
			className={disabled(global.agendas)}
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
				<label data-uid="card-toggle" class="checkbox" slot="toggle">
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
					on:card={({ detail: { current, previous } }) => {
						data.highlight.current = current;
						data.highlight.previous = previous;
						deploy();
					}}
				/>
			</Container>
		</div>
	</section>
</section>

<style lang="scss">
	.side {
		display: grid;
		gap: 1rem;
		grid-template-rows: auto 1fr;
		align-items: flex-start;
		align-content: stretch;
		overflow: hidden;

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
			grid-template-columns: repeat(6, minmax(0, 1fr));
			gap: 1rem;
			height: 100%;
			align-content: flex-start;
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
