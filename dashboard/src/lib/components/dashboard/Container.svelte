<script lang="ts">
	export let title: string;
	export let level: 2 | 3 | 4 | 5 | 6;
	export let icon: string = "";
	export let columns: 1 | 2 = 1;
	export let span: boolean = false;
</script>

<section
	class="side__item side__item--group {columns > 1
		? `side__item--columns-${columns}`
		: ''} {span ? 'side__item--span' : ''}"
>
	<div class="side__item__title">
		{#if icon}
			<img class="side__item__icon" src={icon} />
		{/if}

		{#if level === 2}
			<h2 class="side__item__title">{@html title}</h2>
		{:else if level === 3}
			<h3 class="side__item__title">{@html title}</h3>
		{:else if level === 4}
			<h4 class="side__item__title">{@html title}</h4>
		{/if}

		<slot name="toggle" />
	</div>
	<slot />
</section>

<style lang="scss">
	.side__item {
		display: grid;
		gap: 0.5rem;
		padding: 1rem;
		border: 1px solid #202020;
		border-radius: 8px;
		align-content: flex-start;

		&--columns-2 {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}

		&--span {
			grid-column: 1/-1;
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

		&__icon {
			width: 1.5rem;
			height: 1.5rem;
			fill: #fff;
		}
	}
</style>
