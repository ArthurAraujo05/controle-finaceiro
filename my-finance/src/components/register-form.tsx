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
import { AlertCircle, Loader2, X } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"

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
    const [termsOpen, setTermsOpen] = useState(false)

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
            await new Promise((resolve) => setTimeout(resolve, 1500))

            const existingUsers = JSON.parse(localStorage.getItem("users") || "[]")
            const userExists = existingUsers.some((user: any) => user.email === formData.email)

            if (userExists) {
                setError("Este email já está cadastrado")
                setIsLoading(false)
                return
            }

            const newUser = {
                id: Date.now().toString(),
                name: formData.name,
                email: formData.email,
                password: formData.password,
                createdAt: new Date().toISOString(),
            }

            localStorage.setItem("users", JSON.stringify([...existingUsers, newUser]))

            localStorage.setItem("registrationSuccess", "true")
            router.push("/login")
        } catch (err) {
            setError("Ocorreu um erro ao criar sua conta. Tente novamente.")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <>
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

                        <div className="space-y-2">
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
                                    <button
                                        type="button"
                                        className="text-primary underline focus:outline-none"
                                        onClick={() => setTermsOpen(true)}
                                    >
                                        termos e condições
                                    </button>
                                </label>
                            </div>
                            <p className="text-xs text-muted-foreground pl-6">
                                Ao aceitar os termos e condições, você concorda em utilizar o aplicativo de Controle Financeiro de
                                acordo com nossas políticas. Seus dados serão armazenados localmente em seu dispositivo e não serão
                                compartilhados com terceiros. Você poderá excluir seus dados a qualquer momento através das
                                configurações da conta.
                            </p>
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
                            <Link href="/login" className="text-primary underline">
                                Faça login
                            </Link>
                        </div>
                    </CardFooter>
                </form>
            </Card>

            <AlertDialog open={termsOpen} onOpenChange={setTermsOpen}>
                <AlertDialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="flex justify-between items-center">
                            <span>Termos e Condições</span>
                            <Button variant="ghost" size="icon" onClick={() => setTermsOpen(false)} className="h-6 w-6">
                                <X className="h-4 w-4" />
                            </Button>
                        </AlertDialogTitle>
                        <AlertDialogDescription>Última atualização: 24 de março de 2025</AlertDialogDescription>
                    </AlertDialogHeader>
                    <div className="space-y-4 py-4 text-sm">
                        <h3 className="text-lg font-semibold">1. Introdução</h3>
                        <p>
                            Bem-vindo ao aplicativo de Controle Financeiro. Estes Termos e Condições regem o uso do nosso aplicativo e
                            serviços relacionados. Ao acessar ou usar nosso aplicativo, você concorda com estes termos. Se você não
                            concordar com qualquer parte destes termos, por favor, não use nosso aplicativo.
                        </p>

                        <h3 className="text-lg font-semibold">2. Uso do Aplicativo</h3>
                        <p>
                            O aplicativo de Controle Financeiro é uma ferramenta para ajudá-lo a gerenciar suas finanças pessoais.
                            Você é responsável por todas as atividades que ocorrem em sua conta e pela precisão dos dados que você
                            insere.
                        </p>

                        <h3 className="text-lg font-semibold">3. Privacidade e Dados</h3>
                        <p>
                            Respeitamos sua privacidade e estamos comprometidos em proteger seus dados pessoais. Todos os dados
                            inseridos no aplicativo são armazenados localmente em seu dispositivo e não são transmitidos para nossos
                            servidores, exceto quando necessário para fornecer funcionalidades específicas que você solicitar.
                        </p>
                        <p>
                            Você pode excluir seus dados a qualquer momento através das configurações da conta. Ao excluir sua conta,
                            todos os seus dados serão permanentemente removidos do seu dispositivo.
                        </p>

                        <h3 className="text-lg font-semibold">4. Segurança da Conta</h3>
                        <p>
                            Você é responsável por manter a confidencialidade de sua senha e por restringir o acesso ao seu
                            dispositivo. Recomendamos o uso de senhas fortes e a ativação de autenticação de dois fatores quando
                            disponível.
                        </p>

                        <h3 className="text-lg font-semibold">5. Limitações de Responsabilidade</h3>
                        <p>
                            O aplicativo de Controle Financeiro é fornecido "como está" e "conforme disponível", sem garantias de
                            qualquer tipo. Não garantimos que o aplicativo será ininterrupto, oportuno, seguro ou livre de erros.
                        </p>
                        <p>
                            Não somos responsáveis por quaisquer decisões financeiras que você tomar com base nas informações
                            fornecidas pelo aplicativo. Recomendamos consultar um profissional financeiro para aconselhamento
                            personalizado.
                        </p>

                        <h3 className="text-lg font-semibold">6. Alterações nos Termos</h3>
                        <p>
                            Reservamo-nos o direito de modificar estes termos a qualquer momento. As alterações entrarão em vigor
                            imediatamente após a publicação dos termos atualizados. O uso contínuo do aplicativo após tais alterações
                            constitui sua aceitação dos novos termos.
                        </p>

                        <h3 className="text-lg font-semibold">7. Contato</h3>
                        <p>
                            Se você tiver alguma dúvida sobre estes Termos e Condições, entre em contato conosco pelo email:
                            suporte@controlefinanceiro.com.br
                        </p>
                    </div>
                    <AlertDialogFooter>
                        <AlertDialogAction onClick={() => setTermsOpen(false)}>Fechar</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    )
}

