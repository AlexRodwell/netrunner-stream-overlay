<script lang="ts">
	import { PUBLIC_WEBSOCKET_CONNECTION } from "$env/static/public";
	import { globalData } from "$lib/store";
	import Loading from "$components/Loading.svelte";

	$: connection = $globalData.websocket.status;
</script>

{#if PUBLIC_WEBSOCKET_CONNECTION.toLowerCase() === 'true'}
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
<p class="connection connection--active">
	Using localStorage
</p>
{/if}

<style lang="scss">
	.connection {
		padding: 0.5rem;
		border: 1px solid #262626;
		background: #202020;
		color: #fff;
		border-radius: 4px;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		grid-column: 1/-1;

		&--active {
			border-color: #2a6c21;
			background: rgb(30, 34, 27);
			background: linear-gradient(
				0deg,
				rgba(30, 34, 27, 1) 0%,
				rgba(46, 70, 43, 1) 100%
			);
		}

		&--inactive {
			border-color: #6c2121;
			background: rgb(34, 27, 27);
			background: linear-gradient(
				0deg,
				rgba(34, 27, 27, 1) 0%,
				rgba(112, 41, 41, 1) 100%
			);
		}

		:global(.loading) {
			width: 1rem;
			height: 1rem;
			border-width: 0.125rem;
		}
	}
</style>
