import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { SummaryList } from "@/components/dashboard/summary-list";
import { DashboardShell } from "@/components/shell";
import { getCurrentUser } from "@/lib/auth";
import db from "@/lib/db";
import { redirect } from "next/navigation";
import { getUser } from "@/lib/user";
import { User } from "@prisma/client";
import { Suspense } from "react";
import { SummaryCount } from "@/components/summary/summary-count";
import pluralize from "pluralize";
import { allPagesSorted } from "@/lib/pages";
import { ChapterSelect } from "@/components/dashboard/summary-chapter-select";

type PageProps = {
	searchParams: {
		chapter?: string;
	};
};

export default async function ({ searchParams }: PageProps) {
	const { chapter } = searchParams;
	const queryChapter = chapter ? parseInt(chapter) : 1;
	const pageSlugs = allPagesSorted.filter((p) => p.chapter === queryChapter).map((p) => p.page_slug);
	const currentUser = await getCurrentUser();
	if (!currentUser) {
		return redirect("/auth");
	}

	const [user, userSummaries] = await Promise.all([
		getUser(currentUser.id),
		db.summary.findMany({
			where: {
				userId: currentUser.id,
				pageSlug: {
					in: pageSlugs,
				}
			},
			orderBy: [{ created_at: "desc" }],
		}),
	]);

	return (
		<DashboardShell>
			<DashboardHeader heading="Summary" text="Create and manage summaries" />
			<ChapterSelect defaultChapter={queryChapter} />
			<div className="p-2 space-y-4">
				{userSummaries.length === 0 ? (
					<p className=" text-muted-foreground text-sm">No summary found</p>
				) : (
					<Suspense key={chapter} fallback={<p>hello world</p>}>
						<p className="text-sm leading-relaxed">
							{`You have written ${pluralize(
								"summary",
								userSummaries.length,
								true,
							)} ${queryChapter ? `for chapter ${queryChapter}` : ""}`}
						</p>
						<SummaryList summaries={userSummaries} user={user as User} />
					</Suspense>
				)}
			</div>
		</DashboardShell>
	);
}
