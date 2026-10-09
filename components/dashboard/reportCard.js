
"use client"

import Link from "next/link"

import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
} from "@/components/ui/card"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Icon from "@/components/icon"

const tagStyles = {
    Financeiro:
        "bg-primary/10 text-primary border-transparent",

    Mensal:
        "bg-surface-container text-on-surface-variant border-transparent",

    Auditoria:
        "bg-tertiary/10 text-tertiary border-transparent",

    Bancário:
        "bg-tertiary/10 text-tertiary border-transparent",

    Fiscal:
        "bg-secondary/10 text-secondary border-transparent",
}

export default function ReportCard({
    title,
    code,
    description,
    tags = [],
    icon = "description",
    href,
    status = "Ativo",
}) {

    const isActive = status === "Ativo"

    return (
        <article className="h-full">
            <Card className="flex h-full flex-col gap-0 overflow-hidden rounded-xl border-outline-variant bg-surface-container-lowest py-0 shadow-sm transition-shadow hover:shadow-md">

                <CardHeader className="px-4 pb-0 pt-4">

                    <div className="flex items-start justify-between">

                        <div className="flex size-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                            {Icon(
                                "account_balance",
                                "text-[13px]"
                            )}
                        </div>

                    </div>

                </CardHeader>

                <CardContent className="flex flex-1 flex-col gap-3 px-4 pb-4 pt-4">

                    <div className="space-y-2">

                        <h2 className="font-headline-sm text-primary">
                            {title}
                        </h2>

                        {code && (
                            <div>
                                <Badge
                                    variant="secondary"
                                    className="rounded-sm bg-surface-container px-2 py-1 font-data-mono text-on-surface"
                                >
                                    {code}
                                </Badge>
                            </div>
                        )}

                        <p className="font-body-md text-on-surface-variant">
                            {description}
                        </p>

                    </div>

                    <div className="flex flex-wrap gap-1.5 pt-1">
                        {tags.map((tag) => (
                            <Badge
                                key={tag}
                                variant="outline"
                                className={`rounded-full px-2 py-0.5 font-label-sm ${tagStyles[tag] ??
                                    "border-transparent bg-surface-container text-on-surface"
                                    }`}
                            >
                                {tag}
                            </Badge>
                        ))}
                    </div>

                </CardContent>

                <CardFooter className="px-4 pb-4 pt-0">

                    <div className="flex w-full items-center justify-between gap-3 border-t border-outline-variant pt-4">

                        <div className="flex min-w-0 items-center gap-2">

                            <span
                                className={`size-2 shrink-0 rounded-full ${isActive
                                    ? "bg-success"
                                    : "bg-on-surface-variant"
                                    }`}
                            />

                            <span className="font-label-sm text-on-surface-variant">
                                {status}
                            </span>

                        </div>

                        <Button
                            asChild={Boolean(href) && isActive}
                            disabled={!href || !isActive}
                            className="toolbar-button primary h-9 shrink-0"
                        >
                            {href && isActive ? (
                                <Link
                                    href={href}
                                    className="!inline-flex !items-center !justify-center gap-2 text-center"
                                >
                                    <span className="flex items-center justify-center leading-none">
                                        {Icon("arrow_right")}
                                    </span>

                                    <span className="flex items-center justify-center leading-none">
                                        Executar
                                    </span>
                                </Link>
                            ) : (
                                <span className="flex h-full items-center justify-center">
                                    Indisponível
                                </span>
                            )}
                        </Button>

                    </div>

                </CardFooter>

            </Card>
        </article>
    )
}
