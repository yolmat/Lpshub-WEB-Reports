
import { redirect } from "next/navigation"

import { isAuthenticated } from "@/lib/auth"
import LoginForm from "@/components/dashboard/loginForm"

export default async function LoginPage() {
    const hasCookie = await isAuthenticated()

    if (hasCookie) {
        redirect("/dashboard")
    }

    return <LoginForm />
}
