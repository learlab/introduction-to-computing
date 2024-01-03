"use client";

import { cn } from "@itell/core/utils";
import { Chapter } from "contentlayer/generated";
import { startTransition, useState } from "react";
import Balancer from "react-wrap-balancer";
import { useRouter } from "next/navigation";
import { makeChapterHref } from "@/lib/utils";

type ChapterSidebarProps = {
	chapters: Chapter[];
	currentChapter: number | undefined;
};

export function ChapterSidebar({
	chapters,
	currentChapter,
}: ChapterSidebarProps) {
	const [activeChapter, setActiveChapter] = useState(currentChapter);
	const router = useRouter();

	const navigatePage = (chapter: number) => {
		setActiveChapter(chapter);
		router.push(makeChapterHref(chapter), {});
	};

	return (
		<nav>
			<ol className="space-y-2">
				{chapters.map((chapter) => (
					<li
						className={cn(
							"px-2 py-1 transition ease-in-out duration-200 relative rounded-md hover:bg-accent",
							{
								"bg-accent": chapter.chapter === activeChapter,
							},
						)}
						key={chapter.url}
					>
						<button type="button" onClick={() => navigatePage(chapter.chapter)}>
							<p className="text-sm font-light text-left">
								<Balancer>{`${chapter.chapter}. ${chapter.title}`}</Balancer>
							</p>
						</button>
					</li>
				))}
			</ol>
		</nav>
	);
}
