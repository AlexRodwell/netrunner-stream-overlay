<script lang="ts">
	import { createEventDispatcher } from "svelte";
	import Modal from "$components/dashboard/ui/Modal.svelte";
	import Card from "$components/dashboard/ui/Card.svelte";
	import { globalData, deploy } from "$lib/store";
	import Heading from "$components/dashboard/ui/Heading.svelte";

	// Icons
	import ICON_CLICKS from "$lib/assets/icons/NSG_CLICK.svg";
	import ICON_CREDITS from "$lib/assets/icons/NSG_CREDIT.svg";
	import ICON_AGENDAS from "$lib/assets/icons/NSG_AGENDA.svg";
	import { Settings } from "lucide-svelte";
	import Button from "./ui/Button.svelte";
	import Column from "./ui/Column.svelte";

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

			<Card title="Deploy method" outline={false} uid="display">
				<Column columns={3}>
					<Column span="1/-1">
						<Card>
							<Heading title="Deployment type" level={4} />
							<label class="checkbox">
								<span
									>{$deploy.type === "manual"
										? "Manual"
										: "Automatic (instant)"}</span
								>
								<input
									type="checkbox"
									checked={$deploy.type === "manual"}
									on:click={(e) => {
										$deploy.type = e.target.checked
											? "manual"
											: "automatic";
									}}
								/>
								<span class="checkbox__mark" />
							</label>
						</Card>
					</Column>

					<Card outline={false}>
						<Heading title="Player" level={3} />

						<Card>
							<Heading title="Name" level={4} />
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
						</Card>
						<Card>
							<Heading title="Pronouns" level={4} />
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
						</Card>
						<Card>
							<Heading title="ID" level={4} />
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
						</Card>
						<Card>
							<Heading title="Country" level={4} />
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
						</Card>
					</Card>

					<Card outline={false}>
						<Heading title="Game" level={3} />
						<Card>
							<Heading
								title="Clicks"
								icon={ICON_CLICKS}
								level={4}
							/>
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
						</Card>

						<Card>
							<Heading
								title="Credits"
								icon={ICON_CREDITS}
								level={4}
							/>
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
						</Card>

						<Card>
							<Heading
								title="Agendas"
								icon={ICON_AGENDAS}
								level={4}
							/>
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
						</Card>

						<Card>
							<Heading
								title="Threat Level"
								icon={ICON_AGENDAS}
								level={4}
							/>
							<label class="checkbox">
								<span>{global.threat_level ? "On" : "Off"}</span
								>
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
						</Card>

						<Card>
							<Heading
								title="Wins"
								icon={ICON_AGENDAS}
								level={4}
							/>
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
						</Card>
					</Card>

					<Card outline={false}>
						<Heading title="Visuals" level={3} />
						<Card>
							<Heading title="Faction (logo)" level={4} />
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
						</Card>
						<Card>
							<Heading title="Overlay opacity" level={4} />
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
						</Card>
						<Card>
							<Heading title="Commentators" level={4} />
							<label>
								<span>Commentators</span>
								<input
									type="text"
									bind:value={global.overlay.commentators}
									on:change={(e) => {
										global.overlay.commentators =
											e.target.value;
										dispatch("global");
									}}
								/>
							</label>
						</Card>
					</Card>
				</Column>
			</Card>
		</Modal>
	{/if}
</label>

<style lang="scss">
	// TODO
</style>
