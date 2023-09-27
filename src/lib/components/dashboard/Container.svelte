<script lang="ts">
	export let title: string;
	export let level: 2 | 3 | 4 | 5 | 6;
</script>

<section class="item">
	{#if level === 2}
		<h2>{title}</h2>
	{:else if level === 3}
		<h3>{title}</h3>
	{:else if level === 4}
		<h4>{title}</h4>
	{/if}
	<slot />
</section>

<style lang="scss">
	.item {
		display: grid;
		gap: 1.5rem;
		padding: 2rem;
		border: 1px solid #202020;
		border-radius: 8px;
		align-content: flex-start;
	}
</style>
