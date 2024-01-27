<script lang="ts">
	import { createEventDispatcher } from "svelte";
	import { ChevronsUpDown } from "lucide-svelte";
	import * as Command from "$lib/components/ui/command";
	import * as Popover from "$lib/components/ui/popover";
	import { Button } from "$lib/components/ui/button";
	import { tick } from "svelte";
	import JSON_COUNTRIES from "world_countries_lists/data/countries/en/countries.json";
	import { get_flag_by_iso_code } from "$lib/utils";

	const dispatch = createEventDispatcher();

	let open = false;
	let value = "";

	$: selected =
		JSON_COUNTRIES.find((f: any) => f.alpha2 === value) ??
		"Select a country";

	// We want to refocus the trigger button when the user selects
	// an item from the list so users can continue navigating the
	// rest of the form with the keyboard.
	function closeAndFocusTrigger(triggerId: string) {
		open = false;
		tick().then(() => {
			document.getElementById(triggerId)?.focus();
		});
	}
</script>

<Popover.Root bind:open let:ids>
	<Popover.Trigger asChild let:builder>
		<Button
			builders={[builder]}
			variant="outline"
			role="combobox"
			aria-expanded={open}
			class="w-full justify-between"
		>
			{get_flag_by_iso_code(selected.alpha2).icon}
			{selected.name}
			<ChevronsUpDown class="ml-2 h-4 w-4 shrink-0 opacity-50" />
		</Button>
	</Popover.Trigger>
	<Popover.Content class="max-w-[100%] p-0">
		<Command.Root>
			<Command.Input placeholder="Search country..." />
			<Command.Group class="max-h-[300px] overflow-y-auto">
				{#each JSON_COUNTRIES as country}
					<Command.Item
						value={country.alpha2}
						onSelect={() => {
							value = country.alpha2;
							dispatch("country", country.alpha2);
							closeAndFocusTrigger(ids.trigger);
						}}
					>
						{country.name}
						{get_flag_by_iso_code(country.alpha2).icon}
					</Command.Item>
				{/each}
			</Command.Group>
		</Command.Root>
	</Popover.Content>
</Popover.Root>
