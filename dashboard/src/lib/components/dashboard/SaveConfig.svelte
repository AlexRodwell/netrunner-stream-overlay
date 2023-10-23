<script lang="ts">
	import { createEventDispatcher } from "svelte";
	import Modal from "$lib/components/dashboard/ui/Modal.svelte";
	import Actions from "./ui/Actions.svelte";
	import { FileJson2 } from "lucide-svelte";
	import Button from "./ui/Button.svelte";
	import { globalData, playerData } from "$lib/store";
	import type {
		GlobalData as TGlobalData,
		PlayerData as TPlayerData,
	} from "$lib/types";

	const dispatch = createEventDispatcher();

	$: global = $globalData;
	$: player = $playerData;

	$: display = false;
	$: success = false;

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
			dispatch("import", jsonData);
			display = false;
			success = true;
		} catch (error) {
			console.error("Error parsing JSON file:", error);
		}
	};
</script>

<label>
	<Button
		variant="outline"
		on:click={() => {
			display = true;
		}}
	>
		<FileJson2 size={16} />
		Save/import config
	</Button>
	{#if display}
		<Modal bind:display>
			<h2 slot="header">Save/import config</h2>
			<input type="file" accept=".json" on:change={handleFileSelect} />

			{#if success}
				<p>JSON imported successfully</p>
				<button on:click={() => (display = false)}>Close</button>
			{:else}
				<Actions>
					<Button
						on:click={() => {
							dispatch("save");
							display = false;
						}}>Save player config</Button
					>
					<Button
						class="button button--outline"
						on:click={() => {
							display = false;
						}}>Import player config</Button
					>
				</Actions>
			{/if}
		</Modal>
	{/if}
</label>

<style lang="scss">
	// TODO
</style>
