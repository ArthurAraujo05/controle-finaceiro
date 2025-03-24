import { LoginForm } from "@/components/login-form"

export default function LoginPage() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-gradient-to-b from-muted/50 to-muted">
            <div className="w-full max-w-md">
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold">Controle Financeiro</h1>
                    <p className="text-muted-foreground mt-2">Faça login para acessar seu painel financeiro</p>
                </div>
                <LoginForm />
            </div>
        </div>
    )
}

