<script lang="ts">
	import { createEventDispatcher } from "svelte";
	import { FlipHorizontal2 } from "lucide-svelte";
	import Button from "./ui/Button.svelte";

	const dispatch = createEventDispatcher();
</script>

<label>
	<Button
		variant="outline"
		on:click={() => {
			dispatch("flip");
		}}
	>
		<FlipHorizontal2 size={16} />
		Flip players
	</Button>
</label>
