<script lang="ts">
	export let display: boolean;
	export let size: "small" | "medium" | "large" = "small";

	let dialog: HTMLDialogElement;

	$: if (dialog && display) dialog.showModal();
</script>

<!-- svelte-ignore a11y-click-events-have-key-events a11y-no-noninteractive-element-interactions -->
<dialog
	class="dialog"
	bind:this={dialog}
	on:close={() => (display = false)}
	on:click|self={() => dialog.close()}
	{size}
>
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<div class="dialog__content" on:click|stopPropagation>
		<header class="dialog__header">
			<div class="dialog__title">
				<slot name="header" />
			</div>
			<button
				class="dialog__close"
				autofocus
				on:click={() => dialog.close()}
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="24"
					height="24"
					viewBox="0 0 24 24"
					fill="none"
					stroke="#FFF"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
					class="lucide lucide-x"
					><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg
				>
			</button>
		</header>

		<slot />
	</div>
</dialog>

<style lang="scss">
	.dialog {
		&[size="small"] {
			min-width: 30vw;
		}

		&[size="medium"] {
			min-width: 50vw;
		}

		&[size="large"] {
			min-width: 70vw;
		}

		&__header {
			display: flex;
			flex-direction: row;
			justify-content: flex-end;
			align-items: center;
		}

		&__title {
			flex-grow: 1;
		}

		&__content {
			display: grid;
			gap: 2rem;
		}

		&__close {
			background: unset;
			border: unset;
		}
	}

	dialog {
		border-radius: 8px;
		border: none;
		padding: 0;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);
		position: fixed;
		background: #121212;
		color: #fff;
	}

	dialog::backdrop {
		background: rgba(0, 0, 0, 0.3);
		backdrop-filter: blur(5px);
	}

	dialog > div {
		padding: 1em;
	}

	dialog[open] {
		animation: zoom 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
	}

	@keyframes zoom {
		from {
			transform: translate(-50%, -50%) scale(0.95);
		}
		to {
			transform: translate(-50%, -50%) scale(1);
		}
	}

	dialog[open]::backdrop {
		animation: fade 0.2s ease-out;
	}

	@keyframes fade {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}

	button {
		display: block;
	}
</style>
