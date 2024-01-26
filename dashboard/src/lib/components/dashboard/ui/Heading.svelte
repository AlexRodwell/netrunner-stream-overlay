<script lang="ts">
	export let title: string = "";
	export let level: 2 | 3 | 4 | 5 | 6 = 2;
	export let icon: string | null = null;
</script>

<div class="flex flex-row items-center gap-2">
	{#if icon}
		<!-- svelte-ignore a11y-missing-attribute -->
		<img class="w-6 h-6 fill-white" src={icon} />
	{/if}

	{#if level === 1}
		<h1 class="title">{@html title}</h1>
	{:else if level === 2}
		<h2 class="title">{@html title}</h2>
	{:else if level === 3}
		<h3 class="title">{@html title}</h3>
	{:else if level === 4}
		<h4 class="title">{@html title}</h4>
	{:else if level === 5}
		<h4 class="title">{@html title}</h4>
	{:else if level === 6}
		<h4 class="title">{@html title}</h4>
	{/if}

	<slot name="toggle" />
</div>

<style lang="scss">
	.title {
		@apply flex flex-row justify-start items-center gap-1 flex-grow col-[1/-1];
	}
</style>
