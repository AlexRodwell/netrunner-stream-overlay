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
	import { find_faction_by_id } from "$lib/utils";
	import SearchIdentity from "$components/dashboard/SearchIdentity.svelte";
	import Country from "$components/dashboard/Country.svelte";
	import { Checkbox } from "$lib/components/ui/checkbox";
	import { Input } from "$lib/components/ui/input";
	import { Label } from "$lib/components/ui/label";
	import { Switch } from "$lib/components/ui/switch";
	import * as Card from "$lib/components/ui/card";
	import { t } from "$lib/translations";
	import { Button } from "$lib/components/ui/button";

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
			<Card.Content class="grid gap-2">
				<!-- svelte-ignore a11y-label-has-associated-control -->
				<label data-uid="side-corp" class="grid gap-1">
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
				<label data-uid="side-runner" class="grid gap-1">
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
			<Card.Content class="grid gap-2">
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
				<div class="grid grid-cols-3 gap-4">
					{#each [0, 1, 2] as value}
						<Button
							class="w-full text-center"
							variant={playerCurrent.player.wins === value
								? "primary"
								: "outline"}
							align="center"
							{value}
							name="wins_{name}"
							on:click={(event) => {
								playerCurrent.player.wins = value;
								deploy();
							}}
						>
							{value}
						</Button>
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
				<Card.Content class="grid gap-2">
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

		{#each ["primary", "secondary"] as type}
			<Card.Root class="col-[1/-1]">
				<Card.Header>
					<Card.Title>
						{$t(type) + " " + $t("card").toLowerCase()}
						<div slot="action" class="switch-group">
							<Switch
								id="{name}-display-card"
								bind:checked={playerCurrent.highlight[type].active}
								on:click={(event) => {
									playerCurrent.highlight[type].active = !playerCurrent.highlight[type].active;
									console.log(playerCurrent.highlight[type].active);
									deploy();
								}}
							/>
							<Label for="{name}-display-card">{$t("display")}</Label>
						</div>
					</Card.Title>
				</Card.Header>
				<Card.Content class="grid gap-2">
					<Search
						{name}
						side={playerCurrent.side}
						type={type}
						on:card={(e) => {
							playerCurrent.highlight[type].current = e.detail;
							deploy();
						}}
					/>
				</Card.Content>
			</Card.Root>
		{/each}

	</Card.Content>
</Card.Root>
