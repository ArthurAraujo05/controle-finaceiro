"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import type { Transaction, TransactionType } from "@/types/transaction"

interface FinanceFormProps {
    onSubmit: (transaction: Transaction) => void
    editingTransaction: Transaction | null
    onCancel: () => void
}

export function FinanceForm({ onSubmit, editingTransaction, onCancel }: FinanceFormProps) {
    const [description, setDescription] = useState("")
    const [amount, setAmount] = useState("")
    const [category, setCategory] = useState("")
    const [type, setType] = useState<TransactionType>("expense")
    const [date, setDate] = useState(new Date().toISOString().split("T")[0])
    const [error, setError] = useState("")

    // Calcular a data máxima permitida (amanhã)
    const getMaxDate = () => {
        const tomorrow = new Date()
        tomorrow.setDate(tomorrow.getDate() + 1)
        return tomorrow.toISOString().split("T")[0]
    }

    const maxDate = getMaxDate()

    useEffect(() => {
        if (editingTransaction) {
            setDescription(editingTransaction.description)
            setAmount(editingTransaction.amount.toString())
            setCategory(editingTransaction.category)
            setType(editingTransaction.type)
            setDate(editingTransaction.date)
        }
    }, [editingTransaction])

    const validateDate = (dateString: string) => {
        const selectedDate = new Date(dateString)
        const maxAllowedDate = new Date(maxDate)

        if (selectedDate > maxAllowedDate) {
            return false
        }
        return true
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        setError("")

        // Validação básica
        if (!description.trim()) {
            setError("Por favor, informe uma descrição")
            return
        }

        if (!amount || Number.parseFloat(amount) <= 0) {
            setError("Por favor, informe um valor válido maior que zero")
            return
        }

        if (!category) {
            setError("Por favor, selecione uma categoria")
            return
        }

        if (!date) {
            setError("Por favor, selecione uma data")
            return
        }

        // Validação da data
        if (!validateDate(date)) {
            setError("A data não pode ser mais de um dia no futuro")
            return
        }

        const transaction: Transaction = {
            id: editingTransaction?.id || "",
            description: description.trim(),
            amount: Number.parseFloat(amount),
            category,
            type,
            date,
        }

        onSubmit(transaction)
        resetForm()
    }

    const resetForm = () => {
        setDescription("")
        setAmount("")
        setCategory("")
        setType("expense")
        setDate(new Date().toISOString().split("T")[0])
        setError("")
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>{editingTransaction ? "Editar Transação" : "Nova Transação"}</CardTitle>
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
                        <Label htmlFor="type">Tipo</Label>
                        <RadioGroup
                            id="type"
                            value={type}
                            onValueChange={(value) => setType(value as TransactionType)}
                            className="flex space-x-4"
                        >
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="income" id="income" />
                                <Label htmlFor="income" className="cursor-pointer">
                                    Receita
                                </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="expense" id="expense" />
                                <Label htmlFor="expense" className="cursor-pointer">
                                    Despesa
                                </Label>
                            </div>
                        </RadioGroup>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Descrição</Label>
                        <Input id="description" value={description} onChange={(e) => setDescription(e.target.value)} required />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="amount">Valor (R$)</Label>
                        <Input
                            id="amount"
                            type="number"
                            step="0.01"
                            min="0.01"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="category">Categoria</Label>
                        <Select value={category} onValueChange={setCategory} required>
                            <SelectTrigger>
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

                    <div className="space-y-2">
                        <Label htmlFor="date">Data</Label>
                        <Input
                            id="date"
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            max={maxDate}
                            required
                        />
                        <p className="text-xs text-muted-foreground">Você pode selecionar datas passadas, hoje ou amanhã.</p>
                    </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                    {editingTransaction && (
                        <Button type="button" variant="outline" onClick={onCancel}>
                            Cancelar
                        </Button>
                    )}
                    <Button type="submit" className="ml-auto mt-4">
                        {editingTransaction ? "Atualizar" : "Adicionar"}
                    </Button>
                </CardFooter>
            </form>
        </Card>
    )
}

// Compare this snippet from my-finance/src/components/finance-form.tsx: