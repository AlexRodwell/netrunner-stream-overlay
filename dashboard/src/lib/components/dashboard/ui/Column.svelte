<script lang="ts">
	export let columns: number = 1;
	export let span: string = "";

	$: classColumns = columns ? `--columns: ${columns};` : "";
	$: classSpan = span ? `--span: ${span};` : "";
</script>

<div class="column" style="{classColumns} {classSpan}">
	<slot />
</div>

<style lang="postcss">
	.column {
		display: grid;
		gap: 1rem;
		grid-template-columns: repeat(var(--columns), minmax(0, 1fr));
		grid-column: var(--span);
	}
</style>
