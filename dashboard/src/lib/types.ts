export type Card = {
	deck_limit: number;
	faction_code: string;
	faction_cost: number;
	flavor?: string;
	illustrator?: string;
	influence_limit?: null | number;
	keywords?: string;
	minimum_deck_size?: number;
	pack_code: string;
	position: number;
	quantity: number;
	side_code: string;
	stripped_text?: string;
	stripped_title: string;
	text?: string;
	title: string;
	type_code: string;
	uniqueness: boolean;
	base_link?: number;
	cost?: null | number;
	memory_cost?: number;
	strength?: null | number;
	advancement_cost?: null | number;
	agenda_points?: number;
	trash_cost?: number;
};

export type CounterKeys = "clicks" | "credits" | "agendas";

export type Counter = {
	active: boolean;
	amount: number;
};

export type Counters = {
	[key in CounterKeys]: Counter;
};

export type Agendas = Counters & {
	cards?: any[];
};

export type GameSide = "Corporation" | "Runner";
export type Side = "playerOne" | "playerTwo";

export type GlobalData = {
	name: boolean;
	faction: boolean;
	id: boolean;
	clicks: boolean;
	credits: boolean;
	agendas: boolean;
};

export type TimerData = {
	count: number;
	action: "set" | "reset" | "clear";
	prev: Date;
};

export type PlayerAttributes = {
	player: {
		wins: "0" | "1" | "2";
		name: string;
		pronoun: string;
	};
	faction: string;
	id: string;
	clicks: Counters;
	credits: Counters;
	cards?: string[];
	agendas: Agendas;
	highlight?: {
		code: string;
		active: boolean;
	};
};

export type PlayerData = {
	[key in Side]: PlayerAttributes;
};

type Factions = typeof import("./data/factions.json");

// export type Faction = {
// 	name: Factions[number]["name"];
// };

export type Faction = Factions[number]["code"];
