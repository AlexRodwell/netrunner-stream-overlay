<script lang="ts">
	import { Button } from "$lib/components/ui/button";
</script>

<main class="w-screen h-screen flex flex-col justify-center items-center gap-4">
	<div class="grid grid-cols-4 gap-4">
		<Button variant="outline" href="/dashboard">Dashboard</Button>
		<Button variant="outline" href="/overlay">Overlay</Button>
		<Button variant="outline" href="/overlay/commentators"
			>Commentators</Button
		>
		<Button variant="outline" href="/overlay/timer">Timer</Button>
		<Button variant="outline" href="/overlay/player/one">Player One</Button>
		<Button variant="outline" href="/overlay/player/two">Player Two</Button>
	</div>
</main>
