import { writable } from "svelte/store";
import type { Card, Attributes, PlayerData } from "./types";
import Default from "$lib/data/default.json";

export const info: PlayerData = writable(Default);
