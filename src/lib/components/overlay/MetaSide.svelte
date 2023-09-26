<script lang="ts">
	import { info } from "$lib/store";
	import type { Faction } from "$lib/utils";
	import IconClick from "$lib/assets/icons/click.svg";
	import IconCredit from "$lib/assets/icons/credit.svg";
	import FactionData from "$lib/data/factions.json";

	export let id: string;
	export let faction: Faction;
	export let clicks: number;
	export let credits: number;
	export let align: "left" | "right";

	$: logo = FactionData.find((obj) => obj.name === faction).logo;
</script>

<section class="side" {align}>
	<div class="side__data" {align}>
		<div class="side__faction">
			<img class="side__faction__logo" src={logo} />
		</div>

		<div class="side__item" {align}>
			<img class="side__icon" src={IconClick} />
			{clicks}
		</div>
		<div class="side__item" {align}>
			<img class="side__icon" src={IconCredit} />
			{credits}
		</div>
	</div>

	<p class="side__id side__id--{align}">
		{id}
	</p>
</section>

<style lang="scss">
	.side {
		background: black;
		display: grid;
		align-items: center;
		justify-content: flex-start;
		gap: 1rem;
		padding: 1rem;
		border-radius: 8px;

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
		}

		&__faction {
			width: 75px;
			aspect-ratio: 1/1;
			display: flex;
			place-items: center;
			background: #141414;
			border-radius: 4px;

			&__logo {
				object-fit: contain;
				object-position: center;
				width: 100%;
			}
		}

		&__id {
			grid-column: 1/-1;

			&--right {
				text-align: right;
			}
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
