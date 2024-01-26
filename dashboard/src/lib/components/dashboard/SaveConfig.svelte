<script lang="ts">
	import { createEventDispatcher } from "svelte";
	import { FileJson2 } from "lucide-svelte";
	import { Button, buttonVariants } from "$lib/components/ui/button";
	import * as Dialog from "$lib/components/ui/dialog";
	import { Input } from "$lib/components/ui/input";
	import { Label } from "$lib/components/ui/label";
	import * as Alert from "$lib/components/ui/alert";
	import * as Card from "$lib/components/ui/card";
	import Header from "./Header.svelte";

	const dispatch = createEventDispatcher();

	let success: boolean = false;
	let loading: boolean = false;

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
			loading = true;
			setTimeout(() => {
				success = true;
				loading = false;
			}, 1500);
		} catch (error) {
			console.error("Error parsing JSON file:", error);
		}
	};

	let open: boolean = false;
</script>

<Dialog.Root bind:open closeOnOutsideClick={false}>
	<Dialog.Trigger class={buttonVariants({ variant: "outline" })}>
		<FileJson2 size={16} />
		Save/import config
	</Dialog.Trigger>
	<Dialog.Content class="sm:max-w-[425px]">
		<Dialog.Header>
			<Dialog.Title>Save/import config</Dialog.Title>
		</Dialog.Header>

		<Card.Root>
			<Card.Header>
				<Label for="picture">Import</Label>
			</Card.Header>
			<Card.Content class="grid w-full max-w-sm items-center gap-1.5">
				<Input
					id="picture"
					type="file"
					accept=".json"
					on:change={handleFileSelect}
				/>
				{#if loading}
					loading...
				{/if}
				{#if success}
					<Alert.Root variant="default">
						<Alert.Title>JSON imported successfully</Alert.Title>
					</Alert.Root>
				{/if}
			</Card.Content>
		</Card.Root>

		<Card.Root>
			<Card.Header>
				<Label for="picture">Export</Label>
			</Card.Header>
			<Card.Content class="grid w-full max-w-sm items-center gap-1.5">
				<Button
					variant="outline"
					on:click={() => {
						// open = !open;
						dispatch("save");
					}}>Save player config</Button
				>
			</Card.Content>
		</Card.Root>
	</Dialog.Content>
</Dialog.Root>
