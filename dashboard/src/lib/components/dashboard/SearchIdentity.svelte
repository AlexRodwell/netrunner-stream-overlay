<script lang="ts">
	import { createEventDispatcher } from "svelte";
	import { Check, ChevronsUpDown } from "lucide-svelte";
	import * as Command from "$lib/components/ui/command";
	import * as Popover from "$lib/components/ui/popover";
	import { Button } from "$lib/components/ui/button";
	import { tick } from "svelte";
	import { netrunnerDB } from "$lib/store";
	import type { GameSide as TGameSide, Card as TCard } from "$lib/types";
	import { find_faction_by_id, slugify } from "$lib/utils";

	export let player: TPlayerSide;
	export let side: TGameSide;

	const dispatch = createEventDispatcher();

	const identities = $netrunnerDB.data.filter(
		(card: TCard) =>
			card.attributes.side_id === side &&
			card.attributes.card_type_id === `${side}_identity`,
	);

	let open = false;
	let value = "";

	$: selected =
		identities.find(
			(f: any) => slugify(f.attributes.stripped_title) === slugify(value),
		)?.attributes.title ?? "Select an identity";

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
			{@const faction = find_faction_by_id(selected)}

			{#if faction}
				<img class="min-w-6 w-6 min-h-6 h-6" src={faction.logo} />
			{/if}

			{selected}
			<ChevronsUpDown
				slot="icon-after"
				class="ml-2 h-4 w-4 shrink-0 opacity-50"
			/>
		</Button>
	</Popover.Trigger>
	<Popover.Content class="max-w-[100%] p-0">
		<Command.Root>
			<Command.Input placeholder="Search identity..." />
			<Command.Empty>No framework found.</Command.Empty>
			<Command.Group class="max-h-[300px] overflow-y-auto">
				{#each identities as id}
					{@const faction = find_faction_by_id(
						id.attributes.stripped_title,
					)}

					<Command.Item
						value={slugify(id.attributes.stripped_title)}
						onSelect={(currentValue) => {
							value = currentValue;
							dispatch("change", id.attributes.stripped_title);
							closeAndFocusTrigger(ids.trigger);
						}}
					>
						{#if faction}
							<img class="w-6 h-6 mr-1" src={faction.logo} />
						{/if}
						{id.attributes.stripped_title}
					</Command.Item>
				{/each}
			</Command.Group>
		</Command.Root>
	</Popover.Content>
</Popover.Root>
