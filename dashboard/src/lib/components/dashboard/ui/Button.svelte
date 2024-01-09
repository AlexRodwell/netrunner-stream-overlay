<script lang="ts">
	export { className as class };

	export let variant: "outline" | string = "";
</script>

<button
	class="button {variant ? `button--${variant}` : ''}"
	on:click
	on:keydown
	{...$$restProps}
>
	<slot name="icon" />
	<slot />
</button>

<style lang="scss">
	button {
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		gap: 4px;
		line-height: 1;
	}

	.button {
		transition: background 80ms ease;

		&--outline {
			&:hover {
				background: rgba(255, 255, 255, 0.1);
			}
		}
	}
</style>
