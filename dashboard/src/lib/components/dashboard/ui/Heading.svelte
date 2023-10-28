<script lang="ts">
	export let title: string = "";
	export let level: 2 | 3 | 4 | 5 | 6 = 2;
	export let icon: string | null = null;
</script>

<div class="heading">
	{#if icon}
		<!-- svelte-ignore a11y-missing-attribute -->
		<img class="heading__icon" src={icon} />
	{/if}

	{#if level === 1}
		<h1 class="heading__title">{@html title}</h1>
	{:else if level === 2}
		<h2 class="heading__title">{@html title}</h2>
	{:else if level === 3}
		<h3 class="heading__title">{@html title}</h3>
	{:else if level === 4}
		<h4 class="heading__title">{@html title}</h4>
	{:else if level === 5}
		<h4 class="heading__title">{@html title}</h4>
	{:else if level === 6}
		<h4 class="heading__title">{@html title}</h4>
	{/if}

	<slot name="toggle" />
</div>

<style lang="scss">
	.heading {
		display: flex;
		flex-direction: row;
		align-items: center;
		gap: 0.5rem;

		&__icon {
			width: 1.5rem;
			height: 1.5rem;
			fill: #fff;
		}

		&__title {
			display: flex;
			flex-direction: row;
			justify-content: flex-start;
			align-items: center;
			gap: 0.25rem;
			flex-grow: 1;
			grid-column: 1/-1;
		}
	}
</style>
