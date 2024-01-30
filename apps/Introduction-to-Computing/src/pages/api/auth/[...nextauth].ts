import { env } from "@/env.mjs";
import NextAuth, { NextAuthOptions } from "next-auth";
import AzureADProvider from "next-auth/providers/azure-ad";
import GoogleProvider from "next-auth/providers/google";

import db from "@/lib/db";
import { PrismaAdapter } from "@next-auth/prisma-adapter";

export const authOptions: NextAuthOptions = {
	adapter: PrismaAdapter(db),
	secret: process.env.NEXTAUTH_SECRET,
	providers: [
		AzureADProvider({
			id: "azure-ad",
			name: "Azure AD",
			clientId: env.AZURE_CLIENT_ID,
			clientSecret: env.AZURE_CLIENT_SECRET,
			tenantId: "common",
			allowDangerousEmailAccountLinking: true,
			authorization: {
				params: {
					prompt: "consent",
					access_type: "offline",
					response_type: "code",
				},
			},
		}),
	],
	callbacks: {
		session({ session, user, token }) {
			if (session.user) {
				session.user.id = user.id;
			}
			return session;
		},
	},
	cookies: {
		csrfToken: {
			name: "next-auth.csrf-token",
			options: {
				httpOnly: true,
				sameSite: "none",
				path: "/",
				secure: true,
			},
		},
		pkceCodeVerifier: {
			name: "next-auth.pkce.code_verifier",
			options: {
				httpOnly: true,
				sameSite: "none",
				path: "/",
				secure: true,
			},
		},
	},
	pages: {
		signIn: "/auth",
		error: "/auth",
	},
};

export default NextAuth(authOptions);
