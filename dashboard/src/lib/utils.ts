// Shadcn sVELTE

import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { cubicOut } from "svelte/easing";
import type { TransitionConfig } from "svelte/transition";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

type FlyAndScaleParams = {
	y?: number;
	x?: number;
	start?: number;
	duration?: number;
};

export const flyAndScale = (
	node: Element,
	params: FlyAndScaleParams = { y: -8, x: 0, start: 0.95, duration: 150 }
): TransitionConfig => {
	const style = getComputedStyle(node);
	const transform = style.transform === "none" ? "" : style.transform;

	const scaleConversion = (
		valueA: number,
		scaleA: [number, number],
		scaleB: [number, number]
	) => {
		const [minA, maxA] = scaleA;
		const [minB, maxB] = scaleB;

		const percentage = (valueA - minA) / (maxA - minA);
		const valueB = percentage * (maxB - minB) + minB;

		return valueB;
	};

	const styleToString = (
		style: Record<string, number | string | undefined>
	): string => {
		return Object.keys(style).reduce((str, key) => {
			if (style[key] === undefined) return str;
			return str + `${key}:${style[key]};`;
		}, "");
	};

	return {
		duration: params.duration ?? 200,
		delay: 0,
		css: (t) => {
			const y = scaleConversion(t, [0, 1], [params.y ?? 5, 0]);
			const x = scaleConversion(t, [0, 1], [params.x ?? 0, 0]);
			const scale = scaleConversion(t, [0, 1], [params.start ?? 0.95, 1]);

			return styleToString({
				transform: `${transform} translate3d(${x}px, ${y}px, 0) scale(${scale})`,
				opacity: t,
			});
		},
		easing: cubicOut,
	};
};

// Custom

import JSON_FACTIONS from "$lib/data/factions.json";
import JSON_COUNTRIES from "world_countries_lists/data/countries/en/countries.json";
import { netrunnerDB } from "./store";
import type { Card as TCard } from "./types";
import api from "$lib/data/api.json";

export const slugify = (text: string) => {
	return text
		.toLowerCase()
		.replace(/[^a-zA-Z0-9]+/g, "-")
		.replace(/^-+|-+$/g, "");
};

export const find_faction_by_id = (id: string) => {
	let cards: Array<TCard> = [];

	netrunnerDB.subscribe((subscription: any) => {
		cards = subscription.data;
	});

	const identities = cards.filter(
		(card: TCard) =>
			card.attributes.card_type_id === "corp_identity" ||
			card.attributes.card_type_id === "runner_identity"
	);

	const identity = identities.find(
		(identity: TCard) => identity.attributes.stripped_title === id
	);

	const code = JSON_FACTIONS.find(
		(faction: { [key: string]: string }) =>
			faction.code === identity?.attributes.faction_id
	);

	return code ?? null; // JSON_FACTIONS[JSON_FACTIONS.length - 1];
};

// code: string & { length: 2 }
export const get_flag_by_iso_code = (code: string) => {
	const alpha = JSON_COUNTRIES.find((a) => a?.alpha2 === code);

	if (alpha?.alpha2) {
		return {
			// icon: "🏳️",
			icon: String.fromCodePoint(
				...[...alpha.alpha2.toUpperCase()].map(
					(char) => 127397 + char.toUpperCase().charCodeAt(0)
				)
			),
			name: alpha?.name,
		};
	}

	return {
		icon: "🏳️",
		name: "N/A",
	};
};

export const throttle = (callback: any, timeout: number) => {
	let wait = false;

	return function () {
		if (!wait) return;

		callback.apply(null, arguments);
		wait = true;

		setTimeout(() => {
			wait = false;
		}, timeout);
	};
};

export const fetch_cards = async () => {
	try {
		const response = await fetch(api.endpoint + api.cards);

		netrunnerDB.subscribe((value) => {
			// console.log(value);
		});

		if (!response.ok) {
			throw new Error("Network response was not ok");
		}

		const data = await response.json();

		netrunnerDB.set(data);

		return true;
	} catch (error) {
		console.error("Error fetching data:", error);

		return false;
	}
};
