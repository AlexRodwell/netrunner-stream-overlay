<script lang="ts">
	import { fly } from 'svelte/transition';

	// export let title: string;
	export let code: string;

	$: url = `https://static.nrdbassets.com/v1/large/{code}.jpg`.replace(
		'{code}',
		code
	);
</script>

<img
	data-id={code}
	src={url}
	in:fly={{
		x: 100,
		duration: 300,
	}}
	out:fly={{
		y: -100,
		duration: 300,
	}}
	alt={code}
/>

<style>
	img {
		/* border-radius: 12px; */
		border-radius: 4%;
		overflow: hidden;
		max-width: 12vw;
		width: var(--width);
	}
</style>
