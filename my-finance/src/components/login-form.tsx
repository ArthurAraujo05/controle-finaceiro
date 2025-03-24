"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Loader2, CheckCircle2 } from "lucide-react"

export function LoginForm() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [successMessage, setSuccessMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // Verificar se o usuário acabou de se cadastrar
    const registrationSuccess = localStorage.getItem("registrationSuccess") === "true"
    if (registrationSuccess) {
      setSuccessMessage("Conta criada com sucesso! Faça login para continuar.")
      localStorage.removeItem("registrationSuccess")
    }

    // Verificar se o usuário acabou de redefinir a senha
    const passwordResetSuccess = localStorage.getItem("passwordResetSuccess") === "true"
    if (passwordResetSuccess) {
      setSuccessMessage("Senha redefinida com sucesso! Faça login com sua nova senha.")
      localStorage.removeItem("passwordResetSuccess")
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccessMessage("")

    // Validação básica
    if (!email || !password) {
      setError("Por favor, preencha todos os campos")
      return
    }

    if (!email.includes("@")) {
      setError("Por favor, insira um email válido")
      return
    }

    setIsLoading(true)

    try {
      // Simulando uma chamada de API com um timeout
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Verificar se o usuário existe
      const users = JSON.parse(localStorage.getItem("users") || "[]")
      const user = users.find((u: any) => u.email === email && u.password === password)

      if (!user) {
        setError("Email ou senha incorretos")
        setIsLoading(false)
        return
      }

      // Armazenar informações de login no localStorage
      localStorage.setItem("isLoggedIn", "true")
      localStorage.setItem("userEmail", email)
      localStorage.setItem("userName", user.name)

      // Redirecionar para o dashboard
      router.push("/dashboard")
    } catch (err) {
      setError("Ocorreu um erro ao fazer login. Tente novamente.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Login</CardTitle>
        <CardDescription>Entre com suas credenciais para acessar sua conta</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {successMessage && (
            <Alert variant="default" className="border-green-500 text-green-500">
              <CheckCircle2 className="h-4 w-4" />
              <AlertDescription>{successMessage}</AlertDescription>
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

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Senha</Label>
              <Link href="/esqueceu-senha" className="text-sm text-primary hover:underline">
                Esqueceu a senha?
              </Link>
            </div>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
            />
          </div>
        </CardContent>

        <CardFooter className="flex flex-col space-y-4">
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Entrando...
              </>
            ) : (
              "Entrar"
            )}
          </Button>

          <div className="text-center text-sm text-muted-foreground">
            Não tem uma conta?{" "}
            <Link href="/cadastro" className="text-primary underline">
              Cadastre-se
            </Link>
          </div>
        </CardFooter>
      </form>
    </Card>
  )
}

