<script lang="ts">
	import { globalData } from "$lib/store";

	$: data = $globalData;
</script>

{#if data.overlay.commentators}
	<div
		class="p-3 bg-white text-black absolute top-4 left-2/4 -translate-x-1/2 text-[1.5rem]"
	>
		{data.overlay.commentators}
	</div>
{/if}
