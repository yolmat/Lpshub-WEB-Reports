
import { NextResponse } from "next/server"
import { cookies } from "next/headers"

const API_BASE_URL =
    process.env.REPORTS_API_URL?.replace(/\/$/, "")

export async function POST() {
    try {
        if (!API_BASE_URL) {
            return NextResponse.json(
                {
                    message:
                        "REPORTS_API_URL não foi configurada.",
                },
                { status: 500 }
            )
        }

        const cookieStore = await cookies()

        const accessToken = cookieStore.get(
            "lpshub_access_token"
        )

        if (!accessToken?.value) {
            return NextResponse.json(
                {
                    message: "Usuário não autenticado.",
                },
                { status: 401 }
            )
        }

        const apiUrl =
            `${API_BASE_URL}/api/v1/auth/logout`

        const response = await fetch(apiUrl, {
            method: "POST",

            headers: {
                Accept: "application/json",
                Cookie:
                    `lpshub_access_token=${accessToken.value}`,
            },

            cache: "no-store",
            signal: AbortSignal.timeout(10000),
        })

        // O backend pode responder com JSON ou 204.
        let responseData = null

        const responseText = await response.text()

        if (responseText) {
            try {
                responseData = JSON.parse(responseText)
            } catch {
                return NextResponse.json(
                    {
                        message:
                            "Resposta inválida da API de logout.",
                    },
                    { status: 502 }
                )
            }
        }

        if (!response.ok) {
            return NextResponse.json(
                responseData ?? {
                    message: "Falha ao encerrar a sessão.",
                },
                { status: response.status }
            )
        }

        const nextResponse = NextResponse.json(
            {
                success: true,
                message: "Logout realizado com sucesso.",
            },
            {
                status: 200,
                headers: {
                    "Cache-Control": "no-store",
                },
            }
        )

        // Remove o cookie no domínio do Next.js.
        // Deve corresponder ao Path usado no login.
        nextResponse.cookies.set(
            "lpshub_access_token",
            "",
            {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                path: "/",
                maxAge: 0,
            }
        )

        return nextResponse

    } catch (error) {
        console.error(
            "Erro no Route Handler de logout:",
            error
        )

        return NextResponse.json(
            {
                message:
                    "Não foi possível encerrar a sessão.",
            },
            { status: 502 }
        )
    }
}
