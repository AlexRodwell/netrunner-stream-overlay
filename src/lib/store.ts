import { writable } from "svelte/store";
import type { PlayerData, GlobalData, TimerData } from "./types";
import DefaultPlayer from "$lib/data/default/player.json";
import DefaultGlobal from "$lib/data/default/global.json";
import DefaultTimer from "$lib/data/default/timer.json";

export const playerData: PlayerData = writable(DefaultPlayer);
export const globalData: GlobalData = writable(DefaultGlobal);
export const timerData: TimerData = writable(DefaultTimer);
