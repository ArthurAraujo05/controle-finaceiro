"use client"

import { useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Transaction } from "@/types/transaction"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from "recharts"

interface FinanceDashboardProps {
  transactions: Transaction[]
}

export function FinanceDashboard({ transactions }: FinanceDashboardProps) {
  const categoryColors: Record<string, string> = {
    alimentacao: "#FF6384",
    transporte: "#36A2EB",
    moradia: "#FFCE56",
    lazer: "#4BC0C0",
    saude: "#9966FF",
    educacao: "#FF9F40",
    salario: "#32CD32",
    investimentos: "#1E90FF",
    outros: "#A9A9A9",
  }

  const getCategoryLabel = (category: string) => {
    const categories: Record<string, string> = {
      alimentacao: "Alimentação",
      transporte: "Transporte",
      moradia: "Moradia",
      lazer: "Lazer",
      saude: "Saúde",
      educacao: "Educação",
      salario: "Salário",
      investimentos: "Investimentos",
      outros: "Outros",
    }
    return categories[category] || category
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value)
  }

  // Prepare data for expense categories pie chart
  const expensesByCategory = useMemo(() => {
    const categoryMap = new Map<string, number>()

    transactions
      .filter((t) => t.type === "expense")
      .forEach((t) => {
        const current = categoryMap.get(t.category) || 0
        categoryMap.set(t.category, current + t.amount)
      })

    return Array.from(categoryMap.entries()).map(([category, amount]) => ({
      name: getCategoryLabel(category),
      value: amount,
      category,
    }))
  }, [transactions])

  // Prepare data for monthly chart
  const monthlyData = useMemo(() => {
    const monthMap = new Map<string, { income: number; expense: number }>()

    transactions.forEach((t) => {
      const date = new Date(t.date)
      const monthYear = `${date.getMonth() + 1}/${date.getFullYear()}`

      const current = monthMap.get(monthYear) || { income: 0, expense: 0 }

      if (t.type === "income") {
        current.income += t.amount
      } else {
        current.expense += t.amount
      }

      monthMap.set(monthYear, current)
    })

    return Array.from(monthMap.entries())
      .map(([month, data]) => ({
        month,
        income: data.income,
        expense: data.expense,
        balance: data.income - data.expense,
      }))
      .sort((a, b) => {
        const [aMonth, aYear] = a.month.split("/").map(Number)
        const [bMonth, bYear] = b.month.split("/").map(Number)

        if (aYear !== bYear) return aYear - bYear
        return aMonth - bMonth
      })
  }, [transactions])

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border rounded-md p-2 shadow-sm">
          <p className="font-medium">{payload[0].name}</p>
          <p className="text-sm">{formatCurrency(payload[0].value)}</p>
        </div>
      )
    }
    return null
  }

  const BarChartTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border rounded-md p-2 shadow-sm">
          <p className="font-medium">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={`item-${index}`} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {formatCurrency(entry.value)}
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Dashboard Financeiro</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="expenses" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="expenses">Despesas por Categoria</TabsTrigger>
            <TabsTrigger value="monthly">Evolução Mensal</TabsTrigger>
          </TabsList>

          <TabsContent value="expenses" className="space-y-4">
            {expensesByCategory.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">Nenhuma despesa registrada ainda.</p>
            ) : (
              <div className="h-[300px] mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={expensesByCategory}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {expensesByCategory.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={categoryColors[entry.category] || "#A9A9A9"} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}

            {expensesByCategory.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 mt-4">
                {expensesByCategory.map((category) => (
                  <div key={category.category} className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: categoryColors[category.category] || "#A9A9A9" }}
                    />
                    <span className="text-sm">{category.name}</span>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="monthly">
            {monthlyData.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">Nenhuma transação registrada ainda.</p>
            ) : (
              <div className="h-[300px] mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={monthlyData}
                    margin={{
                      top: 20,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip content={<BarChartTooltip />} />
                    <Legend />
                    <Bar dataKey="income" name="Receitas" fill="#32CD32" />
                    <Bar dataKey="expense" name="Despesas" fill="#FF6384" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

