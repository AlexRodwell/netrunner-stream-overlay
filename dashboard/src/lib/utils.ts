import JSON_CARDS from "$lib/data/cards.json";
import JSON_FACTIONS from "$lib/data/factions.json";
import JSON_COUNTRIES from "world_countries_lists/data/countries/en/countries.json";

export const slugify = (text: string) => {
	return text
		.toLowerCase()
		.replace(/[^a-zA-Z0-9]+/g, "-")
		.replace(/^-+|-+$/g, "");
};

export const find_faction_by_id = (id: string) => {
	const identities = JSON_CARDS.data.filter(
		(obj) => obj.type_code === "identity"
	);
	const identity = identities.find((obj) => obj.stripped_title === id);

	const code = JSON_FACTIONS.find(
		(obj) => obj.code === identity?.faction_code
	);

	return code ?? false;
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
