<script lang="ts">
	import { createEventDispatcher } from "svelte";
	import type {
		PlayerSide as TPlayerSide,
		GameSide as TGameSide,
		WebSocketFunction as TWebSocketFunction,
		Faction as TFaction,
	} from "$lib/types";
	import { globalData, playerOneData, playerTwoData } from "$lib/store";
	import Search from "$components/dashboard/Search.svelte";
	import ICON_CLICKS from "$lib/assets/icons/NSG_CLICK.svg";
	import ICON_CREDITS from "$lib/assets/icons/NSG_CREDIT.svg";
	import ICON_AGENDAS from "$lib/assets/icons/NSG_AGENDA.svg";
	import Counter from "./Counter.svelte";
	import { find_faction_by_id, get_flag_by_iso_code } from "$lib/utils";
	import Heading from "./ui/Heading.svelte";
	import Column from "./ui/Column.svelte";
	import SearchIdentity from "$components/dashboard/SearchIdentity.svelte";
	import Country from "$components/dashboard/Country.svelte";
	import { Checkbox } from "$lib/components/ui/checkbox";
	import { Input } from "$lib/components/ui/input";
	import { Label } from "$lib/components/ui/label";
	import { Switch } from "$lib/components/ui/switch";
	import * as Card from "$lib/components/ui/card";

	// Properties
	export let name: TPlayerSide;
	export let update: TWebSocketFunction;

	// Constants
	const dispatch = createEventDispatcher();

	// Assign data relative to store name
	$: playerCurrent = name === "playerOne" ? $playerOneData : $playerTwoData;

	$: global = $globalData;

	const deploy = () => {
		const type = name === "playerOne" ? "playerOne" : "playerTwo";
		update({
			type: type,
			data: playerCurrent,
		});
	};

	const togglePlayerID = (active: TGameSide) => {
		let opposite: TGameSide = active === "corp" ? "runner" : "corp";

		// console.log('================================================', {
		// 	currentPlayer: name,
		// 	selected: {
		// 		active: active,
		// 		inactive: opposite,
		// 	},
		// })

		dispatch("swap_deck", {
			currentPlayer: name,
			selected: {
				active: active,
				inactive: opposite,
			},
		});
	};

	let faction: TFaction | null;

	$: faction = find_faction_by_id(
		playerCurrent.decks.corp.active
			? playerCurrent.decks.corp.id
			: playerCurrent.decks.runner.id,
	);

	const types = [
		{
			name: "Clicks",
			type: "clicks",
			icon: ICON_CLICKS,
		},
		{
			name: "Credits",
			type: "credits",
			icon: ICON_CREDITS,
		},
		{
			name: "Agendas",
			type: "agendas",
			icon: ICON_AGENDAS,
		},
	];
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
				>{name === "playerOne"
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
		<Card.Root class="col-[auto/span_3]">
			<Card.Header>
				<Card.Title>
					<img
						slot="icon"
						src={faction?.logo}
						class="min-w-6 w-6 min-h-6 h-6"
					/>
					Identity
				</Card.Title>
			</Card.Header>
			<Card.Content>
				<!-- svelte-ignore a11y-label-has-associated-control -->
				<label data-uid="side-corp">
					<span>Corporation ID </span>

					<div
						class="id-selection grid grid-cols-[auto,1fr] gap-4 items-center"
					>
						<Checkbox
							class="aspect-square h-full w-auto max-h-[44px]"
							bind:checked={playerCurrent.decks.corp.active}
							on:click={(event) => {
								togglePlayerID(
									playerCurrent.decks.corp.active
										? "runner"
										: "corp",
								);
							}}
						/>
						<SearchIdentity
							player={name}
							side="corp"
							on:change={(e) => {
								playerCurrent.decks.corp.id = e.detail;
								deploy();
							}}
						/>
					</div>
				</label>
				<!-- svelte-ignore a11y-label-has-associated-control -->
				<label data-uid="side-runner">
					<span>Runner ID</span>
					<div
						class="id-selection grid grid-cols-[auto,1fr] gap-4 items-center"
					>
						<Checkbox
							class="aspect-square h-full w-auto max-h-[44px]"
							bind:checked={playerCurrent.decks.runner.active}
							on:click={(event) => {
								togglePlayerID(
									playerCurrent.decks.runner.active
										? "corp"
										: "runner",
								);
							}}
						/>
						<SearchIdentity
							player={name}
							side="runner"
							on:change={(e) => {
								playerCurrent.decks.runner.id = e.detail;
								deploy();
							}}
						/>
					</div>
				</label>
			</Card.Content>
		</Card.Root>

		<Card.Root class="col-[auto/span_3]">
			<Card.Header>
				<Card.Title>Player</Card.Title>
			</Card.Header>
			<Card.Content>
				<!-- Name -->
				<Label data-uid="name" class="side__item" for="player_name"
					>Player name</Label
				>
				<Input
					id="player_name"
					type="text"
					bind:value={playerCurrent.player.name}
					on:input={deploy}
				/>

				<Label data-uid="pronouns" class="side__item" for="pronouns"
					>Pronouns</Label
				>
				<Input
					id="pronouns"
					type="text"
					bind:value={playerCurrent.player.pronoun}
					on:input={deploy}
					placeholder="they/them"
				/>

				<!-- Wins -->
				<Label data-uid="wins" data-disabled={!global.wins}>
					<span>Wins</span>
				</Label>
				<div class="wins">
					{#each [0, 1, 2] as item}
						<Input
							type="radio"
							name="wins_{name}"
							bind:group={playerCurrent.player.wins}
							on:change={deploy}
							value={item}
						/>
					{/each}
				</div>

				<!-- Country -->
				<Label data-uid="country" for="player_country">Country</Label>
				<Country
					on:country={(event) => {
						console.log(event);
						playerCurrent.player.country = event.detail.name;
						deploy();
					}}
				/>
			</Card.Content>
		</Card.Root>

		{#each types as { name, type, icon }}
			<Card.Root class="col-[auto/span_2]">
				<Card.Header>
					<Card.Title>
						<!-- svelte-ignore a11y-missing-attribute -->
						<img
							slot="icon"
							src={icon}
							class="min-w-6 w-6 min-h-6 h-6"
						/>
						{name}
					</Card.Title>
				</Card.Header>
				<Card.Content>
					<Counter
						data={playerCurrent[type]}
						on:count={(event) => {
							playerCurrent[type].amount = parseInt(event.detail);
							deploy();
						}}
					/>
				</Card.Content>
			</Card.Root>
		{/each}

		<Card.Root class="col-[1/-1]">
			<Card.Header>
				<Card.Title>
					{@html `Display card ${
						playerCurrent.highlight.active
							? `<span style="color: red;">(VISIBLE)</span>`
							: ""
					}`}

					<div slot="action">
						<Switch
							id="{name}-display-card"
							bind:checked={playerCurrent.highlight.active}
							on:click={(event) => {
								playerCurrent.highlight.active =
									!playerCurrent.highlight.active;
								deploy();
							}}
						/>
						<Label for="{name}-display-card">Display card</Label>
					</div>
				</Card.Title>
			</Card.Header>
			<Card.Content>
				<Search
					{name}
					side={playerCurrent.side}
					on:card={(e) => {
						playerCurrent.highlight.cards = e.detail;
						deploy();
					}}
				/>
			</Card.Content>
		</Card.Root>
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
