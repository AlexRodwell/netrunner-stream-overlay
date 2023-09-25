<script lang="ts">
	import { info } from "$lib/store";
	import type { Faction } from "$lib/utils";
	import IconClick from "$lib/assets/icons/click.svg";
	import IconCredit from "$lib/assets/icons/credit.svg";
	import FactionData from "$lib/data/factions.json";

	export let faction: Faction;
	export let clicks: number;
	export let credits: number;
	export let align: "left" | "right";
	let direction = align === "right" ? "flex-row-reverse" : "flex-row";

	$: logo = FactionData.find((obj) => obj.name === faction).logo;
</script>

<section class="flex {direction} p-4 gap-4">
	<div
		class="max-w-[100px] aspect-square flex flex-row items-center justify-center text-black bg-white"
	>
		<img src={logo} />
	</div>

	<div class="flex {direction} items-center gap-1 text-2xl">
		<img class="fill-white w-6 h-6" src={IconClick} />
		{clicks}
	</div>
	<div class="flex {direction} items-center gap-1 text-2xl">
		<img class="fill-white w-6 h-6" src={IconCredit} />
		{credits}
	</div>
</section>
