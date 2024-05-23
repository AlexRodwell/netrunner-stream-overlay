<script lang="ts">
	export let fill: "white" | "black" = "white";
	export let size: number = 4;
</script>

<div
	class="loading {$$props['class']}"
	style="--fill: {fill === 'white'
		? 'rgb(255,255,255)'
		: 'rgb(0,0,0)'}; --size: {size}rem"
/>

<style lang="postcss">
	.loading {
		animation: spin 800ms linear infinite;
		height: var(--size);
		width: var(--size);
		border-radius: 100%;
		border: calc(var(--size) / 6) solid var(--fill);
		border-top: calc(var(--size) / 6) solid transparent;
	}

	@keyframes spin {
		0% {
			transform: rotate(0deg);
		}
		100% {
			transform: rotate(360deg);
		}
	}
</style>
