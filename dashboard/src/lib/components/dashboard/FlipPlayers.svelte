<script lang="ts">
	import { createEventDispatcher } from "svelte";
	import { FlipHorizontal2 } from "lucide-svelte";
	import { Button } from "$lib/components/ui/button";

	const dispatch = createEventDispatcher();
</script>

<Button
	variant="outline"
	on:click={() => {
		dispatch("flip");
	}}
>
	<FlipHorizontal2 size={16} class="mr-1" />
	Flip players
</Button>
