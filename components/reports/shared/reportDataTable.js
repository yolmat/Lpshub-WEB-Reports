"use client"

import {
    useDeferredValue,
    useMemo,
    useState,
} from "react"

import {
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table"

import Icon from "@/components/icon"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

import { Skeleton } from "@/components/ui/skeleton"

function containsTextFilter(
    row,
    columnId,
    filterValue
) {
    const cellValue =
        row.getValue(columnId)

    const normalizedCellValue =
        String(cellValue ?? "")
            .toLocaleLowerCase("pt-BR")

    const normalizedFilterValue =
        String(filterValue ?? "")
            .trim()
            .toLocaleLowerCase("pt-BR")

    return normalizedCellValue.includes(
        normalizedFilterValue
    )
}

function formatDefaultValue(value) {
    if (
        value === null ||
        value === undefined ||
        value === ""
    ) {
        return "—"
    }

    return String(value)
}

function getAlignmentClass(alignment) {
    const alignmentClasses = {
        left: "text-left",
        center: "text-center",
        right: "text-right",
    }

    return (
        alignmentClasses[alignment] ??
        alignmentClasses.left
    )
}

function getJustificationClass(alignment) {
    const justificationClasses = {
        left: "justify-between",
        center: "justify-center",
        right: "justify-end",
    }

    return (
        justificationClasses[alignment] ??
        justificationClasses.left
    )
}

function DataTableColumnHeader({
    column,
    label,
    alignment,
}) {
    const filterValue =
        column.getFilterValue() ?? ""

    const sorting = column.getIsSorted()
    const hasFilter = Boolean(filterValue)

    const sortingIcon =
        sorting === "asc"
            ? "arrow_upward"
            : sorting === "desc"
                ? "arrow_downward"
                : "unfold_more"

    return (
        <Popover>
            <PopoverTrigger
                render={
                    <Button
                        type="button"
                        variant="ghost"
                        className={`
                            h-8
                            w-full
                            min-w-0
                            gap-1
                            rounded-md
                            px-1
                            text-on-surface-variant
                            hover:text-primary
                            ${getJustificationClass(
                            alignment
                        )}
                        `}
                    >
                        <span className="flex min-w-0 items-center gap-1.5">
                            <span className="truncate">
                                {label}
                            </span>

                            {hasFilter && (
                                <span
                                    className="h-2 w-2 shrink-0 rounded-full bg-primary"
                                    title="Filtro ativo"
                                />
                            )}
                        </span>

                        <span className="shrink-0">
                            {Icon(
                                sortingIcon,
                                "text-[15px]"
                            )}
                        </span>
                    </Button>
                }
            />

            <PopoverContent
                align="start"
                className="w-72 p-space-md"
            >
                <div className="flex flex-col gap-space-sm">
                    <div>
                        <p className="font-label-md font-bold">
                            {label}
                        </p>

                        <p className="text-xs text-on-surface-variant">
                            Filtre ou classifique esta
                            coluna.
                        </p>
                    </div>

                    <div className="relative flex items-center">
                        <span className="pointer-events-none absolute left-2 text-on-surface-variant">
                            {Icon(
                                "search",
                                "text-[16px]"
                            )}
                        </span>

                        <Input
                            value={filterValue}
                            onChange={(event) =>
                                column.setFilterValue(
                                    event.target.value
                                )
                            }
                            placeholder={`Filtrar ${label.toLocaleLowerCase(
                                "pt-BR"
                            )}...`}
                            className="h-8 pl-8"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                        <Button
                            type="button"
                            variant={
                                sorting === "asc"
                                    ? "secondary"
                                    : "outline"
                            }
                            size="sm"
                            onClick={() =>
                                column.toggleSorting(
                                    false
                                )
                            }
                        >
                            {Icon(
                                "arrow_upward",
                                "text-[16px]"
                            )}

                            Crescente
                        </Button>

                        <Button
                            type="button"
                            variant={
                                sorting === "desc"
                                    ? "secondary"
                                    : "outline"
                            }
                            size="sm"
                            onClick={() =>
                                column.toggleSorting(
                                    true
                                )
                            }
                        >
                            {Icon(
                                "arrow_downward",
                                "text-[16px]"
                            )}

                            Decrescente
                        </Button>
                    </div>

                    <div className="flex justify-between border-t pt-2">
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                                column.setFilterValue(
                                    ""
                                )
                            }
                            disabled={!hasFilter}
                        >
                            Limpar filtro
                        </Button>

                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                                column.clearSorting()
                            }
                            disabled={!sorting}
                        >
                            Limpar ordem
                        </Button>
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    )
}

function DataTableLoadingState() {
    return (
        <div className="rounded-xl bg-surface-container-lowest shadow-sm">
            <div className="flex items-center justify-between border-b p-space-md">
                <Skeleton className="h-8 w-72" />
                <Skeleton className="h-5 w-28" />
            </div>

            <div className="grid gap-2 p-space-md">
                {Array.from({
                    length: 8,
                }).map((_, index) => (
                    <Skeleton
                        key={index}
                        className="h-9 w-full"
                    />
                ))}
            </div>
        </div>
    )
}

function DataTableEmptyState({
    title,
    description,
    icon,
}) {
    return (
        <div className="flex min-h-80 flex-col items-center justify-center rounded-xl bg-surface-container-lowest p-8 text-center shadow-sm">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-surface-container text-primary">
                {Icon(icon, "text-[26px]")}
            </div>

            <h3 className="font-headline-sm">
                {title}
            </h3>

            <p className="mt-1 max-w-md text-sm text-on-surface-variant">
                {description}
            </p>
        </div>
    )
}

export default function ReportDataTable({
    data = null,
    columns = [],
    loading = false,
    searchPlaceholder =
    "Pesquisar em todas as colunas...",
    initialTitle =
    "Execute o relatório",
    initialDescription =
    "Preencha os critérios e execute o relatório para visualizar os dados.",
    emptyTitle =
    "Nenhum registro encontrado",
    emptyDescription =
    "A consulta foi concluída, mas nenhum registro corresponde aos critérios informados.",
    getRowId,
}) {
    const [sorting, setSorting] =
        useState([])

    const [
        columnFilters,
        setColumnFilters,
    ] = useState([])

    const [globalFilter, setGlobalFilter] =
        useState("")

    const deferredGlobalFilter =
        useDeferredValue(globalFilter)

    const normalizedData =
        Array.isArray(data) ? data : []

    const tableColumns = useMemo(
        () =>
            columns.map((columnDefinition) => {
                const alignment =
                    columnDefinition.align ??
                    "left"

                return {
                    ...columnDefinition,

                    id:
                        columnDefinition.id ??
                        columnDefinition.accessorKey,

                    size:
                        columnDefinition.size ??
                        160,

                    minSize:
                        columnDefinition.minSize ??
                        100,

                    filterFn:
                        columnDefinition.filterFn ??
                        containsTextFilter,

                    header: ({ column }) => (
                        <DataTableColumnHeader
                            column={column}
                            label={
                                columnDefinition.header
                            }
                            alignment={alignment}
                        />
                    ),

                    cell: ({
                        getValue,
                        row,
                    }) => {
                        const value = getValue()

                        if (
                            columnDefinition.cell
                        ) {
                            return columnDefinition.cell(
                                {
                                    value,
                                    row:
                                        row.original,
                                }
                            )
                        }

                        return formatDefaultValue(
                            value
                        )
                    },

                    meta: {
                        align: alignment,
                        className:
                            columnDefinition.className ??
                            "",
                    },
                }
            }),
        [columns]
    )

    const table = useReactTable({
        data: normalizedData,
        columns: tableColumns,

        state: {
            sorting,
            columnFilters,
            globalFilter:
                deferredGlobalFilter,
        },

        onSortingChange: setSorting,

        onColumnFiltersChange:
            setColumnFilters,

        onGlobalFilterChange:
            setGlobalFilter,

        getCoreRowModel:
            getCoreRowModel(),

        getFilteredRowModel:
            getFilteredRowModel(),

        getSortedRowModel:
            getSortedRowModel(),

        globalFilterFn:
            containsTextFilter,

        getRowId,
    })

    if (loading) {
        return <DataTableLoadingState />
    }

    if (
        data !== null &&
        !Array.isArray(data)
    ) {
        return (
            <DataTableEmptyState
                icon="error"
                title="Formato de dados inválido"
                description="A tabela esperava receber um array de registros."
            />
        )
    }

    if (data === null) {
        return (
            <DataTableEmptyState
                icon="query_stats"
                title={initialTitle}
                description={
                    initialDescription
                }
            />
        )
    }

    if (
        Array.isArray(data) &&
        data.length === 0
    ) {
        return (
            <DataTableEmptyState
                icon="search_off"
                title={emptyTitle}
                description={
                    emptyDescription
                }
            />
        )
    }

    const visibleRows =
        table.getRowModel().rows

    return (
        <div className="mb-10 overflow-hidden rounded-xl bg-surface-container-lowest shadow-sm">
            <div className="flex flex-col gap-3 border-b p-space-md sm:flex-row sm:items-center sm:justify-between">
                <div className="relative w-full max-w-md">
                    <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">
                        {Icon(
                            "search",
                            "text-[18px]"
                        )}
                    </span>

                    <Input
                        value={globalFilter}
                        onChange={(event) =>
                            setGlobalFilter(
                                event.target.value
                            )
                        }
                        placeholder={
                            searchPlaceholder
                        }
                        className="pl-9"
                    />
                </div>

                <div className="flex items-center gap-3">
                    {(globalFilter ||
                        columnFilters.length >
                        0 ||
                        sorting.length > 0) && (
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                    setGlobalFilter("")
                                    table.resetColumnFilters()
                                    table.resetSorting()
                                }}
                            >
                                {Icon(
                                    "filter_alt_off",
                                    "text-[16px]"
                                )}

                                Limpar filtros
                            </Button>
                        )}

                    <span className="whitespace-nowrap text-sm text-on-surface-variant">
                        {visibleRows.length}{" "}
                        {visibleRows.length === 1
                            ? "registro"
                            : "registros"}
                    </span>
                </div>
            </div>

            {/*<div className="max-h-[620px] overflow-auto"> Rolagem na tabela */}
            <div className="w-full overflow-x-auto">
                <table
                    className="w-full table-fixed border-collapse text-left"
                    style={{
                        minWidth: `${table.getTotalSize()}px`,
                    }}
                >
                    <thead className="top-0 z-20 bg-surface-container-high shadow-[0_1px_4px_rgba(0,0,0,0.06)]">
                        {table
                            .getHeaderGroups()
                            .map(
                                (
                                    headerGroup
                                ) => (
                                    <tr
                                        key={
                                            headerGroup.id
                                        }
                                        className="h-10 select-none font-label-md text-on-surface-variant"
                                    >
                                        {headerGroup.headers.map(
                                            (
                                                header
                                            ) => (
                                                <th
                                                    key={header.id}
                                                    scope="col"
                                                    style={{
                                                        width: header.getSize(),
                                                    }}
                                                    className={`
                                                        sticky
                                                        z-30
                                                        bg-surface-container-high
                                                        px-space-md
                                                        shadow-[0_1px_0_rgba(0,0,0,0.08)]
                                                        ${getAlignmentClass(
                                                        header.column.columnDef.meta?.align
                                                    )}
                                                `}
                                                >
                                                    {header.isPlaceholder
                                                        ? null
                                                        : flexRender(
                                                            header.column.columnDef.header,
                                                            header.getContext()
                                                        )}
                                                </th>
                                            )
                                        )}
                                    </tr>
                                )
                            )}
                    </thead>

                    <tbody className="text-on-surface">
                        {visibleRows.length >
                            0 ? (
                            visibleRows.map(
                                (row, rowIndex) => (
                                    <tr
                                        key={row.id}
                                        className={`
                                            h-9
                                            transition-colors
                                            hover:bg-surface-container
                                            ${rowIndex %
                                                2
                                                ? "bg-surface-container-low/40"
                                                : ""
                                            }
                                        `}
                                    >
                                        {row
                                            .getVisibleCells()
                                            .map(
                                                (
                                                    cell
                                                ) => {
                                                    const meta =
                                                        cell
                                                            .column
                                                            .columnDef
                                                            .meta

                                                    return (
                                                        <td
                                                            key={
                                                                cell.id
                                                            }
                                                            className={`
                                                                overflow-hidden
                                                                px-space-md
                                                                ${getAlignmentClass(
                                                                meta?.align
                                                            )}
                                                                ${meta?.className ?? ""}
                                                            `}
                                                        >
                                                            <div className="truncate">
                                                                {flexRender(
                                                                    cell
                                                                        .column
                                                                        .columnDef
                                                                        .cell,
                                                                    cell.getContext()
                                                                )}
                                                            </div>
                                                        </td>
                                                    )
                                                }
                                            )}
                                    </tr>
                                )
                            )
                        ) : (
                            <tr>
                                <td
                                    colSpan={
                                        tableColumns.length
                                    }
                                    className="h-48 text-center text-sm text-on-surface-variant"
                                >
                                    Nenhum registro corresponde aos filtros aplicados.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <div className="flex items-center justify-between border-t p-space-md">
                <p className="text-sm text-on-surface-variant">
                    Exibindo todos os{" "}
                    <strong className="text-on-surface">
                        {visibleRows.length}
                    </strong>{" "}
                    {visibleRows.length === 1
                        ? "registro"
                        : "registros"}
                </p>
            </div>
        </div>
    )
}