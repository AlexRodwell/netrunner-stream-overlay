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
	import SearchIdentity from "$components/dashboard/SearchIdentity.svelte";
	import Country from "$components/dashboard/Country.svelte";
	import { Checkbox } from "$lib/components/ui/checkbox";
	import { Input } from "$lib/components/ui/input";
	import { Label } from "$lib/components/ui/label";
	import { Switch } from "$lib/components/ui/switch";
	import * as Card from "$lib/components/ui/card";
	import { t } from "$lib/translations";
	import { Description } from "$components/ui/alert";

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

<Card.Root data-uid={name === "playerOne" ? "playerOne" : "playerTwo"}>
	<Card.Header class="pb-0">
		<Card.Title>
			<div slot="icon">
				{#if faction?.logo}
					<img
						class="aspect-square w-16"
						src={faction?.logo
							? faction.logo
							: "/static/factions/NSG_NEUTRAL.svg"}
					/>
				{/if}
			</div>

			<div>
				<span
					>{name === "playerOne"
						? `${$t("player")} One (${$t("left")})`
						: `${$t("player")} Two (${$t("right")})`}</span
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
		</Card.Title>
	</Card.Header>
	<Card.Content class="grid grid-cols-6 p-4 gap-4">
		<Card.Root class="col-[auto/span_3]">
			<Card.Header>
				<Card.Title>
					<img
						slot="icon"
						src={faction?.logo}
						class="min-w-6 w-6 min-h-6 h-6"
					/>
					{$t("identity")}
				</Card.Title>
			</Card.Header>
			<Card.Content>
				<!-- svelte-ignore a11y-label-has-associated-control -->
				<label data-uid="side-corp">
					<span>{$t("corporation")} ID</span>

					<div
						class="id-selection grid grid-cols-[auto,1fr] gap-2 items-center"
					>
						<Checkbox
							class="aspect-square h-full w-auto w-[40px] h-[40px]"
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
					<span>{$t("runner")} ID</span>
					<div
						class="id-selection grid grid-cols-[auto,1fr] gap-2 items-center"
					>
						<Checkbox
							class="aspect-square h-full w-auto w-[40px] h-[40px]"
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
				<Card.Title>{$t("player")}</Card.Title>
			</Card.Header>
			<Card.Content>
				<!-- Name -->
				<Label data-uid="name" class="side__item" for="player_name"
					>{$t("player_name")}</Label
				>
				<Input
					id="player_name"
					type="text"
					bind:value={playerCurrent.player.name}
					on:input={deploy}
				/>

				<Label data-uid="pronouns" class="side__item" for="pronouns"
					>{$t("pronouns")}</Label
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
					<span>{$t("wins")}</span>
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
				<Label data-uid="country" for="player_country"
					>{$t("country")}</Label
				>
				<Country
					on:country={(event) => {
						playerCurrent.player.country = event.detail;
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
						{$t(name.toLowerCase())}
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

		<!-- Main card -->
		<Card.Root class="col-[1/-1]">
			<Card.Header>
				<Card.Title>
					{$t("primary") + " " + $t("card").toLowerCase()}
					<div slot="action" class="switch-group">
						<Switch
							id="{name}-display-card"
							bind:checked={playerCurrent.highlight.primary
								.active}
							on:click={(event) => {
								playerCurrent.highlight.primary.active =
									!playerCurrent.highlight.primary.active;
								deploy();
							}}
						/>
						<Label for="{name}-display-card">{$t("display")}</Label>
					</div>
				</Card.Title>
			</Card.Header>
			<Card.Content>
				<Search
					{name}
					side={playerCurrent.side}
					type="primary"
					on:card={(e) => {
						playerCurrent.highlight.primary.cards = e.detail;
						deploy();
					}}
				/>
			</Card.Content>
		</Card.Root>

		<!-- Combo card -->
		<Card.Root class="col-[1/-1]">
			<Card.Header>
				<Card.Title>
					{$t("secondary") + " " + $t("card").toLowerCase()}
					<div slot="action" class="switch-group">
						<Switch
							id="{name}-display-card"
							bind:checked={playerCurrent.highlight.secondary
								.active}
							on:click={(event) => {
								playerCurrent.highlight.secondary.active =
									!playerCurrent.highlight.secondary.active;
								deploy();
							}}
						/>
						<Label for="{name}-display-card">{$t("display")}</Label>
					</div>
				</Card.Title>
				<Card.Description>
					{$t("hints.such_as_ice")}
				</Card.Description>
			</Card.Header>
			<Card.Content>
				<Search
					{name}
					side={playerCurrent.side}
					type="secondary"
					on:card={(e) => {
						playerCurrent.highlight.secondary.cards = e.detail;
						deploy();
					}}
				/>
			</Card.Content>
		</Card.Root>
	</Card.Content>
</Card.Root>
