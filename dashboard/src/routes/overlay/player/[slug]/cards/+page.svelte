<script lang="ts">
    import type { PageData } from './$types';
    export let data: PageData;
	import {
		globalData,
		playerOneData,
		playerTwoData,
	} from "$lib/store";
	import CardHighlight from "$components/overlay/CardHighlight.svelte";
	import layout from "$lib/data/layout.json";
	import Wrapper from "$components/overlay/Wrapper.svelte";

    let side = data.slug;
</script>

<Wrapper>
    {#if side === "left"}
        <CardHighlight
            player="playerOne"
            data={$playerOneData.highlight}
            side={$playerOneData.side}
        />
        <div/>
    {:else if side === "right"}
        <div/>
        <CardHighlight
            player="playerTwo"
            data={$playerTwoData.highlight}
            side={$playerTwoData.side}
        />
    {/if}
</Wrapper>