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
import { AlertCircle, Loader2 } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"

export function RegisterForm() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [acceptTerms, setAcceptTerms] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    // Validação básica
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      setError("Por favor, preencha todos os campos")
      return
    }

    if (!formData.email.includes("@")) {
      setError("Por favor, insira um email válido")
      return
    }

    if (formData.password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres")
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError("As senhas não coincidem")
      return
    }

    if (!acceptTerms) {
      setError("Você precisa aceitar os termos e condições")
      return
    }

    setIsLoading(true)

    try {
      // Simulando uma chamada de API com um timeout
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Verificar se o email já está cadastrado
      const existingUsers = JSON.parse(localStorage.getItem("users") || "[]")
      const userExists = existingUsers.some((user: any) => user.email === formData.email)

      if (userExists) {
        setError("Este email já está cadastrado")
        setIsLoading(false)
        return
      }

      // Salvar o novo usuário
      const newUser = {
        id: Date.now().toString(),
        name: formData.name,
        email: formData.email,
        password: formData.password, // Em uma aplicação real, você NUNCA armazenaria senhas em texto puro
        createdAt: new Date().toISOString(),
      }

      localStorage.setItem("users", JSON.stringify([...existingUsers, newUser]))

      // Redirecionar para a página de login com mensagem de sucesso
      localStorage.setItem("registrationSuccess", "true")
      router.push("/")
    } catch (err) {
      setError("Ocorreu um erro ao criar sua conta. Tente novamente.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Criar Conta</CardTitle>
        <CardDescription>Preencha os dados abaixo para criar sua conta</CardDescription>
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
            <Label htmlFor="name">Nome completo</Label>
            <Input
              id="name"
              name="name"
              placeholder="Seu nome completo"
              value={formData.name}
              onChange={handleChange}
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="seu@email.com"
              value={formData.email}
              onChange={handleChange}
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirmar senha</Label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={handleChange}
              disabled={isLoading}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="terms"
              checked={acceptTerms}
              onCheckedChange={(checked) => setAcceptTerms(checked === true)}
              disabled={isLoading}
            />
            <label
              htmlFor="terms"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Eu aceito os{" "}
              <Link href="#" className="text-primary underline">
                termos e condições
              </Link>
            </label>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col space-y-4">
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Criando conta...
              </>
            ) : (
              "Criar conta"
            )}
          </Button>

          <div className="text-center text-sm text-muted-foreground">
            Já tem uma conta?{" "}
            <Link href="/" className="text-primary underline">
              Faça login
            </Link>
          </div>
        </CardFooter>
      </form>
    </Card>
  )
}

