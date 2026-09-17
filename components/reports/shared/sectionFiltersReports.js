import Icon from "@/components/icon";
import FilterFieldBranch from "./filters/filterFieldBranch";
import { useState } from "react";

export default function SectionFiltersReports() {

    const [branchs, setBranchs] = useState(["Todas"])

    const [filtersOpen, setFiltersOpen] = useState(true);
    const [executing, setExecuting] = useState(false);
    const [resetKey, setResetKey] = useState(0)

    function executeReport() {
        console.log("Filiais selecionadas:", branchs.join(","))

        setExecuting(true)

        globalThis.setTimeout(() => {
            setExecuting(false)
        }, 600)
    }

    function clearFilters() {
        setResetKey((value) => value + 1)
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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-space-md">
                    <FilterFieldBranch
                        resetKey={resetKey}
                        onChange={setBranchs}
                    />
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