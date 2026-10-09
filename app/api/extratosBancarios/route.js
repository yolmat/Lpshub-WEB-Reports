
import { NextResponse } from "next/server"
import { cookies } from "next/headers"

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

        // Recuperar o cookie de autenticação.
        const cookieStore = await cookies()

        const accessToken = cookieStore.get(
            "lpshub_access_token"
        )

        // Impedir requisições sem autenticação.
        if (!accessToken?.value) {
            return NextResponse.json(
                {
                    message:
                        "Não autenticado. Faça login para continuar.",
                },
                { status: 401 }
            )
        }

        // Recuperar e validar o JSON recebido.
        let requestBody

        try {
            requestBody = await request.json()
        } catch {
            return NextResponse.json(
                {
                    message:
                        "O corpo da requisição contém um JSON inválido.",
                },
                { status: 400 }
            )
        }

        const apiUrl =
            `${API_BASE_URL}/api/v1/extratos-bancarios`

        const response = await fetch(apiUrl, {
            method: "POST",

            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",

                // Encaminhar o cookie ao backend Express.
                Cookie:
                    `lpshub_access_token=${accessToken.value}`,
            },

            body: JSON.stringify(requestBody),

            cache: "no-store",
        })

        const contentType =
            response.headers.get("content-type") ?? ""

        const responseText =
            await response.text()

        if (
            !contentType.includes("application/json")
        ) {
            console.error(
                "A API Express respondeu com conteúdo não JSON:",
                {
                    status: response.status,
                    contentType,
                }
            )

            return NextResponse.json(
                {
                    message:
                        "A API de extratos retornou uma resposta em formato inesperado.",

                    upstreamStatus:
                        response.status,
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
                        "A API de extratos retornou um JSON inválido.",
                },
                { status: 502 }
            )
        }

        // Repassar erros de autenticação,
        // autorização e demais erros do backend.
        if (!response.ok) {
            console.error(
                "A API de extratos retornou um erro:",
                {
                    status: response.status,
                }
            )

            return NextResponse.json(
                responseData,
                {
                    status: response.status,
                    headers: {
                        "Cache-Control": "no-store",
                    },
                }
            )
        }

        return NextResponse.json(
            responseData,
            {
                status: response.status,
                headers: {
                    "Cache-Control": "no-store",
                },
            }
        )

    } catch (error) {
        console.error(
            "Erro no Route Handler de extratos bancários:",
            error
        )

        return NextResponse.json(
            {
                message:
                    "Não foi possível acessar a API de extratos bancários.",
            },
            { status: 502 }
        )
    }
}
