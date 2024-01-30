import { ArrowUpIcon, PencilIcon } from "lucide-react";
import { Button } from "./client-components";
import { Page } from "contentlayer/generated";
import { allPagesSorted } from "@/lib/pages";
import { cn } from "@itell/core/utils";
import Link from "next/link";
import { makePageHref } from "@/lib/utils";

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



type Props = {
    page: Page
}

export const ChapterToc = ({ page }: Props) => {

    return <aside className="chapter-sidebar md:col-span-2">
        <div className="sticky top-20">
            <nav>
                <ol className="space-y-2">
                    {allPagesSorted.map((p) => (
                        <li
                            className={cn(
                                "px-2 py-1 transition ease-in-out duration-200 relative rounded-md hover:bg-accent",
                                {
                                    "bg-accent": p.chapter === page.chapter,
                                },
                            )}
                            key={p.url}
                        >
                            <Link href={makePageHref(p.page_slug)} className="text-sm font-light text-left text-pretty">
                                {`${p.chapter}. ${p.title}`}
                            </Link>
                        </li>
                    ))}
                </ol>
            </nav>
            <div className="mt-12 flex flex-col gap-2">
                {page.summary && (
                    <AnchorLink
                        icon={<PencilIcon className="w-4 h-4" />}
                        text="Write a summary"
                        href="#page-summary"
                    />
                )}
                <AnchorLink
                    icon={<ArrowUpIcon className="w-4 h-4" />}
                    text="Back to top"
                    href="#page-title"
                />
            </div>
        </div>
    </aside>

}