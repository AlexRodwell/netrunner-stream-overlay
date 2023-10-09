<script lang="ts">
	import type { PageData } from "./$types";
	import { default as Player } from "$lib/components/overlay/MetaSide.svelte";
	import { playerData } from "$lib/store";

	export let data: PageData;
</script>

<Player player={data.player} />
