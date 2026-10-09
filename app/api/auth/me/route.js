
import { NextResponse } from "next/server"
import { cookies } from "next/headers"

const API_BASE_URL =
    process.env.REPORTS_API_URL?.replace(/\/$/, "")

export async function GET() {
    if (!API_BASE_URL) {
        return NextResponse.json(
            { message: "API não configurada." },
            { status: 500 }
        )
    }

    const cookieStore = await cookies()
    const token = cookieStore.get("lpshub_access_token")

    if (!token?.value) {
        return NextResponse.json(
            { message: "Não autenticado." },
            { status: 401 }
        )
    }

    try {
        const response = await fetch(
            `${API_BASE_URL}/api/v1/auth/me`,
            {
                method: "GET",
                headers: {
                    Accept: "application/json",
                    Cookie: `lpshub_access_token=${token.value}`,
                },
                cache: "no-store",
                signal: AbortSignal.timeout(5000),
            }
        )

        if (!response.ok) {
            return NextResponse.json(
                {
                    message: response.status === 401
                        ? "Sessão inválida ou expirada."
                        : "Falha ao consultar usuário.",
                },
                { status: response.status }
            )
        }

        const result = await response.json()

        if (
            result?.success !== true ||
            !result?.data?.id ||
            !result?.data?.login
        ) {
            return NextResponse.json(
                { message: "Dados de usuário inválidos." },
                { status: 502 }
            )
        }

        return NextResponse.json(
            {
                success: true,
                data: {
                    id: result.data.id,
                    login: result.data.login,
                    email: result.data.email,
                },
            },
            {
                headers: {
                    "Cache-Control": "no-store",
                },
            }
        )
    } catch {
        return NextResponse.json(
            { message: "Serviço indisponível." },
            { status: 502 }
        )
    }
}
