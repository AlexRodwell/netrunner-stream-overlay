import { writable } from "svelte/store";
import type { Card, Attributes, PlayerData } from "./types";

export const info: PlayerData = writable({
	Corporation: {
		faction: "Jinteki",
		id: "419: Amoral Scammer",
		clicks: {
			active: true,
			amount: 3,
		},
		credits: {
			active: true,
			amount: 5,
		},
		cards: [],
		highlight: {
			code: "21063",
			active: false,
		},
	},
	Runner: {
		faction: "Anarch",
		id: "Asa Group: Security Through Vigilance",
		clicks: {
			active: true,
			amount: 4,
		},
		credits: {
			active: true,
			amount: 5,
		},
		cards: [],
		highlight: {
			code: "21063",
			active: false,
		},
	},
});

// const storedTheme = localStorage.getItem("theme");
//
// export const theme = writable(storedTheme);
//
// theme.subscribe(value => {
//     localStorage.setItem("theme", value === 'dark' ? 'dark' : 'light');
// });
