'use client'

import z from "zod";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../ui/button";
import { startTransition, useState } from "react";
import { createPost, updatePost } from "@/actions/post-actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { PostFormProps } from "@/lib/types";
import { slugify } from "@/lib/utils";
import { db } from "@/lib/db";
import { eq } from "drizzle-orm";
import { postsTable } from "@/lib/db/schema";

// post form schema for form validation
const postSchema = z.object({
    title: z.string().min(3, "Title must be at least 3 characters long.").max(255,
        "Title must be less than 255 characters."
    ),
    description: z.string().min(3, "Description must be at least 3 Characters long.").max(255,
        "Description must be less than 255 characters."
    ),
    content: z.string().min(10, "Content must be at least 10 characters long.")
})

type PostSchemaValues = z.infer<typeof postSchema>

export default function PostForm({ isEditing, post }: PostFormProps) {
    const router = useRouter()
    const [submitting, setSubmitting] = useState(false)

    const { handleSubmit, formState: { errors }, register } = useForm<PostSchemaValues>({
        resolver: zodResolver(postSchema),
        defaultValues: isEditing && post ? {
            title: post.title,
            description: post.description,
            content: post.content,
        } : {
            title: "",
            description: "",
            content: ""
        }
    })
    const onFormSubmit = async (data: PostSchemaValues) => {
        setSubmitting(true)

        const formData = new FormData()
        formData.append("title", data.title)
        formData.append("description", data.description)
        formData.append("content", data.content)


        try {
            if (isEditing) {
                if (!post?.id) {
                    toast("Missing post id for update.")
                    return;
                }
                const res = await updatePost(post.id, formData)
                if (res.success) {
                    toast(res.message)
                    router.push("/")
                }
                else toast(res.message || "Failed to update post!")

            } else {
                const res = await createPost(formData)
                if (res.success) {
                    toast("Post created successfully.")
                    router.push("/")
                }
                else toast(res.message || "Failed to create post!")
            }
        } catch (error) {
            toast(isEditing ? "Failed to edit the post." : "Failed to create post")
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input id="title" placeholder="Enter post title" {...register("title")} />
                {errors.title &&
                    <p className="text-sm text-red-600">{errors.title.message}</p>
                }
            </div>
            <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" placeholder="Enter a short post description" {...register("description")} />
                {errors.description &&
                    <p className="text-sm text-red-600">{errors.description.message}</p>
                }
            </div>
            <div className="space-y-2">
                <Label htmlFor="content">Content</Label>
                <Textarea className="min-h-32" id="content" placeholder="Enter post content" {...register("content")} />
                {errors.content &&
                    <p className="text-sm text-red-600">{errors.content.message}</p>
                }
            </div>
            <Button disabled={submitting} type="submit" className="w-full mt-4">{isEditing ? "Update Post" : "Create Post"}</Button>
        </form>
    )
}