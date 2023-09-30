<script lang="ts">
	import Modal from "$lib/components/dashboard/ui/Modal.svelte";

	export let title: string;
	export let url: string;
	export let button: string;

	let display: boolean = false;
</script>

<button on:click={() => (display = true)}>{button}</button>

<Modal bind:display>
	<h2 slot="header">Previewing: {title}</h2>

	<!-- svelte-ignore a11y-missing-attribute -->
	<iframe class="iframe" src={url} />
</Modal>

<style lang="scss">
	.iframe {
		width: 1920px;
		height: 1080px;
		border: 1px solid #202020;
		border-radius: 4px;
		overflow: hidden;
	}
</style>
