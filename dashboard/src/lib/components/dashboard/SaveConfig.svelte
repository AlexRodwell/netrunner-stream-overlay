<script lang="ts">
	import { createEventDispatcher } from "svelte";
	import Modal from "$lib/components/dashboard/ui/Modal.svelte";
	import Actions from "./ui/Actions.svelte";
	import { playerData } from "$lib/store";

	const dispatch = createEventDispatcher();
	$: display = false;

	let selectedFile = null;

	const handleFileSelect = (event) => {
		selectedFile = event.target.files[0];

		if (selectedFile) {
			const reader = new FileReader();

			reader.onload = (event) => {
				const fileContents = event.target.result;
				processJSONFile(fileContents);
			};

			reader.readAsText(selectedFile);
		}
	};

	const processJSONFile = (fileContents) => {
		try {
			const jsonData = JSON.parse(fileContents);
			// Now you can work with the JSON data, e.g., display it or manipulate it.
			console.log(jsonData);
			$playerData = jsonData;
			display = false;
		} catch (error) {
			console.error("Error parsing JSON file:", error);
		}
	};
</script>

<label>
	<button
		on:click={() => {
			display = true;
		}}>Save/import config</button
	>
	{#if display}
		<Modal bind:display>
			<h2 slot="header">Save/import config</h2>
			<input type="file" accept=".json" on:change={handleFileSelect} />

			<Actions>
				<button
					on:click={() => {
						dispatch("save");
						display = false;
					}}>Save player confog</button
				>
				<button
					class="button button--outline"
					on:click={() => {
						display = false;
					}}>Import player config</button
				>
			</Actions>
		</Modal>
	{/if}
</label>

<style lang="scss">
	// TODO
</style>
