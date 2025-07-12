// Credit store interface and functions

// Transaction type for recording credit operations
export interface Transaction {
  type: 'generation' | 'withdrawal';
  amount: number;
  dollarValue: number;
  timestamp: string;
  details: string;
}

// Initialize credits in localStorage
export const initializeStore = (): void => {
  if (!localStorage.getItem('credits')) {
    localStorage.setItem('credits', '0');
  }
  
  if (!localStorage.getItem('transactions')) {
    localStorage.setItem('transactions', JSON.stringify([]));
  }
};

// Get current credit balance
export const getCredits = (): number => {
  initializeStore();
  return Number(localStorage.getItem('credits') || '0');
};

// Add credits to balance
export const addCredits = (amount: number): number => {
  const currentCredits = getCredits();
  const newBalance = currentCredits + amount;
  localStorage.setItem('credits', newBalance.toString());
  return newBalance;
};

// Withdraw credits from balance
export const withdrawCredits = (amount: number): number => {
  const currentCredits = getCredits();
  
  if (currentCredits < amount) {
    throw new Error(`Not enough Quantum Credits to withdraw. Required: ${amount}, Available: ${currentCredits}`);
  }
  
  const newBalance = currentCredits - amount;
  localStorage.setItem('credits', newBalance.toString());
  return newBalance;
};

// Get all transactions
export const getTransactions = (): Transaction[] => {
  initializeStore();
  return JSON.parse(localStorage.getItem('transactions') || '[]');
};

// Add a transaction to history
export const addTransaction = (transaction: Transaction): Transaction[] => {
  const transactions = getTransactions();
  const updatedTransactions = [transaction, ...transactions];
  localStorage.setItem('transactions', JSON.stringify(updatedTransactions));
  return updatedTransactions;
};

// Clear all transactions
export const clearTransactions = (): void => {
  localStorage.setItem('transactions', JSON.stringify([]));
};