<script lang="ts">
	export let count: number;
	export let align: "left" | "right";
</script>

<div
	class="inline-flex gap-2 w-[fit-content] [filter:drop-shadow(2px_2px_black)] {align ===
	'left'
		? 'flex-row'
		: 'flex-row-reverse'}"
>
	{#each Array(2) as _, index}
		<div
			class="w-3.5 h-3.5 border-[2px] border-[solid] border-white rounded-full {count >
				0 && index < count
				? 'bg-white'
				: ''}"
		/>
	{/each}
</div>
