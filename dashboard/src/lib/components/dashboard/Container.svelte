<script lang="ts">
	export let title: string = "";
	export let level: 2 | 3 | 4 | 5 | 6 = 2;
	export let icon: string = "";
	export let columns: 1 | 2 | 3 = 1;
	export let span: boolean = false;
	export let className: string = "";
	export let outline: boolean = true;
</script>

<section
	class="side__item side__item--group
	{outline ? 'side__item--outline' : ''}
	{columns > 1 ? `side__item--columns-${columns}` : ''} 
	{span ? 'side__item--span' : ''} 
	{className}"
	{...$$restProps}
>
	{#if title}
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
	{/if}

	<slot />
</section>

<style lang="scss">
	.side__item {
		display: grid;
		gap: 0.5rem;
		align-content: flex-start;
		grid-column: auto/span 2;

		&--wide {
			grid-column: auto/span 3;
		}

		&--outline {
			padding: 1rem;
			border: 1px solid #202020;
			border-radius: 8px;
		}

		&--columns-2 {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}

		&--columns-3 {
			grid-template-columns: repeat(3, minmax(0, 1fr));
		}

		&--span {
			grid-column: 1/-1;
		}

		&--danger {
			border-color: #6c2121;
			background: rgb(34, 27, 27);
			background: linear-gradient(
				0deg,
				rgba(34, 27, 27, 1) 0%,
				rgba(112, 41, 41, 1) 100%
			);
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
