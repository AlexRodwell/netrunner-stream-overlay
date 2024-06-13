import { error } from "@sveltejs/kit";
import type { PageLoadEvent } from "./$types";

/** @type {import('./$types').PageLoadEvent} */
export async function load({ params }: PageLoadEvent) {

	if (params.slug === "left" || params.slug === "right") {
		return {
			side: params.slug === "left" ? "left" : "right"
		};
	}

	throw error(404, "Not found");
}

export const prerender = true;
