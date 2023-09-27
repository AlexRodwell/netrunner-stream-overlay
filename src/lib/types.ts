export type Card = {
	code: string;
	deck_limit: number;
	faction_code: string;
	faction_cost: number;
	flavor: string;
	illustrator: string;
	influence_limit: null;
	keywords: string;
	minimum_deck_size: number;
	pack_code: string;
	position: number;
	quantity: number;
	side_code: string;
	stripped_text: string;
	stripped_title: string;
	text: string;
	title: string;
	type_code: string;
	uniqueness: boolean;
};

export type Attributes = {
	faction: string;
	// | "Haas-Bioroid"
	// | "Jinteki"
	// | "NBN"
	// | "Weyland Consortium."
	// | "Anarch"
	// | "Criminal"
	// | "Shaper"
	// | string;
	id: string;
	clicks: {
		active: boolean;
		amount: number;
	};
	credits: {
		active: boolean;
		amount: number;
	};
	cards?: string[];
	highlight?: {
		code: string;
		active: boolean;
	};
};

export type PlayerData = {
	[key in Side]: Attributes;
};

export type Side = "Corporation" | "Runner";

type Factions = typeof import("./data/factions.json");

// export type Faction = {
// 	name: Factions[number]["name"];
// };

export type Faction = Factions[number]["name"];
