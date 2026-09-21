"use client"

import { useState, useEffect } from "react"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Field, FieldLabel } from "@/components/ui/field"
import { ptBR } from "date-fns/locale"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

export function FilterFieldDate({ resetKey, defaultValue = undefined, label }) {

    const [open, setOpen] = useState(false)
    const [date, setDate] = useState(defaultValue)
    const [value, setValue] = useState(["Todas"])

    useEffect(() => {
        setDate(defaultValue)
        setOpen(false)
    }, [resetKey, defaultValue])

    return (
        <Field className="w-full flex flex-col">
            <FieldLabel htmlFor="date" className="font-bold">{label}</FieldLabel>
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger render={<Button variant="outline" id="date" className="justify-start !text-sm">{date ? date.toLocaleDateString("pt-BR") : "Selecione uma data"}</Button>} />
                <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                    <Calendar
                        locale={ptBR}
                        mode="single"
                        selected={date}
                        defaultMonth={date}
                        captionLayout="dropdown"
                        onSelect={(date) => {
                            setDate(date)
                            setOpen(false)
                        }}
                    />
                </PopoverContent>
            </Popover>
        </Field>
    )
}
