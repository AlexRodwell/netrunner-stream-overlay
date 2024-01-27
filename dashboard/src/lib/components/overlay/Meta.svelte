<script lang="ts">
	import { default as Side } from "$components/overlay/MetaSide.svelte";
</script>

<section
	class="absolute bottom-0 left-0 right-0 col-[1/-1] flex flex-row justify-between items-center"
>
	<Side player="playerOne" />
	<Side player="playerTwo" />
</section>
