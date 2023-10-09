<script>
	import Socket from "$lib/components/Socket.svelte";
	import "../../app.scss";
</script>

<svelte:head>
	<meta name="viewport" content="width=device-width, initial-scale=1.0" />
	<link rel="preconnect" href="https://static.nrdbassets.com/" />
	<style>
		body {
			color: #fff;
		}
	</style>
</svelte:head>

<Socket>
	<slot />
</Socket>
