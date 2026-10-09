
import { NextResponse } from "next/server"
import { cookies } from "next/headers"

const API_BASE_URL =
    process.env.REPORTS_API_URL?.replace(/\/$/, "")

const SERVICES = {
    api: "/api",
    sap: "/api/v1/service-layer",
}

export async function GET(request, { params }) {
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
                    message:
                        "Não autenticado. Faça login para continuar.",
                },
                { status: 401 }
            )
        }

        const { server } = await params

        if (!Object.hasOwn(SERVICES, server)) {
            return NextResponse.json(
                {
                    message: "Serviço não identificado.",
                },
                { status: 400 }
            )
        }

        const apiUrl =
            `${API_BASE_URL}${SERVICES[server]}`

        const response = await fetch(apiUrl, {
            method: "GET",

            headers: {
                Accept: "application/json",

                Cookie:
                    `lpshub_access_token=${accessToken.value}`,
            },

            cache: "no-store",

            signal: AbortSignal.timeout(5000),
        })

        // Não confundir 401/403 com indisponibilidade.
        if (
            response.status === 401 ||
            response.status === 403
        ) {
            return NextResponse.json(
                {
                    message:
                        "Não autorizado a consultar o serviço.",
                },
                { status: response.status }
            )
        }

        const contentType =
            response.headers.get("content-type") ?? ""

        let responseData = null

        if (contentType.includes("application/json")) {
            try {
                responseData = await response.json()
            } catch {
                return NextResponse.json(
                    {
                        server,
                        status: "unknown",
                        message: "JSON inválido.",
                    },
                    { status: 502 }
                )
            }
        }

        // Se o backend fornecer um campo de saúde,
        // utilizamos esse resultado como referência.
        const healthStatus =
            responseData?.data?.status ??
            responseData?.status

        let status

        if (healthStatus === "offline") {
            status = "offline"
        } else if (healthStatus === "online") {
            status = response.ok ? "online" : "offline"
        } else {
            // Verificação HTTP simples.
            status = response.ok ? "online" : "offline"
        }

        return NextResponse.json(
            {
                server,
                status,
            },
            {
                status: 200,
                headers: {
                    "Cache-Control": "no-store",
                },
            }
        )

    } catch (error) {
        console.error(
            "Erro ao consultar status:",
            error
        )

        return NextResponse.json(
            {
                status: "unknown",
                message:
                    "Não foi possível verificar o serviço.",
            },
            { status: 502 }
        )
    }
}
