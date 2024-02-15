import i18n from "sveltekit-i18n";
import type { Translation } from "$lib/types";

/** @type {import('sveltekit-i18n').Config} */
const config = {
	loaders: [
		{
			locale: "en",
			key: "",
			loader: async () =>
				(await import("./locales/en.json")).default as Translation,
		},
	],
};

export const { t, locale, locales, loading, loadTranslations } = new i18n(
	config
);
