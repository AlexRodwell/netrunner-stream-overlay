<script lang="ts">
	import { createEventDispatcher } from "svelte";
	import type {
		Card as TCard,
		PlayerSide as TPlayerSide,
		GameSide as TGameSide,
		WebSocketFunction as TWebSocketFunction,
		Faction as TFaction,
	} from "$lib/types";
	import {
		netrunnerDB,
		globalData,
		playerOneData,
		playerTwoData,
	} from "$lib/store";
	import Card from "$components/dashboard/ui/Card.svelte";
	import Search from "$components/dashboard/Search.svelte";
	import ICON_CLICKS from "$lib/assets/icons/NSG_CLICK.svg";
	import ICON_CREDITS from "$lib/assets/icons/NSG_CREDIT.svg";
	import ICON_AGENDAS from "$lib/assets/icons/NSG_AGENDA.svg";
	import Counter from "./Counter.svelte";
	import { find_faction_by_id, get_flag_by_iso_code } from "$lib/utils";
	import JSON_COUNTRIES from "world_countries_lists/data/countries/en/countries.json";
	import Heading from "./ui/Heading.svelte";
	import Column from "./ui/Column.svelte";

	// Properties
	export let name: TPlayerSide;
	export let socketSend: TWebSocketFunction;

	// Constants
	const dispatch = createEventDispatcher();

	// Assign data relative to store name
	$: playerCurrent = name === "playerOne" ? $playerOneData : $playerTwoData;

	$: global = $globalData;

	function filterIdentitiesByFaction(_side: TGameSide) {
		// Filter card data to return an array of unique ID's (findIndex), that has a type_code of "identity" and side_code of corp or runner
		const identities = $netrunnerDB.data.filter((item, index, self) => {
			return (
				item.attributes.side_id === _side &&
				item.attributes.card_type_id === `${_side}_identity` &&
				self.findIndex(
					(i) =>
						i.attributes.stripped_title ===
						item.attributes.stripped_title,
				) === index
			);
		});

		// Sort alphabetically
		const alphabetical = identities.sort((a: TCard, b: TCard) => {
			const prev = a.attributes.stripped_title.toLowerCase();
			const next = b.attributes.stripped_title.toLowerCase();

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
		const type = name === "playerOne" ? "playerOne" : "playerTwo";
		socketSend(type, playerCurrent);
	};

	const togglePlayerID = (active: TGameSide) => {
		let opposite: TGameSide = active === "corp" ? "runner" : "corp";

		dispatch("deckSwap", {
			currentPlayer: name,
			selected: {
				active: active,
				inactive: opposite,
			},
		});
	};

	let faction: TFaction | null;

	$: {
		(async () => {
			try {
				faction = await find_faction_by_id(
					playerCurrent.decks.corp.active
						? playerCurrent.decks.corp.id
						: playerCurrent.decks.runner.id,
				);
			} catch (error) {
				console.error("Error fetching faction:", error);
			}
		})();
	}
</script>

<section
	class="side"
	data-uid={name === "playerOne" ? "playerOne" : "playerTwo"}
>
	<header class="side__header side__item side__item--span">
		{#if faction?.logo}
			<img class="side__faction" src={faction.logo} />
		{/if}

		<div>
			<span
				>{"playerOne" === "playerOne"
					? "Player One (left)"
					: "Player Two (right)"}</span
			>
			<h2>
				{#if playerCurrent?.player?.name}
					{playerCurrent.player.name}
				{:else}
					{name}
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
		<Column span="auto/span 3">
			<Card data-uid="side" className="side__item--wide">
				<Heading title="Identity" icon={faction?.logo} level={3} />
				<label data-uid="side-corp">
					<span>Corporation ID </span>
					<div class="id-selection">
						<label class="checkbox">
							<input
								type="checkbox"
								bind:checked={playerCurrent.decks.corp.active}
								on:click={(event) => {
									togglePlayerID(
										event.target.checked
											? "corp"
											: "runner",
									);
								}}
							/>
							<span class="checkbox__mark" />
						</label>
						<select
							bind:value={playerCurrent.decks.corp.id}
							on:change={deploy}
						>
							{#each filterIdentitiesByFaction("corp") as identity}
								<option
									value={identity.attributes.stripped_title}
									>{identity.attributes
										.stripped_title}</option
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
								bind:checked={playerCurrent.decks.runner.active}
								on:click={(event) => {
									togglePlayerID(
										event.target.checked
											? "runner"
											: "corp",
									);
								}}
							/>
							<span class="checkbox__mark" />
						</label>
						<select
							bind:value={playerCurrent.decks.runner.id}
							on:change={deploy}
						>
							{#each filterIdentitiesByFaction("runner") as identity}
								<option
									value={identity.attributes.stripped_title}
									>{identity.attributes
										.stripped_title}</option
								>
							{/each}
						</select>
					</div>
				</label>
			</Card>
		</Column>

		<!-- Player -->
		<Column span="auto/span 3">
			<Card className="side__item--wide">
				<Heading title="Player" level={3} />

				<Card outline={false}>
					<Column columns={2}>
						<!-- Name -->
						<label data-uid="name" class="side__item">
							<span>Player name</span>
							<input
								type="text"
								bind:value={playerCurrent.player.name}
								on:input={deploy}
							/>
						</label>

						<!-- Pronouns -->
						<label data-uid="pronouns" class="side__item">
							<span>Pronouns</span>
							<input
								type="text"
								bind:value={playerCurrent.player.pronoun}
								on:input={deploy}
								placeholder="they/them"
							/>
						</label>
					</Column>
				</Card>

				<!-- Wins -->
				<label data-uid="wins" data-disabled={!global.wins}>
					<span>Wins</span>
					<div class="wins">
						{#each [0, 1, 2] as item}
							<div class="wins__item">
								<input
									type="radio"
									name="wins_{name}"
									bind:group={playerCurrent.player.wins}
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
					<select
						bind:value={playerCurrent.player.country}
						on:change={deploy}
					>
						<option value="" />
						<option value="not_representing"
							>🏳️ Not representing</option
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
			</Card>
		</Column>

		<Column span="auto/span 2">
			<Card data-uid="clicks" data-disabled={!global.clicks}>
				<Heading title="Clicks" icon={ICON_CLICKS} level={3} />
				<Counter
					data={playerCurrent.clicks}
					on:count={(event) => {
						playerCurrent.clicks.amount = event.detail;
						deploy();
					}}
				/>
			</Card>
		</Column>

		<Column span="auto/span 2">
			<Card data-uid="credits" data-disabled={!global.credits}>
				<Heading
					title={`Credits ${
						playerCurrent.credits.amount > 0
							? `(${playerCurrent.credits.amount})`
							: ""
					}`}
					icon={ICON_CREDITS}
					level={3}
				/>
				<Counter
					data={playerCurrent.credits}
					on:count={(event) => {
						playerCurrent.credits.amount = event.detail;
						deploy();
					}}
				/>
			</Card>
		</Column>

		<Column span="auto/span 2">
			<Card data-uid="agendas" data-disabled={!global.agendas}>
				<Heading
					title={`Agendas ${
						playerCurrent.agendas.amount !== 0
							? `(${playerCurrent.agendas.amount})`
							: ""
					}`}
					icon={ICON_AGENDAS}
					level={3}
				/>
				<!-- min={-9} = Possible to have negative agendas (i.e. Nightmare Archive https://netrunnerdb.com/en/card/33097) -->
				<Counter
					data={playerCurrent.agendas}
					on:count={(event) => {
						playerCurrent.agendas.amount = event.detail;
						deploy();
					}}
					min={-9}
				/>
			</Card>
		</Column>

		<Column span="1/-1">
			<Card>
				<Heading
					title={`Display card ${
						playerCurrent.highlight.active
							? `<span style="color: red;">(VISIBLE)</span>`
							: ""
					}`}
					level={3}
				>
					<label
						data-uid="card-toggle"
						class="checkbox"
						slot="toggle"
					>
						<input
							type="checkbox"
							bind:checked={playerCurrent.highlight.active}
							on:click={(event) => {
								playerCurrent.highlight.active =
									event.target.checked;

								// Cleanup previously displayed array by emptying it
								if (!event.target.checked) {
									// console.log("emptying cards list");
									// playerCurrent.highlight.cards = [];
									// console.table(data.highlight.cards);
								}

								deploy();
							}}
						/>
						<span class="checkbox__mark" />
					</label>
				</Heading>

				<Search
					{name}
					side={playerCurrent.side}
					on:card={(e) => {
						playerCurrent.highlight.cards = e.detail;
						deploy();
					}}
				/>
			</Card>
		</Column>
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
