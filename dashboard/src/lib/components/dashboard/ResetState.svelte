<script lang="ts">
	import { createEventDispatcher } from "svelte";
	import Modal from "$lib/components/dashboard/ui/Modal.svelte";
	import Actions from "./ui/Actions.svelte";

	const dispatch = createEventDispatcher();
	$: display = false;
</script>

<label>
	<button
		on:click={() => {
			display = true;
		}}>Reset game state</button
	>
	{#if display}
		<Modal bind:display>
			<h2 slot="header">Reset game data</h2>
			<p>
				Reset clicks, credits, agendas, and wins to default state
				(relative to active side)
			</p>
			<Actions>
				<button
					on:click={() => {
						dispatch("reset");
						display = false;
					}}>Reset game state</button
				>
				<button
					class="button button--outline"
					on:click={() => {
						display = false;
					}}>Cancel</button
				>
			</Actions>
		</Modal>
	{/if}
</label>

<style lang="scss">
	// TODO
</style>
