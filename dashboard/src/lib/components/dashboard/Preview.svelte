<script lang="ts">
	import { Eye } from "lucide-svelte";
	import { Button, buttonVariants } from "$lib/components/ui/button";
	import * as Dialog from "$lib/components/ui/dialog";

	export let title: string;
	export let url: string;
	export let button: string;
</script>

<Dialog.Root>
	<Dialog.Trigger class={buttonVariants({ variant: "outline" })}>
		<Eye size={16} class="mr-1" />
		{button}
	</Dialog.Trigger>
	<Dialog.Content class="min-w-[calc(1920px+3rem)] min-h-[calc(1080px+3rem)]">
		<Dialog.Header>
			<Dialog.Title>Previewing: {title}</Dialog.Title>
		</Dialog.Header>
		<div>
			<iframe class="iframe" src={url} />
		</div>
	</Dialog.Content>
</Dialog.Root>

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
