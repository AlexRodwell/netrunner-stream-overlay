<script lang="ts">
	import Modal from "$lib/components/dashboard/ui/Modal.svelte";
	import { Eye } from "lucide-svelte";
	import Button from "./ui/Button.svelte";

	export let title: string;
	export let url: string;
	export let button: string;

	let display: boolean = false;
</script>

<Button variant="outline" on:click={() => (display = true)}>
	<Eye size={16} />
	{button}
</Button>

<Modal bind:display>
	<h2 slot="header">Previewing: {title}</h2>

	<!-- svelte-ignore a11y-missing-attribute -->
	<iframe class="iframe" src={url} />
</Modal>

<style lang="scss">
	button {
		grid-column: 1/-1;
	}

	.iframe {
		width: 1920px;
		height: 1080px;
		border: 1px solid #202020;
		border-radius: 4px;
		overflow: hidden;
	}
</style>
