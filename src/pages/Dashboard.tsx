import React from 'react';
import { TrendingUp, TrendingDown, Target, AlertTriangle } from 'lucide-react';
import { useFinance } from '../contexts/FinanceContext';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const Dashboard: React.FC = () => {
  const { state, populateSampleData } = useFinance();
  const { summary } = state;

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'under': return 'text-success-600';
      case 'warning': return 'text-warning-600';
      case 'over': return 'text-danger-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'under': return '✅';
      case 'warning': return '⚠️';
      case 'over': return '🚨';
      default: return 'ℹ️';
    }
  };

  // Dados para o gráfico de pizza das categorias
  const pieChartData = state.transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, transaction) => {
      const existing = acc.find(item => item.name === transaction.category);
      if (existing) {
        existing.value += transaction.amount;
      } else {
        acc.push({ name: transaction.category, value: transaction.amount });
      }
      return acc;
    }, [] as { name: string; value: number }[])
    .sort((a, b) => b.value - a.value)
    .slice(0, 6);

  // Dados para o gráfico de barras dos últimos 7 dias
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    return date;
  }).reverse();

  const barChartData = last7Days.map(date => {
    const dayTransactions = state.transactions.filter(t => {
      const transactionDate = new Date(t.date);
      return transactionDate.toDateString() === date.toDateString();
    });

    const income = dayTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const expenses = dayTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    return {
      date: format(date, 'dd/MM', { locale: ptBR }),
      income,
      expenses,
    };
  });

  const COLORS = ['#ef4444', '#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#6366f1'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">
            Visão geral das suas finanças em {format(new Date(), 'MMMM yyyy', { locale: ptBR })}
          </p>
        </div>
        {state.transactions.length === 0 && (
          <button
            onClick={populateSampleData}
            className="btn-secondary"
          >
            Carregar Dados de Exemplo
          </button>
        )}
      </div>

      {/* Cards de resumo */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        <div className="card">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="p-3 bg-success-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-success-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Saldo Atual</p>
                <p className="text-xl lg:text-2xl font-bold text-gray-900 truncate">
                  {formatCurrency(summary.currentBalance)}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="p-3 bg-primary-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-primary-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Entradas do Mês</p>
                <p className="text-xl lg:text-2xl font-bold text-gray-900 truncate">
                  {formatCurrency(summary.monthlyIncome)}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="p-3 bg-danger-100 rounded-lg">
                <TrendingDown className="h-6 w-6 text-danger-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Saídas do Mês</p>
                <p className="text-xl lg:text-2xl font-bold text-gray-900 truncate">
                  {formatCurrency(summary.monthlyExpenses)}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="p-3 bg-warning-100 rounded-lg">
                <Target className="h-6 w-6 text-warning-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Economias</p>
                <p className="text-xl lg:text-2xl font-bold text-gray-900 truncate">
                  {formatCurrency(summary.monthlySavings)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Gráfico de pizza - Categorias de gastos */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Gastos por Categoria
          </h3>
          {pieChartData.length > 0 ? (
            <div className="w-full h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: number) => formatCurrency(value)}
                    labelStyle={{ color: '#374151' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="flex items-center justify-center h-64 text-gray-500">
              <p>Nenhuma transação encontrada</p>
            </div>
          )}
        </div>

        {/* Gráfico de barras - Últimos 7 dias */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Últimos 7 Dias
          </h3>
          <div className="w-full h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barChartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip 
                  formatter={(value: number) => formatCurrency(value)}
                  labelStyle={{ color: '#374151' }}
                />
                <Bar dataKey="income" fill="#10b981" name="Entradas" />
                <Bar dataKey="expenses" fill="#ef4444" name="Saídas" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Progresso do orçamento */}
      {summary.budgetProgress.length > 0 && (
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Progresso do Orçamento
          </h3>
          <div className="space-y-4">
            {summary.budgetProgress.map((budget) => (
              <div key={budget.categoryId} className="border-b border-gray-200 pb-4 last:border-b-0">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{getStatusIcon(budget.status)}</span>
                    <span className="font-medium text-gray-900 truncate">{budget.categoryName}</span>
                  </div>
                  <div className={`text-sm font-medium ${getStatusColor(budget.status)}`}>
                    {budget.percentage.toFixed(1)}%
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-sm text-gray-600 mb-3 gap-2">
                  <span className="truncate">Gasto: {formatCurrency(budget.spent)}</span>
                  <span className="truncate">Restante: {formatCurrency(budget.remaining)}</span>
                </div>
                
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${
                      budget.status === 'over' 
                        ? 'bg-danger-500' 
                        : budget.status === 'warning' 
                        ? 'bg-warning-500' 
                        : 'bg-success-500'
                    }`}
                    style={{ width: `${Math.min(budget.percentage, 100)}%` }}
                  />
                </div>
                
                {budget.status === 'warning' && (
                  <div className="flex items-center gap-2 mt-3 text-warning-600 text-sm">
                    <AlertTriangle className="h-4 w-4 flex-shrink-0" />
                    <span className="truncate">Você está próximo do limite do orçamento!</span>
                  </div>
                )}
                
                {budget.status === 'over' && (
                  <div className="flex items-center gap-2 mt-3 text-danger-600 text-sm">
                    <AlertTriangle className="h-4 w-4 flex-shrink-0" />
                    <span className="truncate">Você ultrapassou o orçamento!</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Transações recentes */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Transações Recentes
        </h3>
        {state.transactions.length > 0 ? (
          <div className="space-y-3">
            {state.transactions
              .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
              .slice(0, 5)
              .map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className={`p-2 rounded-full flex-shrink-0 ${
                      transaction.type === 'income' ? 'bg-success-100' : 'bg-danger-100'
                    }`}>
                      <span className="text-lg">
                        {transaction.type === 'income' ? '💰' : '💸'}
                      </span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-gray-900 truncate">{transaction.category}</p>
                      <p className="text-sm text-gray-600">
                        {format(new Date(transaction.date), 'dd/MM/yyyy', { locale: ptBR })}
                      </p>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0 ml-4">
                    <p className={`font-semibold ${
                      transaction.type === 'income' ? 'text-success-600' : 'text-danger-600'
                    }`}>
                      {transaction.type === 'income' ? '+' : '-'} {formatCurrency(transaction.amount)}
                    </p>
                    <p className="text-sm text-gray-600 truncate">{transaction.paymentMethod}</p>
                  </div>
                </div>
              ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p>Nenhuma transação encontrada</p>
            <p className="text-sm">Comece adicionando sua primeira transação!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
