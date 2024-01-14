<script lang="ts">
	import { Button as ButtonPrimitive } from "bits-ui";
	import { cn } from "$lib/utils";
	import { buttonVariants, type Props, type Events } from ".";

	type $$Props = Props;
	type $$Events = Events;

	let className: $$Props["class"] = undefined;
	export let variant: $$Props["variant"] = "default";
	export let size: $$Props["size"] = "default";
	export let builders: $$Props["builders"] = [];
	export { className as class };
</script>

<ButtonPrimitive.Root
	{builders}
	class={cn(buttonVariants({ variant, size, className }),  "grid grid-cols-[1fr,auto]")}
	type="button"
	{...$$restProps}
	on:click
	on:keydown
>

	<div class="flex flex-row gap-1 items-center overflow-hidden overflow-ellipsis whitespace-nowrap">
		{#if $$slots['icon-before']}
			<slot name="icon-before" />
		{/if}
		<slot />
	</div>
	
	{#if $$slots['icon-after']}
		<slot name="icon-after" />
	{/if}

</ButtonPrimitive.Root>
