import { Button, Pager } from "@/components/client-components";
import { ModuleSidebar } from "@/components/module-sidebar";
import { NoteCount } from "@/components/note/note-count";
import { NoteList } from "@/components/note/note-list";
import { NoteToolbar } from "@/components/note/note-toolbar";
import { PageStatus } from "@/components/page-status/page-status";
import { PageStatusModal } from "@/components/page-status/page-status-modal";
import { PageTitle } from "@/components/page-title";
import { PageToc } from "@/components/page-toc";
import { PageContent } from "@/components/page/page-content";
import { RestartPageButton } from "@/components/page/restart-page-button";
import { PageProvider } from "@/components/provider/page-provider";
import { QuestionControl } from "@/components/question/question-control";
import { Spinner } from "@/components/spinner";
import { PageSummary } from "@/components/summary/page-summary";
import { EventTracker } from "@/components/telemetry/event-tracker";
import { getCurrentUser } from "@/lib/auth";
import { getPageChunks } from "@/lib/chunks";
import { isProduction } from "@/lib/constants";
import { isPageWithFeedback } from "@/lib/feedback";
import { getPageStatus } from "@/lib/page-status";
import { getPagerLinks } from "@/lib/pager";
import { allPagesSorted } from "@/lib/pages";
import { getRandomPageQuestions } from "@/lib/question";
import { getModuleChapters } from "@/lib/sidebar";
import { getUser } from "@/lib/user";
import { Page } from "contentlayer/generated";
import {
	ArrowUpIcon,
	EyeIcon,
	LockIcon,
	PencilIcon,
	UnlockIcon,
} from "lucide-react";
import { notFound } from "next/navigation";
import { Fragment, Suspense } from "react";

const AnchorLink = ({
						text,
						href,
						icon,
					}: { text: string; href: string; icon: React.ReactNode }) => {
	return (
		<a href={href} className="block">
			<Button
				variant="ghost"
				className="flex flex-wrap justify-start items-center gap-2 pl-0"
			>
				{icon}
				{text}
			</Button>
		</a>
	);
};

export const LeftAside = ({ page }: { page: Page }) => {
	const chapters = getModuleChapters(page.location.module);

	return (
		<aside className="module-sidebar col-span-2 sticky top-20 h-fit">
			<ModuleSidebar
				chapters={chapters}
				currentPage={{
					chapter: page.location.chapter,
					section: page.location.section,
					url: page.url,
				}}
			/>
			<div className="mt-12 space-y-2">
				<RestartPageButton pageSlug={page.page_slug} />
				{page.summary && (
					<AnchorLink
						icon={<PencilIcon className="size-4" />}
						text="Write a summary"
						href="#page-summary"
					/>
				)}
				<AnchorLink
					icon={<ArrowUpIcon className="size-4" />}
					text="Back to top"
					href="#page-title"
				/>
			</div>
		</aside>
	);
};

export default async function ({ params }: { params: { slug: string } }) {
	const sessionUser = await getCurrentUser();
	const user = sessionUser ? await getUser(sessionUser.id) : null;

	const pageIndex = allPagesSorted.findIndex((section) => {
		return section.page_slug === params.slug;
	});

	if (pageIndex === -1) {
		return notFound();
	}

	const page = allPagesSorted[pageIndex];
	const pageSlug = page.page_slug;

	const pagerLinks = getPagerLinks({
		pageIndex,
		userPageSlug: user?.pageSlug || null,
	});

	const isFeedbackEnabled = sessionUser
		? isPageWithFeedback(sessionUser, page)
		: true;

	const chunks = getPageChunks(page);

	const selectedQuestions = await getRandomPageQuestions(pageSlug);
	const isLastChunkWithQuestion = selectedQuestions.has(
		chunks[chunks.length - 1],
	);
	const pageStatus = getPageStatus(pageSlug, user?.pageSlug);
	const { isPageLatest, isPageUnlocked } = pageStatus;

	return (
		<PageProvider
			pageSlug={pageSlug}
			chunks={chunks}
			pageStatus={pageStatus}
			isLastChunkWithQuestion={isLastChunkWithQuestion}
		>
			<div className="max-w-[1440px] mx-auto grid grid-cols-12 gap-6 px-2">
				<LeftAside page={page} />

				<section className="page-content relative col-span-8">
					<PageTitle>
						{page.title}
						{isPageLatest ? (
							<EyeIcon />
						) : isPageUnlocked ? (
							<UnlockIcon />
						) : (
							<LockIcon />
						)}
					</PageTitle>
					<PageContent code={page.body.code} />
					<NoteToolbar pageSlug={pageSlug} />
					<Pager prev={pagerLinks.prev} next={pagerLinks.next} />
				</section>

				<aside className="toc-sidebar col-span-2 relative">
					<div className="sticky top-20">
						<PageToc headings={page.headings} />
						<div className="mt-8 flex flex-col gap-1">
							<PageStatus status={pageStatus} />
							{user && <NoteCount user={user} pageSlug={pageSlug} />}
						</div>
					</div>
					<Suspense
						fallback={
							<p className="text-sm text-muted-foreground mt-8">
								<Spinner className="inline mr-2" />
								loading notes
							</p>
						}
					>
						<NoteList pageSlug={pageSlug} />
					</Suspense>
				</aside>
			</div>

			{page.summary && (
				<footer>
					<PageSummary
						pageSlug={pageSlug}
						isFeedbackEnabled={isFeedbackEnabled}
					/>
				</footer>
			)}

			<PageStatusModal user={user} pageStatus={pageStatus} />
			<QuestionControl
				selectedQuestions={selectedQuestions}
				pageSlug={pageSlug}
				isFeedbackEnabled={isFeedbackEnabled}
			/>
			{user && isProduction && <EventTracker />}
		</PageProvider>
	);
}