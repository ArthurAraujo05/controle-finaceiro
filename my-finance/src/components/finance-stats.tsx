"use client"

import { useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowDownIcon, ArrowUpIcon, BarChart3 } from "lucide-react"
import type { Transaction } from "@/types/transaction"

interface FinanceStatsProps {
    transactions: Transaction[]
}

export function FinanceStats({ transactions }: FinanceStatsProps) {
    const stats = useMemo(() => {
        const income = transactions.filter((t) => t.type === "income").reduce((sum, t) => sum + t.amount, 0)

        const expenses = transactions.filter((t) => t.type === "expense").reduce((sum, t) => sum + t.amount, 0)

        const balance = income - expenses

        return { income, expenses, balance }
    }, [transactions])

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
        }).format(value)
    }

    return (
        <div className="grid grid-cols-1 gap-6">
            {/* Card de Saldo - Principal e maior */}
            <Card className="shadow-md">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-xl font-bold">Saldo Atual</CardTitle>
                    <BarChart3 className={`h-6 w-6 ${stats.balance >= 0 ? "text-green-600" : "text-red-600"}`} />
                </CardHeader>
                <CardContent>
                    <div className={`text-4xl font-bold ${stats.balance >= 0 ? "text-green-600" : "text-red-600"}`}>
                        {formatCurrency(stats.balance)}
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">Saldo atual baseado em todas as suas transações</p>
                </CardContent>
            </Card>

            {/* Cards de Receitas e Despesas em uma divisão */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Receitas</CardTitle>
                        <ArrowUpIcon className="h-4 w-4 text-green-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">{formatCurrency(stats.income)}</div>
                        <p className="text-xs text-muted-foreground mt-1">Total de entradas</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Despesas</CardTitle>
                        <ArrowDownIcon className="h-4 w-4 text-red-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-red-600">{formatCurrency(stats.expenses)}</div>
                        <p className="text-xs text-muted-foreground mt-1">Total de saídas</p>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

