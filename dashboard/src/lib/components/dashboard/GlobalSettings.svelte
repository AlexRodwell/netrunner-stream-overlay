<script lang="ts">
	import { createEventDispatcher } from "svelte";
	import Modal from "$lib/components/dashboard/ui/Modal.svelte";
	import Container from "$lib/components/dashboard/Container.svelte";
	import { globalData } from "$lib/store";

	// Icons
	import ICON_CLICKS from "$lib/assets/icons/NSG_CLICK.svg";
	import ICON_CREDITS from "$lib/assets/icons/NSG_CREDIT.svg";
	import ICON_AGENDAS from "$lib/assets/icons/NSG_AGENDA.svg";
	import { Settings } from "lucide-svelte";
	import Button from "./ui/Button.svelte";

	let global: TGlobalData = $globalData;

	const dispatch = createEventDispatcher();
	$: display = false;
</script>

<label>
	<Button
		variant="outline"
		on:click={() => {
			display = true;
		}}
	>
		<Settings size={16} />
		Global settings
	</Button>
	{#if display}
		<Modal bind:display size="medium">
			<h2 slot="header">Global settings</h2>

			<Container columns={3} outline={false}>
				<Container title="Player" level={3} outline={false}>
					<Container title="Name" level={4}>
						<label class="checkbox">
							<span>{global.name ? "On" : "Off"}</span>
							<input
								type="checkbox"
								bind:checked={global.name}
								on:click={(e) => {
									global.name = e.target.checked;
									dispatch("global");
								}}
							/>
							<span class="checkbox__mark" />
						</label>
					</Container>
					<Container title="Pronouns" level={4}>
						<label class="checkbox">
							<span>{global.pronoun ? "On" : "Off"}</span>
							<input
								type="checkbox"
								bind:checked={global.pronoun}
								on:click={(e) => {
									global.pronoun = e.target.checked;
									dispatch("global");
								}}
							/>
							<span class="checkbox__mark" />
						</label>
					</Container>
					<Container title="ID" level={4}>
						<label class="checkbox">
							<span>{global.id ? "On" : "Off"}</span>
							<input
								type="checkbox"
								bind:checked={global.id}
								on:click={(e) => {
									global.id = e.target.checked;
									dispatch("global");
								}}
							/>
							<span class="checkbox__mark" />
						</label>
					</Container>
					<Container title="Country" level={4}>
						<label class="checkbox">
							<span>{global.country ? "On" : "Off"}</span>
							<input
								type="checkbox"
								bind:checked={global.country}
								on:click={(e) => {
									global.country = e.target.checked;
									dispatch("global");
								}}
							/>
							<span class="checkbox__mark" />
						</label>
					</Container>
				</Container>

				<Container title="Game" level={3} outline={false}>
					<Container title="Clicks" level={4} icon={ICON_CLICKS}>
						<label class="checkbox">
							<span>{global.clicks ? "On" : "Off"}</span>
							<input
								type="checkbox"
								bind:checked={global.clicks}
								on:click={(e) => {
									global.clicks = e.target.checked;
									dispatch("global");
								}}
							/>
							<span class="checkbox__mark" />
						</label>
					</Container>

					<Container title="Credits" level={4} icon={ICON_CREDITS}>
						<label class="checkbox">
							<span>{global.credits ? "On" : "Off"}</span>
							<input
								type="checkbox"
								bind:checked={global.credits}
								on:click={(e) => {
									global.credits = e.target.checked;
									dispatch("global");
								}}
							/>
							<span class="checkbox__mark" />
						</label>
					</Container>

					<Container title="Agendas" level={4} icon={ICON_AGENDAS}>
						<label class="checkbox">
							<span>{global.agendas ? "On" : "Off"}</span>
							<input
								type="checkbox"
								bind:checked={global.agendas}
								on:click={(e) => {
									global.agendas = e.target.checked;
									dispatch("global");
								}}
							/>
							<span class="checkbox__mark" />
						</label>
					</Container>

					<Container
						title="Threat Level"
						level={4}
						icon={ICON_AGENDAS}
					>
						<label class="checkbox">
							<span>{global.threat_level ? "On" : "Off"}</span>
							<input
								type="checkbox"
								bind:checked={global.threat_level}
								on:click={(e) => {
									global.threat_level = e.target.checked;
									dispatch("global");
								}}
							/>
							<span class="checkbox__mark" />
						</label>
					</Container>

					<Container title="Wins" level={4} icon={ICON_AGENDAS}>
						<label class="checkbox">
							<span>{global.wins ? "On" : "Off"}</span>
							<input
								type="checkbox"
								bind:checked={global.wins}
								on:click={(e) => {
									global.wins = e.target.checked;
									dispatch("global");
								}}
							/>
							<span class="checkbox__mark" />
						</label>
					</Container>
				</Container>

				<Container title="Visuals" level={3} outline={false}>
					<Container title="Faction (logo)" level={4}>
						<label class="checkbox">
							<span>{global.faction ? "On" : "Off"}</span>
							<input
								type="checkbox"
								bind:checked={global.faction}
								on:click={(e) => {
									global.faction = e.target.checked;
									dispatch("global");
								}}
							/>
							<span class="checkbox__mark" />
						</label>
					</Container>
					<Container title="Overlay opacity" level={4}>
						<label>
							<span
								>Opacity ({(
									global.overlay.opacity * 100
								).toFixed(0)}%)</span
							>
							<input
								type="range"
								min="0"
								max="1"
								value={global.overlay.opacity.toString()}
								step="0.1"
								on:change={(e) => {
									global.overlay.opacity = e.target.value;
									dispatch("global");
								}}
							/>
						</label>
					</Container>
				</Container>
			</Container>
		</Modal>
	{/if}
</label>

<style lang="scss">
	// TODO
</style>
