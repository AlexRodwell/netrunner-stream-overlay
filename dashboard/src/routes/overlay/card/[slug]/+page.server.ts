import { error } from "@sveltejs/kit";
import type { PageLoadEvent } from "./$types";

export const prerender = true;

/** @type {import('./$types').PageLoadEvent} */
export async function load({ params }: PageLoadEvent) {
	if (params.slug === "one" || params.slug === "two") {
		return {
			player: `player${
				params.slug.charAt(0).toUpperCase() + params.slug.slice(1)
			}`,
		};
	}

	throw error(404, "Not found");
}
