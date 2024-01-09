<script lang="ts">
	import { globalData } from "$lib/store";

	$: data = $globalData;
</script>

<div class="commentators">{data.overlay.commentators}</div>

<style lang="scss">
	.commentators {
		padding: 0.75rem;
		background: #fff;
		color: #000;
		position: absolute;
		top: 1rem;
		left: 50%;
		transform: translateX(-50%);
		font-size: 1.5rem;
	}
</style>
