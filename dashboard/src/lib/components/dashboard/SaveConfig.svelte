<script lang="ts">
	import { createEventDispatcher } from "svelte";
	import Actions from "./ui/Actions.svelte";
	import { FileJson2 } from "lucide-svelte";
	import Card from "./ui/Card.svelte";
	import Heading from "$components/dashboard/ui/Heading.svelte";
	import { Button, buttonVariants } from "$lib/components/ui/button";
	import * as Dialog from "$lib/components/ui/dialog";
	import { Input } from "$lib/components/ui/input";
	import { Label } from "$lib/components/ui/label";
	import { Terminal } from "lucide-svelte";
  import * as Alert from "$lib/components/ui/alert";

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

<Dialog.Root>
	<Dialog.Trigger class={buttonVariants({ variant: "outline" })}>
		<FileJson2 size={16} />
		Save/import config
	</Dialog.Trigger>
	<Dialog.Content class="sm:max-w-[425px]">
		<Dialog.Header>
			<Dialog.Title>Save/import config</Dialog.Title>
		</Dialog.Header>

	
		<div class="grid w-full max-w-sm items-center gap-1.5">
			<Label for="picture">Import</Label>
			<Input id="picture" type="file" accept=".json" on:change={handleFileSelect} />
		</div>

		{#if success}
		<Alert.Root variant="default">
			<Alert.Title>JSON imported successfully</Alert.Title>
		</Alert.Root>
		{/if}

		<Dialog.Footer>
			<Button
				variant="outline"
				on:click={() => {
					dispatch("save");
					display = false;
				}}>Save player config</Button
			>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
