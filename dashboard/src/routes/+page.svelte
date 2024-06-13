<script lang="ts">
	import { Button } from "$lib/components/ui/button";
	import { t } from "$lib/translations";
</script>

<main class="bg-[#101010] text-foreground w-screen h-screen flex flex-col justify-center items-center gap-4">
	<div class="grid grid-cols-2 gap-4 w-[40vw] h-[25vh]">
		<Button variant="outline" class="w-full h-full col-span-full" align="center" href="/dashboard">{$t('dashboard')}</Button>
		<Button variant="outline" class="w-full h-full col-span-full" align="center" href="/overlay">{$t('overlay_aio')}</Button>

		<div class="grid gap-2">
			<Button variant="outline" class="w-full h-full" align="center" href="/overlay/player/left/details">{$t('overlay_details') + " " + $t('left')}</Button>
			<Button variant="outline" class="w-full h-full" align="center" href="/overlay/player/left/cards">{$t('cards') + " " + $t('left')}</Button>
		</div>

		<div class="grid gap-2">
			<Button variant="outline" class="w-full h-full" align="center" href="/overlay/player/right/details">{$t('overlay_details') + " " + $t('right')}</Button>
			<Button variant="outline" class="w-full h-full" align="center" href="/overlay/player/right/cards">{$t('cards') + " " + $t('right')}</Button>
		</div>

		<Button variant="outline" class="w-full h-full col-span-full" align="center" href="/overlay/commentators">{$t('commentators')}</Button>
		<Button variant="outline" class="w-full h-full col-span-full" align="center" href="/overlay/timer">{$t('timer')}</Button>
	</div>
</main>
