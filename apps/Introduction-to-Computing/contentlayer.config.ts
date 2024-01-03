import { defineDocumentType, makeSource } from "contentlayer/source-files";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import rehypePrism from "rehype-prism-plus";
import { getHeadingsFromRawBody } from "./src/lib/contentlayer";
import { h } from "hastscript";
import { toString as hastToString } from "hast-util-to-string";

const AnchorLinkIcon = h(
	"svg",
	{
		width: 16,
		height: 16,
		version: 1.1,
		viewBox: "0 0 16 16",
		xlmns: "http://www.w3.org/2000/svg",
	},
	h("path", {
		fillRule: "evenodd",
		fill: "currentcolor",
		d: "M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z",
	}),
);

const Site = defineDocumentType(() => ({
	name: "Site",
	filePathPattern: "site/**/*.{md,mdx}",
	contentType: "mdx",
	computedFields: {
		slug: {
			type: "string",
			resolve: (doc) => `${doc._raw.flattenedPath.replace("site/", "")}`,
		},
	},
}));

const Chapter = defineDocumentType(() => ({
	name: "Chapter",
	filePathPattern: "chapter/**/*.{md,mdx}",
	contentType: "mdx",

	fields: {
		title: {
			type: "string",
			description: "The title of the Section",
			required: true,
		},
		qa: {
			type: "boolean",
			description: "If the page should include question & answers",
			required: false,
			default: false,
		},
		summary: {
			type: "boolean",
			description: "If the page require a summary",
			required: false,
			default: true,
		},
	},
	computedFields: {
		url: {
			type: "string",
			resolve: (doc) => `${doc._raw.flattenedPath.replace("chapter/", "")}`,
		},
		chapter: {
			type: "number",
			resolve: (doc) => Number(doc._raw.flattenedPath.split("-")[1]),
		},
		headings: {
			type: "json",
			resolve: (doc) => getHeadingsFromRawBody(doc.body.raw),
		},
	},
}));

const createSROnlyLabel = (text: string) => {
	const node = h("span.sr-only", `Section titled ${escape(text)}`);
	node.properties["is:raw"] = "true";
	return node;
};

export default makeSource({
	contentDirPath: "content",
	documentTypes: [Chapter, Site],
	mdx: {
		remarkPlugins: [remarkGfm],
		rehypePlugins: [
			rehypeSlug,
			() =>
				rehypeAutolinkHeadings({
					behavior: "append",
					// @ts-ignore
					content: (heading) => [
						h(
							"span.heading-anchor-icon",
							{
								ariaHidden: "true",
							},
							AnchorLinkIcon,
						),
						// @ts-ignore
						createSROnlyLabel(hastToString(heading)),
					],
				}),
			rehypePrism,
		],
	},
	disableImportAliasWarning: true,
});
