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
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Receitas</CardTitle>
          <ArrowUpIcon className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">{formatCurrency(stats.income)}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Despesas</CardTitle>
          <ArrowDownIcon className="h-4 w-4 text-red-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-600">{formatCurrency(stats.expenses)}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Saldo</CardTitle>
          <BarChart3 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${stats.balance >= 0 ? "text-green-600" : "text-red-600"}`}>
            {formatCurrency(stats.balance)}
          </div>
        </CardContent>
      </Card>
    </>
  )
}

