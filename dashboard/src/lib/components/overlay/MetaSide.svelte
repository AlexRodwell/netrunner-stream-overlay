<script lang="ts">
	import { globalData, playerOneData, playerTwoData } from "$lib/store";
	import type { PlayerSide as TPlayerSide } from "$lib/types";
	import ICON_CLICK from "$lib/assets/icons/NSG_CLICK.svg";
	import ICON_CREDIT from "$lib/assets/icons/NSG_CREDIT.svg";
	import ICON_AGENDA from "$lib/assets/icons/NSG_AGENDA.svg";
	import Wins from "./Wins.svelte";
	import Counter from "./Counter.svelte";
	import { find_faction_by_id, get_flag_by_iso_code } from "$lib/utils";

	export let player: TPlayerSide;

	$: global = $globalData;
	$: data = player === "playerOne" ? $playerOneData : $playerTwoData;
	$: align = player === "playerOne" ? "left" : "right"; // data.align;
	$: id = data.decks.corp.active ? data.decks.corp.id : data.decks.runner.id;
	$: faction = find_faction_by_id(id);
	$: country = get_flag_by_iso_code(data.player.country);
</script>

<section
	class="side side--{align}"
	style="--opacity: {`0.${global.overlay.opacity}` ?? '0.8'}"
>
	{#if global.faction && faction?.logo}
		<div class="side__faction">
			<img class="side__faction__logo" src={faction.logo} />
		</div>
	{/if}

	<div class="side__player">
		<div class="side__upper" {align}>
			{#if global.name && data.player?.name}
				<p class="side__name side__text side__text--{align}">
					{data.player.name}
				</p>
			{/if}

			{#if global.wins}
				<div class="side__text side__text--{align}">
					<Wins count={data.player.wins} {align} />
				</div>
			{/if}
		</div>

		{#if (data.player.pronoun && global.pronoun) || (id && global.id)}
			<p class="side__text side__text--{align}" {align}>
				{#if global.pronoun && data.player.pronoun}
					<span>{data.player.pronoun}</span>
				{/if}

				{#if data.player.pronoun && global.pronoun && id && global.id}
					<span> &nbsp; &mdash; &nbsp; </span>
				{/if}

				{#if global.id && id}
					<span>{id.includes(":") ? id.split(":")[0] : id}</span>
				{/if}
			</p>
		{/if}

		{#if global.country && country}
			{country.icon} {country.name}
		{/if}
	</div>

	<div class="side__stats" {align}>
		{#if global?.clicks}
			<div class="side__item" {align}>
				<!-- svelte-ignore a11y-missing-attribute -->
				<img class="side__icon" src={ICON_CLICK} />
				<Counter count={data.clicks.amount} {align} />
			</div>
		{/if}

		{#if global?.credits}
			<div class="side__item" {align}>
				<!-- svelte-ignore a11y-missing-attribute -->
				<img class="side__icon" src={ICON_CREDIT} />
				<Counter count={data.credits.amount} {align} />
			</div>
		{/if}

		{#if global?.threat_level}
			<div class="side__item" {align}>
				<!-- svelte-ignore a11y-missing-attribute -->
				<!-- <img class="side__icon" src={ICON_AGENDA} /> -->
				Threat
				<Counter count={global.agendas_count} {align} />
			</div>
		{/if}

		{#if global?.agendas}
			<div class="side__item" {align}>
				<!-- svelte-ignore a11y-missing-attribute -->
				<img class="side__icon" src={ICON_AGENDA} />
				<Counter count={data.agendas.amount} {align} />
			</div>
		{/if}
	</div>
</section>

<style lang="scss">
	$height: 100px;
	$faction: 30px;

	.side {
		// display: grid;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: flex-start;
		background: rgba(255, 255, 255, 0.5);
		max-width: 50vw;
		width: var(--width);
		height: $height;
		margin-bottom: calc(2 * $faction);
		outline-offset: 5px;
		color: #fff;
		text-shadow: 2px 2px black;
		bottom: 0;
		position: absolute;

		&--left {
			left: 0;
			grid-template-columns: auto 1fr auto;
			padding: {
				left: calc(2 * $faction);
				right: calc(4 * $faction);
			}
			background: linear-gradient(
				90deg,
				rgba(0, 0, 0, var(--opacity)) 0%,
				rgba(0, 0, 0, 0) 100%
			);

			.side__faction__logo {
				right: 0;
				filter: drop-shadow(-5px 5px black);
			}

			.side__player {
				margin: {
					right: $faction;
					left: calc($faction / 2);
				}
			}
		}

		&--right {
			flex-direction: row-reverse;
			right: 0;
			grid-template-columns: auto 1fr auto;
			padding: {
				left: calc(4 * $faction);
				right: calc(2 * $faction);
			}
			background: linear-gradient(
				90deg,
				rgba(0, 0, 0, 0) 0%,
				rgba(0, 0, 0, var(--opacity)) 100%
			);

			.side__faction__logo {
				left: 0;
				filter: drop-shadow(5px 5px black);
			}

			.side__player {
				margin: {
					left: $faction;
					right: calc($faction / 2);
				}
			}
		}

		&__stats {
			display: flex;
			align-items: center;
			// gap: calc($faction / 2);
		}

		&__faction {
			aspect-ratio: 1/1;
			width: 100px;
			height: 100px;
			position: relative;

			&__logo {
				width: calc(100% + $faction);
				height: calc(100% + $faction);
				position: absolute;
				object-position: center;
				top: 50%;
				transform: translateY(-50%);
			}
		}

		&__upper {
			display: flex;
			flex-direction: row;
			gap: 10px;
			align-items: center;
		}

		&__player {
			// padding: 0.75rem;
		}

		&__text {
			grid-column: 1/-1;

			&--right {
				text-align: right;
			}
		}

		&__name {
			font-size: 32px;
		}

		&__item {
			display: flex;
			gap: 10px;
			font-size: 42px;
			// flex-direction: row;
			// justify-content: flex-row;
			align-items: center;
			border-radius: 4px;
			padding: 8px;
		}

		&__icon {
			width: 36px;
			height: 36px;
			filter: drop-shadow(2px 2px #000);
		}
	}
</style>
