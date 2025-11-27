'use client'

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"
import LoginForm from "./login-form"
import RegisterForm from "./register-form"

export default function AuthLayout() {
    const [activeTab, setActiveTab] = useState('login')
    return (
        <div className="flex justify-center items-center min-h-[80vh] ">
            <div className="p-8 rounded border w-full max-w-md shadow-md bg-card space-y-4">
                <h2 className="text-2xl text-center">Welcome!</h2>
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid grid-cols-2 w-full mb-8">
                        <TabsTrigger value="login">Login</TabsTrigger>
                        <TabsTrigger value="register">Register</TabsTrigger>
                    </TabsList>

                    <TabsContent value="login">
                        <LoginForm />
                    </TabsContent>
                    <TabsContent value="register">
                        <RegisterForm onSuccess={() => setActiveTab("login")} />
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    )
}