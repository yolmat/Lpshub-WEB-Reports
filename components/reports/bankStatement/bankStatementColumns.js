const currencyFormatter =
    new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
    })

const dateFormatter =
    new Intl.DateTimeFormat("pt-BR", {
        timeZone: "UTC",
    })

function parseBrazilianDate(value) {
    if (!value) {
        return 0
    }

    const [day, month, year] =
        String(value).split("/")

    return Date.UTC(
        Number(year),
        Number(month) - 1,
        Number(day)
    )
}

function brazilianDateSorting(
    rowA,
    rowB,
    columnId
) {
    return (
        parseBrazilianDate(
            rowA.getValue(columnId)
        ) -
        parseBrazilianDate(
            rowB.getValue(columnId)
        )
    )
}

function isoDateSorting(
    rowA,
    rowB,
    columnId
) {
    const dateA = new Date(
        rowA.getValue(columnId)
    ).getTime()

    const dateB = new Date(
        rowB.getValue(columnId)
    ).getTime()

    return dateA - dateB
}

export const bankStatementColumns = [
    {
        accessorKey: "AccountCode",
        header: "Conta contábil",
        size: 160,
        className:
            "font-data-mono font-medium",
    },
    {
        accessorKey: "Sequence",
        header: "Sequência",
        size: 110,
        align: "right",
        className:
            "font-data-mono tabular-nums",
    },
    {
        accessorKey: "AccountName",
        header: "Conta bancária",
        size: 300,
        className: "font-semibold",
    },
    {
        accessorKey: "Reference",
        header: "Referência",
        size: 130,
        sortingFn:
            brazilianDateSorting,
        className: "font-data-mono",
    },
    {
        accessorKey: "DueDate",
        header: "Data",
        size: 130,
        sortingFn: isoDateSorting,
        className: "font-data-mono",

        cell: ({ value }) => {
            if (!value) {
                return "—"
            }

            return dateFormatter.format(
                new Date(value)
            )
        },
    },
    {
        accessorKey: "Memo",
        header: "Histórico",
        size: 260,
    },
    {
        accessorKey: "DebitAmount",
        header: "Débito",
        size: 150,
        align: "right",
        className:
            "font-data-mono font-medium tabular-nums",

        cell: ({ value }) =>
            currencyFormatter.format(
                Number(value ?? 0)
            ),
    },
    {
        accessorKey: "CreditAmount",
        header: "Crédito",
        size: 150,
        align: "right",
        className:
            "font-data-mono font-medium tabular-nums",

        cell: ({ value }) =>
            currencyFormatter.format(
                Number(value ?? 0)
            ),
    },
    {
        accessorKey: "StatementNumber",
        header: "Nº extrato",
        size: 130,
        align: "right",
        className:
            "font-data-mono tabular-nums",
    },
    {
        accessorKey: "ExternalCode",
        header: "Código externo",
        size: 150,
        className: "font-data-mono",
    },
    {
        accessorKey: "CardName",
        header: "Parceiro de negócio",
        size: 230,
    },
    {
        accessorKey: "PaymentCreated",
        header: "Pagamento criado",
        size: 170,
        align: "center",

        cell: ({ value }) =>
            value === "tYES"
                ? "Sim"
                : value === "tNO"
                    ? "Não"
                    : "—",
    },
]