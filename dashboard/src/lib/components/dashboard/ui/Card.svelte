<script lang="ts">
	export let span: boolean = false;
	export let className: string = "";
	export let outline: boolean = true;
	export let uid: string | null = null;
</script>

<section
	class="card card--group
	{outline ? 'card--outline' : ''}
	{span ? 'card--span' : ''} 
	{className}"
	data-uid={uid}
	{...$$restProps}
>
	<slot />
</section>

<!-- <style lang="scss">
	.card {
		display: grid;
		gap: 0.5rem;
		align-content: flex-start;
		// grid-column: auto/span 2;
		// background-color: #0d0d0d;

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
	}
</style> -->
