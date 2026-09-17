import Icon from "@/components/icon"
import { Button } from "@base-ui/react"

export default function SectionHeaderReports({ title, transaction, subtitle }) {
    return (
        <section className="flex flex-col xl:flex-row xl:items-center justify-between gap-space-md">
            <div className="flex flex-col gap-space-xs">

                <div className="flex items-center gap-space-sm flex-wrap">
                    <h1 className="font-headline-lg font-bold tracking-tight">{title}</h1>
                    <span className="inline-flex items-center gap-1 px-space-xs py-0.5 rounded bg-surface-container-highest text-on-surface-variant font-data-mono font-semibold">
                        {Icon("terminal", "text-[13px]")} [{transaction}]
                    </span>
                </div>

                <p className="text-on-surface-variant max-w-3xl">
                    {subtitle}
                </p>
            </div>

            <div className="flex items-center gap-space-xs flex-wrap shrink-0">
                <Button type="button" className="toolbar-button primary">
                    {Icon("download", "text-[18px]")}<span>Exportar Excel (XLSX)</span>
                </Button>
            </div>
        </section>
    )
}