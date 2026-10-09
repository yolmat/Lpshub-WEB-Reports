
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

// Components
import Icon from "@/components/icon"
import { useAuth } from "@/contexts/authContext"

import { Avatar } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function CardPerson() {
    const router = useRouter()

    const {
        user,
        loading,
        logout,
        loggingOut,
    } = useAuth()

    const [logoutError, setLogoutError] = useState("")

    const login = user?.login ?? "Usuário"
    const email = user?.email ?? ""


    async function handleLogout() {
        if (loggingOut) return

        setLogoutError("")

        try {
            console.log("Iniciando logout...")

            await logout()

            console.log("Logout realizado com sucesso.")

            router.replace("/login")
            router.refresh()

        } catch (error) {
            console.error("Erro ao realizar logout:", error)

            setLogoutError(
                error.message ??
                "Não foi possível encerrar a sessão."
            )
        }
    }


    return (
        <DropdownMenu>
            <DropdownMenuTrigger
                render={
                    <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-full"
                        aria-label="Abrir menu do usuário"
                    >
                        <Avatar className="flex items-center justify-center bg-primary">
                            {Icon(
                                "person",
                                "text-on-primary text-[18px]"
                            )}
                        </Avatar>
                    </Button>
                }
            />

            <DropdownMenuContent
                align="end"
                className="w-fit min-w-56"
            >
                <DropdownMenuGroup>

                    <div className="flex items-center gap-3 px-2 py-2 text-xs">
                        <div className="flex items-center gap-2">

                            <Avatar className="flex shrink-0 items-center justify-center bg-primary">
                                {Icon(
                                    "person",
                                    "text-on-primary text-[18px]"
                                )}
                            </Avatar>

                            <div className="flex min-w-0 flex-col gap-1">

                                <p className="font-label-md font-semibold text-on-surface">
                                    {loading
                                        ? "Carregando..."
                                        : login}
                                </p>

                                <p className="font-body-sm break-all text-on-surface-variant">
                                    {loading
                                        ? "Consultando usuário..."
                                        : email}
                                </p>

                            </div>
                        </div>
                    </div>

                </DropdownMenuGroup>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                    disabled={loggingOut}
                    onClick={handleLogout}
                    className="cursor-pointer text-xs"
                >
                    {Icon("exit_to_app", "text-primary")}

                    <span>
                        {loggingOut ? "Saindo..." : "Sair"}
                    </span>
                </DropdownMenuItem>

                {logoutError && (
                    <div
                        role="alert"
                        className="max-w-64 px-2 py-2 font-body-sm text-error"
                    >
                        {logoutError}
                    </div>
                )}

            </DropdownMenuContent>
        </DropdownMenu>
    )
}
