import { allPages } from "contentlayer/generated";
import { PageData } from "./utils";

export const allPagesSorted = allPages
	.slice(0)
	.sort((a, b) => a.chapter - b.chapter);

export const getPageData = (slug: string | null): PageData | null => {
	const index = allPagesSorted.findIndex((s) => s.page_slug === slug);
	if (index === -1) {
		return null;
	}
	const page = allPagesSorted[index];

	const nextPageSlug =
		index !== allPagesSorted.length - 1
			? allPagesSorted[index + 1]?.page_slug
			: null;

	return {
		id: page._id,
		index,
		title: page.title,
		page_slug: page.page_slug,
		chapter: page.chapter,
		nextPageSlug,
	};
};
