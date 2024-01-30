import { cn } from "@itell/core/utils";
import { BookmarkIcon } from "lucide-react";

type Heading = {
	level: "one" | "two" | "three" | "four" | "other";
	text: string | undefined;
	slug: string | undefined;
};
type TocSidebarProps = {
	headings: Heading[];
};

export const PageToc = ({ headings }: TocSidebarProps) => {
	return (
		<div>
			<p className="font-medium flex items-center">
				<BookmarkIcon className="mr-2 size-4" />
				<span>ON THIS PAGE</span>
			</p>

			<ol className="list-disc mt-2 space-y-2 pl-4">
				{headings
					.filter((heading) => heading.level !== "other")
					.map((heading) => (
						<li key={heading.slug}>
							<a
								data-level={heading.level}
								href={`#${heading.slug}`}
								className={cn("hover:underline inline-flex ", {
									"text-base": heading.level === "two",
									"text-sm pl-2 text-muted-foreground": heading.level === "three",
									"text-xs pl-4 text-muted-foreground": heading.level === "four",
								})}
							>
								{heading.text}
							</a>
						</li>
					))}
			</ol>
		</div>
	);
};
