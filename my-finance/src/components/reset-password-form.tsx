"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Loader2 } from "lucide-react"

export function ResetPasswordForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const email = searchParams.get("email") || ""

  const [verificationCode, setVerificationCode] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (!email) {
      router.push("/esqueceu-senha")
    }
  }, [email, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    // Validação básica
    if (!verificationCode || !newPassword || !confirmPassword) {
      setError("Por favor, preencha todos os campos")
      return
    }

    if (newPassword.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres")
      return
    }

    if (newPassword !== confirmPassword) {
      setError("As senhas não coincidem")
      return
    }

    setIsLoading(true)

    try {
      // Verificar o código de verificação
      const resetRequests = JSON.parse(localStorage.getItem("resetRequests") || "{}")
      const resetRequest = resetRequests[email]

      if (!resetRequest) {
        setError("Solicitação de redefinição de senha não encontrada ou expirada")
        setIsLoading(false)
        return
      }

      if (resetRequest.code !== verificationCode) {
        setError("Código de verificação inválido")
        setIsLoading(false)
        return
      }

      const expiresAt = new Date(resetRequest.expiresAt)
      if (expiresAt < new Date()) {
        setError("Código de verificação expirado. Solicite um novo código.")
        setIsLoading(false)
        return
      }

      // Simulando uma chamada de API com um timeout
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Atualizar a senha do usuário
      const users = JSON.parse(localStorage.getItem("users") || "[]")
      const updatedUsers = users.map((user: any) => {
        if (user.email === email) {
          return { ...user, password: newPassword }
        }
        return user
      })

      localStorage.setItem("users", JSON.stringify(updatedUsers))

      // Remover a solicitação de redefinição
      delete resetRequests[email]
      localStorage.setItem("resetRequests", JSON.stringify(resetRequests))

      // Definir mensagem de sucesso e redirecionar para login
      localStorage.setItem("passwordResetSuccess", "true")
      router.push("/")
    } catch (err) {
      setError("Ocorreu um erro ao redefinir sua senha. Tente novamente.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Redefinir Senha</CardTitle>
        <CardDescription>Digite o código de verificação enviado para {email} e sua nova senha</CardDescription>
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
            <Label htmlFor="verificationCode">Código de verificação</Label>
            <Input
              id="verificationCode"
              placeholder="Digite o código de 6 dígitos"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              disabled={isLoading}
              maxLength={6}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="newPassword">Nova senha</Label>
            <Input
              id="newPassword"
              type="password"
              placeholder="••••••••"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirmar nova senha</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={isLoading}
            />
          </div>
        </CardContent>

        <CardFooter className="flex flex-col space-y-4">
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Redefinindo senha...
              </>
            ) : (
              "Redefinir senha"
            )}
          </Button>

          <div className="text-center text-sm text-muted-foreground">
            Não recebeu o código?{" "}
            <Link href="/esqueceu-senha" className="text-primary underline">
              Solicitar novamente
            </Link>
          </div>
        </CardFooter>
      </form>
    </Card>
  )
}

