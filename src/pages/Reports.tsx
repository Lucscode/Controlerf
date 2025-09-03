import React, { useState, useMemo } from 'react';
import { TrendingUp, TrendingDown, BarChart3, Target, Download, FileText, FileSpreadsheet } from 'lucide-react';
import { useFinance } from '../contexts/FinanceContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { exportToCSV, exportToExcel, filterTransactionsByPeriod, generateSummaryReport } from '../utils/exportUtils';

const Reports: React.FC = () => {
  const { state } = useFinance();
  const [selectedPeriod, setSelectedPeriod] = useState<'1m' | '3m' | '6m' | '1y'>('1m');
  const [selectedChart, setSelectedChart] = useState<'bar' | 'pie' | 'line'>('bar');
  const [showExportOptions, setShowExportOptions] = useState(false);

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  };

  // Filtrar transações por período
  const periodTransactions = useMemo(() => {
    return filterTransactionsByPeriod(state.transactions, selectedPeriod);
  }, [state.transactions, selectedPeriod]);

  // Calcular totais
  const totalIncome = periodTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = periodTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalBalance = totalIncome - totalExpenses;
  const averageDailyExpense = totalExpenses / Math.max(1, periodTransactions.length);

  // Dados para gráficos
  const chartData = useMemo(() => {
    if (selectedChart === 'pie') {
      // Gráfico de pizza - gastos por categoria
      return periodTransactions
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
        .slice(0, 8);
    } else {
      // Gráfico de barras/linha - receitas vs despesas por mês
      const months = Array.from({ length: 12 }, (_, i) => {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        return date;
      }).reverse();

      return months.map(date => {
        const monthTransactions = periodTransactions.filter(t => {
          const transactionDate = new Date(t.date);
          return transactionDate.getMonth() === date.getMonth() && 
                 transactionDate.getFullYear() === date.getFullYear();
        });

        const income = monthTransactions
          .filter(t => t.type === 'income')
          .reduce((sum, t) => sum + t.amount, 0);

        const expenses = monthTransactions
          .filter(t => t.type === 'expense')
          .reduce((sum, t) => sum + t.amount, 0);

        return {
          month: format(date, 'MMM', { locale: ptBR }),
          income,
          expenses,
          balance: income - expenses,
        };
      });
    }
  }, [periodTransactions, selectedChart]);

  const COLORS = ['#ef4444', '#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#6366f1', '#ec4899', '#06b6d4'];

  const handleExport = (format: 'csv' | 'excel') => {
    const exportData = {
      transactions: periodTransactions,
      categories: state.categories,
      budgets: state.budgets,
      paymentMethods: state.paymentMethods,
      exportDate: new Date().toISOString(),
      version: '1.0.0',
    };

    if (format === 'csv') {
      exportToCSV(periodTransactions, undefined, selectedPeriod);
    } else {
      exportToExcel(exportData, undefined, selectedPeriod);
    }

    setShowExportOptions(false);
  };

  const handleExportSummary = () => {
    const summary = generateSummaryReport(periodTransactions, state.categories, state.budgets);
    const blob = new Blob([summary], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `controlerf-resumo-${selectedPeriod}-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setShowExportOptions(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Relatórios</h1>
          <p className="text-gray-600">Análises detalhadas das suas finanças</p>
        </div>
        
        {/* Botão de exportação com dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowExportOptions(!showExportOptions)}
            className="btn-secondary flex items-center gap-2"
          >
            <Download className="h-5 w-5" />
            Exportar
          </button>
          
          {/* Dropdown de opções de exportação */}
          {showExportOptions && (
            <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
              <div className="py-2">
                <button
                  onClick={() => handleExport('csv')}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                >
                  <FileText className="h-4 w-4" />
                  Exportar CSV
                </button>
                <button
                  onClick={() => handleExport('excel')}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                >
                  <FileSpreadsheet className="h-4 w-4" />
                  Exportar Excel
                </button>
                <button
                  onClick={handleExportSummary}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                >
                  <FileText className="h-4 w-4" />
                  Relatório Resumido (TXT)
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Filtros */}
      <div className="card">
        <div className="flex flex-col sm:flex-row gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Período
            </label>
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value as '1m' | '3m' | '6m' | '1y')}
              className="input-field"
            >
              <option value="1m">Último mês</option>
              <option value="3m">Últimos 3 meses</option>
              <option value="6m">Últimos 6 meses</option>
              <option value="1y">Último ano</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tipo de Gráfico
            </label>
            <select
              value={selectedChart}
              onChange={(e) => setSelectedChart(e.target.value as 'bar' | 'pie' | 'line')}
              className="input-field"
            >
              <option value="bar">Barras</option>
              <option value="pie">Pizza</option>
              <option value="line">Linha</option>
            </select>
          </div>
        </div>
      </div>

      {/* Estatísticas gerais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center">
            <div className="p-2 bg-success-100 rounded-lg">
              <TrendingUp className="h-6 w-6 text-success-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total de Receitas</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(totalIncome)}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-2 bg-danger-100 rounded-lg">
              <TrendingDown className="h-6 w-6 text-danger-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total de Despesas</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(totalExpenses)}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className={`p-2 rounded-lg ${
              totalBalance >= 0 ? 'bg-success-100' : 'bg-danger-100'
            }`}>
              <BarChart3 className={`h-6 w-6 ${
                totalBalance >= 0 ? 'text-success-600' : 'text-danger-600'
              }`} />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Saldo Total</p>
              <p className={`text-2xl font-bold ${
                totalBalance >= 0 ? 'text-success-600' : 'text-danger-600'
              }`}>
                {formatCurrency(totalBalance)}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-2 bg-warning-100 rounded-lg">
              <Target className="h-6 w-6 text-warning-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Gasto Médio Diário</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(averageDailyExpense)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Gráficos */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          {selectedChart === 'pie' ? 'Gastos por Categoria' : 'Receitas vs Despesas por Mês'}
        </h3>
        
        <div className="w-full h-96">
          <ResponsiveContainer width="100%" height="100%">
            {selectedChart === 'pie' ? (
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={120}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: number) => formatCurrency(value)}
                  labelStyle={{ color: '#374151' }}
                />
              </PieChart>
            ) : selectedChart === 'bar' ? (
              <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip 
                  formatter={(value: number) => formatCurrency(value)}
                  labelStyle={{ color: '#374151' }}
                />
                <Bar dataKey="income" fill="#10b981" name="Receitas" />
                <Bar dataKey="expenses" fill="#ef4444" name="Despesas" />
              </BarChart>
            ) : (
              <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip 
                  formatter={(value: number) => formatCurrency(value)}
                  labelStyle={{ color: '#374151' }}
                />
                <Line type="monotone" dataKey="income" stroke="#10b981" name="Receitas" strokeWidth={2} />
                <Line type="monotone" dataKey="expenses" stroke="#ef4444" name="Despesas" strokeWidth={2} />
                <Line type="monotone" dataKey="balance" stroke="#3b82f6" name="Saldo" strokeWidth={2} />
              </LineChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>

      {/* Resumo das transações */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Resumo das Transações ({periodTransactions.length})
        </h3>
        
        {periodTransactions.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Data
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tipo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Categoria
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Valor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Forma de Pagamento
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {periodTransactions
                  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                  .slice(0, 10)
                  .map((transaction) => (
                    <tr key={transaction.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {format(new Date(transaction.date), 'dd/MM/yyyy', { locale: ptBR })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          transaction.type === 'income' 
                            ? 'bg-success-100 text-success-800' 
                            : 'bg-danger-100 text-danger-800'
                        }`}>
                          {transaction.type === 'income' ? 'Receita' : 'Despesa'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {transaction.category}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                        {transaction.type === 'income' ? '+' : '-'} {formatCurrency(transaction.amount)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {transaction.paymentMethod}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
            
            {periodTransactions.length > 10 && (
              <div className="mt-4 text-center text-sm text-gray-500">
                Mostrando as 10 transações mais recentes de {periodTransactions.length} total
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p>Nenhuma transação encontrada para o período selecionado</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Reports;
