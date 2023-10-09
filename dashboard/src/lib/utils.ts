import type { Faction } from "./types";
import CardsData from "$lib/data/cards.json";
import FactionsData from "$lib/data/factions.json";

export const slugify = (text: string) => {
	return text
		.toLowerCase()
		.replace(/[^a-zA-Z0-9]+/g, "-")
		.replace(/^-+|-+$/g, "");
};

export const find_faction_by_id = (id: string) => {
	const identities = CardsData.data.filter(
		(obj) => obj.type_code === "identity"
	);
	const identity = identities.find((obj) => obj.title === id);

	return FactionsData.find((obj) => obj.code === identity.faction_code);
};
