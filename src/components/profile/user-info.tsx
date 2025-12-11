'use client'

import Link from "next/link";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Check, Pencil, PlusCircle, X } from "lucide-react";
import { UserInfoProps } from "@/lib/types";
import { useState, useEffect } from "react";
import { formatDate } from "@/lib/utils";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { changeEmail, updateUser } from "@/lib/auth-client";

const updateSchema = z.object({
    name: z.string().min(3, "Name must be at least 3 character long!"),
    email: z.email("Please enter a valid email address!")
})

type UpdateFormValue = z.infer<typeof updateSchema>

export function UserInfo({ user }: UserInfoProps) {
    const [isEditing, setIsEditing] = useState(false)
    const [isSaving, setIsSaving] = useState(false)
    const router = useRouter()

    const { register, reset, handleSubmit, formState: { errors } } = useForm<UpdateFormValue>({
        resolver: zodResolver(updateSchema),
        defaultValues: user ? {
            name: user.name,
            email: user.email
        } : {
            name: "",
            email: ""
        }
    })

    // If user prop changes after navigation or refresh, sync the form values
    useEffect(() => {
        reset(user ? { name: user.name, email: user.email } : { name: "", email: "" })
    }, [user, reset])
    const handleSave = async (values: UpdateFormValue) => {
        setIsSaving(true)
        try {
            console.log(values)
            const promises: Promise<any>[] = [
                updateUser({ name: values.name })
            ]

            // Only update email if it has changed
            if (values.email !== user?.email) {
                promises.push(changeEmail({ newEmail: values.email }))
            }

            const results = await Promise.all(promises)
            const [userResult, emailResult] = results

            if (userResult.error) {
                toast.error(userResult.error.message || "Failed to update name")
                return
            }
            if (emailResult && emailResult.error) {
                toast.error(emailResult.error.message || "Failed to update email")
                return
            }

            toast.success("User info updated successfully.")
            reset(values)
            setIsEditing(false)
        } catch (error: any) {
            toast.error(error.message || "Failed to update user info")
        } finally {
            setIsSaving(false)
        }
    }

    const handleCancel = () => {
        reset()
        setIsEditing(false)
    }

    return (
        <Card>
            <CardContent>
                <div className="space-y-8">
                    <form onSubmit={handleSubmit(handleSave)} className="flex flex-col gap-4">
                        <div className="flex flex-col gap-1">
                            <Label htmlFor="name" className="font-medium">Name:</Label>
                            <Input {...register("name")} disabled={!isEditing} type="text" id="name" defaultValue={user?.name} className="border px-2 py-1 rounded max-w-66 disabled:opacity-100" />
                            {isEditing && errors.name &&
                                <p className="text-sm text-red-600">{errors.name.message}</p>
                            }
                        </div>
                        <div className="flex flex-col gap-1">
                            <Label htmlFor="email" className="font-medium">Email:</Label>
                            <Input {...register("email")} disabled={!isEditing} type="email" id="email" defaultValue={user?.email} className="border px-2 py-1 rounded max-w-66 disabled:opacity-100" />
                            {isEditing && errors.email &&
                                <p className="text-sm text-red-600">{errors.email.message}</p>
                            }
                        </div>
                        {!isEditing && (
                            <>
                                <div className="mt-2">
                                    <span className="font-medium">Profile Created: </span> {formatDate(user?.createdAt)}
                                </div>
                                <div>
                                    <span className="font-medium">Last Updated: </span> {formatDate(user?.updatedAt)}
                                </div>
                            </>
                        )}

                        <div className="flex gap-4 mt-4">
                            {!isEditing ? (
                                <>
                                    <Button asChild>
                                        <Link href={"/post/create"}>
                                            <PlusCircle />
                                            Create Post
                                        </Link>
                                    </Button>
                                    <Button onClick={(e) => { e.preventDefault(); setIsEditing(true); }} type="button">
                                        <Pencil />
                                        Edit profile
                                    </Button>
                                </>
                            ) : (
                                <>
                                    <Button onClick={handleCancel} type="button">
                                        <X />
                                        Cancel
                                    </Button>
                                    <Button disabled={isSaving} type="submit">
                                        <Check />
                                        {isSaving ? "Saving" : "Save"}
                                    </Button>
                                </>
                            )}

                        </div>
                    </form>

                </div>
            </CardContent>
        </Card>
    )
}