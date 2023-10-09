<script lang="ts">
	import { globalData, playerData } from "$lib/store";
	import type { Side, Faction, Counters, Agendas } from "$lib/types";
	import ICON_CLICK from "$lib/assets/icons/NSG_CLICK.svg";
	import ICON_CREDIT from "$lib/assets/icons/NSG_CREDIT.svg";
	import ICON_AGENDA from "$lib/assets/icons/NSG_AGENDA.svg";
	import FactionData from "$lib/data/factions.json";
	import Wins from "./Wins.svelte";
	import Counter from "./Counter.svelte";

	export let player: Side;

	$: global = $globalData;
	$: data = $playerData[player];
	$: align = data.align;
	$: logo = FactionData.find((obj) => obj.code === data.faction)?.logo;
</script>

<section class="side side--{align}">
	{#if logo}
		<div class="side__faction">
			<img class="side__faction__logo" src={logo} />
		</div>
	{/if}

	<div class="side__player">
		<div class="side__upper" {align}>
			{#if data.player?.name}
				<p class="side__name side__text side__text--{align}">
					{data.player.name}
				</p>
			{/if}

			{#if data.player?.wins}
				<div class="side__text side__text--{align}">
					<Wins count={data.player.wins} {align} />
				</div>
			{/if}
		</div>

		<p class="side__text side__text--{align}">
			{#if data.player.pronoun}
				{data.player.pronoun} &mdash;
			{/if}
			{data.id.split(":")[0]}
		</p>
	</div>

	<div class="side__stats" {align}>
		{#if global?.clicks}
			<div class="side__item" {align}>
				<!-- svelte-ignore a11y-missing-attribute -->
				<img class="side__icon" src={ICON_CLICK} />
				<Counter count={data.clicks.amount} />
			</div>
		{/if}

		{#if global?.credits}
			<div class="side__item" {align}>
				<!-- svelte-ignore a11y-missing-attribute -->
				<img class="side__icon" src={ICON_CREDIT} />
				<Counter count={data.credits.amount} />
			</div>
		{/if}

		{#if global?.agendas}
			<div class="side__item" {align}>
				<!-- svelte-ignore a11y-missing-attribute -->
				<img class="side__icon" src={ICON_AGENDA} />
				<Counter count={data.agendas.amount} />
			</div>
		{/if}
	</div>
</section>

<style lang="scss">
	$height: 100px;
	$faction: 30px;

	.side {
		display: grid;
		align-items: center;
		justify-content: flex-start;
		background: rgba(255, 255, 255, 0.5);
		min-width: 700px;
		height: $height;
		margin-bottom: calc(2 * $faction); // calc($faction / 2)
		outline-offset: 5px;
		color: #fff;
		text-shadow: 2px 2px black;
		bottom: 0;
		position: absolute;

		&--left {
			left: 0;
			grid-template-columns: auto 1fr auto;
			padding: 0px calc(2 * $faction);
			background: linear-gradient(
				90deg,
				rgba(0, 0, 0, 0.8) 0%,
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
			right: 0;
			grid-template-columns: auto 1fr auto;
			padding: 0px calc(2 * $faction);
			background: linear-gradient(
				90deg,
				rgba(0, 0, 0, 0) 0%,
				rgba(0, 0, 0, 0.8) 100%
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

			.side__faction {
				order: 3;
			}

			.side__player {
				order: 2;
			}
		}

		&__stats {
			display: flex;
			align-items: center;
			gap: $faction / 2;
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
			gap: 5px;
			font-size: 42px;
			flex-direction: row;
			justify-content: flex-row;
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

	[align="left"] {
		flex-direction: row;
		justify-content: left;
	}

	[align="right"] {
		flex-direction: row-reverse;
		justify-content: right;
	}
</style>
