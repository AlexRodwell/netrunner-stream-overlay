<script lang="ts">
	import type { PageData } from "./$types";
	import Highlight from "$lib/components/overlay/Highlight.svelte";

	export let data: PageData;
</script>

<main>
	<Highlight player={data.player} />
</main>

<style lang="scss">
	main {
		height: 100vh;
		display: flex;
		flex-direction: row;
		align-items: flex-end;
	}
</style>
