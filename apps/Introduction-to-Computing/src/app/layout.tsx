import { RootProvider } from "@/components/provider/root-provider";
import { TailwindIndicator } from "@/components/tailwind-indicator";
import { getSiteConfig } from "@/lib/config";
import "@/styles/globals.css";
import { cn } from "@itell/core/utils";
import { GeistSans as FontSans } from "geist/font/sans";
import { Metadata } from "next";
import { IBM_Plex_Mono as FontMono } from "next/font/google";
import { Suspense } from "react";

export async function generateMetadata(): Promise<Metadata> {
	const siteConfig = await getSiteConfig();
	return {
		title: {
			default: siteConfig.title,
			template: `%s | ${siteConfig.title}`,
		},
		description: siteConfig.description,
	};
}

const fontMono = FontMono({
	subsets: ["latin"],
	weight: ["400", "700"],
	variable: "--font-mono",
});

export default async function RootLayout({
	children,
}: { children: React.ReactNode }) {
	const { favicon } = await getSiteConfig();

	return (
		<html lang="en" suppressHydrationWarning>
			<head>
				<link rel="icon" type="image/x-icon" href={favicon || "/favicon.ico"} />
			</head>
			<body
				className={cn(
					"min-h-screen bg-background font-sans antialiased",
					FontSans.className,
					fontMono.variable,
				)}
			>
				<RootProvider>
					<TailwindIndicator />
					<main>{children}</main>
				</RootProvider>
			</body>
		</html>
	);
}
