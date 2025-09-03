import { Transaction, Category, Budget } from '../types';

// Dados de exemplo para demonstração
export const sampleTransactions: Omit<Transaction, 'id' | 'createdAt'>[] = [
  {
    type: 'income',
    amount: 5000,
    category: 'Salário',
    paymentMethod: 'Transferência',
    date: new Date(2024, 0, 5),
    description: 'Salário mensal',
  },
  {
    type: 'income',
    amount: 800,
    category: 'Freelance',
    paymentMethod: 'PIX',
    date: new Date(2024, 0, 12),
    description: 'Projeto de design',
  },
  {
    type: 'expense',
    amount: 120,
    category: 'Alimentação',
    paymentMethod: 'Cartão de Crédito',
    date: new Date(2024, 0, 8),
    description: 'Supermercado',
  },
  {
    type: 'expense',
    amount: 45,
    category: 'Alimentação',
    paymentMethod: 'Cartão de Débito',
    date: new Date(2024, 0, 10),
    description: 'Almoço no restaurante',
  },
  {
    type: 'expense',
    amount: 80,
    category: 'Transporte',
    paymentMethod: 'Cartão de Crédito',
    date: new Date(2024, 0, 15),
    description: 'Combustível',
  },
  {
    type: 'expense',
    amount: 150,
    category: 'Lazer',
    paymentMethod: 'Dinheiro',
    date: new Date(2024, 0, 18),
    description: 'Cinema e jantar',
  },
  {
    type: 'expense',
    amount: 200,
    category: 'Saúde',
    paymentMethod: 'Cartão de Débito',
    date: new Date(2024, 0, 20),
    description: 'Consulta médica',
  },
  {
    type: 'expense',
    amount: 300,
    category: 'Educação',
    paymentMethod: 'PIX',
    date: new Date(2024, 0, 22),
    description: 'Curso online',
  },
  {
    type: 'expense',
    amount: 1800,
    category: 'Moradia',
    paymentMethod: 'Transferência',
    date: new Date(2024, 0, 25),
    description: 'Aluguel',
  },
  {
    type: 'income',
    amount: 1200,
    category: 'Investimentos',
    paymentMethod: 'Transferência',
    date: new Date(2024, 0, 28),
    description: 'Dividendos',
  },
];

export const sampleBudgets: Omit<Budget, 'id'>[] = [
  {
    categoryId: '1', // Alimentação
    amount: 500,
    period: 'monthly',
    startDate: new Date(2024, 0, 1),
  },
  {
    categoryId: '2', // Transporte
    amount: 300,
    period: 'monthly',
    startDate: new Date(2024, 0, 1),
  },
  {
    categoryId: '3', // Lazer
    amount: 400,
    period: 'monthly',
    startDate: new Date(2024, 0, 1),
  },
  {
    categoryId: '4', // Saúde
    amount: 200,
    period: 'monthly',
    startDate: new Date(2024, 0, 1),
  },
];

// Função para popular dados de exemplo
export const populateSampleData = (addTransaction: Function, setBudget: Function) => {
  // Adicionar transações de exemplo
  sampleTransactions.forEach(transaction => {
    addTransaction(transaction);
  });

  // Adicionar orçamentos de exemplo
  sampleBudgets.forEach(budget => {
    setBudget(budget);
  });
};

