import { writable } from "svelte/store";
import type {
	GlobalData,
	PlayerData,
	TimerData,
	PlayerAttributes,
} from "./types";

// JSON
import DefaultGlobal from "$lib/data/default/global.json";
import DefaultPlayer from "$lib/data/default/player.json";
import DefaultTimer from "$lib/data/default/timer.json";
import api from "$lib/data/api.json";

// Session token
export const websocketToken = writable<string>();

// API data
export const netrunnerDB = writable<Map<string, any>>(new Map());

// Websocket data
export const globalData = writable<GlobalData>(DefaultGlobal);
export const playerData = writable<PlayerData>(DefaultPlayer);
export const timerData = writable<TimerData>(DefaultTimer);

export const playerOneData = writable<PlayerAttributes>(
	DefaultPlayer.playerOne
);

export const playerTwoData = writable<PlayerAttributes>(
	DefaultPlayer.playerTwo
);

// Local data
export const deploy: {
	type: "automatic" | "manual";
	proceed: boolean;
} = writable({
	type: "automatic",
	proceed: false,
});
