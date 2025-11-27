'use client'

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import z from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { useState } from "react"
import { signUp } from "@/lib/auth-client"
import { toast } from "sonner"

const registerSchema = z.object({
    name: z.string().min(3, "Name must be at least 3 characters long!"),
    email: z.email("Please enter a valid email address!"),
    password: z.string().min(6, "Password must be at least 6 characters long!"),
    confirmPassword: z.string()
}).refine(data => data.password === data.confirmPassword, {
    message: "Confirm password must be same as password",
    path: ["confirmPassword"]
})

type RegisterFormValues = z.infer<typeof registerSchema>

interface onRegisterSubmitProps {
    onSuccess?: () => void
}

export default function RegisterForm({ onSuccess }: onRegisterSubmitProps) {
    const form = useForm<RegisterFormValues>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            email: "",
            name: "",
            password: "",
            confirmPassword: "",
        }
    })

    const [isLoading, setIsLoading] = useState(false)

    const onRegisterSubmit = async (values: RegisterFormValues) => {
        setIsLoading(true)

        try {
            const { error } = await signUp.email({
                email: values.email,
                name: values.name,
                password: values.password
            })

            if (error) {
                toast(error.message)
                return
            }
            toast("Account created successfully. Login with same email & password")

            if (onSuccess) onSuccess()

        } catch (error) {
            console.error("Error while submitting the register form: ", error)
        } finally {
            setIsLoading(false)
        }
    }

    return <Form {...form}>
        <form onSubmit={form.handleSubmit(onRegisterSubmit)} className="space-y-4">
            <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                            <Input placeholder='Enter you name' {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                            <Input placeholder='Enter you email address' {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                            <Input type="password" placeholder='Enter you password' {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Confirm Password</FormLabel>
                        <FormControl>
                            <Input type="password" placeholder='Enter you password again' {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <Button disabled={isLoading} type="submit" className="w-full">{isLoading ? "Creating Account..." : "Create Account"}</Button>
        </form>
    </Form>
}