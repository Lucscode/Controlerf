import React, { useState, useMemo } from 'react';
import { Plus, Search, Edit, Trash2 } from 'lucide-react';
import { useFinance } from '../contexts/FinanceContext';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import AddTransactionModal from '../components/AddTransactionModal';
import ExportButton from '../components/ExportButton';

const Transactions: React.FC = () => {
  const { state, deleteTransaction } = useFinance();
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'income' | 'expense'>('all');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  };

  // Filtrar transações
  const filteredTransactions = useMemo(() => {
    return state.transactions.filter(transaction => {
      const matchesSearch = !searchTerm || 
        transaction.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (transaction.description && transaction.description.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesType = typeFilter === 'all' || transaction.type === typeFilter;
      
      const matchesCategory = !categoryFilter || transaction.category === categoryFilter;
      
      const matchesDate = !dateFilter || format(new Date(transaction.date), 'yyyy-MM-dd') === dateFilter;
      
      return matchesSearch && matchesType && matchesCategory && matchesDate;
    }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [state.transactions, searchTerm, typeFilter, categoryFilter, dateFilter]);

  const handleDelete = (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta transação?')) {
      deleteTransaction(id);
    }
  };

  const totalIncome = filteredTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = filteredTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const uniqueCategories = [...new Set(state.transactions.map(t => t.category))];

  // Preparar dados para exportação
  const exportData = {
    transactions: filteredTransactions,
    categories: state.categories,
    budgets: state.budgets,
    paymentMethods: state.paymentMethods,
    exportDate: new Date().toISOString(),
    version: '1.0.0',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Transações</h1>
          <p className="text-gray-600">Gerencie todas as suas transações financeiras</p>
        </div>
        <div className="flex items-center gap-3">
          <ExportButton 
            data={exportData}
            variant="secondary"
            size="md"
            showLabel={true}
          />
          <button
            onClick={() => setShowAddModal(true)}
            className="btn-primary flex items-center gap-2"
          >
            <Plus className="h-5 w-5" />
            Nova Transação
          </button>
        </div>
      </div>

      {/* Filtros */}
      <div className="card">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Busca */}
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Buscar
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por categoria ou descrição..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-10"
              />
            </div>
          </div>

          {/* Filtro de tipo */}
          <div className="lg:w-48">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tipo
            </label>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as 'all' | 'income' | 'expense')}
              className="input-field"
            >
              <option value="all">Todos</option>
              <option value="income">Receitas</option>
              <option value="expense">Despesas</option>
            </select>
          </div>

          {/* Filtro de categoria */}
          <div className="lg:w-48">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Categoria
            </label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="input-field"
            >
              <option value="">Todas</option>
              {uniqueCategories.map((category) => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          {/* Filtro de data */}
          <div className="lg:w-48">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Data
            </label>
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="input-field"
            />
          </div>
        </div>
      </div>

      {/* Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card text-center">
          <p className="text-sm font-medium text-gray-600 mb-1">Total de Transações</p>
          <p className="text-3xl font-bold text-gray-900">{filteredTransactions.length}</p>
        </div>
        <div className="card text-center">
          <p className="text-sm font-medium text-gray-600 mb-1">Total de Receitas</p>
          <p className="text-2xl font-bold text-success-600">{formatCurrency(totalIncome)}</p>
        </div>
        <div className="card text-center">
          <p className="text-sm font-medium text-gray-600 mb-1">Total de Despesas</p>
          <p className="text-2xl font-bold text-danger-600">{formatCurrency(totalExpenses)}</p>
        </div>
      </div>

      {/* Lista de transações */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Transações ({filteredTransactions.length})
        </h3>
        
        {filteredTransactions.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Transação
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Categoria
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Forma de Pagamento
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Data
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Valor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredTransactions.map((transaction) => (
                  <tr key={transaction.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className={`p-2 rounded-full ${
                          transaction.type === 'income' ? 'bg-success-100' : 'bg-danger-100'
                        }`}>
                          <span className="text-lg">
                            {transaction.type === 'income' ? '💰' : '💸'}
                          </span>
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-900">
                            {transaction.type === 'income' ? 'Receita' : 'Despesa'}
                          </p>
                          {transaction.description && (
                            <p className="text-sm text-gray-500">{transaction.description}</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">{transaction.category}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">{transaction.paymentMethod}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">
                        {format(new Date(transaction.date), 'dd/MM/yyyy', { locale: ptBR })}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`text-sm font-semibold ${
                        transaction.type === 'income' ? 'text-success-600' : 'text-danger-600'
                      }`}>
                        {transaction.type === 'income' ? '+' : '-'} {formatCurrency(transaction.amount)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {/* TODO: Implementar edição */}}
                          className="text-primary-600 hover:text-primary-900 p-1 rounded"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(transaction.id)}
                          className="text-danger-600 hover:text-danger-900 p-1 rounded"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma transação encontrada</h3>
            <p className="text-gray-500 mb-4">
              {searchTerm || typeFilter !== 'all' || categoryFilter || dateFilter
                ? 'Tente ajustar os filtros de busca.'
                : 'Comece adicionando sua primeira transação!'
              }
            </p>
            {!searchTerm && typeFilter === 'all' && !categoryFilter && !dateFilter && (
              <button
                onClick={() => setShowAddModal(true)}
                className="btn-primary"
              >
                Adicionar Transação
              </button>
            )}
          </div>
        )}
      </div>

      {/* Modal de adicionar transação */}
      <AddTransactionModal 
        isOpen={showAddModal} 
        onClose={() => setShowAddModal(false)} 
      />
    </div>
  );
};

export default Transactions;
