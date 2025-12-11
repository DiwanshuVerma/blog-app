'use client'

import { Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import { PostDeleteButtonProps } from "@/lib/types";
import { toast } from "sonner";
import { deletePost } from "@/actions/post-actions";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function DeletePostButton({ postId }: PostDeleteButtonProps) {
    const router = useRouter()
    const [isDeleting, setIsDeleting] = useState(false)

    const handleDelete = async () => {
        setIsDeleting(true)
        try {
            const res = await deletePost(postId)
            if (res?.success) {
                toast.success(res.message)
                router.push("/")
                router.refresh()
            }
            else toast.error(res?.message)
        } catch (error) {
            toast.error("Error while deleting the post!")
        } finally {
            setIsDeleting(false)
        }
    }

    return (
        <Button disabled={isDeleting} variant={"destructive"} size={"sm"} onClick={handleDelete}>
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
        </Button>
    )
}