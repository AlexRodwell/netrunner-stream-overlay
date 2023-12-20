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

// API data
export const netrunnerDB: any = writable(new Map());

// Websocket data
export const globalData: GlobalData = writable(DefaultGlobal);
export const playerData: PlayerData = writable(DefaultPlayer);
export const timerData: TimerData = writable(DefaultTimer);

export const playerOneData: PlayerAttributes = writable(
	DefaultPlayer.playerOne
);

export const playerTwoData: PlayerAttributes = writable(
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
