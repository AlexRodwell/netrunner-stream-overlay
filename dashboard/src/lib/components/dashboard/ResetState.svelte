<script lang="ts">
	import { createEventDispatcher } from "svelte";
	import { ListRestart } from "lucide-svelte";
	import { Button, buttonVariants } from "$lib/components/ui/button";
	import * as Dialog from "$lib/components/ui/dialog";

	const dispatch = createEventDispatcher();
	let open: boolean = false;
</script>

<Dialog.Root bind:open>
	<Dialog.Trigger class={buttonVariants({ variant: "outline" })}>
		<ListRestart size={16} class="mr-1" />
		Reset game state
	</Dialog.Trigger>
	<Dialog.Content class="sm:max-w-[425px]">
		<Dialog.Header>
			<Dialog.Title>Reset game data</Dialog.Title>
			<Dialog.Description>
				Reset clicks, credits, agendas, and wins to default state
				(relative to active side)
			</Dialog.Description>
		</Dialog.Header>
		<Dialog.Footer>
			<Button
				variant="destructive"
				on:click={() => {
					open = !open;
					dispatch("reset");
				}}>Reset game state</Button
			>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
