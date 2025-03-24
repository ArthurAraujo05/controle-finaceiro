"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { FinanceForm } from "@/components/finance-form"
import { TransactionList } from "@/components/transaction-list"
import { FinanceStats } from "@/components/finance-stats"
import { FinanceDashboard } from "@/components/finance-dashboard"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { Transaction } from "@/types/transaction"
import { Button } from "@/components/ui/button"
import { MoonIcon, SunIcon } from "lucide-react"
import { useTheme } from "next-themes"
import { UserNav } from "@/components/user-nav"

export default function DashboardPage() {
    const [transactions, setTransactions] = useState<Transaction[]>([])
    const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null)
    const { theme, setTheme } = useTheme()
    const [mounted, setMounted] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const router = useRouter()

    useEffect(() => {
        const checkAuth = () => {
            const isLoggedIn = localStorage.getItem("isLoggedIn") === "true"
            if (!isLoggedIn) {
                router.push("/login")
            } else {
                setIsLoading(false)
            }
        }

        checkAuth()
        setMounted(true)
    }, [router])

    useEffect(() => {
        if (mounted && !isLoading) {
            const savedTransactions = localStorage.getItem("transactions")
            if (savedTransactions) {
                try {
                    setTransactions(JSON.parse(savedTransactions))
                } catch (e) {
                    console.error("Error loading saved transactions", e)
                }
            }
        }
    }, [mounted, isLoading])

    useEffect(() => {
        if (mounted && !isLoading) {
            localStorage.setItem("transactions", JSON.stringify(transactions))
        }
    }, [transactions, mounted, isLoading])

    const addTransaction = (transaction: Transaction) => {
        setTransactions([...transactions, { ...transaction, id: Date.now().toString() }])
    }

    const updateTransaction = (updatedTransaction: Transaction) => {
        setTransactions(transactions.map((t) => (t.id === updatedTransaction.id ? updatedTransaction : t)))
        setEditingTransaction(null)
    }

    const deleteTransaction = (id: string) => {
        setTransactions(transactions.filter((t) => t.id !== id))
    }

    const startEditing = (transaction: Transaction) => {
        setEditingTransaction(transaction)
    }

    const cancelEditing = () => {
        setEditingTransaction(null)
    }

    const handleLogout = () => {
        localStorage.removeItem("isLoggedIn")
        localStorage.removeItem("userEmail")
        localStorage.removeItem("userName")
        router.push("/login")
    }

    if (isLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                    <p className="mt-4 text-muted-foreground">Carregando...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-background">
            <header className="border-b">
                <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                    <h1 className="text-xl font-bold">Controle Financeiro</h1>
                    <div className="flex items-center gap-4">
                        <Button variant="outline" size="icon" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
                            {mounted && theme === "dark" ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
                            <span className="sr-only">Alternar tema</span>
                        </Button>
                        <UserNav onLogout={handleLogout} />
                    </div>
                </div>
            </header>

            <main className="container mx-auto p-4 max-w-4xl">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <FinanceStats transactions={transactions} />
                </div>

                <div className="mb-8">
                    <FinanceDashboard transactions={transactions} />
                </div>

                <Tabs defaultValue="form" className="mb-8">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="form">Adicionar Transação</TabsTrigger>
                        <TabsTrigger value="list">Transações</TabsTrigger>
                    </TabsList>
                    <TabsContent value="form">
                        <FinanceForm
                            onSubmit={editingTransaction ? updateTransaction : addTransaction}
                            editingTransaction={editingTransaction}
                            onCancel={cancelEditing}
                        />
                    </TabsContent>
                    <TabsContent value="list">
                        <TransactionList transactions={transactions} onDelete={deleteTransaction} onEdit={startEditing} />
                    </TabsContent>
                </Tabs>
            </main>
        </div>
    )
}

