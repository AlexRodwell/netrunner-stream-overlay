<slot />

<style lang="scss">
	:global(html) {
		scroll-behavior: smooth;
		font-size: 16px; // Fallback for clamp()
		font-size: clamp(
			0.875rem,
			0.8092rem + 0.2632vw,
			1.125rem
		); // Scales between 400-800px https://clamp.font-size.app/
	}
</style>
