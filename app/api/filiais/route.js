
import { NextResponse } from "next/server"
import { cookies } from "next/headers"

const API_BASE_URL =
    process.env.REPORTS_API_URL?.replace(/\/$/, "")

export async function GET() {
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

        // Recuperar o cookie enviado pelo navegador.
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

        const apiUrl =
            `${API_BASE_URL}/api/v1/filiais`

        const response = await fetch(apiUrl, {
            method: "GET",

            headers: {
                Accept: "application/json",

                // Encaminhar o cookie ao backend.
                Cookie:
                    `lpshub_access_token=${accessToken.value}`,
            },

            cache: "no-store",
        })

        const contentType =
            response.headers.get(
                "content-type"
            ) ?? ""

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
                }
            )

            return NextResponse.json(
                {
                    message:
                        "A API de filiais retornou uma resposta em formato inesperado.",

                    upstreamStatus:
                        response.status,
                },
                { status: 502 }
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
                        "A API de filiais retornou um JSON inválido.",
                },
                { status: 502 }
            )
        }

        // Repassar erros de autenticação,
        // autorização e demais erros do backend.
        if (!response.ok) {
            console.error(
                "A API de filiais retornou um erro:",
                {
                    status: response.status,
                }
            )

            return NextResponse.json(
                responseData,
                { status: response.status }
            )
        }

        const apiBranches =
            Array.isArray(responseData)
                ? responseData
                : responseData?.data

        if (!Array.isArray(apiBranches)) {
            console.error(
                "Formato inesperado retornado pela API de filiais:",
                responseData
            )

            return NextResponse.json(
                {
                    message:
                        "A API de filiais não retornou um array válido.",
                },
                { status: 502 }
            )
        }

        const branchMap = new Map()

        apiBranches.forEach((branch) => {
            const sigla = String(
                branch?.Sigla ?? ""
            )
                .trim()
                .toLocaleUpperCase("pt-BR")

            const nomeEmpresa = String(
                branch?.["Nome Empresa"] ?? ""
            ).trim()

            if (
                !sigla ||
                !nomeEmpresa ||
                branchMap.has(sigla)
            ) {
                return
            }

            branchMap.set(sigla, {
                sigla,
                nomeEmpresa,
            })
        })

        const branches = [
            ...branchMap.values(),
        ].sort(
            (firstBranch, secondBranch) =>
                firstBranch.sigla.localeCompare(
                    secondBranch.sigla,
                    "pt-BR"
                )
        )

        return NextResponse.json(
            branches,
            {
                status: 200,
                headers: {
                    "Cache-Control": "no-store",
                },
            }
        )

    } catch (error) {
        console.error(
            "Erro no Route Handler de filiais:",
            error
        )

        return NextResponse.json(
            {
                message:
                    "Não foi possível acessar a API de filiais.",
            },
            { status: 502 }
        )
    }
}
