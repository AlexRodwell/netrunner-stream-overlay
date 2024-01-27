<script lang="ts">
	import { PUBLIC_WEBSOCKET_CONNECTION } from "$env/static/public";
	import { globalData } from "$lib/store";
	import Loading from "$components/Loading.svelte";

	$: connection = $globalData.websocket.status;
</script>

{#if PUBLIC_WEBSOCKET_CONNECTION.toLowerCase() === "true"}
	<p class="flex flex-row gap-2 items-center">
		{#if connection}
			Connected to websocket
		{:else}
			<Loading size={1.5} />
			Connecting to websocket
		{/if}
	</p>
{/if}
