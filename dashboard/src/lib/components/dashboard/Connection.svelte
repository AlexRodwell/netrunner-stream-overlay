<script lang="ts">
	import { PUBLIC_WEBSOCKET_CONNECTION } from "$env/static/public";
	import { globalData } from "$lib/store";
	import Loading from "$components/Loading.svelte";

	$: connection = $globalData.websocket.status;
</script>

{#if PUBLIC_WEBSOCKET_CONNECTION.toLowerCase() === "true"}
	<p class="connection connection--{connection ? 'active' : 'inactive'}">
		{#if connection}
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="24"
				height="24"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="3"
				stroke-linecap="round"
				stroke-linejoin="round"
				class="lucide lucide-check"
				><polyline points="20 6 9 17 4 12" /></svg
			>
			Connected to websocket
		{:else}
			<Loading />
			Connection lost, attempting to reconnect
		{/if}
	</p>
{:else}
	<p class="connection connection--active">Using localStorage</p>
{/if}
