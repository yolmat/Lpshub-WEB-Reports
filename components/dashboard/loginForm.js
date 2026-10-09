
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Field, FieldLabel } from "@/components/ui/field"
import Logo from "@/components/logo"
import ThemeToggle from "@/components/ThemeToggle"
import { useAuth } from "@/contexts/authContext"

export default function LoginPage() {

    const { refreshUser } = useAuth()

    const [showPassword, setShowPassword] = useState(false)

    const [login, setLogin] = useState("")
    const [senha, setSenha] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    const router = useRouter()

    async function handleLogin({ login, senha }) {
        const response = await fetch("/api/auth/login", {
            method: "POST",

            headers: {
                "Content-Type": "application/json",
            },

            credentials: "same-origin",

            body: JSON.stringify({
                login,
                senha,
            }),

            cache: "no-store",
        })

        const responseData = await response.json()

        if (!response.ok) {
            throw new Error(
                responseData?.message ??
                "Não foi possível realizar o login."
            )
        }

        return responseData
    }

    async function handleSubmit(event) {
        event.preventDefault()

        if (loading) return

        setLoading(true)
        setError("")

        try {
            await handleLogin({
                login,
                senha,
            })

            const authenticatedUser = await refreshUser()

            if (!authenticatedUser) {
                throw new Error(
                    "Login realizado, mas não foi possível carregar a sessão."
                )
            }

            router.replace("/dashboard")

        } catch (error) {
            setError(
                error.message ??
                "Não foi possível realizar o login."
            )
        } finally {
            setLoading(false)
        }
    }


    return (
        <main className="relative flex min-h-dvh items-center justify-center bg-surface px-4 py-12">

            {/* Local reservado para o componente de tema */}
            <div className="absolute right-4 top-4 sm:right-8 sm:top-8">
                <ThemeToggle />
            </div>

            <Card className="w-full max-w-[400px] gap-6 rounded-xl border-outline-variant bg-surface-container-lowest py-8 shadow-sm">

                <CardHeader className="items-center gap-3 px-6 text-center justify-center">

                    <Logo
                        className="h-20"
                    />

                    <div className="space-y-1">
                        <CardTitle className="font-headline-lg text-on-surface">
                            Lpshub
                        </CardTitle>

                        <CardDescription className="font-body-sm text-on-surface-variant">
                            Acesse sua conta
                        </CardDescription>
                    </div>

                </CardHeader>

                <CardContent className="px-6">
                    <form
                        onSubmit={handleSubmit}
                        className="flex flex-col gap-5"
                    >

                        <Field className="gap-2">
                            <FieldLabel
                                htmlFor="username"
                                className="font-label-md text-on-surface"
                            >
                                Usuário
                            </FieldLabel>

                            <Input
                                id="username"
                                name="username"
                                type="text"
                                placeholder="Digite seu usuário"
                                autoComplete="username"
                                required
                                value={login}
                                onChange={(event) =>
                                    setLogin(event.target.value)
                                }
                                className="field-input h-10"
                            />
                        </Field>

                        <Field className="gap-2">
                            <FieldLabel
                                htmlFor="password"
                                className="font-label-md text-on-surface"
                            >
                                Senha
                            </FieldLabel>

                            <div className="relative">
                                <Input
                                    id="password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Digite sua senha"
                                    autoComplete="current-password"
                                    required
                                    value={senha}
                                    onChange={(event) =>
                                        setSenha(event.target.value)
                                    }
                                    className="field-input h-10 pr-11"
                                />

                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    aria-label={
                                        showPassword
                                            ? "Ocultar senha"
                                            : "Mostrar senha"
                                    }
                                    aria-pressed={showPassword}
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-1 top-1/2 size-8 -translate-y-1/2 text-on-surface-variant hover:bg-surface-container-high"
                                >
                                    <span
                                        aria-hidden="true"
                                        className="material-symbols-outlined !text-[20px]"
                                    >
                                        {showPassword
                                            ? "visibility_off"
                                            : "visibility"}
                                    </span>
                                </Button>
                            </div>
                        </Field>

                        {error && (
                            <p
                                role="alert"
                                className="font-body-sm text-error"
                            >
                                {error}
                            </p>
                        )}

                        <Button
                            type="submit"
                            disabled={loading}
                            className="toolbar-button primary mt-1 h-10 w-full"
                        >
                            {loading ? "Entrando..." : "Entrar"}
                        </Button>

                    </form>
                </CardContent>
            </Card>
        </main>
    )
}
