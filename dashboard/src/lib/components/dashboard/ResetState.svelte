<script lang="ts">
	import { createEventDispatcher } from "svelte";
	import Modal from "$components/dashboard/ui/Modal.svelte";
	import Actions from "./ui/Actions.svelte";
	import { ListRestart } from "lucide-svelte";
	import Button from "./ui/Button.svelte";

	const dispatch = createEventDispatcher();
	$: display = false;
</script>

<!-- svelte-ignore a11y-label-has-associated-control -->
<label>
	<Button
		variant="outline"
		on:click={() => {
			display = true;
		}}
	>
		<ListRestart size={16} />
		Reset game state
	</Button>
	{#if display}
		<Modal bind:display>
			<h2 slot="header">Reset game data</h2>
			<p>
				Reset clicks, credits, agendas, and wins to default state
				(relative to active side)
			</p>
			<Actions>
				<Button
					on:click={() => {
						dispatch("reset");
						display = false;
					}}>Reset game state</Button
				>
				<Button
					class="button button--outline"
					on:click={() => {
						display = false;
					}}>Cancel</Button
				>
			</Actions>
		</Modal>
	{/if}
</label>

<style lang="scss">
	// TODO
</style>
