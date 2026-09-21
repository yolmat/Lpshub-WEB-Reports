"use client"

import { useState, useEffect, useId } from "react"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Field, FieldLabel } from "@/components/ui/field"
import {
    format,
    isValid,
    parse,
} from "date-fns"
import { ptBR } from "date-fns/locale"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import MatchCode from "@/components/reports/shared/filters/matchCode"

const DATE_PATTERNS = [
    "dd/MM/yyyy",
    "d/M/yyyy",
    "yyyy-MM-dd",
    "dd-MM-yyyy",
    "d-M-yyyy",
]

function parseDateValue(value) {
    if (value instanceof Date) {
        return isValid(value) ? value : undefined
    }

    const stringValue = String(value ?? "").trim()

    if (!stringValue) {
        return undefined
    }

    for (const pattern of DATE_PATTERNS) {
        const parsedDate = parse(
            stringValue,
            pattern,
            new Date()
        )

        if (isValid(parsedDate)) {
            return parsedDate
        }
    }

    return undefined
}

function formatDateValue(date) {
    return format(date, "dd/MM/yyyy")
}

function normalizeDateText(value) {
    const parsedDate = parseDateValue(value)

    if (!parsedDate) {
        return ""
    }

    return formatDateValue(parsedDate)
}

function normalizeDefaultDates(defaultValue) {
    if (!defaultValue) {
        return []
    }

    const values = Array.isArray(defaultValue)
        ? defaultValue
        : [defaultValue]

    const dates = values
        .map(parseDateValue)
        .filter(Boolean)

    const uniqueDates = new Map()

    dates.forEach((date) => {
        uniqueDates.set(
            formatDateValue(date),
            date
        )
    })

    return [...uniqueDates.values()]
}

export function FilterFieldDate({ resetKey, defaultValue = undefined, label, onChange, multiple = false, matchCodeOn = false }) {

    const generatedId = useId()
    const inputId = `date-${generatedId}`

    const [open, setOpen] = useState(false)
    const [dates, setDates] = useState(() =>
        normalizeDefaultDates(defaultValue)
    )

    const formattedDates = dates.map(
        formatDateValue
    )

    useEffect(() => {
        const resetDates =
            normalizeDefaultDates(defaultValue)

        setDates(resetDates)
        setOpen(false)
    }, [resetKey, defaultValue])

    function updateDates(newDates, source) {
        const normalizedDates = multiple
            ? newDates
            : newDates.slice(0, 1)

        const formattedValues =
            normalizedDates.map(formatDateValue)

        setDates(normalizedDates)

        onChange?.(formattedValues, {
            source,
        })
    }

    function handleSingleDateSelect(selectedDate) {
        updateDates(
            selectedDate ? [selectedDate] : [],
            "calendar"
        )

        setOpen(false)
    }

    function handleMultipleDatesSelect(selectedDates) {
        updateDates(
            selectedDates ?? [],
            "calendar"
        )
    }

    function handleMatchCodeChange(values) {
        const parsedDates = values
            .map(parseDateValue)
            .filter(Boolean)

        updateDates(
            parsedDates,
            "matchcode"
        )
    }

    return (
        <Field className="flex w-full min-w-0 flex-col">
            <FieldLabel
                htmlFor={inputId}
                className="font-bold"
            >
                {label}
            </FieldLabel>

            <div className="flex w-full min-w-0 items-stretch">
                <div className="min-w-0 flex-1">
                    <Popover
                        open={open}
                        onOpenChange={setOpen}
                    >
                        <PopoverTrigger
                            render={
                                <Button
                                    type="button"
                                    variant="outline"
                                    id={inputId}
                                    className={`
                                    h-9
                                    w-full
                                    min-w-0
                                    justify-start
                                    overflow-hidden
                                    ${matchCodeOn ? "rounded-r-none" : ""}
                                    !text-sm
                                `}
                                >
                                    <span className="block min-w-0 flex-1 truncate text-left">
                                        {formattedDates.length > 0
                                            ? formattedDates.join(", ")
                                            : "Selecione uma data"}
                                    </span>
                                </Button>
                            }
                        />

                        <PopoverContent
                            className="w-auto overflow-hidden p-0"
                            align="start"
                        >
                            {multiple ? (
                                <Calendar
                                    locale={ptBR}
                                    mode="multiple"
                                    selected={dates}
                                    defaultMonth={dates[0]}
                                    captionLayout="dropdown"
                                    onSelect={
                                        handleMultipleDatesSelect
                                    }
                                />
                            ) : (
                                <Calendar
                                    locale={ptBR}
                                    mode="single"
                                    selected={dates[0]}
                                    defaultMonth={dates[0]}
                                    captionLayout="dropdown"
                                    onSelect={
                                        handleSingleDateSelect
                                    }
                                />
                            )}
                        </PopoverContent>
                    </Popover>
                </div>

                {matchCodeOn && (

                    <MatchCode
                        value={formattedDates}
                        onChange={handleMatchCodeChange}
                        transformValue={normalizeDateText}
                        maxValues={
                            multiple ? undefined : 1
                        }
                        title={`MatchCode — ${label}`}
                        description={
                            multiple
                                ? "Cole uma ou várias datas copiadas do Excel."
                                : "Cole uma data copiada do Excel."
                        }
                        placeholder={
                            multiple
                                ? "21/09/2026\n22/09/2026\n23/09/2026"
                                : "21/09/2026"
                        }
                        buttonClassName="
                    h-9
                    w-9
                    shrink-0
                    rounded-l-none
                    border-l-0
                    p-0
                "
                    />

                )}

            </div>
        </Field>
    )
}
