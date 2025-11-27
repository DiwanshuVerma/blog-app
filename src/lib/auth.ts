import { betterAuth } from 'better-auth'
import { db } from "./db"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import * as schema from "./db/schema"

export const auth = betterAuth({
    appName: "NextJs blog app",
    secret: process.env.BETTER_AUTH_SECRET,
    baseURL: process.env.BETTER_AUTH_URL,

    database: drizzleAdapter(db, {
        provider: "pg",
        schema: {
            ...schema,
            user: schema.usersTable,
            account: schema.accountsTable,
            session: schema.sessionsTable,
        }
    }),
    emailAndPassword: {
        enabled: true,
        requireEmailVerification: false,
        minPasswordLength: 6,
        maxPasswordLength: 128,
        autoSignIn: false
    },
    socialProviders: {
        github: {
            clientId: process.env.GITHUB_CLIENT_ID as string,
            clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
        }
    },
    session: {
        expiresIn: 60 * 60 * 24 * 7, // 7 days
        updateAge: 60 * 60 * 24, // 1 day
        disableSessionRefresh: true,
        cookieCache: {
            enabled: true,
            maxAge: 300
        }
    },
    advanced: {
        useSecureCookies: process.env.NODE_ENV === "production",
        defaultCookieAttributes: {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production"
        }
    }
})