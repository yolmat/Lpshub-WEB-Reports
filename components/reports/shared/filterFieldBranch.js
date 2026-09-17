"use client"

import { useState, useEffect, Fragment } from "react"

import {
    Combobox,
    ComboboxChip,
    ComboboxChips,
    ComboboxContent,
    ComboboxEmpty,
    ComboboxItem,
    ComboboxList,
    ComboboxValue,
    useComboboxAnchor,
    ComboboxInput,
    ComboboxTrigger
} from "@/components/ui/combobox"

const branchs = [
    "Todas",
    "Lpsi",
    "Lsulasdasdasdasdasdasasdfasdkljfhsdaklfjhasdklfhasdklfjhasdflkjashdflkasdjhflkasdfjghasdoifuyhasdoifuy",
    "Lsulaasdasdasdasdasasdfasdkljfhsdaklfjhasdklfhasdklfjhasdflkjashdflkasdjhflkasdfjghasdoifuyhasdoifuy",
    "Lsasdasdasdasdasasdfasdkljfhsdaklfjhasdklfhasdklfjhasdflkjashdflkasdjhflkasdfjghasdoifuyhasdoifuy",
    "Lsuladasdasdasdasdasasdfasdkljfhsdaklfjhasdklfhasdklfjhasdflkjashdflkasdjhflkasdfjghasdoifuyhasdoifuy",
    "Ljun",
    "Lita",
]

export default function FilterFieldBranch({ resetKey }) {
    const anchor = useComboboxAnchor()

    const [value, setValue] = useState(["Todas"])

    useEffect(() => {
        setValue(["Todas"])
    }, [resetKey])

    function handleValueChange(values) {
        const previousValues = value

        // Usuário selecionou "Todas"
        if (
            values.includes("Todas") &&
            !previousValues.includes("Todas")
        ) {
            setValue(["Todas"])
            return
        }

        if (
            previousValues.includes("Todas") &&
            !values.includes("Todas")
        ) {
            setValue(values)
            return
        }

        if (
            previousValues.includes("Todas") &&
            values.includes("Todas") &&
            values.length > 1
        ) {
            setValue(values.filter((item) => item !== "Todas"))
            return
        }

        // Nenhuma seleção
        if (values.length === 0) {
            setValue(["Todas"])
            return
        }

        setValue(values)
    }

    return (
        <div className="w-full flex flex-col">
            <label className="font-bold">Filial</label>
            <Combobox
                multiple
                autoHighlight
                items={branchs}
                value={value}
                onValueChange={handleValueChange}
                itemToStringValue={(branchs) => branchs}
            >
                <ComboboxTrigger className="h-auto min-h-9 w-full max-w-xs">
                    <ComboboxChips
                        ref={anchor}
                        className="w-full flex-wrap gap-1 overflow-hidden"
                    >
                        <ComboboxValue>
                            {(values) => (
                                <Fragment>
                                    {values.map((value) => (
                                        <ComboboxChip key={value}>
                                            {value.length > 15
                                                ? `${value.slice(0, 10)}...`
                                                : value}
                                        </ComboboxChip>
                                    ))}
                                </Fragment>
                            )}
                        </ComboboxValue>
                    </ComboboxChips>
                </ComboboxTrigger>

                <ComboboxContent
                    className="w-max max-w-[calc(100vw-2rem)]"
                >
                    <ComboboxInput
                        showTrigger={false}
                        className="text-body-sm"
                        placeholder="Qual empresa?"
                    />

                    <ComboboxEmpty>
                        Filial Não Encontrada
                    </ComboboxEmpty>

                    <ComboboxList>
                        {(item) => (
                            <ComboboxItem
                                key={item}
                                value={item}
                                className="w-full"
                            >
                                {item}
                            </ComboboxItem>
                        )}
                    </ComboboxList>
                </ComboboxContent>
            </Combobox>
        </ div>
    )
}