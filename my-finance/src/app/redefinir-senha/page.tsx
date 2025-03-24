import { ResetPasswordForm } from "@/components/reset-password-form"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default function ResetPasswordPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-gradient-to-b from-muted/50 to-muted">
      <div className="w-full max-w-md">
        <div className="absolute top-4 left-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/esqueceu-senha">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Link>
          </Button>
        </div>

        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold">Redefinir Senha</h1>
          <p className="text-muted-foreground mt-2">Insira o código de verificação e sua nova senha</p>
        </div>

        <ResetPasswordForm />
      </div>
    </div>
  )
}

