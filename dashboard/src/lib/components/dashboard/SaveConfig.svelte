<script lang="ts">
	import { createEventDispatcher } from "svelte";
	import Modal from "$components/dashboard/ui/Modal.svelte";
	import Actions from "./ui/Actions.svelte";
	import { FileJson2 } from "lucide-svelte";
	import Button from "./ui/Button.svelte";
	import Card from "./ui/Card.svelte";
	import Heading from "$components/dashboard/ui/Heading.svelte";

	const dispatch = createEventDispatcher();

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

			<Card>
				<Heading title="Import config" level={4} />
				<input
					type="file"
					accept=".json"
					on:change={handleFileSelect}
				/>
				{#if success}
					<p>JSON imported successfully</p>
					<button on:click={() => (display = false)}>Close</button>
				{:else}
					<Actions>
						<Button
							class="button button--outline"
							on:click={() => {
								display = false;
							}}>Import player config</Button
						>
					</Actions>
				{/if}
			</Card>

			<Card>
				<Heading title="Save config" level={4} />
				<Button
					on:click={() => {
						dispatch("save");
						display = false;
					}}>Save player config</Button
				>
			</Card>
		</Modal>
	{/if}
</label>

<style lang="scss">
	// TODO
</style>
