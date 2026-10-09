
import { redirect } from "next/navigation"

import { isAuthenticated } from "@/lib/auth"
import ReportsHeader from "@/components/reports/shared/reportsHeader"

export default async function DashboardLayout({
    children,
}) {
    const authenticated = await isAuthenticated()

    if (!authenticated) {
        redirect("/login")
    }

    return (
        <div className="min-h-dvh bg-surface text-on-surface">
            <ReportsHeader />
            {children}
        </div>
    )
}
