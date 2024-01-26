import { loadTranslations } from "$lib/translations";

/** @type {import('@sveltejs/kit').Load} */
export const load = async () => {
	await loadTranslations("en");

	return {};
};

export const prerender = true;
