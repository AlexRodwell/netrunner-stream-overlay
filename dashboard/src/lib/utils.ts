import JSON_FACTIONS from "$lib/data/factions.json";
import JSON_COUNTRIES from "world_countries_lists/data/countries/en/countries.json";
import { netrunnerDB } from "./store";
import type { Card as TCard } from "./types";

export const slugify = (text: string) => {
	return text
		.toLowerCase()
		.replace(/[^a-zA-Z0-9]+/g, "-")
		.replace(/^-+|-+$/g, "");
};

export const find_faction_by_id = (id: string) => {
	let cards: Array<TCard> = [];

	netrunnerDB.subscribe((subscription: any) => {
		cards = subscription.data;
	});

	const identities = cards.filter(
		(card: TCard) =>
			card.attributes.card_type_id === "corp_identity" ||
			card.attributes.card_type_id === "runner_identity"
	);

	const identity = identities.find(
		(identity: TCard) => identity.attributes.stripped_title === id
	);

	const code = JSON_FACTIONS.find(
		(faction: { [key: string]: string }) =>
			faction.code === identity?.attributes.faction_id
	);

	return code ?? null; // JSON_FACTIONS[JSON_FACTIONS.length - 1];
};

// code: string & { length: 2 }
export const get_flag_by_iso_code = (code: string) => {
	const alpha = JSON_COUNTRIES.find((a) => a?.alpha2 === code);

	if (alpha?.alpha2) {
		return {
			// icon: "🏳️",
			icon: String.fromCodePoint(
				...[...alpha.alpha2.toUpperCase()].map(
					(char) => 127397 + char.toUpperCase().charCodeAt(0)
				)
			),
			name: alpha?.name,
		};
	}

	return {
		icon: "🏳️",
		name: "N/A",
	};
};

export const throttle = (callback: any, timeout: number) => {
	let wait = false;

	return function () {
		if (!wait) return;

		callback.apply(null, arguments);
		wait = true;

		setTimeout(() => {
			wait = false;
		}, timeout);
	};
};
