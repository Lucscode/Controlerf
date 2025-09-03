import React, { useState } from 'react';
import { Plus, Edit, Trash2, Target, AlertTriangle, TrendingUp } from 'lucide-react';
import { useFinance } from '../contexts/FinanceContext';
import { Budget, Category } from '../types';

const Budgets: React.FC = () => {
  const { state, setBudget, deleteCategory } = useFinance();
  const [showModal, setShowModal] = useState(false);
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null);
  const [formData, setFormData] = useState({
    categoryId: '',
    amount: '',
    period: 'monthly' as 'monthly' | 'yearly',
  });

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  };

  const getCategoryById = (id: string) => {
    return state.categories.find(c => c.id === id);
  };

  const getBudgetProgress = (categoryId: string) => {
    const budget = state.budgets.find(b => b.categoryId === categoryId);
    if (!budget) return null;

    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const monthlyTransactions = state.transactions.filter(t => {
      const transactionDate = new Date(t.date);
      return transactionDate.getMonth() === currentMonth && 
             transactionDate.getFullYear() === currentYear &&
             t.category === getCategoryById(categoryId)?.name &&
             t.type === 'expense';
    });

    const spent = monthlyTransactions.reduce((sum, t) => sum + t.amount, 0);
    const remaining = budget.amount - spent;
    const percentage = (spent / budget.amount) * 100;

    let status: 'under' | 'warning' | 'over' = 'under';
    if (percentage >= 100) status = 'over';
    else if (percentage >= 80) status = 'warning';

    return {
      spent,
      remaining,
      percentage,
      status,
    };
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.categoryId || !formData.amount) {
      alert('Por favor, preencha todos os campos obrigatórios');
      return;
    }

    const budget: Omit<Budget, 'id'> = {
      categoryId: formData.categoryId,
      amount: parseFloat(formData.amount),
      period: formData.period,
      startDate: new Date(),
    };

    setBudget(budget);
    setShowModal(false);
    resetForm();
  };

  const handleEdit = (budget: Budget) => {
    setEditingBudget(budget);
    setFormData({
      categoryId: budget.categoryId,
      amount: budget.amount.toString(),
      period: budget.period,
    });
    setShowModal(true);
  };

  const handleDelete = (categoryId: string) => {
    if (window.confirm('Tem certeza que deseja remover este orçamento?')) {
      // Remover o orçamento (implementar no contexto)
      const budget = state.budgets.find(b => b.categoryId === categoryId);
      if (budget) {
        // TODO: Implementar remoção de orçamento
      }
    }
  };

  const resetForm = () => {
    setFormData({
      categoryId: '',
      amount: '',
      period: 'monthly',
    });
    setEditingBudget(null);
  };

  const handleClose = () => {
    setShowModal(false);
    resetForm();
  };

  const expenseCategories = state.categories.filter(c => c.type === 'expense');
  const categoriesWithBudget = expenseCategories.filter(c => 
    state.budgets.some(b => b.categoryId === c.id)
  );
  const categoriesWithoutBudget = expenseCategories.filter(c => 
    !state.budgets.some(b => b.categoryId === c.id)
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Orçamentos</h1>
          <p className="text-gray-600">Defina limites mensais para suas categorias de despesas</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="h-5 w-5" />
          Novo Orçamento
        </button>
      </div>

      {/* Orçamentos ativos */}
      {categoriesWithBudget.length > 0 && (
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Target className="h-5 w-5 text-primary-600" />
            Orçamentos Ativos
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categoriesWithBudget.map((category) => {
              const budget = state.budgets.find(b => b.categoryId === category.id);
              const progress = getBudgetProgress(category.id);
              
              if (!budget || !progress) return null;

              return (
                <div
                  key={category.id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-12 h-12 rounded-full flex items-center justify-center text-2xl"
                        style={{ backgroundColor: category.color + '20' }}
                      >
                        {category.icon}
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">{category.name}</h4>
                        <p className="text-sm text-gray-500">
                          {budget.period === 'monthly' ? 'Mensal' : 'Anual'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEdit(budget)}
                        className="text-primary-600 hover:text-primary-900 p-1 rounded"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(category.id)}
                        className="text-danger-600 hover:text-danger-900 p-1 rounded"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {/* Progresso do orçamento */}
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Gasto</span>
                      <span className="font-medium">{formatCurrency(progress.spent)}</span>
                    </div>
                    
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Restante</span>
                      <span className={`font-medium ${
                        progress.remaining < 0 ? 'text-danger-600' : 'text-success-600'
                      }`}>
                        {formatCurrency(Math.abs(progress.remaining))}
                      </span>
                    </div>

                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Total</span>
                      <span className="font-medium">{formatCurrency(budget.amount)}</span>
                    </div>

                    {/* Barra de progresso */}
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className={`h-3 rounded-full transition-all duration-300 ${
                          progress.status === 'over' 
                            ? 'bg-danger-500' 
                            : progress.status === 'warning' 
                            ? 'bg-warning-500' 
                            : 'bg-success-500'
                        }`}
                        style={{ width: `${Math.min(progress.percentage, 100)}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Progresso</span>
                      <span className={`text-sm font-medium ${
                        progress.status === 'over' 
                          ? 'text-danger-600' 
                          : progress.status === 'warning' 
                          ? 'text-warning-600' 
                          : 'text-success-600'
                      }`}>
                        {progress.percentage.toFixed(1)}%
                      </span>
                    </div>

                    {/* Alertas */}
                    {progress.status === 'warning' && (
                      <div className="flex items-center gap-2 text-warning-600 text-sm bg-warning-50 p-2 rounded">
                        <AlertTriangle className="h-4 w-4" />
                        <span>Próximo do limite!</span>
                      </div>
                    )}
                    
                    {progress.status === 'over' && (
                      <div className="flex items-center gap-2 text-danger-600 text-sm bg-danger-50 p-2 rounded">
                        <AlertTriangle className="h-4 w-4" />
                        <span>Orçamento excedido!</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Categorias sem orçamento */}
      {categoriesWithoutBudget.length > 0 && (
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-gray-600" />
            Categorias sem Orçamento
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categoriesWithoutBudget.map((category) => (
              <div
                key={category.id}
                className="border border-gray-200 rounded-lg p-4 bg-gray-50"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-xl"
                    style={{ backgroundColor: category.color + '20' }}
                  >
                    {category.icon}
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{category.name}</h4>
                    <p className="text-sm text-gray-500">Sem orçamento definido</p>
                  </div>
                </div>
                
                <button
                  onClick={() => {
                    setFormData(prev => ({ ...prev, categoryId: category.id }));
                    setShowModal(true);
                  }}
                  className="w-full btn-primary text-sm py-2"
                >
                  Definir Orçamento
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal de orçamento */}
      {showModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={handleClose} />
            
            <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
              <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {editingBudget ? 'Editar Orçamento' : 'Novo Orçamento'}
                  </h3>
                  <button
                    onClick={handleClose}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Categoria */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Categoria *
                    </label>
                    <select
                      value={formData.categoryId}
                      onChange={(e) => setFormData(prev => ({ ...prev, categoryId: e.target.value }))}
                      className="input-field"
                      required
                      disabled={!!editingBudget}
                    >
                      <option value="">Selecione uma categoria</option>
                      {expenseCategories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.icon} {category.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Valor */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Valor do Orçamento *
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.amount}
                      onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                      placeholder="0,00"
                      className="input-field"
                      required
                    />
                  </div>

                  {/* Período */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Período *
                    </label>
                    <select
                      value={formData.period}
                      onChange={(e) => setFormData(prev => ({ ...prev, period: e.target.value as 'monthly' | 'yearly' }))}
                      className="input-field"
                      required
                    >
                      <option value="monthly">Mensal</option>
                      <option value="yearly">Anual</option>
                    </select>
                  </div>

                  {/* Botões */}
                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={handleClose}
                      className="btn-secondary flex-1"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="btn-primary flex-1"
                    >
                      {editingBudget ? 'Atualizar' : 'Criar'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Budgets;

