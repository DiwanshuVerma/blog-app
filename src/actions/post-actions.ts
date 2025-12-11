'use server'

import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { postsTable } from "@/lib/db/schema"
import { slugify } from "@/lib/utils"
import { and, eq, ne } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import { headers } from "next/headers"

export async function createPost(formData: FormData) {
    try {

        // check browser session if user logged in or not
        const session = await auth.api.getSession({
            headers: await headers()
        })
        if (!session || !session.user) {
            return {
                success: false,
                message: "User must be logged in to create a post."
            }
        }

        const title = formData.get("title") as string
        const description = formData.get("description") as string
        const content = formData.get("content") as string

        // convert title to slug for checking the existing blog
        const slug = slugify(title)

        const existingPost = await db.query.postsTable.findFirst({
            where: eq(postsTable.slug, slug)
        })

        if (existingPost) {
            return {
                success: false,
                message: "A post with the same title already exists."
            }
        }

        // store post in the database
        const [newPost] = await db.insert(postsTable).values({   // db.insert returns an array thats why "newPost" is written in brackets
            title,
            description,
            content,
            slug,
            authorId: session.user.id
        }).returning()

        // revaliadte pages to update new added posts
        revalidatePath("/")
        revalidatePath(`/post/${slug}`)
        revalidatePath("/profile")

        return {
            success: true,
            message: "Post created successfully.",
            slug
        }

    } catch (e) {
        console.log("Error while creating", e)
        return {
            success: false,
            message: "Error occured while creating the post.",
            error: e
        }
    }

}

export async function updatePost(postId: number, formData: FormData) {
    try {
        const session = await auth.api.getSession({
            headers: await headers()
        })
        if (!session || !session.user) {
            return {
                success: false,
                message: "You must logged in to edit a post."
            }
        }

        const title = await formData.get("title") as string
        const description = await formData.get("description") as string
        const content = await formData.get("content") as string

        const slug = slugify(title)
        const existingPost = await db.query.postsTable.findFirst({
            where: and(eq(postsTable.slug, slug), ne(postsTable.id, postId))  // postsTable.slug === slug && postsTable.id !== postId
        })

        if (existingPost) {
            return {
                success: false,
                message: "A post with the same title already exists!"
            }
        }

        const post = await db.query.postsTable.findFirst({
            where: eq(postsTable.id, postId)
        })
        if (post?.authorId !== session.user.id) {
            return {
                success: false,
                message: "You can only edit your own posts!"
            }
        }

        await db.update(postsTable).set({
            title, description, content, slug, updatedAt: new Date()
        }).where(eq(postsTable.id, postId))

        revalidatePath("/")
        revalidatePath(`/post/${slug}`)
        revalidatePath(`/profile`)

        return {
            success: true,
            message: "Post updated successfully.",
            slug
        }
    } catch (e) {
        console.log("Error while updating", e)
        return {
            success: false,
            message: "Error occured while updating the post.",
            error: e
        }
    }
}

export async function deletePost(postId: number) {
    try {
        const session = await auth.api.getSession({
            headers: await headers()
        })
        if (!session || !session.user) {
            return {
                success: false,
                message: "You must be logged in to delete post!"
            }
        }

        const postToDelete = await db.query.postsTable.findFirst({
            where: eq(postsTable.id, postId)
        })
        if (postToDelete?.authorId !== session.user.id) {
            return {
                success: false,
                message: "You can only delete your own post!"
            }
        }

        await db.delete(postsTable).where(eq(postsTable.id, postId))
        revalidatePath("/")
        revalidatePath("/profile")
        return {
            success: true,
            message: "Post deleted successfully."
        }
    } catch (error) {
        console.log("Error while deleting -> ", error)
        return null
    }
}