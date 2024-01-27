export type Card = {
	attributes: {
		advancement_requirement?: number;
		agenda_points?: number;
		attribution?: string | number;
		base_link?: string | number;
		card_abilities?: {
			additional_cost?: boolean;
			advanceable?: boolean;
			gains_subroutines?: boolean;
			interrupt?: boolean;
			link_provided?: string | number;
			mu_provided?: string | number;
			num_printed_subroutines?: string | number;
			on_encounter_effect?: boolean;
			performs_trace?: boolean;
			recurring_credits_provided?: string | number;
			rez_effect?: boolean;
			trash_ability?: boolean;
		};
		card_cycle_ids?: string[];
		card_pool_ids?: string[];
		card_set_ids?: string[];
		card_subtype_ids?: string[];
		card_type_id?: string;
		cost?: number;
		date_release?: string;
		deck_limit?: number;
		designed_by?: string;
		display_subtypes?: string | number;
		faction_id?: string;
		format_ids?: string[];
		in_restriction?: boolean;
		influence_cost?: string | number;
		influence_limit?: string | number;
		is_unique?: boolean;
		latest_printing_id: string;
		memory_cost?: string | number;
		minimum_deck_size?: string | number;
		num_printings?: number;
		printing_ids?: string[];
		printings_released_by?: string[];
		restriction_ids?: string[];
		restrictions?: {
			banned?: string[];
			global_penalty?: string[];
			points?: Record<string, any>;
			restricted?: string[];
			universal_faction_cost?: Record<string, any>;
		};
		side_id?: string;
		snapshot_ids?: string[];
		strength?: string | number;
		stripped_text?: string;
		stripped_title?: string;
		text?: string;
		title?: string;
		trash_cost?: string | number;
		updated_at?: string;
	};
	id: string | null;
	links?: {
		self?: string;
	};
	relationships?: {
		card_subtypes?: {
			links?: {
				related?: string;
				self?: string;
			};
		};
		card_type?: {
			links?: {
				related?: string;
				self?: string;
			};
		};
		faction?: {
			links?: {
				related?: string;
				self?: string;
			};
		};
		printings?: {
			links?: {
				related?: string;
				self?: string;
			};
		};
		rulings?: {
			links?: {
				related?: string;
				self?: string;
			};
		};
		side?: {
			links?: {
				related?: string;
				self?: string;
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
		commentators?: string;
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

export type HighlightGroup = {
	primary: Highlight;
	secondary: Highlight;
};

export type Highlight = {
	cards: string[];
	current?: string;
	previous?: string;
	active: boolean;
	test: string[];
};

export type PlayerAttributes = {
	side: GameSide;
	player: {
		wins: "0" | "1" | "2";
		name: string;
		pronoun?: string;
		country?: string;
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
	highlight?: {
		primary: Highlight;
		secondary: Highlight;
	};
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
