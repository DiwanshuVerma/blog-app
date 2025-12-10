
// get all posts

import { headers } from "next/headers";
import { db } from ".";
import { auth } from "../auth";
import { desc, eq } from "drizzle-orm";
import { postsTable } from "./schema";

export async function getAllPosts() {
    try {
        const res = await db.query.postsTable.findMany({
            orderBy: [desc(postsTable.createdAt)],
            with: {
                author: true
            }
        })

        return res
    } catch (e) {
        console.log(e)
        return []
    }
}

export async function getPostBySlug(slug: string) {
    try {
        const post = await db.query.postsTable.findFirst({
            where: eq(postsTable.slug, slug),
            with: {
                author: true
            }
        })
        return post
    } catch (e) {
        console.log(e)
        return null
    }
}