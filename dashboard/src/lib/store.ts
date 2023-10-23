import { writable } from "svelte/store";
import type { GlobalData, PlayerData, TimerData } from "./types";

// JSON
import DefaultGlobal from "$lib/data/default/global.json";
import DefaultPlayer from "$lib/data/default/player.json";
import DefaultTimer from "$lib/data/default/timer.json";

// Websocket data
export const globalData: GlobalData = writable(DefaultGlobal);
export const playerData: PlayerData = writable(DefaultPlayer);
export const timerData: TimerData = writable(DefaultTimer);

// Local data
export const deploy: {
	type: "automatic" | "manual";
	proceed: boolean;
} = writable({
	type: "automatic",
	proceed: false,
});
