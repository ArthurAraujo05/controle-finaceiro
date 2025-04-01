"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ChevronDown, Plus, Edit2, Trash2, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import type { FinancialControl } from "@/types/control"

interface ControlSelectorProps {
    selectedControlId: string
    onSelectControl: (controlId: string) => void
}

export function ControlSelector({ selectedControlId, onSelectControl }: ControlSelectorProps) {
    const [controls, setControls] = useState<FinancialControl[]>([])
    const [selectedControl, setSelectedControl] = useState<FinancialControl | null>(null)
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
    const [formError, setFormError] = useState("")

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        color: "#3b82f6", // Azul por padrão
    })

    // Carregar controles do localStorage
    useEffect(() => {
        const savedControls = localStorage.getItem("financialControls")
        if (savedControls) {
            try {
                const parsedControls = JSON.parse(savedControls)
                setControls(parsedControls)

                // Se não houver controle selecionado, selecione o primeiro
                if (!selectedControlId && parsedControls.length > 0) {
                    onSelectControl(parsedControls[0].id)
                }

                // Encontrar o controle selecionado
                const current = parsedControls.find((c: FinancialControl) => c.id === selectedControlId)
                if (current) {
                    setSelectedControl(current)
                }
            } catch (e) {
                console.error("Erro ao carregar controles financeiros", e)
            }
        } else {
            // Se não existirem controles, criar um padrão
            const defaultControl: FinancialControl = {
                id: Date.now().toString(),
                name: "Controle Principal",
                description: "Meu controle financeiro principal",
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                color: "#3b82f6",
            }

            setControls([defaultControl])
            localStorage.setItem("financialControls", JSON.stringify([defaultControl]))
            onSelectControl(defaultControl.id)
            setSelectedControl(defaultControl)
        }
    }, [selectedControlId, onSelectControl])

    const handleSelectControl = (control: FinancialControl) => {
        setSelectedControl(control)
        onSelectControl(control.id)
    }

    const openCreateDialog = () => {
        setFormData({
            name: "",
            description: "",
            color: "#3b82f6",
        })
        setFormError("")
        setIsCreateDialogOpen(true)
    }

    const openEditDialog = (e: React.MouseEvent, control: FinancialControl) => {
        e.stopPropagation()
        setFormData({
            name: control.name,
            description: control.description || "",
            color: control.color || "#3b82f6",
        })
        setFormError("")
        setSelectedControl(control)
        setIsEditDialogOpen(true)
    }

    const openDeleteDialog = (e: React.MouseEvent, control: FinancialControl) => {
        e.stopPropagation()
        setSelectedControl(control)
        setIsDeleteDialogOpen(true)
    }

    const handleCreateControl = () => {
        if (!formData.name.trim()) {
            setFormError("Por favor, informe um nome para o controle")
            return
        }

        const newControl: FinancialControl = {
            id: Date.now().toString(),
            name: formData.name.trim(),
            description: formData.description.trim(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            color: formData.color,
        }

        const updatedControls = [...controls, newControl]
        setControls(updatedControls)
        localStorage.setItem("financialControls", JSON.stringify(updatedControls))

        // Selecionar o novo controle
        setSelectedControl(newControl)
        onSelectControl(newControl.id)

        setIsCreateDialogOpen(false)
    }

    const handleUpdateControl = () => {
        if (!selectedControl) return

        if (!formData.name.trim()) {
            setFormError("Por favor, informe um nome para o controle")
            return
        }

        const updatedControl: FinancialControl = {
            ...selectedControl,
            name: formData.name.trim(),
            description: formData.description.trim(),
            updatedAt: new Date().toISOString(),
            color: formData.color,
        }

        const updatedControls = controls.map((c) => (c.id === selectedControl.id ? updatedControl : c))

        setControls(updatedControls)
        setSelectedControl(updatedControl)
        localStorage.setItem("financialControls", JSON.stringify(updatedControls))

        setIsEditDialogOpen(false)
    }

    const handleDeleteControl = () => {
        if (!selectedControl) return

        // Não permitir excluir se for o único controle
        if (controls.length <= 1) {
            setFormError("Você não pode excluir o único controle existente")
            return
        }

        const updatedControls = controls.filter((c) => c.id !== selectedControl.id)
        setControls(updatedControls)
        localStorage.setItem("financialControls", JSON.stringify(updatedControls))

        // Selecionar o primeiro controle da lista
        setSelectedControl(updatedControls[0])
        onSelectControl(updatedControls[0].id)

        setIsDeleteDialogOpen(false)

        // Limpar as transações associadas a este controle
        const allTransactions = JSON.parse(localStorage.getItem("allTransactions") || "{}")
        delete allTransactions[selectedControl.id]
        localStorage.setItem("allTransactions", JSON.stringify(allTransactions))
    }

    const handleFormChange = (field: string, value: string) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }))
    }

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="flex items-center gap-2 w-full md:w-auto">
                        {selectedControl ? (
                            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: selectedControl.color || "#3b82f6" }} />
                        ) : null}
                        <span className="truncate max-w-[150px]">
                            {selectedControl ? selectedControl.name : "Selecione um controle"}
                        </span>
                        <ChevronDown className="h-4 w-4 opacity-50" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[240px]">
                    <DropdownMenuLabel>Meus Controles</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {controls.map((control) => (
                        <DropdownMenuItem
                            key={control.id}
                            className="flex items-center justify-between cursor-pointer"
                            onClick={() => handleSelectControl(control)}
                        >
                            <div className="flex items-center gap-2">
                                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: control.color || "#3b82f6" }} />
                                <span className="truncate max-w-[150px]">{control.name}</span>
                            </div>
                            <div className="flex items-center">
                                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={(e) => openEditDialog(e, control)}>
                                    <Edit2 className="h-3 w-3" />
                                </Button>
                                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={(e) => openDeleteDialog(e, control)}>
                                    <Trash2 className="h-3 w-3" />
                                </Button>
                            </div>
                        </DropdownMenuItem>
                    ))}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="flex items-center gap-2 cursor-pointer" onClick={openCreateDialog}>
                        <Plus className="h-4 w-4" />
                        <span>Novo Controle</span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            {/* Diálogo para criar novo controle */}
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Novo Controle Financeiro</DialogTitle>
                        <DialogDescription>Crie um novo controle para organizar suas finanças</DialogDescription>
                    </DialogHeader>

                    {formError && (
                        <Alert variant="destructive">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>{formError}</AlertDescription>
                        </Alert>
                    )}

                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="name">Nome</Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) => handleFormChange("name", e.target.value)}
                                placeholder="Ex: Finanças Pessoais"
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="description">Descrição (opcional)</Label>
                            <Textarea
                                id="description"
                                value={formData.description}
                                onChange={(e) => handleFormChange("description", e.target.value)}
                                placeholder="Ex: Controle de gastos pessoais"
                                rows={3}
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="color">Cor</Label>
                            <div className="flex items-center gap-2">
                                <Input
                                    id="color"
                                    type="color"
                                    value={formData.color}
                                    onChange={(e) => handleFormChange("color", e.target.value)}
                                    className="w-12 h-8 p-1"
                                />
                                <span className="text-sm text-muted-foreground">Escolha uma cor para identificar este controle</span>
                            </div>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                            Cancelar
                        </Button>
                        <Button onClick={handleCreateControl}>Criar Controle</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Diálogo para editar controle */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Editar Controle</DialogTitle>
                        <DialogDescription>Modifique as informações do controle selecionado</DialogDescription>
                    </DialogHeader>

                    {formError && (
                        <Alert variant="destructive">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>{formError}</AlertDescription>
                        </Alert>
                    )}

                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="edit-name">Nome</Label>
                            <Input id="edit-name" value={formData.name} onChange={(e) => handleFormChange("name", e.target.value)} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="edit-description">Descrição (opcional)</Label>
                            <Textarea
                                id="edit-description"
                                value={formData.description}
                                onChange={(e) => handleFormChange("description", e.target.value)}
                                rows={3}
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="edit-color">Cor</Label>
                            <div className="flex items-center gap-2">
                                <Input
                                    id="edit-color"
                                    type="color"
                                    value={formData.color}
                                    onChange={(e) => handleFormChange("color", e.target.value)}
                                    className="w-12 h-8 p-1"
                                />
                                <span className="text-sm text-muted-foreground">Escolha uma cor para identificar este controle</span>
                            </div>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                            Cancelar
                        </Button>
                        <Button onClick={handleUpdateControl}>Salvar Alterações</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Diálogo para confirmar exclusão */}
            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Excluir Controle</DialogTitle>
                        <DialogDescription>
                            Tem certeza que deseja excluir este controle? Esta ação não pode ser desfeita.
                        </DialogDescription>
                    </DialogHeader>

                    {formError && (
                        <Alert variant="destructive">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>{formError}</AlertDescription>
                        </Alert>
                    )}

                    <div className="py-4">
                        <p className="text-sm text-muted-foreground">
                            Ao excluir o controle <strong>{selectedControl?.name}</strong>, todas as transações associadas a ele serão
                            removidas permanentemente.
                        </p>
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                            Cancelar
                        </Button>
                        <Button variant="destructive" onClick={handleDeleteControl}>
                            Excluir Controle
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}

