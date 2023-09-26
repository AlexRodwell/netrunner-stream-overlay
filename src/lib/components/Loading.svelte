<div class="loading" />

<style lang="scss">
	.loading {
		animation: spin 800ms linear infinite;
		height: 4rem;
		width: 4rem;
		border-radius: 100%;
		border: 0.5rem solid rgba(255, 255, 255, 0.1);
		border-top: 0.5rem solid rgb(255, 255, 255);

		@keyframes spin {
			0% {
				transform: rotate(0deg);
			}
			100% {
				transform: rotate(360deg);
			}
		}
	}
</style>
