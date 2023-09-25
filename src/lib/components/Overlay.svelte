<script lang="ts">
	import { info } from "$lib/store";
	import Side from "./Side.svelte";
</script>

{#if $info.corp.name && $info.runner.name}
	<section
		class="w-[100vw] h-[auto] fixed bottom-0 grid grid-cols-3"
		style="background: red;"
	>
		<Side
			faction={$info.corp.name}
			align="left"
			clicks={$info.corp.clicks}
			credits={$info.corp.credits}
		/>

		<div
			class="flex flex-column justify-center items-center bg-black relative"
		>
			<div
				class="left-[50%] absolute transform translate-x-[-50%] bottom-0 height-[120%] bg-red-300 p-4"
			>
				Logo
			</div>
		</div>

		<Side
			faction={$info.runner.name}
			align="right"
			clicks={$info.runner.clicks}
			credits={$info.runner.credits}
		/>
		<!-- <img class="w-[300px] center-elm" alt="The project logo" src={photo} /> -->
	</section>
{:else}
	No data found... listening for changes
{/if}

<style lang="scss">
	.center-elm {
		@apply top-[50%] left-[50%] absolute transform translate-x-[-50%] translate-y-[-50%];
	}
</style>
