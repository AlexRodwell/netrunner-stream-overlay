<script lang="ts">
	export let count: number;
	export let align: "left" | "right";
</script>

<div class="wins wins--{align}">
	{#each Array(2) as _, index}
		<div
			class="wins__pip {count > 0 && index < count
				? 'wins__pip--active'
				: ''}"
		/>
	{/each}
</div>

<style lang="scss">
	.wins {
		// display: flex;
		display: inline-flex;
		gap: 0.5rem;
		width: fit-content;
		filter: drop-shadow(2px 2px black);

		&__pip {
			width: 0.875rem;
			height: 0.875rem;
			border: 2px solid #fff;
			border-radius: 100%;

			&--active {
				background: #fff;
			}
		}

		&--left {
			flex-direction: row;
		}

		&--right {
			flex-direction: row-reverse;
		}
	}
</style>
