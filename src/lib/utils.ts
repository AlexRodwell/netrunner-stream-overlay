export const slugify = (text: string) => {
	return text
		.toLowerCase()
		.replace(/[^a-zA-Z0-9]+/g, "-")
		.replace(/^-+|-+$/g, "");
};
