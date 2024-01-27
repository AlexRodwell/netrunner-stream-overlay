<script lang="ts">
	import type { PageData } from "./$types";
	import { default as Player } from "$components/overlay/MetaSide.svelte";

	export let data: PageData;
</script>

<Player player={data.player} />
