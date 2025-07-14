// src/app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth"
import GitHub from "next-auth/providers/github"
import { MongoDBAdapter } from "@auth/mongodb-adapter"
import clientPromise from "@/lib/mongodb"
import { AuthOptions } from "next-auth"

export const authOptions: AuthOptions = {
    adapter: MongoDBAdapter(clientPromise),
    providers: [
        GitHub({
            clientId: process.env.AUTH_GITHUB_ID!,
            clientSecret: process.env.AUTH_GITHUB_SECRET!,
        }),
    ],
    // Optional: Füge hier weitere Konfigurationen hinzu, z.B. Session-Strategie
    session: {
        strategy: "jwt",
    },
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }