<script lang="ts">
	import { deploy } from "$lib/store";
	import { createEventDispatcher } from "svelte";

	const dispatch = createEventDispatcher();
</script>

<label class="checkbox">
	<span>{$deploy.type === "manual" ? "Manual" : "Automatic (instant)"}</span>
	<input
		type="checkbox"
		checked={$deploy.type === "manual"}
		on:click={(e) => {
			$deploy.type = e.target.checked ? "manual" : "automatic";
		}}
	/>
	<span class="checkbox__mark" />
</label>

{#if $deploy.type === "manual"}
	<button
		on:click={() => {
			dispatch("proceed");
		}}>Deploy</button
	>
	{$deploy.proceed}
{/if}
