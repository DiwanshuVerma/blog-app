import { relations } from "drizzle-orm"
import { pgTable, varchar, boolean, timestamp, text, serial } from "drizzle-orm/pg-core"

export const usersTable = pgTable('users', {
    id: varchar("id", { length: 255 }).primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    email: varchar("email", { length: 255 }).notNull().unique(),
    emailVerified: boolean("email_verified").default(false),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

export const sessionsTable = pgTable('sessions', {
    id: varchar("id", { length: 255 }).primaryKey(),
    userId: varchar('user_id').references(() => usersTable.id).notNull(),  // foreign key
    token: varchar("token", { length: 255 }).notNull(),
    ipAddress: varchar("ip_address", { length: 255 }),
    userAgent: text("user_agent"),
    expiresAt: timestamp("expires_at").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
})


export const accountsTable = pgTable('accounts', {
    id: varchar("id", { length: 255 }).primaryKey(),
    accountId: varchar("account_id", { length: 255 }).notNull(),
    userId: varchar('user_id').references(() => usersTable.id).notNull(),
    password: text("password"),
    providerId: varchar("provider_id", { length: 255 }).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

export const postsTable = pgTable('posts', {
    id: serial("id").primaryKey(),
    title: varchar('title', { length: 255 }).notNull(),
    description: varchar('description', { length: 255 }).notNull(),
    slug: varchar('slug', { length: 255 }).notNull().unique(),
    content: text("content").notNull(),
    authorId: varchar("author_id", { length: 255 }).references(() => usersTable.id).notNull()
})


// relations
// -> one user can have many posts
export const UsersRelations = relations(postsTable, ({ one }) => ({
    author: one(usersTable, {
        fields: [postsTable.authorId],
        references: [usersTable.id]
    })
}))

// -> one post -> belongs to one user
export const postsRelations = relations(postsTable, ({ one }) => ({
    author: one(usersTable, {
        fields: [postsTable.authorId],
        references: [usersTable.id]
    })
}))

// -> one acc -> belongs to one user
export const accountsRelations = relations(accountsTable, ({ one }) => ({
    user: one(usersTable, {
        fields: [accountsTable.userId],
        references: [usersTable.id]
    })
}))

export const sessionsRelations = relations(sessionsTable, ({ one }) => ({
    user: one(usersTable, {
        fields: [sessionsTable.userId],
        references: [usersTable.id]
    })
}))


export const schema = {
    usersTable,
    postsTable,
    accountsTable,
    sessionsTable
}