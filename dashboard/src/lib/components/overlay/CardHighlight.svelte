<script lang="ts">
	import Card from "../Card.svelte";
	import type { Highlight as THighlight, PlayerSide as TPlayerSide, GameSide as TGameSide } from "$lib/types";

	export let player: TPlayerSide;
	export let data: THighlightGroup;
	export let side: TGameSide;
	export let width: number = 12;

	$: align = player === "playerOne" ? 'left' : 'right';

	let classes = {
		wrapper: {
			left: `left-0 ml-[var(--padding)] justify-start`,
			right: `right-0 mr-[var(--padding)] justify-end`
		},
		card: {
			primary: {
				shared: {
					default: 'w-[var(--width)] z-10 bottom-0',
					inactive: '50vw'
				},
				left: 'left-0 origin-bottom-left -rotate-2',
				right: 'right-0 origin-bottom-right rotate-2'
			},
			secondary: {
				shared: {
					default: 'w-[calc(var(--width)-2rem)] bottom-8',
					inactive: '-50vw'
				},
				left: 'left-[calc(var(--width)-4rem)] origin-bottom-left rotate-3',
				right: 'right-[calc(var(--width)-4rem)] origin-bottom-right -rotate-3'
			},
		}
	}
</script>

<div class="flex flex-col mb-[calc((var(--padding)*2)+100px)] relative bottom-0 {classes.wrapper[align]}" style="--width: {width}vw">
	{#each ['primary', 'secondary'] as type}
		<div 
			id="{player}-card-{type}" 
			class="absolute {classes.card[type].shared.default} {classes.card[type][align]}"
			style="transform: translateX({data[type].active ? '0' : (player === "playerOne" ? '-300' : '300')}%); transition: transform 200ms ease-in-out 260ms; --transition-delay: {data[type].active ? '480ms' : '0ms'}"
		>
			<Card code={data[type].current} flip={!data[type].active} {side} />
		</div>
	{/each}
</div>
