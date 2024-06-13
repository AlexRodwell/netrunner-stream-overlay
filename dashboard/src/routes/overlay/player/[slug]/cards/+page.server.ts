import { error } from "@sveltejs/kit";
import type { PageLoadEvent } from "./$types";

/** @type {import('./$types').PageLoadEvent} */
export async function load({ params }: PageLoadEvent) {
	return params;

	throw error(404, "Not found");
}

export const prerender = true;
