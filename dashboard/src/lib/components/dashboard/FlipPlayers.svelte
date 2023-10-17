<script lang="ts">
	import { createEventDispatcher } from "svelte";

	const dispatch = createEventDispatcher();
</script>

<label>
	<button
		on:click={() => {
			dispatch("flip");
		}}>Flip players</button
	>
</label>
