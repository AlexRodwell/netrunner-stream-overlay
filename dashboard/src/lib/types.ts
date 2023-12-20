/*
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
*/

export type Card = {
	attributes: {
		advancement_requirement?: number | null;
		agenda_points?: number | null;
		attribution?: string | number | null;
		base_link?: string | number | null;
		card_abilities?: {
			additional_cost?: boolean | null;
			advanceable?: boolean | null;
			gains_subroutines?: boolean | null;
			interrupt?: boolean | null;
			link_provided?: string | number | null;
			mu_provided?: string | number | null;
			num_printed_subroutines?: string | number | null;
			on_encounter_effect?: boolean | null;
			performs_trace?: boolean | null;
			recurring_credits_provided?: string | number | null;
			rez_effect?: boolean | null;
			trash_ability?: boolean | null;
		};
		card_cycle_ids?: string[] | null;
		card_pool_ids?: string[] | null;
		card_set_ids?: string[] | null;
		card_subtype_ids?: string[] | null;
		card_type_id?: string | null;
		cost?: number | null;
		date_release?: string | null;
		deck_limit?: number | null;
		designed_by?: string | null;
		display_subtypes?: string | number | null;
		faction_id?: string | null;
		format_ids?: string[] | null;
		in_restriction?: boolean | null;
		influence_cost?: string | number | null;
		influence_limit?: string | number | null;
		is_unique?: boolean | null;
		latest_printing_id: string | null;
		memory_cost?: string | number | null;
		minimum_deck_size?: string | number | null;
		num_printings?: number | null;
		printing_ids?: string[] | null;
		printings_released_by?: string[] | null;
		restriction_ids?: string[] | null;
		restrictions?: {
			banned?: string[] | null;
			global_penalty?: string[] | null;
			points?: Record<string, any> | null;
			restricted?: string[] | null;
			universal_faction_cost?: Record<string, any> | null;
		};
		side_id?: string | null;
		snapshot_ids?: string[] | null;
		strength?: string | number | null;
		stripped_text?: string | null;
		stripped_title?: string | null;
		text?: string | null;
		title?: string | null;
		trash_cost?: string | number | null;
		updated_at?: string | null;
	};
	id: string | null;
	links?: {
		self?: string | null;
	};
	relationships?: {
		card_subtypes?: {
			links?: {
				related?: string | null;
				self?: string | null;
			};
		};
		card_type?: {
			links?: {
				related?: string | null;
				self?: string | null;
			};
		};
		faction?: {
			links?: {
				related?: string | null;
				self?: string | null;
			};
		};
		printings?: {
			links?: {
				related?: string | null;
				self?: string | null;
			};
		};
		rulings?: {
			links?: {
				related?: string | null;
				self?: string | null;
			};
		};
		side?: {
			links?: {
				related?: string | null;
				self?: string | null;
			};
		};
	};
	type: string;
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

export type GameSide = "corp" | "runner";
export type PlayerSide = "playerOne" | "playerTwo";

export type GlobalData = {
	deploy: "automatic" | "manual";
	websocket: {
		status: boolean;
	};
	overlay: {
		opacity: number;
		commentators?: string | null;
	};
	country: boolean;
	wins: boolean;
	pronoun: boolean;
	name: boolean;
	faction: boolean;
	id: boolean;
	clicks: boolean;
	credits: boolean;
	agendas: boolean;
	agendas_count: number;
	threat_level: boolean;
	card_size: "small" | "medium" | "large";
};

export type TimerData = {
	count: number;
	action: "set" | "reset" | "clear";
	prev: Date;
};

export type Highlight = {
	cards: string[] | [];
	current: string | null;
	previous: string | null;
	active: boolean;
	test: string[] | [];
};

export type PlayerAttributes = {
	side: GameSide;
	player: {
		wins: "0" | "1" | "2";
		name: string;
		pronoun?: string | null;
		country?: string | null;
	};
	decks: {
		[key in GameSide]: {
			active: boolean;
			faction: string;
			id: string;
		};
	};
	clicks: Counters;
	credits: Counters;
	agendas: Agendas;
	highlight?: Highlight;
};

export type PlayerData = {
	[key in PlayerSide]: PlayerAttributes;
};

export type Faction = {
	side: string; // "corp";
	code: string; // "nbn";
	name: string; // "NBN";
	logo: string; // "/factions/NSG_NBN.svg";
};

export type WebSocketFunction = Function;
