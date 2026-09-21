"use client"

import { useEffect, useId, useState } from "react"

import Icon from "@/components/icon"

import { Button } from "@/components/ui/button"

import {
    Drawer,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
} from "@/components/ui/drawer"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

function defaultTransformValue(value) {
    return value
}

function prepareValues(
    values,
    transformValue,
    maxValues
) {
    const normalizedValues = values
        .map((value) => String(value ?? "").trim())
        .filter(Boolean)
        .map(transformValue)
        .map((value) => String(value ?? "").trim())
        .filter(Boolean)

    const uniqueValues = [...new Set(normalizedValues)]

    if (
        Number.isInteger(maxValues) &&
        maxValues > 0
    ) {
        return uniqueValues.slice(0, maxValues)
    }

    return uniqueValues
}

function parseExcelValues(
    text,
    transformValue,
    maxValues
) {
    /*
     * Excel separa:
     *
     * Linhas: \n ou \r\n
     * Colunas: \t
     *
     * Não separamos por vírgula porque uma célula
     * pode conter valores como 1.500,90.
     */
    const cells = text.split(/[\t\r\n]+/)

    return prepareValues(
        cells,
        transformValue,
        maxValues
    )
}

export default function MatchCode({
    value = [],
    onChange,
    transformValue = defaultTransformValue,
    maxValues,
    disabled = false,
    title = "Seleção múltipla",
    description = "Cole os valores copiados das células do Excel.",
    placeholder = "Cole aqui os valores copiados do Excel.",
    buttonClassName = "",
}) {
    const generatedId = useId()
    const textareaId = `matchcode-${generatedId}`

    const [open, setOpen] = useState(false)
    const [rawText, setRawText] = useState("")
    const [draftValues, setDraftValues] = useState([])

    useEffect(() => {
        if (!open) {
            return
        }

        setDraftValues(value)
        setRawText(value.join("\n"))
    }, [value, open])

    function handleOpen() {
        setDraftValues(value)
        setRawText(value.join("\n"))
        setOpen(true)
    }

    function handleTextChange(event) {
        const text = event.target.value

        setRawText(text)

        setDraftValues(
            parseExcelValues(
                text,
                transformValue,
                maxValues
            )
        )
    }

    function handlePaste(event) {
        const clipboardText =
            event.clipboardData.getData("text/plain")

        if (!clipboardText) {
            return
        }

        event.preventDefault()

        setRawText(clipboardText)

        setDraftValues(
            parseExcelValues(
                clipboardText,
                transformValue,
                maxValues
            )
        )
    }

    function handleItemChange(index, newValue) {
        setDraftValues((currentValues) => {
            const updatedValues = currentValues.map(
                (currentValue, currentIndex) =>
                    currentIndex === index
                        ? newValue
                        : currentValue
            )

            setRawText(updatedValues.join("\n"))

            return updatedValues
        })
    }

    function handleRemoveItem(index) {
        setDraftValues((currentValues) => {
            const updatedValues = currentValues.filter(
                (_, currentIndex) =>
                    currentIndex !== index
            )

            setRawText(updatedValues.join("\n"))

            return updatedValues
        })
    }

    function handleClear() {
        setRawText("")
        setDraftValues([])
    }

    function handleApply() {
        const finalValues = prepareValues(
            draftValues,
            transformValue,
            maxValues
        )

        onChange?.(finalValues)
        setOpen(false)
    }

    return (
        <>
            <Button
                type="button"
                variant="outline"
                size="icon"
                disabled={disabled}
                onClick={handleOpen}
                className={buttonClassName}
                aria-label="Abrir MatchCode"
                title="Abrir MatchCode"
            >
                {Icon(
                    "playlist_add",
                    "text-[20px]"
                )}
            </Button>

            <Drawer
                open={open}
                onOpenChange={setOpen}
                swipeDirection="right"
            >
                <DrawerContent className="max-h-[100vh]">
                    <div className="mx-auto flex w-full max-w-3xl flex-col overflow-hidden">
                        <DrawerHeader className="text-left">
                            <DrawerTitle>
                                {title}
                            </DrawerTitle>

                            <DrawerDescription>
                                {description}
                            </DrawerDescription>
                        </DrawerHeader>

                        <div className="grid gap-6 overflow-y-auto px-4 pb-4">
                            <div className="grid gap-2">
                                <div className="flex items-center justify-between gap-4">
                                    <Label htmlFor={textareaId}>
                                        Valores copiados
                                    </Label>

                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={handleClear}
                                        disabled={
                                            draftValues.length === 0
                                        }
                                    >
                                        {Icon(
                                            "delete",
                                            "text-[18px]"
                                        )}

                                        Limpar
                                    </Button>
                                </div>

                                <div className="relative">
                                    <span className="text-muted-foreground pointer-events-none absolute left-3 top-3">
                                        {Icon(
                                            "content_paste",
                                            "text-[20px]"
                                        )}
                                    </span>

                                    <Textarea
                                        id={textareaId}
                                        value={rawText}
                                        onChange={handleTextChange}
                                        onPaste={handlePaste}
                                        placeholder={placeholder}
                                        className="min-h-36 resize-y pl-10 font-mono"
                                    />
                                </div>

                                {maxValues && (
                                    <p className="text-muted-foreground text-xs">
                                        Este campo aceita no máximo{" "}
                                        {maxValues}{" "}
                                        {maxValues === 1
                                            ? "valor"
                                            : "valores"}.
                                    </p>
                                )}
                            </div>

                            <div className="grid gap-2">
                                <div className="flex items-center justify-between gap-4">
                                    <Label>
                                        Valores identificados
                                    </Label>

                                    <span className="text-muted-foreground text-sm">
                                        {draftValues.length}{" "}
                                        {draftValues.length === 1
                                            ? "valor"
                                            : "valores"}
                                    </span>
                                </div>

                                {draftValues.length === 0 ? (
                                    <div className="text-muted-foreground flex min-h-28 items-center justify-center rounded-md border border-dashed p-6 text-center text-sm">
                                        Nenhum valor identificado.
                                    </div>
                                ) : (
                                    <div className="grid max-h-72 gap-2 overflow-y-auto rounded-md border p-3">
                                        {draftValues.map(
                                            (item, index) => (
                                                <div
                                                    key={`${item}-${index}`}
                                                    className="flex items-center gap-2"
                                                >
                                                    <span className="text-muted-foreground w-7 shrink-0 text-right text-xs">
                                                        {index + 1}
                                                    </span>

                                                    <Input
                                                        value={item}
                                                        onChange={(event) =>
                                                            handleItemChange(
                                                                index,
                                                                event.target.value
                                                            )
                                                        }
                                                    />

                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() =>
                                                            handleRemoveItem(
                                                                index
                                                            )
                                                        }
                                                        aria-label={`Remover ${item}`}
                                                    >
                                                        {Icon(
                                                            "close",
                                                            "text-[18px]"
                                                        )}
                                                    </Button>
                                                </div>
                                            )
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        <DrawerFooter className="border-t sm:flex-row sm:justify-end pt-3">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setOpen(false)}
                            >
                                Cancelar
                            </Button>

                            <Button
                                type="button"
                                onClick={handleApply}
                            >
                                Aplicar valores
                            </Button>
                        </DrawerFooter>
                    </div>
                </DrawerContent>
            </Drawer>
        </>
    )
}