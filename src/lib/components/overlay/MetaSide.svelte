<script lang="ts">
	import { playerData } from "$lib/store";
	import type { Faction, Counters, Agendas } from "$lib/types";
	import ICON_CLICK from "$lib/assets/icons/NSG_CLICK.svg";
	import ICON_CREDIT from "$lib/assets/icons/NSG_CREDIT.svg";
	import ICON_AGENDA from "$lib/assets/icons/NSG_AGENDA.svg";
	import FactionData from "$lib/data/factions.json";
	import Wins from "./Wins.svelte";

	export let player: string;
	export let id: string;
	export let faction: Faction;
	export let align: "left" | "right";
	export let clicks: Counters;
	export let credits: Counters;
	export let agendas: Agendas;

	$: logo = FactionData.find((obj) => obj.code === faction)?.logo;
</script>

<section class="side" {align}>
	<div class="side__data" {align}>
		{#if logo}
			<div class="side__faction">
				<img class="side__faction__logo" src={logo} />
			</div>
		{/if}

		{#if clicks?.active && clicks?.amount}
			<div class="side__item" {align}>
				<!-- svelte-ignore a11y-missing-attribute -->
				<img class="side__icon" src={ICON_CLICK} />
				{clicks.amount}
			</div>
		{/if}

		{#if credits?.active && credits?.amount}
			<div class="side__item" {align}>
				<!-- svelte-ignore a11y-missing-attribute -->
				<img class="side__icon" src={ICON_CREDIT} />
				{credits.amount}
			</div>
		{/if}

		{#if agendas?.active}
			<div class="side__item" {align}>
				<!-- svelte-ignore a11y-missing-attribute -->
				<img class="side__icon" src={ICON_AGENDA} />
				{agendas.amount}
			</div>
		{/if}
	</div>

	{#if player?.name}
		<p class="side__name side__text side__text--{align}">
			{player.name}
			{#if player.pronoun}
				({player.pronoun})
			{/if}
		</p>
	{/if}

	<p class="side__text side__text--{align}">
		{id}
	</p>

	{#if player?.wins}
		<div class="side__text side__text--{align}">
			<Wins count={player.wins} />
		</div>
	{/if}
</section>

<style lang="scss">
	.side {
		// background: black;
		// padding: 1rem;
		// border-radius: 8px;
		display: grid;
		align-items: center;
		justify-content: flex-start;
		gap: 5px;

		&--left {
			flex-direction: row;
		}

		&--right {
			flex-direction: row-reverse;
		}

		&__data {
			display: flex;
			align-items: center;
			gap: 1rem;
			margin-bottom: 10px;
		}

		&__faction {
			width: 75px;
			aspect-ratio: 1/1;
			display: flex;
			place-items: center;
			// background: #141414;
			// border-radius: 4px;

			&__logo {
				object-fit: contain;
				object-position: center;
				width: 100%;
			}
		}

		&__text {
			grid-column: 1/-1;

			&--right {
				text-align: right;
			}
		}

		&__name {
			font-size: 24px;
		}

		&__item {
			display: flex;
			gap: 0.5rem;
			font-size: 1.5rem;
			flex-direction: row;
			justify-content: flex-row;
			align-items: center;
			padding: 0.25rem;
			border: 1px solid white;
			border-radius: 4px;
			padding: 8px;

			&--clicks {
			}

			&--credits {
			}
		}

		&__icon {
			width: 32px;
			height: 32px;
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
