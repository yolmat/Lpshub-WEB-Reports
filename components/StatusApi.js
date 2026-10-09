
"use client"

import { useCallback, useEffect, useState } from "react"

export default function StatusApi({
    name = "Servidor SAP",
    endpoint,
    refreshInterval = 60000,
}) {
    const [status, setStatus] = useState("checking")

    const checkStatus = useCallback(async (signal) => {
        setStatus("checking")

        try {
            const response = await fetch(endpoint, {
                method: "GET",
                credentials: "same-origin",
                cache: "no-store",
                signal,
            })

            if (!response.ok) {
                setStatus("offline")
                return
            }

            const result = await response.json()

            setStatus(
                result?.status === "online"
                    ? "online"
                    : result?.status === "offline"
                        ? "offline"
                        : "unknown"
            )

        } catch (error) {
            if (error.name !== "AbortError") {
                setStatus("unknown")
            }
        }
    }, [endpoint])

    useEffect(() => {
        const controller = new AbortController()

        checkStatus(controller.signal)

        const interval = setInterval(() => {
            if (!document.hidden) {
                checkStatus(controller.signal)
            }
        }, Math.max(refreshInterval, 10000))

        return () => {
            controller.abort()
            clearInterval(interval)
        }
    }, [checkStatus, refreshInterval])

    const statusConfig = {
        online: {
            label: "OPERANDO",
            color: "bg-success",
        },
        offline: {
            label: "INDISPONÍVEL",
            color: "bg-error",
        },
        checking: {
            label: "VERIFICANDO",
            color: "bg-on-surface-variant",
        },
        unknown: {
            label: "DESCONHECIDO",
            color: "bg-on-surface-variant",
        },
    }

    const current =
        statusConfig[status] ?? statusConfig.unknown

    return (
        <div className="hidden sm:flex">
            <div className="p-space-sm flex items-center justify-between rounded-lg bg-surface-container">

                <div className="flex flex-col">
                    <span className="font-caption text-on-surface-variant">
                        {name}
                    </span>

                    <span
                        className="font-data-mono font-semibold"
                        role="status"
                    >
                        {current.label}
                    </span>
                </div>

                <span
                    aria-hidden="true"
                    className={`ml-1.5 size-2 rounded-full ${current.color}`}
                />

            </div>
        </div>
    )
}
