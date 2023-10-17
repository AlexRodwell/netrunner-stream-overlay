<slot />

<style lang="scss">
	:global(html) {
		scroll-behavior: smooth;
		font-size: 16px; // Fallback for clamp()
		font-size: clamp(
			1rem,
			0.875rem + 0.5vw,
			1.25rem
		); // Scales between 400-800px https://clamp.font-size.app/
	}
</style>
