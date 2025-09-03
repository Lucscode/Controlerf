import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { Transaction, Category, Budget, PaymentMethod, FinancialSummary, Notification } from '../types';
import { populateSampleData } from '../data/sampleData';

interface FinanceState {
  transactions: Transaction[];
  categories: Category[];
  budgets: Budget[];
  paymentMethods: PaymentMethod[];
  notifications: Notification[];
  summary: FinancialSummary;
  isLoading: boolean;
}

type FinanceAction =
  | { type: 'ADD_TRANSACTION'; payload: Transaction }
  | { type: 'UPDATE_TRANSACTION'; payload: Transaction }
  | { type: 'DELETE_TRANSACTION'; payload: string }
  | { type: 'ADD_CATEGORY'; payload: Category }
  | { type: 'UPDATE_CATEGORY'; payload: Category }
  | { type: 'DELETE_CATEGORY'; payload: string }
  | { type: 'SET_BUDGET'; payload: Budget }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'LOAD_DATA'; payload: Partial<FinanceState> };

const initialState: FinanceState = {
  transactions: [],
  categories: [
    // Categorias padrão para despesas
    { id: '1', name: 'Alimentação', color: '#ef4444', icon: '🍽️', type: 'expense' },
    { id: '2', name: 'Transporte', color: '#3b82f6', icon: '🚗', type: 'expense' },
    { id: '3', name: 'Lazer', color: '#8b5cf6', icon: '🎮', type: 'expense' },
    { id: '4', name: 'Saúde', color: '#10b981', icon: '🏥', type: 'expense' },
    { id: '5', name: 'Educação', color: '#f59e0b', icon: '📚', type: 'expense' },
    { id: '6', name: 'Moradia', color: '#6366f1', icon: '🏠', type: 'expense' },
    // Categorias padrão para receitas
    { id: '7', name: 'Salário', color: '#22c55e', icon: '💰', type: 'income' },
    { id: '8', name: 'Freelance', color: '#06b6d4', icon: '💼', type: 'income' },
    { id: '9', name: 'Investimentos', color: '#84cc16', icon: '📈', type: 'income' },
  ],
  budgets: [],
  paymentMethods: [
    { id: '1', name: 'Dinheiro', type: 'cash', icon: '💵' },
    { id: '2', name: 'Cartão de Crédito', type: 'card', icon: '💳' },
    { id: '3', name: 'Cartão de Débito', type: 'card', icon: '💳' },
    { id: '4', name: 'PIX', type: 'pix', icon: '📱' },
    { id: '5', name: 'Transferência', type: 'transfer', icon: '🏦' },
    { id: '6', name: 'Boleto', type: 'boleto', icon: '📄' },
  ],
  notifications: [],
  summary: {
    currentBalance: 0,
    monthlyIncome: 0,
    monthlyExpenses: 0,
    monthlySavings: 0,
    budgetProgress: [],
  },
  isLoading: false,
};

function financeReducer(state: FinanceState, action: FinanceAction): FinanceState {
  switch (action.type) {
    case 'ADD_TRANSACTION':
      return {
        ...state,
        transactions: [...state.transactions, action.payload],
      };
    case 'UPDATE_TRANSACTION':
      return {
        ...state,
        transactions: state.transactions.map(t => 
          t.id === action.payload.id ? action.payload : t
        ),
      };
    case 'DELETE_TRANSACTION':
      return {
        ...state,
        transactions: state.transactions.filter(t => t.id !== action.payload),
      };
    case 'ADD_CATEGORY':
      return {
        ...state,
        categories: [...state.categories, action.payload],
      };
    case 'UPDATE_CATEGORY':
      return {
        ...state,
        categories: state.categories.map(c => 
          c.id === action.payload.id ? action.payload : c
        ),
      };
    case 'DELETE_CATEGORY':
      return {
        ...state,
        categories: state.categories.filter(c => c.id !== action.payload),
      };
    case 'SET_BUDGET':
      return {
        ...state,
        budgets: state.budgets.filter(b => b.categoryId !== action.payload.categoryId),
        budgets: [...state.budgets.filter(b => b.categoryId !== action.payload.categoryId), action.payload],
      };
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };
    case 'LOAD_DATA':
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
}

interface FinanceContextType {
  state: FinanceState;
  dispatch: React.Dispatch<FinanceAction>;
  addTransaction: (transaction: Omit<Transaction, 'id' | 'createdAt'>) => void;
  updateTransaction: (transaction: Transaction) => void;
  deleteTransaction: (id: string) => void;
  addCategory: (category: Omit<Category, 'id'>) => void;
  updateCategory: (category: Category) => void;
  deleteCategory: (id: string) => void;
  setBudget: (budget: Omit<Budget, 'id'>) => void;
  getCategoryById: (id: string) => Category | undefined;
  getPaymentMethodById: (id: string) => PaymentMethod | undefined;
  calculateSummary: () => void;
  populateSampleData: () => void;
}

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

export function FinanceProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(financeReducer, initialState);

  const addTransaction = (transaction: Omit<Transaction, 'id' | 'createdAt'>) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: Date.now().toString(),
      createdAt: new Date(),
    };
    dispatch({ type: 'ADD_TRANSACTION', payload: newTransaction });
  };

  const updateTransaction = (transaction: Transaction) => {
    dispatch({ type: 'UPDATE_TRANSACTION', payload: transaction });
  };

  const deleteTransaction = (id: string) => {
    dispatch({ type: 'DELETE_TRANSACTION', payload: id });
  };

  const addCategory = (category: Omit<Category, 'id'>) => {
    const newCategory: Category = {
      ...category,
      id: Date.now().toString(),
    };
    dispatch({ type: 'ADD_CATEGORY', payload: newCategory });
  };

  const updateCategory = (category: Category) => {
    dispatch({ type: 'UPDATE_CATEGORY', payload: category });
  };

  const deleteCategory = (id: string) => {
    dispatch({ type: 'DELETE_CATEGORY', payload: id });
  };

  const setBudget = (budget: Omit<Budget, 'id'>) => {
    const newBudget: Budget = {
      ...budget,
      id: Date.now().toString(),
    };
    dispatch({ type: 'SET_BUDGET', payload: newBudget });
  };

  const getCategoryById = (id: string) => {
    return state.categories.find(c => c.id === id);
  };

  const getPaymentMethodById = (id: string) => {
    return state.paymentMethods.find(p => p.id === id);
  };

  const calculateSummary = () => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const monthlyTransactions = state.transactions.filter(t => {
      const transactionDate = new Date(t.date);
      return transactionDate.getMonth() === currentMonth && 
             transactionDate.getFullYear() === currentYear;
    });

    const monthlyIncome = monthlyTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const monthlyExpenses = monthlyTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    const monthlySavings = monthlyIncome - monthlyExpenses;

    // Calcular progresso do orçamento
    const budgetProgress = state.budgets.map(budget => {
      const category = state.categories.find(c => c.id === budget.categoryId);
      if (!category) return null;

      const spent = monthlyTransactions
        .filter(t => t.category === category.name && t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);

      const remaining = budget.amount - spent;
      const percentage = (spent / budget.amount) * 100;

      let status: 'under' | 'warning' | 'over' = 'under';
      if (percentage >= 100) status = 'over';
      else if (percentage >= 80) status = 'warning';

      return {
        categoryId: budget.categoryId,
        categoryName: category.name,
        budget: budget.amount,
        spent,
        remaining,
        percentage,
        status,
      };
    }).filter(Boolean) as any[];

    const summary: FinancialSummary = {
      currentBalance: monthlySavings,
      monthlyIncome,
      monthlyExpenses,
      monthlySavings,
      budgetProgress,
    };

    dispatch({ type: 'LOAD_DATA', payload: { summary } });
  };

  useEffect(() => {
    calculateSummary();
  }, [state.transactions, state.budgets]);

  const value: FinanceContextType = {
    state,
    dispatch,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    addCategory,
    updateCategory,
    deleteCategory,
    setBudget,
    getCategoryById,
    getPaymentMethodById,
    calculateSummary,
    populateSampleData: () => populateSampleData(addTransaction, setBudget),
  };

  return (
    <FinanceContext.Provider value={value}>
      {children}
    </FinanceContext.Provider>
  );
}

export function useFinance() {
  const context = useContext(FinanceContext);
  if (context === undefined) {
    throw new Error('useFinance must be used within a FinanceProvider');
  }
  return context;
}
