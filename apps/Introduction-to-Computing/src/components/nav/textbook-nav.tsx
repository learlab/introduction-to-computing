import { getSiteConfig } from "@/lib/config";
import Image from "next/image";
import Link from "next/link";
import SiteNav from "./site-nav";
import { ScrollProgress } from "./textbook-scroll-progress";
import { firstPageUrl } from "@/lib/constants";
import { cn } from "@itell/core/utils";
import { buttonVariants } from "@itell/ui/server";
import { CommandMenu } from "../command-menu";
import ThemeToggle from "../theme/theme-toggle";
import { UserAccountNav } from "../user-account-nav";

export default async function TextbookNavbar() {
	const { title } = await getSiteConfig();

	return (
		<SiteNav>
		<div className="container flex h-16 items-center space-x-4 justify-between sm:space-x-0">
				<div className="flex gap-4 items-center">
					<Link href="/" className="hidden items-center space-x-2 md:flex">
						<span className="hidden font-bold sm:inline-block">{title}</span>
					</Link>
					<Link
						href={firstPageUrl}
						className={cn(
							buttonVariants({ variant: "outline" }),
							"flex items-center space-x-2 text-base",
						)}
					>
						<span className="font-bold sm:inline-block">
							Read
						</span>
					</Link>
				</div>

				<div className="ml-auto flex items-center gap-2">
					<CommandMenu />
					<ThemeToggle />
					<UserAccountNav />
				</div>
			</div>

			<ScrollProgress />
		</SiteNav>
	);
}
