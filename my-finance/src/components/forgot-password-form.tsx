"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Loader2, Mail } from "lucide-react"

export function ForgotPasswordForm() {
    const router = useRouter()
    const [email, setEmail] = useState("")
    const [error, setError] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [emailSent, setEmailSent] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")

        if (!email) {
            setError("Por favor, informe seu email")
            return
        }

        if (!email.includes("@")) {
            setError("Por favor, insira um email válido")
            return
        }

        setIsLoading(true)

        try {
            const users = JSON.parse(localStorage.getItem("users") || "[]")
            const userExists = users.some((user: any) => user.email === email)

            if (!userExists) {
                setError("Email não encontrado. Verifique se digitou corretamente.")
                setIsLoading(false)
                return
            }

            await new Promise((resolve) => setTimeout(resolve, 1500))

            const verificationCode = Math.floor(100000 + Math.random() * 900000).toString()

            const resetRequests = JSON.parse(localStorage.getItem("resetRequests") || "{}")
            resetRequests[email] = {
                code: verificationCode,
                expiresAt: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
            }
            localStorage.setItem("resetRequests", JSON.stringify(resetRequests))

            console.log(`Código de verificação para ${email}: ${verificationCode}`)

            setEmailSent(true)

            setTimeout(() => {
                router.push(`/redefinir-senha?email=${encodeURIComponent(email)}`)
            }, 3000)
        } catch (err) {
            setError("Ocorreu um erro ao processar sua solicitação. Tente novamente.")
        } finally {
            setIsLoading(false)
        }
    }

    if (emailSent) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Email Enviado</CardTitle>
                    <CardDescription>Verifique sua caixa de entrada</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex flex-col items-center justify-center py-4">
                        <div className="rounded-full bg-primary/10 p-3 mb-4">
                            <Mail className="h-6 w-6 text-primary" />
                        </div>
                        <p className="text-center">
                            Enviamos um código de verificação para <strong>{email}</strong>. Use este código para redefinir sua senha.
                        </p>
                    </div>
                    <p className="text-center text-sm text-muted-foreground">
                        Você será redirecionado automaticamente para a página de redefinição de senha.
                    </p>
                </CardContent>
                <CardFooter>
                    <Button className="w-full" onClick={() => router.push(`/redefinir-senha?email=${encodeURIComponent(email)}`)}>
                        Continuar
                    </Button>
                </CardFooter>
            </Card>
        )
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Recuperar Senha</CardTitle>
                <CardDescription>Informe seu email cadastrado para receber um código de verificação</CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
                <CardContent className="space-y-4">
                    {error && (
                        <Alert variant="destructive">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="seu@email.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={isLoading}
                        />
                    </div>
                </CardContent>

                <CardFooter className="flex flex-col space-y-4 mt-4">
                    <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Processando...
                            </>
                        ) : (
                            "Enviar código de verificação"
                        )}
                    </Button>

                    <div className="text-center text-sm text-muted-foreground">
                        Lembrou sua senha?{" "}
                        <Link href="/login" className="text-primary underline">
                            Voltar para login
                        </Link>
                    </div>
                </CardFooter>
            </form>
        </Card>
    )
}

