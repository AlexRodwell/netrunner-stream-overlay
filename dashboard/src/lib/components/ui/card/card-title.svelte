<script lang="ts">
	import type { HTMLAttributes } from "svelte/elements";
	import { cn } from "$lib/utils";
	import type { HeadingLevel } from ".";

	type $$Props = HTMLAttributes<HTMLHeadingElement> & {
		tag?: HeadingLevel;
	};

	let className: $$Props["class"] = undefined;
	export let tag: $$Props["tag"] = "h3";
	export { className as class };
</script>

<svelte:element
	this={tag}
	class={cn(
		"text-lg font-semibold leading-none tracking-tight",
		className,
		"grid grid-cols-[1fr,auto] items-center",
	)}
	{...$$restProps}
>
	<div class="flex flex-row items-center justify-start gap-1">
		{#if $$slots.icon}
			<slot name="icon" />
		{/if}
		<slot />
	</div>
	{#if $$slots.action}
		<div class="flex flex-row items-center justify-end gap-1">
			<slot name="action" />
		</div>
	{/if}
</svelte:element>

<style>
	img {
		@apply min-w-6 w-6 min-h-6 h-6;
	}
</style>
