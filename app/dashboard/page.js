
"use client"

import { useMemo, useState } from "react"

import ReportCard from "@/components/dashboard/reportCard"
import { reports } from "@/config/reports"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export default function DashboardPage() {
    const [search, setSearch] = useState("")
    const [activeTag, setActiveTag] = useState("Todos")

    const tags = useMemo(() => {
        return [
            "Todos",
            ...new Set(
                reports.flatMap((report) => report.tags)
            ),
        ]
    }, [])

    const filteredReports = useMemo(() => {
        const normalizedSearch = search
            .trim()
            .toLocaleLowerCase("pt-BR")

        return reports.filter((report) => {
            const matchesSearch = [
                report.title,
                report.code ?? "",
                report.description,
                ...report.tags,
            ]
                .join(" ")
                .toLocaleLowerCase("pt-BR")
                .includes(normalizedSearch)

            const matchesTag =
                activeTag === "Todos" ||
                report.tags.includes(activeTag)

            return matchesSearch && matchesTag
        })
    }, [search, activeTag])

    return (
        <main className="min-h-dvh bg-surface px-4 py-8 sm:px-6 lg:px-8">

            <div className="mx-auto flex max-w-7xl flex-col gap-8">

                <header className="space-y-2">

                    <h1 className="font-headline-lg text-on-surface">
                        Central de Relatórios
                    </h1>

                    <p className="font-body-md text-on-surface-variant">
                        Consulte e execute os relatórios disponíveis no sistema.
                    </p>

                </header>

                <section
                    aria-label="Pesquisa e filtros de relatórios"
                    className="space-y-4"
                >

                    <div className="relative max-w-xl">

                        {/*}<span
                            aria-hidden="true"
                            className="material-symbols-outlined pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 !text-[20px] text-on-surface-variant"
                        >
                            search
                        </span>

                        <Input
                            type="search"
                            value={search}
                            onChange={(event) =>
                                setSearch(event.target.value)
                            }
                            placeholder="Buscar relatório por nome, código ou descrição..."
                            aria-label="Pesquisar relatórios"
                            className="field-input h-10 pl-10"
                        />{*/}

                    </div>

                    <div className="flex flex-wrap gap-2">

                        {tags.map((tag) => {
                            const isSelected = activeTag === tag

                            return (
                                <Button
                                    key={tag}
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setActiveTag(tag)}
                                    aria-pressed={isSelected}
                                    className={`h-8 rounded-full px-3 font-label-md ${isSelected
                                        ? "bg-primary text-on-primary hover:bg-primary-container hover:text-on-primary"
                                        : "bg-surface-container text-on-surface-variant hover:bg-surface-container-high"
                                        }`}
                                >
                                    {tag}
                                </Button>
                            )
                        })}

                    </div>

                </section>

                <section
                    aria-labelledby="reports-heading"
                    className="space-y-4"
                >

                    <div className="flex items-center justify-between gap-3">

                        <h2
                            id="reports-heading"
                            className="font-headline-sm text-on-surface"
                        >
                            Relatórios disponíveis
                        </h2>

                        <Badge
                            variant="secondary"
                            className="bg-surface-container font-label-md text-on-surface-variant"
                        >
                            {filteredReports.length} relatórios
                        </Badge>

                    </div>

                    {filteredReports.length > 0 ? (
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

                            {filteredReports.map((report) => (
                                <ReportCard
                                    key={report.id}
                                    {...report}
                                />
                            ))}

                        </div>
                    ) : (
                        <div className="flex min-h-60 flex-col items-center justify-center gap-3 rounded-xl border border-outline-variant bg-surface-container-lowest p-6 text-center">

                            <span
                                aria-hidden="true"
                                className="material-symbols-outlined !text-[36px] text-on-surface-variant"
                            >
                                search_off
                            </span>

                            <p className="font-headline-sm text-on-surface">
                                Nenhum relatório encontrado
                            </p>

                            <p className="font-body-md text-on-surface-variant">
                                Tente utilizar outro termo ou categoria.
                            </p>

                            <Button
                                variant="outline"
                                onClick={() => {
                                    setSearch("")
                                    setActiveTag("Todos")
                                }}
                            >
                                Limpar filtros
                            </Button>

                        </div>
                    )}

                </section>

            </div>

        </main>
    )
}
