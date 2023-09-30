<script lang="ts">
	export let display: boolean;

	let dialog: HTMLDialogElement;

	$: if (dialog && display) dialog.showModal();
</script>

<!-- svelte-ignore a11y-click-events-have-key-events a11y-no-noninteractive-element-interactions -->
<dialog
	class="dialog"
	bind:this={dialog}
	on:close={() => (display = false)}
	on:click|self={() => dialog.close()}
>
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<div class="dialog__content" on:click|stopPropagation>
		<header class="dialog__header">
			<slot name="header" />
			<button autofocus on:click={() => dialog.close()}
				>close modal</button
			>
		</header>

		<slot />
	</div>
</dialog>

<style lang="scss">
	.dialog {
		&__header {
			display: flex;
			flex-direction: row;
			justify-content: space-between;
			align-items: center;
		}

		&__content {
			display: grid;
			gap: 1rem;
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
