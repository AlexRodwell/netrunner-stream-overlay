<script lang="ts">
    import type { PageData } from '../cards copy/$types';
    export let data: PageData;
	import {
		globalData,
	} from "$lib/store";
	import layout from "$lib/data/layout.json";
	import { default as Side } from "$components/overlay/MetaSide.svelte";
	import type { ThemeClasses as TThemeClasses } from "$lib/types";
	import Wrapper from "$components/overlay/Wrapper.svelte";

    let side = data.slug;

	const theme: TThemeClasses = layout[$globalData.overlay.layout];
</script>

<Wrapper>
	<section
		class="absolute bottom-0 left-0 right-0 col-[1/-1] flex flex-row justify-between items-center"
	>
		{#if side === "left"}
			<Side player="playerOne" {theme} />
		{:else if side === "right"}
			<Side player="playerTwo" {theme} />
		{/if}
	</section>
</Wrapper>