<script lang="ts">
	import { globalData, playerData } from "$lib/store";
	import { default as Side } from "$lib/components/overlay/MetaSide.svelte";

	$: align =
		$globalData.direction === "ltr" ? ["left", "right"] : ["right", "left"];
</script>

<section class="meta meta--{$globalData.direction}">
	<Side
		player={$playerData["Corporation"].player}
		id={$playerData["Corporation"].id}
		faction={$playerData["Corporation"].faction}
		align={align[0]}
		clicks={$playerData["Corporation"].clicks}
		credits={$playerData["Corporation"].credits}
	/>

	<Side
		player={$playerData["Runner"].player}
		id={$playerData["Runner"].id}
		faction={$playerData["Runner"].faction}
		align={align[1]}
		clicks={$playerData["Runner"].clicks}
		credits={$playerData["Runner"].credits}
	/>
</section>

<style lang="scss">
	.meta {
		grid-column: 1/-1;
		// display: grid;
		// grid-template-columns: 1fr 3fr 1fr;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;

		&__brand {
		}

		&--ltr {
			// Default
		}

		&--rtl {
			flex-direction: row-reverse;
		}
	}
</style>
