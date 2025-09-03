export interface Transaction {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  category: string;
  paymentMethod: string;
  date: Date;
  description?: string;
  createdAt: Date;
}

export interface Category {
  id: string;
  name: string;
  color: string;
  icon: string;
  type: 'income' | 'expense';
  budget?: number;
}

export interface Budget {
  id: string;
  categoryId: string;
  amount: number;
  period: 'monthly' | 'yearly';
  startDate: Date;
  endDate?: Date;
}

export interface PaymentMethod {
  id: string;
  name: string;
  type: 'cash' | 'card' | 'pix' | 'transfer' | 'other';
  icon: string;
}

export interface FinancialSummary {
  currentBalance: number;
  monthlyIncome: number;
  monthlyExpenses: number;
  monthlySavings: number;
  budgetProgress: BudgetProgress[];
}

export interface BudgetProgress {
  categoryId: string;
  categoryName: string;
  budget: number;
  spent: number;
  remaining: number;
  percentage: number;
  status: 'under' | 'warning' | 'over';
}

export interface Notification {
  id: string;
  type: 'budget_warning' | 'bill_reminder' | 'goal_achieved';
  title: string;
  message: string;
  isRead: boolean;
  createdAt: Date;
  actionUrl?: string;
}

export interface UserSettings {
  currency: string;
  language: string;
  theme: 'light' | 'dark' | 'auto';
  notifications: boolean;
  timezone: string;
}

