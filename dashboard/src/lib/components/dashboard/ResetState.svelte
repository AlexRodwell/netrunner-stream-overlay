<script lang="ts">
	import { createEventDispatcher } from "svelte";
	import { ListRestart } from "lucide-svelte";
	import { Button, buttonVariants } from "$lib/components/ui/button";
	import * as Dialog from "$lib/components/ui/dialog";

	const dispatch = createEventDispatcher();
</script>

<Dialog.Root>
	<Dialog.Trigger class={buttonVariants({ variant: "outline" })}>
		<ListRestart size={16} />
		Reset game state
	</Dialog.Trigger>
	<Dialog.Content class="sm:max-w-[425px]">
		<Dialog.Header>
			<Dialog.Title>Reset game data</Dialog.Title>
			<Dialog.Description>
				Reset clicks, credits, agendas, and wins to default state (relative to active side)
			</Dialog.Description>
		</Dialog.Header>
		<Dialog.Footer>
			<Button
				variant="destructive"
				on:click={() => {
					dispatch("reset");
				}}>Reset game state</Button
			>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>