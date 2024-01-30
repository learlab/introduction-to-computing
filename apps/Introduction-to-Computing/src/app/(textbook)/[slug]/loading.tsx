import { ChapterToc } from "@/components/chapter-toc";
import { PageTitle } from "@/components/page-title";
import { allPagesSorted } from "@/lib/pages";
import { Skeleton } from "@itell/ui/server";
import { BookmarkIcon } from "lucide-react";
import { headers } from "next/headers";
import { notFound } from "next/navigation";

export default async function () {
	const headersList = headers();
	const pathname = headersList.get("x-pathname") as string;
	const split = pathname.split("/");
	let pageSlug: string | null = null;
	if (split.length === 2) {
		pageSlug = split[1];
	}

	// if this is not found, 404 will be throw at page.tsx
	const page = allPagesSorted.find((page) => page.page_slug === pageSlug);
	if (!page) {
		return notFound();
	}

	const arr = Array.from(Array(10).keys());

	return (
		<>
			<div className="max-w-[1440px] mx-auto grid grid-cols-12 gap-6 px-2">
				<ChapterToc page={page} />
				<section className="relative col-span-12 md:col-span-10 lg:col-span-8 space-y-4">
					<PageTitle>{page.title}</PageTitle>

					{arr.map((i) => (
						<Skeleton className="w-full h-28 mb-4" key={i} />
					))}
				</section>

				<aside className="toc-sidebar col-span-2 relative">
					<p className="font-medium text-sm flex items-center">
						<span>ON THIS PAGE</span>
						<BookmarkIcon className="ml-2 size-4" />
					</p>
					<ul className="mt-2 space-y-2">
						{arr.slice(0, 5).map((i) => (
							<Skeleton className="w-32 h-7" key={i} />
						))}
					</ul>
				</aside>
			</div>
		</>
	);
}
