import Icon from "@/components/icon";
import FilterFieldBranch from "./filters/filterFieldBranch";
import { useState } from "react";
import { FilterFieldDate } from "./filters/filterFieldDate";

const ALL_COMPANIES = [
    "LPSI",
    "LSUL",
    "EBC",
]

function convertDateToApi(date) {
    if (!date) {
        return ""
    }

    // A data já está em yyyy-MM-dd
    if (/^\d{4}-\d{2}-\d{2}$/.test(date)) {
        return date
    }

    const match = String(date).match(
        /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/
    )

    if (!match) {
        throw new Error(
            `Formato de data inválido: ${date}`
        )
    }

    const [, day, month, year] = match

    return [
        year,
        month.padStart(2, "0"),
        day.padStart(2, "0"),
    ].join("-")
}

function getErrorMessage(
    responseData,
    fallbackMessage
) {
    const possibleMessages = [
        responseData?.error?.message?.value,
        responseData?.error?.message,
        responseData?.message?.value,
        responseData?.message,
        responseData?.error?.value,
        responseData?.error,
        responseData?.details,
        responseData?.detail,
    ]

    for (const possibleMessage of possibleMessages) {
        if (
            typeof possibleMessage === "string" &&
            possibleMessage.trim()
        ) {
            return possibleMessage
        }

        if (
            typeof possibleMessage === "number"
        ) {
            return String(possibleMessage)
        }

        if (
            possibleMessage &&
            typeof possibleMessage === "object"
        ) {
            try {
                return JSON.stringify(
                    possibleMessage
                )
            } catch {
                continue
            }
        }
    }

    return fallbackMessage
}

export default function SectionFiltersReports() {

    const [branchs, setBranchs] = useState(["Todas"])
    const [dateInit, setDateInit] = useState([])
    const [dateEnd, setDateEnd] = useState([])
    const [dateInitFromMatchCode, setDateInitFromMatchCode] = useState(false)

    const [reportData, setReportData] = useState(null)
    const [requestError, setRequestError] = useState("")

    const [filtersOpen, setFiltersOpen] = useState(true);
    const [executing, setExecuting] = useState(false);
    const [resetKey, setResetKey] = useState(0)

    async function executeReport() {

        const filtros = [
            branchs,
            dateInitFromMatchCode,
            dateInit,
            dateEnd
        ]

        console.log(filtros)

        if (executing) {
            return
        }

        setExecuting(true)
        setRequestError("")

        try {
            const empresa = branchs.includes("Todas")
                ? ALL_COMPANIES
                : branchs.map((branch) =>
                    branch.toLocaleUpperCase("pt-BR")
                )

            let requestBody

            if (dateInitFromMatchCode) {
                const datas = dateInit
                    .map(convertDateToApi)
                    .sort()

                if (datas.length === 0) {
                    throw new Error(
                        "Informe pelo menos uma data no MatchCode."
                    )
                }

                requestBody = {
                    empresa,
                    datas,
                }
            } else {
                if (dateInit.length === 0) {
                    throw new Error(
                        "Informe a data inicial."
                    )
                }

                if (dateEnd.length === 0) {
                    throw new Error(
                        "Informe a data final."
                    )
                }

                const dataInicial =
                    convertDateToApi(dateInit[0])

                const dataFinal =
                    convertDateToApi(dateEnd[0])

                if (dataInicial > dataFinal) {
                    throw new Error(
                        "A data inicial não pode ser maior que a data final."
                    )
                }

                requestBody = {
                    empresa,
                    datas: [],
                    dataInicial,
                    dataFinal,
                }
            }

            console.log(
                "Body enviado para API:",
                requestBody
            )

            const response = await fetch(
                "/api/extratosBancarios",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json",
                    },

                    body: JSON.stringify(requestBody),
                }
            )

            const contentType =
                response.headers.get("content-type") ?? ""

            const responseText = await response.text()

            let responseData = null

            if (
                contentType.includes("application/json") &&
                responseText
            ) {
                try {
                    responseData =
                        JSON.parse(responseText)
                } catch {
                    throw new Error(
                        "A resposta foi identificada como JSON, mas possui conteúdo inválido."
                    )
                }
            }

            if (!response.ok) {
                const responsePreview = responseText
                    .replace(/\s+/g, " ")
                    .slice(0, 200)

                console.error(
                    "Resposta completa da API:",
                    {
                        status: response.status,
                        statusText: response.statusText,
                        contentType,
                        responseData,
                        responsePreview,
                    }
                )

                const fallbackMessage =
                    `Erro ${response.status} ao acessar a API. ` +
                    `Resposta: ${responsePreview}`

                throw new Error(
                    getErrorMessage(
                        responseData,
                        fallbackMessage
                    )
                )
            }

            if (
                !contentType.includes("application/json")
            ) {
                throw new Error(
                    `A API respondeu com um formato inesperado: ${contentType || "sem content-type"
                    }.`
                )
            }

            setReportData(responseData)

            console.log(
                "Dados recebidos:",
                responseData
            )
        } catch (error) {
            console.error(
                "Erro ao executar relatório:",
                error
            )

            setReportData(null)

            setRequestError(
                error instanceof Error
                    ? error.message
                    : "Não foi possível executar o relatório."
            )
        } finally {
            setExecuting(false)
        }
    }

    function handleDateInitChange(
        values,
        metadata = {}
    ) {
        setDateInit(values)

        const hasMatchCodeValues =
            metadata.source === "matchcode" &&
            values.length > 0

        setDateInitFromMatchCode(
            hasMatchCodeValues
        )

        if (hasMatchCodeValues) {
            setDateEnd([])
        }
    }

    function clearFilters() {
        setBranchs(["Todas"])
        setDateInit([])
        setDateEnd([])
        setDateInitFromMatchCode(false)

        setResetKey(
            (currentValue) => currentValue + 1
        )
    }

    return (
        <section className="panel flex flex-col gap-space-md">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-space-sm">
                    <div className="w-7 h-7 rounded bg-surface-container-high flex items-center justify-center text-primary">
                        {Icon("manage_search", "text-[18px]")}
                    </div>
                    <div>
                        <h2 className="font-headline-sm leading-tight">Critérios de Seleção</h2>
                    </div>
                </div>
                <div className="flex items-center gap-space-xs">
                    <button type="button" onClick={() => setFiltersOpen(!filtersOpen)} className="square-button">
                        {Icon(filtersOpen ? "keyboard_arrow_up" : "keyboard_arrow_down", "text-[18px]")}
                    </button>
                </div>
            </div>

            {filtersOpen && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-space-sm">
                    <FilterFieldBranch
                        resetKey={resetKey}
                        onChange={setBranchs}
                    />

                    <FilterFieldDate
                        multiple
                        matchCodeOn
                        label="Data Inicio | documento"
                        resetKey={resetKey}
                        onChange={handleDateInitChange}
                    />

                    {!dateInitFromMatchCode && (
                        <FilterFieldDate
                            label="Data Fim | documento"
                            resetKey={resetKey}
                            onChange={setDateEnd}
                        />
                    )}

                </div>
            )}

            <div className="flex items-center justify-end pt-space-xs">
                <div className="flex items-center gap-space-sm">
                    <button type="button" onClick={clearFilters} className="toolbar-button">{Icon("restart_alt", "text-[16px]")} Limpar Filtros</button>
                    <button type="button" onClick={executeReport} disabled={executing} className="toolbar-button primary">
                        {Icon(executing ? "refresh" : "play_arrow", `text-[18px] ${executing ? "animate-spin" : ""}`)}
                        {executing ? "Executando RFC..." : "Executar Relatório (F8)"}
                    </button>
                </div>
            </div>
        </section>
    )
}