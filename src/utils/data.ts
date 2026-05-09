export interface Transaction {
  _id: string;
  title: string;
  amount: number;
  type: 'income' | 'expense';
  category: Category;
  date: string;
  note?: string;
  paymentMethod: 'cash' | 'card' | 'upi' | 'bank_transfer' | 'other';
}

export interface Category {
  _id: string;
  name: string;
  icon: string;
  color: string;
  type: 'income' | 'expense' | 'both';
}

export const DEFAULT_CATEGORIES: Category[] = [
  { _id: '1', name: 'Food & Dining', icon: '🍔', color: '#f59e0b', type: 'expense' },
  { _id: '2', name: 'Transportation', icon: '🚗', color: '#3b82f6', type: 'expense' },
  { _id: '3', name: 'Shopping', icon: '🛍️', color: '#ec4899', type: 'expense' },
  { _id: '4', name: 'Entertainment', icon: '🎬', color: '#8b5cf6', type: 'expense' },
  { _id: '5', name: 'Health & Medical', icon: '💊', color: '#ef4444', type: 'expense' },
  { _id: '6', name: 'Housing', icon: '🏠', color: '#06b6d4', type: 'expense' },
  { _id: '7', name: 'Education', icon: '📚', color: '#10b981', type: 'expense' },
  { _id: '8', name: 'Utilities', icon: '💡', color: '#f97316', type: 'expense' },
  { _id: '9', name: 'Salary', icon: '💼', color: '#22c55e', type: 'income' },
  { _id: '10', name: 'Freelance', icon: '💻', color: '#6366f1', type: 'income' },
  { _id: '11', name: 'Investment', icon: '📈', color: '#84cc16', type: 'income' },
  { _id: '12', name: 'Other', icon: '📦', color: '#94a3b8', type: 'both' },
];

export const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];

export function formatCurrency(amount: number, currency = 'INR') {
  return new Intl.NumberFormat(currency === 'INR' ? 'en-IN' : 'en-US', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(date: string) {
  return new Date(date).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}
