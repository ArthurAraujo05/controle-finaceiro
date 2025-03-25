"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Edit, Trash2, Download } from "lucide-react"
import type { Transaction } from "@/types/transaction"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogClose,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"

interface TransactionListProps {
    transactions: Transaction[]
    onDelete: (id: string) => void
    onEdit: (transaction: Transaction) => void
}

export function TransactionList({ transactions, onDelete, onEdit }: TransactionListProps) {
    const [searchTerm, setSearchTerm] = useState("")
    const [filterCategory, setFilterCategory] = useState("")
    const [filterType, setFilterType] = useState("")
    const [sortBy, setSortBy] = useState("date")
    const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")
    const [dialogOpen, setDialogOpen] = useState(false)
    const [editingItem, setEditingItem] = useState<Transaction | null>(null)
    const [editForm, setEditForm] = useState({
        description: "",
        category: "",
        amount: "",
        date: "",
    })

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

    const filteredTransactions = transactions.filter((transaction) => {
        const matchesSearch =
            transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            transaction.category.toLowerCase().includes(searchTerm.toLowerCase())

        const matchesCategory =
            filterCategory === "all" || filterCategory === "" || transaction.category === filterCategory

        const matchesType =
            filterType === "all" || filterType === "" || transaction.type === filterType

        return matchesSearch && matchesCategory && matchesType
    })

    const sortedTransactions = [...filteredTransactions].sort((a, b) => {
        let comparison = 0

        if (sortBy === "date") {
            comparison = new Date(a.date).getTime() - new Date(b.date).getTime()
        } else if (sortBy === "amount") {
            comparison = a.amount - b.amount
        } else if (sortBy === "description") {
            comparison = a.description.localeCompare(b.description)
        } else if (sortBy === "category") {
            comparison = a.category.localeCompare(b.category)
        }

        return sortDirection === "asc" ? comparison : -comparison
    })

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
        }).format(value)
    }

    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        return new Intl.DateTimeFormat("pt-BR").format(date)
    }

    const handleSort = (column: string) => {
        if (sortBy === column) {
            setSortDirection(sortDirection === "asc" ? "desc" : "asc")
        } else {
            setSortBy(column)
            setSortDirection("asc")
        }
    }

    const exportToCSV = () => {
        if (filteredTransactions.length === 0) return

        const headers = ["Descrição", "Categoria", "Data", "Tipo", "Valor"]
        const csvContent = [
            headers.join(","),
            ...filteredTransactions.map((t) =>
                [
                    `"${t.description}"`,
                    `"${getCategoryLabel(t.category)}"`,
                    `"${formatDate(t.date)}"`,
                    `"${t.type === "income" ? "Receita" : "Despesa"}"`,
                    `"${t.amount}"`,
                ].join(","),
            ),
        ].join("\n")

        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
        const url = URL.createObjectURL(blob)
        const link = document.createElement("a")
        link.setAttribute("href", url)
        link.setAttribute("download", "transacoes.csv")
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

    const handleOpenEditDialog = (transaction: Transaction) => {
        setEditingItem(transaction)
        setEditForm({
            description: transaction.description,
            category: transaction.category,
            amount: transaction.amount.toString(),
            date: transaction.date,
        })
        setDialogOpen(true)
    }

    const handleSaveEdit = () => {
        if (!editingItem) return

        if (!editForm.description.trim() || !editForm.category || !editForm.amount || !editForm.date) {
            alert("Por favor, preencha todos os campos obrigatórios.")
            return
        }

        const amount = Number.parseFloat(editForm.amount)
        if (isNaN(amount) || amount <= 0) {
            alert("Por favor, insira um valor válido maior que zero.")
            return
        }

        const updatedTransaction: Transaction = {
            ...editingItem,
            description: editForm.description.trim(),
            category: editForm.category,
            amount: amount,
            date: editForm.date,
        }

        onEdit(updatedTransaction)
        setDialogOpen(false)
        setEditingItem(null)
    }

    const handleEditFormChange = (field: string, value: string) => {
        setEditForm((prev) => ({
            ...prev,
            [field]: value,
        }))
    }

    return (
        <Card>
            <CardHeader className="space-y-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <CardTitle>Transações</CardTitle>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={exportToCSV}
                        disabled={filteredTransactions.length === 0}
                        className="flex items-center gap-2"
                    >
                        <Download className="h-4 w-4" />
                        Exportar CSV
                    </Button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                    <Input
                        placeholder="Buscar transações..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />

                    <Select value={filterCategory} onValueChange={setFilterCategory}>
                        <SelectTrigger>
                            <SelectValue placeholder="Todas as categorias" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Todas as categorias</SelectItem>
                            <SelectItem value="alimentacao">Alimentação</SelectItem>
                            <SelectItem value="transporte">Transporte</SelectItem>
                            <SelectItem value="moradia">Moradia</SelectItem>
                            <SelectItem value="lazer">Lazer</SelectItem>
                            <SelectItem value="saude">Saúde</SelectItem>
                            <SelectItem value="educacao">Educação</SelectItem>
                            <SelectItem value="salario">Salário</SelectItem>
                            <SelectItem value="investimentos">Investimentos</SelectItem>
                            <SelectItem value="outros">Outros</SelectItem>
                        </SelectContent>
                    </Select>

                    <Select value={filterType} onValueChange={setFilterType}>
                        <SelectTrigger>
                            <SelectValue placeholder="Todos os tipos" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Todos os tipos</SelectItem>
                            <SelectItem value="income">Receitas</SelectItem>
                            <SelectItem value="expense">Despesas</SelectItem>
                        </SelectContent>
                    </Select>

                    <Select
                        value={`${sortBy}-${sortDirection}`}
                        onValueChange={(value) => {
                            const [newSortBy, newSortDirection] = value.split("-") as [string, "asc" | "desc"]
                            setSortBy(newSortBy)
                            setSortDirection(newSortDirection)
                        }}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Ordenar por" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="date-desc">Data (mais recente)</SelectItem>
                            <SelectItem value="date-asc">Data (mais antiga)</SelectItem>
                            <SelectItem value="amount-desc">Valor (maior)</SelectItem>
                            <SelectItem value="amount-asc">Valor (menor)</SelectItem>
                            <SelectItem value="description-asc">Descrição (A-Z)</SelectItem>
                            <SelectItem value="description-desc">Descrição (Z-A)</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </CardHeader>

            <CardContent>
                {transactions.length === 0 ? (
                    <p className="text-center text-muted-foreground py-4">Nenhuma transação registrada ainda.</p>
                ) : filteredTransactions.length === 0 ? (
                    <p className="text-center text-muted-foreground py-4">Nenhuma transação encontrada com os filtros atuais.</p>
                ) : (
                    <div className="rounded-md border overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="cursor-pointer hover:bg-muted/50" onClick={() => handleSort("description")}>
                                        Descrição
                                        {sortBy === "description" && <span className="ml-1">{sortDirection === "asc" ? "↑" : "↓"}</span>}
                                    </TableHead>
                                    <TableHead className="cursor-pointer hover:bg-muted/50" onClick={() => handleSort("category")}>
                                        Categoria
                                        {sortBy === "category" && <span className="ml-1">{sortDirection === "asc" ? "↑" : "↓"}</span>}
                                    </TableHead>
                                    <TableHead className="cursor-pointer hover:bg-muted/50" onClick={() => handleSort("date")}>
                                        Data
                                        {sortBy === "date" && <span className="ml-1">{sortDirection === "asc" ? "↑" : "↓"}</span>}
                                    </TableHead>
                                    <TableHead
                                        className="text-right cursor-pointer hover:bg-muted/50"
                                        onClick={() => handleSort("amount")}
                                    >
                                        Valor
                                        {sortBy === "amount" && <span className="ml-1">{sortDirection === "asc" ? "↑" : "↓"}</span>}
                                    </TableHead>
                                    <TableHead className="text-right">Ações</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {sortedTransactions.map((transaction) => (
                                    <TableRow key={transaction.id}>
                                        <TableCell>{transaction.description}</TableCell>
                                        <TableCell>{getCategoryLabel(transaction.category)}</TableCell>
                                        <TableCell>{formatDate(transaction.date)}</TableCell>
                                        <TableCell
                                            className={`text-right ${transaction.type === "income" ? "text-green-600" : "text-red-600"}`}
                                        >
                                            {transaction.type === "income" ? "+" : "-"} {formatCurrency(transaction.amount)}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end space-x-2">
                                                <Button variant="ghost" size="icon" onClick={() => handleOpenEditDialog(transaction)}>
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                                <Button variant="ghost" size="icon" onClick={() => onDelete(transaction.id)}>
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                )}
            </CardContent>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Editar Transação</DialogTitle>
                        <DialogDescription>Faça as alterações necessárias nos campos abaixo.</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="edit-description" className="text-right">
                                Descrição
                            </Label>
                            <Input
                                id="edit-description"
                                value={editForm.description}
                                onChange={(e) => handleEditFormChange("description", e.target.value)}
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="edit-category" className="text-right">
                                Categoria
                            </Label>
                            <Select value={editForm.category} onValueChange={(value) => handleEditFormChange("category", value)}>
                                <SelectTrigger className="col-span-3">
                                    <SelectValue placeholder="Selecione uma categoria" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="alimentacao">Alimentação</SelectItem>
                                    <SelectItem value="transporte">Transporte</SelectItem>
                                    <SelectItem value="moradia">Moradia</SelectItem>
                                    <SelectItem value="lazer">Lazer</SelectItem>
                                    <SelectItem value="saude">Saúde</SelectItem>
                                    <SelectItem value="educacao">Educação</SelectItem>
                                    <SelectItem value="salario">Salário</SelectItem>
                                    <SelectItem value="investimentos">Investimentos</SelectItem>
                                    <SelectItem value="outros">Outros</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="edit-amount" className="text-right">
                                Valor
                            </Label>
                            <Input
                                id="edit-amount"
                                type="number"
                                step="0.01"
                                min="0.01"
                                value={editForm.amount}
                                onChange={(e) => handleEditFormChange("amount", e.target.value)}
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="edit-date" className="text-right">
                                Data
                            </Label>
                            <Input
                                id="edit-date"
                                type="date"
                                value={editForm.date}
                                onChange={(e) => handleEditFormChange("date", e.target.value)}
                                className="col-span-3"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button type="button" variant="secondary">
                                Cancelar
                            </Button>
                        </DialogClose>
                        <Button type="button" onClick={handleSaveEdit}>
                            Salvar alterações
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </Card>
    )
}

