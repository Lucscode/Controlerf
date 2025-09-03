import { Transaction, Category, Budget, PaymentMethod } from '../types';

export interface ExportData {
  transactions: Transaction[];
  categories: Category[];
  budgets: Budget[];
  paymentMethods: PaymentMethod[];
  exportDate: string;
  version: string;
}

export interface ExportOptions {
  format: 'json' | 'csv' | 'excel';
  period?: 'all' | '1m' | '3m' | '6m' | '1y';
  includeCategories?: boolean;
  includeBudgets?: boolean;
  includePaymentMethods?: boolean;
}

/**
 * Exporta dados para JSON
 */
export const exportToJSON = (data: ExportData, filename?: string): void => {
  const blob = new Blob([JSON.stringify(data, null, 2)], { 
    type: 'application/json' 
  });
  downloadFile(blob, filename || `controlerf-backup-${new Date().toISOString().split('T')[0]}.json`);
};

/**
 * Exporta transações para CSV
 */
export const exportToCSV = (
  transactions: Transaction[], 
  filename?: string,
  period?: string
): void => {
  const headers = [
    'Data',
    'Tipo',
    'Categoria',
    'Valor',
    'Forma de Pagamento',
    'Descrição',
    'Data de Criação'
  ];

  const rows = transactions.map(t => [
    new Date(t.date).toLocaleDateString('pt-BR'),
    t.type === 'income' ? 'Receita' : 'Despesa',
    t.category,
    t.amount.toLocaleString('pt-BR', { 
      style: 'currency', 
      currency: 'BRL' 
    }),
    t.paymentMethod,
    t.description || '',
    new Date(t.createdAt).toLocaleDateString('pt-BR')
  ]);

  const csvContent = [headers, ...rows]
    .map(row => row.map(cell => `"${cell}"`).join(','))
    .join('\n');

  const blob = new Blob(['\ufeff' + csvContent], { 
    type: 'text/csv;charset=utf-8;' 
  });
  
  const periodSuffix = period ? `-${period}` : '';
  downloadFile(blob, filename || `controlerf-transacoes${periodSuffix}-${new Date().toISOString().split('T')[0]}.csv`);
};

/**
 * Exporta dados para Excel (formato XLSX usando uma biblioteca externa)
 * Nota: Para implementação completa, seria necessário instalar uma biblioteca como 'xlsx'
 */
export const exportToExcel = (
  data: ExportData,
  filename?: string,
  period?: string
): void => {
  // Por enquanto, vamos exportar como CSV com extensão .xls
  // Para implementação completa com XLSX, seria necessário:
  // npm install xlsx
  
  const transactions = data.transactions;
  const headers = [
    'Data',
    'Tipo',
    'Categoria',
    'Valor',
    'Forma de Pagamento',
    'Descrição',
    'Data de Criação'
  ];

  const rows = transactions.map(t => [
    new Date(t.date).toLocaleDateString('pt-BR'),
    t.type === 'income' ? 'Receita' : 'Despesa',
    t.category,
    t.amount,
    t.paymentMethod,
    t.description || '',
    new Date(t.createdAt).toLocaleDateString('pt-BR')
  ]);

  const csvContent = [headers, ...rows]
    .map(row => row.map(cell => `"${cell}"`).join('\t'))
    .join('\n');

  const blob = new Blob(['\ufeff' + csvContent], { 
    type: 'application/vnd.ms-excel' 
  });
  
  const periodSuffix = period ? `-${period}` : '';
  downloadFile(blob, filename || `controlerf-relatorio${periodSuffix}-${new Date().toISOString().split('T')[0]}.xls`);
};

/**
 * Filtra transações por período
 */
export const filterTransactionsByPeriod = (
  transactions: Transaction[], 
  period: '1m' | '3m' | '6m' | '1y'
): Transaction[] => {
  const now = new Date();
  const periods = {
    '1m': 30,
    '3m': 90,
    '6m': 180,
    '1y': 365
  };

  const daysAgo = periods[period];
  const cutoffDate = new Date(now.getTime() - (daysAgo * 24 * 60 * 60 * 1000));

  return transactions.filter(t => new Date(t.date) >= cutoffDate);
};

/**
 * Gera relatório resumido
 */
export const generateSummaryReport = (
  transactions: Transaction[],
  categories: Category[],
  budgets: Budget[]
): string => {
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpenses;

  const expensesByCategory = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {} as Record<string, number>);

  let report = `RELATÓRIO FINANCEIRO - ${new Date().toLocaleDateString('pt-BR')}\n`;
  report += '='.repeat(50) + '\n\n';
  report += `Total de Receitas: ${totalIncome.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}\n`;
  report += `Total de Despesas: ${totalExpenses.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}\n`;
  report += `Saldo: ${balance.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}\n\n`;
  
  report += 'GASTOS POR CATEGORIA:\n';
  report += '-'.repeat(30) + '\n';
  
  Object.entries(expensesByCategory)
    .sort(([,a], [,b]) => b - a)
    .forEach(([category, amount]) => {
      report += `${category}: ${amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}\n`;
    });

  return report;
};

/**
 * Função auxiliar para download de arquivos
 */
const downloadFile = (blob: Blob, filename: string): void => {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

/**
 * Exporta dados completos da aplicação
 */
export const exportAllData = (
  data: ExportData,
  options: ExportOptions = { format: 'json' }
): void => {
  switch (options.format) {
    case 'json':
      exportToJSON(data);
      break;
    case 'csv':
      exportToCSV(data.transactions, undefined, options.period);
      break;
    case 'excel':
      exportToExcel(data, undefined, options.period);
      break;
    default:
      exportToJSON(data);
  }
};

