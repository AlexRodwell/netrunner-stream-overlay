import { writable } from "svelte/store";
import type { Card, Attributes, PlayerData } from "./types";

export const info: PlayerData = writable({
	corp: {
		clicks: 3,
		credits: 5,
		cards: [],
	},
	runner: {
		clicks: 4,
		credits: 5,
		cards: [],
	},
});

// const storedTheme = localStorage.getItem("theme");
//
// export const theme = writable(storedTheme);
//
// theme.subscribe(value => {
//     localStorage.setItem("theme", value === 'dark' ? 'dark' : 'light');
// });
