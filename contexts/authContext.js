
"use client"

import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useState,
} from "react"

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [loggingOut, setLoggingOut] = useState(false)


    const refreshUser = useCallback(async () => {
        setLoading(true)
        setError(null)

        try {
            const response = await fetch("/api/auth/me", {
                method: "GET",
                credentials: "same-origin",
                cache: "no-store",
            })

            const responseData = await response.json()

            console.log("AUTH/ME:", {
                status: response.status,
                success: responseData?.success,
                data: responseData?.data,
            })

            if (response.status === 401) {
                setUser(null)
                setError("Sessão inválida ou expirada.")
                return null
            }

            if (!response.ok) {
                throw new Error(
                    responseData?.message ??
                    `Erro HTTP ${response.status}`
                )
            }

            if (
                responseData?.success !== true ||
                !responseData?.data?.id ||
                !responseData?.data?.login
            ) {
                throw new Error(
                    "Formato de resposta inválido."
                )
            }

            setUser(responseData.data)

            return responseData.data

        } catch (error) {
            console.error(
                "Falha ao carregar sessão:",
                error
            )

            setError(error.message)
            return null

        } finally {
            setLoading(false)
        }
    }, [])


    const clearUser = useCallback(() => {
        setUser(null)
        setError(null)
    }, [])

    useEffect(() => {
        refreshUser()
    }, [refreshUser])

    const logout = useCallback(async () => {
        if (loggingOut) return

        setLoggingOut(true)
        setError(null)

        try {
            const response = await fetch("/api/auth/logout", {
                method: "POST",
                credentials: "same-origin",
                cache: "no-store",
            })

            const responseData = await response.json()

            if (!response.ok) {
                throw new Error(
                    responseData?.message ??
                    "Não foi possível encerrar a sessão."
                )
            }

            // Limpar os dados do usuário.
            setUser(null)

            return true

        } catch (error) {
            setError(error.message)
            throw error

        } finally {
            setLoggingOut(false)
        }
    }, [loggingOut])

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                error,
                isAuthenticated: Boolean(user),
                refreshUser,
                clearUser,
                logout,
                loggingOut,
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)

    if (!context) {
        throw new Error(
            "useAuth deve ser utilizado dentro do AuthProvider."
        )
    }

    return context
}
