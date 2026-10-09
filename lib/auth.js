
import "server-only"

import { cookies } from "next/headers"

export async function isAuthenticated() {
    const cookieStore = await cookies()

    const token = cookieStore.get(
        "lpshub_access_token"
    )

    if (!token?.value) {
        return false
    }

    const API_BASE_URL =
        process.env.REPORTS_API_URL?.replace(/\/$/, "")

    if (!API_BASE_URL) {
        return false
    }

    try {
        const response = await fetch(
            `${API_BASE_URL}/api/v1/auth/me`,
            {
                method: "GET",

                headers: {
                    Cookie:
                        `lpshub_access_token=${token.value}`,

                    Accept: "application/json",
                },

                cache: "no-store",

                signal: AbortSignal.timeout(5000),
            }
        )

        return response.ok

    } catch (error) {
        console.error(
            "Falha na validação da sessão:",
            error
        )

        return false
    }
}
