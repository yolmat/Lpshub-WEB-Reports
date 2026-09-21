import { NextResponse } from "next/server"

const API_BASE_URL =
    process.env.REPORTS_API_URL?.replace(
        /\/$/,
        ""
    )

export async function POST(request) {
    try {
        if (!API_BASE_URL) {
            return NextResponse.json(
                {
                    message:
                        "REPORTS_API_URL não foi configurada.",
                },
                {
                    status: 500,
                }
            )
        }

        const requestBody =
            await request.json()

        const apiUrl =
            `${API_BASE_URL}/api/v1/extratos-bancarios`

        console.log(
            "Encaminhando requisição para:",
            apiUrl
        )

        const response = await fetch(apiUrl, {
            method: "POST",

            headers: {
                "Content-Type": "application/json",
            },

            body: JSON.stringify(requestBody),

            cache: "no-store",
        })

        const contentType =
            response.headers.get("content-type") ?? ""

        const responseText =
            await response.text()

        if (
            !contentType.includes(
                "application/json"
            )
        ) {
            console.error(
                "A API Express respondeu com conteúdo não JSON:",
                {
                    status: response.status,
                    contentType,
                    preview: responseText.slice(
                        0,
                        500
                    ),
                }
            )

            return NextResponse.json(
                {
                    message:
                        "A API de extratos retornou uma resposta em formato inesperado.",
                    upstreamStatus:
                        response.status,
                },
                {
                    status: 502,
                }
            )
        }

        let responseData

        try {
            responseData =
                JSON.parse(responseText)
        } catch {
            return NextResponse.json(
                {
                    message:
                        "A API de extratos retornou um JSON inválido.",
                },
                {
                    status: 502,
                }
            )
        }

        return NextResponse.json(
            responseData,
            {
                status: response.status,
            }
        )
    } catch (error) {
        console.error(
            "Erro no Route Handler:",
            error
        )

        return NextResponse.json(
            {
                message:
                    "Não foi possível acessar a API de extratos bancários.",
            },
            {
                status: 500,
            }
        )
    }
}