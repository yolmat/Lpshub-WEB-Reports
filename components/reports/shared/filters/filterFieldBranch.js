"use client"

import {
    Fragment,
    useEffect,
    useRef,
    useState,
} from "react"

import {
    Combobox,
    ComboboxChip,
    ComboboxChips,
    ComboboxContent,
    ComboboxEmpty,
    ComboboxInput,
    ComboboxItem,
    ComboboxList,
    ComboboxTrigger,
    ComboboxValue,
    useComboboxAnchor,
} from "@/components/ui/combobox"

import {
    Field,
    FieldLabel,
} from "@/components/ui/field"

const allBranchesOption = {
    sigla: "Todas",
    nomeEmpresa: "Todas as filiais",
}

function getBranchLabel(branch) {
    if (!branch) {
        return ""
    }

    return `${branch.sigla} - ${branch.nomeEmpresa}`
}

function getAllBranchCodes(branches) {
    return branches
        .filter(
            (branch) =>
                branch.sigla !==
                allBranchesOption.sigla
        )
        .map((branch) => branch.sigla)
}

export default function FilterFieldBranch({
    resetKey,
    onChange,
}) {
    const anchor = useComboboxAnchor()

    const onChangeRef = useRef(onChange)

    const [branches, setBranches] =
        useState([allBranchesOption])

    const [value, setValue] =
        useState([allBranchesOption])

    const [loading, setLoading] =
        useState(true)

    const [requestError, setRequestError] =
        useState("")

    useEffect(() => {
        onChangeRef.current = onChange
    }, [onChange])

    useEffect(() => {
        const abortController =
            new AbortController()

        async function loadBranches() {
            setLoading(true)
            setRequestError("")

            try {
                const response = await fetch(
                    "/api/filiais",
                    {
                        method: "GET",
                        headers: {
                            Accept:
                                "application/json",
                        },
                        cache: "no-store",
                        signal:
                            abortController.signal,
                    }
                )

                const responseText =
                    await response.text()

                let responseData = null

                if (responseText) {
                    try {
                        responseData =
                            JSON.parse(
                                responseText
                            )
                    } catch {
                        throw new Error(
                            "A resposta das filiais possui um formato inválido."
                        )
                    }
                }

                if (!response.ok) {
                    throw new Error(
                        responseData?.message ??
                        `Erro ${response.status} ao consultar as filiais.`
                    )
                }

                if (
                    !Array.isArray(
                        responseData
                    )
                ) {
                    throw new Error(
                        "A consulta de filiais não retornou um array."
                    )
                }

                const loadedBranches =
                    responseData.filter(
                        (branch) =>
                            branch?.sigla &&
                            branch?.nomeEmpresa
                    )

                const newBranches = [
                    allBranchesOption,
                    ...loadedBranches,
                ]

                setBranches(newBranches)
                setValue([
                    allBranchesOption,
                ])

                onChangeRef.current?.(
                    getAllBranchCodes(
                        newBranches
                    )
                )
            } catch (error) {
                if (
                    error?.name ===
                    "AbortError"
                ) {
                    return
                }

                console.error(
                    "Erro ao carregar filiais:",
                    error
                )

                setBranches([
                    allBranchesOption,
                ])

                setValue([
                    allBranchesOption,
                ])

                setRequestError(
                    error instanceof Error
                        ? error.message
                        : "Não foi possível carregar as filiais."
                )

                onChangeRef.current?.([])
            } finally {
                if (
                    !abortController.signal
                        .aborted
                ) {
                    setLoading(false)
                }
            }
        }

        loadBranches()

        return () => {
            abortController.abort()
        }
    }, [])

    useEffect(() => {
        setValue([allBranchesOption])

        const branchCodes =
            getAllBranchCodes(branches)

        if (branchCodes.length > 0) {
            onChangeRef.current?.(
                branchCodes
            )
        }
    }, [resetKey])

    function handleValueChange(values) {
        const previousValues = value

        const previousHasAll =
            previousValues.some(
                (branch) =>
                    branch.sigla === "Todas"
            )

        const valuesHaveAll =
            values.some(
                (branch) =>
                    branch.sigla === "Todas"
            )

        let newValue

        if (
            valuesHaveAll &&
            !previousHasAll
        ) {
            newValue = [
                allBranchesOption,
            ]
        } else if (
            previousHasAll &&
            !valuesHaveAll
        ) {
            newValue = values
        } else if (
            previousHasAll &&
            valuesHaveAll &&
            values.length > 1
        ) {
            newValue = values.filter(
                (branch) =>
                    branch.sigla !==
                    "Todas"
            )
        } else if (values.length === 0) {
            newValue = [
                allBranchesOption,
            ]
        } else {
            newValue = values
        }

        setValue(newValue)

        const allSelected =
            newValue.some(
                (branch) =>
                    branch.sigla === "Todas"
            )

        const selectedBranchCodes =
            allSelected
                ? getAllBranchCodes(
                    branches
                )
                : newValue.map(
                    (branch) =>
                        branch.sigla
                )

        onChangeRef.current?.(
            selectedBranchCodes
        )
    }

    return (
        <Field className="flex w-full flex-col">
            <FieldLabel className="font-bold">
                Filial
            </FieldLabel>

            <Combobox
                multiple
                autoHighlight
                disabled={loading}
                items={branches}
                value={value}
                onValueChange={
                    handleValueChange
                }
                itemToStringValue={
                    getBranchLabel
                }
            >
                <ComboboxTrigger className="h-auto min-h-9 w-full">
                    <ComboboxChips
                        ref={anchor}
                        className="w-full flex-wrap gap-1 overflow-hidden"
                    >
                        <ComboboxValue>
                            {(selectedBranches) => (
                                <Fragment>
                                    {selectedBranches.map(
                                        (branch) => (
                                            <ComboboxChip
                                                key={
                                                    branch.sigla
                                                }
                                                title={getBranchLabel(
                                                    branch
                                                )}
                                                className="max-w-full"
                                            >
                                                <span className="truncate">
                                                    {getBranchLabel(
                                                        branch
                                                    )}
                                                </span>
                                            </ComboboxChip>
                                        )
                                    )}
                                </Fragment>
                            )}
                        </ComboboxValue>
                    </ComboboxChips>
                </ComboboxTrigger>

                <ComboboxContent className="w-max max-w-[calc(100vw-2rem)] min-w-0 overflow-x-hidden">
                    <ComboboxInput
                        showTrigger={false}
                        className="text-body-sm"
                        placeholder="Pesquisar filial..."
                    />

                    <ComboboxEmpty>
                        Filial não encontrada
                    </ComboboxEmpty>

                    <ComboboxList className="w-full max-w-full min-w-0 overflow-x-hidden">
                        {(branch) => (
                            <ComboboxItem
                                key={
                                    branch.sigla
                                }
                                value={branch}
                                className="w-full max-w-full min-w-0"
                            >
                                <span className="whitespace-normal break-words">
                                    {getBranchLabel(
                                        branch
                                    )}
                                </span>
                            </ComboboxItem>
                        )}
                    </ComboboxList>
                </ComboboxContent>
            </Combobox>

            {loading && (
                <p className="mt-1 text-xs text-on-surface-variant">
                    Carregando filiais...
                </p>
            )}

            {requestError && (
                <p className="mt-1 text-xs text-error">
                    {requestError}
                </p>
            )}
        </Field>
    )
}