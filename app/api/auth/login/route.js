
import { NextResponse } from "next/server"

const API_BASE_URL =
    process.env.REPORTS_API_URL?.replace(/\/$/, "")

export async function POST(request) {
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

        let body

        try {
            body = await request.json()
        } catch {
            return NextResponse.json(
                {
                    message: "JSON inválido.",
                },
                { status: 400 }
            )
        }

        const { login, senha } = body ?? {}

        if (
            typeof login !== "string" ||
            !login.trim() ||
            typeof senha !== "string" ||
            !senha
        ) {
            return NextResponse.json(
                {
                    message:
                        "Usuário e senha são obrigatórios.",
                },
                { status: 400 }
            )
        }

        const apiUrl =
            `${API_BASE_URL}/api/v1/auth/login`

        const response = await fetch(apiUrl, {
            method: "POST",

            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },

            body: JSON.stringify({
                login: login.trim(),
                senha,
            }),

            cache: "no-store",
        })

        const contentType =
            response.headers.get("content-type") ?? ""

        const responseText = await response.text()

        if (!contentType.includes("application/json")) {
            console.error(
                "A API de autenticação retornou conteúdo não JSON:",
                {
                    status: response.status,
                    contentType,
                }
            )

            return NextResponse.json(
                {
                    message:
                        "A API de autenticação retornou uma resposta inesperada.",
                    upstreamStatus: response.status,
                },
                { status: 502 }
            )
        }

        let responseData

        try {
            responseData = JSON.parse(responseText)
        } catch {
            return NextResponse.json(
                {
                    message:
                        "A API de autenticação retornou um JSON inválido.",
                },
                { status: 502 }
            )
        }

        if (!response.ok) {
            return NextResponse.json(
                responseData,
                { status: response.status }
            )
        }

        const nextResponse = NextResponse.json(
            responseData,
            { status: response.status }
        )

        // Encaminhar os cookies de sessão enviados pela API.
        const cookies =
            response.headers.getSetCookie()

        for (const cookie of cookies) {
            nextResponse.headers.append(
                "Set-Cookie",
                cookie
            )
        }

        nextResponse.headers.set(
            "Cache-Control",
            "no-store"
        )

        return nextResponse

    } catch (error) {
        console.error(
            "Erro no Route Handler de autenticação:",
            error
        )

        return NextResponse.json(
            {
                message:
                    "Não foi possível acessar a API de autenticação.",
            },
            { status: 502 }
        )
    }
}
