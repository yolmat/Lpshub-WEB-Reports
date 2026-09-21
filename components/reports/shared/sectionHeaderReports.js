import Icon from "@/components/icon"

import { Button } from "@/components/ui/button"

export default function SectionHeaderReports({
    title,
    transaction,
    subtitle,
    onExport,
    exportingExcel = false,
    exportDisabled = false,
    exportError = "",
}) {
    return (
        <section className="flex flex-col justify-between gap-space-md xl:flex-row xl:items-center">
            <div className="flex flex-col gap-space-xs">
                <div className="flex flex-wrap items-center gap-space-sm">
                    <h1 className="font-headline-lg font-bold tracking-tight">
                        {title}
                    </h1>

                    <span className="inline-flex items-center gap-1 rounded bg-surface-container-highest px-space-xs py-0.5 font-data-mono font-semibold text-on-surface-variant">
                        {Icon(
                            "terminal",
                            "text-[13px]"
                        )}

                        [{transaction}]
                    </span>
                </div>

                <p className="max-w-3xl text-on-surface-variant">
                    {subtitle}
                </p>
            </div>

            <div className="flex shrink-0 flex-col items-end gap-1">
                <Button
                    type="button"
                    className="toolbar-button primary"
                    onClick={onExport}
                    disabled={
                        exportDisabled ||
                        exportingExcel
                    }
                >
                    {Icon(
                        exportingExcel
                            ? "progress_activity"
                            : "download",
                        `text-[18px] ${exportingExcel
                            ? "animate-spin"
                            : ""
                        }`
                    )}

                    <span>
                        {exportingExcel
                            ? "Gerando Excel..."
                            : "Exportar Excel (XLSX)"}
                    </span>
                </Button>

                {exportError && (
                    <p className="max-w-72 text-right text-xs text-error">
                        {exportError}
                    </p>
                )}
            </div>
        </section>
    )
}