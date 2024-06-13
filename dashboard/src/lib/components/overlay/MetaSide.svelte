<script lang="ts">
	import { globalData, playerOneData, playerTwoData } from "$lib/store";
	import type {
		PlayerSide as TPlayerSide,
		ThemeClasses as TThemeClasses,
	} from "$lib/types";
	import ICON_CLICK from "$lib/assets/icons/NSG_CLICK.svg";
	import ICON_CREDIT from "$lib/assets/icons/NSG_CREDIT.svg";
	import ICON_AGENDA from "$lib/assets/icons/NSG_AGENDA.svg";
	import Wins from "./Wins.svelte";
	import Counter from "./Counter.svelte";
	import { find_faction_by_id, get_flag_by_iso_code } from "$lib/utils";

	export let player: TPlayerSide;
	export let theme: TThemeClasses;

	$: global = $globalData;
	$: data = player === "playerOne" ? $playerOneData : $playerTwoData;
	$: align = player === "playerOne" ? "left" : "right"; // data.align;
	$: id = data.decks.corp.active ? data.decks.corp.id : data.decks.runner.id;
	$: faction = find_faction_by_id(id);
	$: country = get_flag_by_iso_code(data.player.country);

	let left =
		"left-0 pl-[var(--padding)] pr-[120px] bg-[linear-gradient(90deg,rgba(0,0,0,var(--opacity))_0%,rgba(0,0,0,0)_100%)]";
	let right =
		"right-0 pl-[120px] pr-[var(--padding)] flex-row-reverse bg-[linear-gradient(-90deg,rgba(0,0,0,var(--opacity))_0%,rgba(0,0,0,0)_100%)]";
</script>

<section
	class="{theme.meta.wrapper} flex flex-row items-center justify-start max-w-[50vw] w-[var(--width)] h-[100px] mb-[var(--padding)] outline-offset-[5px] text-[#fff] [text-shadow:2px_2px_black] bottom-[0] absolute grid-cols-[auto_1fr_auto] {align ===
	'left'
		? left
		: right}"
	style="--opacity: {global.overlay.opacity < 100
		? `0.${global.overlay.opacity}`
		: '1' ?? '0.8'}"
>
	{#if global.faction && faction?.logo}
		<div class="aspect-square w-[100px] h-[100px] relative">
			<img
				class="w-[calc(100%+100px)] h-[calc(100%+100px)] absolute object-center top-2/4 -translate-y-1/2 {align ===
				'left'
					? 'right-0'
					: 'left-0'} [filter:drop-shadow(5px_5px_black)]"
				src={faction.logo}
			/>
		</div>
	{/if}

	<div
		class={align === "left"
			? "ml-[calc(var(--padding)/2)] mr-[var(--padding)]"
			: "ml-[var(--padding)] mr-[calc(var(--padding)/2)]"}
	>
		<div
			class="flex flex-row gap-4 items-center {align === 'right'
				? 'flex-row-reverse'
				: ''}"
		>
			{#if global.name && data.player?.name}
				<p class="text-3xl text-{align}">
					{data.player.name}
				</p>
			{/if}

			{#if global.wins}
				<div class="text-{align}">
					<Wins count={data.player.wins} {align} />
				</div>
			{/if}
		</div>

		{#if (data.player.pronoun && global.pronoun) || (id && global.id)}
			<p class="text-{align}">
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

	<div class="flex items-center">
		{#if global?.clicks}
			<div class="item">
				<!-- svelte-ignore a11y-missing-attribute -->
				<img class="icon" src={ICON_CLICK} />
				<Counter count={data.clicks.amount} {align} />
			</div>
		{/if}

		{#if global?.credits}
			<div class="item">
				<!-- svelte-ignore a11y-missing-attribute -->
				<img class="icon" src={ICON_CREDIT} />
				<Counter count={data.credits.amount} {align} />
			</div>
		{/if}

		{#if global?.agendas}
			<div class="item {theme.meta.agendas}">
				<!-- svelte-ignore a11y-missing-attribute -->
				<img class="icon" src={ICON_AGENDA} />
				<Counter count={data.agendas.amount} {align} />
			</div>
		{/if}
	</div>
</section>

<style lang="postcss">
	.item {
		@apply flex gap-2 text-4xl items-center p-2;
	}

	.icon {
		@apply w-9 h-9 [filter:drop-shadow(2px_2px_#000)];
	}
</style>
