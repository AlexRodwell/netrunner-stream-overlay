<script lang="ts">
	export let count: number;
</script>

<div class="wins">
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
		display: flex;
		flex-direction: row;
		gap: 0.5rem;

		&__pip {
			width: 1rem;
			height: 1rem;
			border: 1px solid #fff;
			border-radius: 100%;

			&--active {
				background: #fff;
			}
		}
	}
</style>
