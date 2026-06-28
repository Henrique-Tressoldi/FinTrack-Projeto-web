// ==============================
// FinTrack — Storage Module
// Persistência de dados via localStorage
// ==============================

const Storage = (() => {
  'use strict';

  const KEYS = {
    categories: 'fintrack_categories',
    transactions: 'fintrack_transactions'
  };

  // Categorias padrão (seed)
  const DEFAULT_CATEGORIES = [
    { id: 'cat_1',  name: 'Salário',       type: 'receita', color: '#00d4aa' },
    { id: 'cat_2',  name: 'Freelance',     type: 'receita', color: '#6c5ce7' },
    { id: 'cat_3',  name: 'Investimentos', type: 'receita', color: '#f0c040' },
    { id: 'cat_4',  name: 'Alimentação',   type: 'despesa', color: '#ff4757' },
    { id: 'cat_5',  name: 'Transporte',    type: 'despesa', color: '#ff6b81' },
    { id: 'cat_6',  name: 'Moradia',       type: 'despesa', color: '#ffa502' },
    { id: 'cat_7',  name: 'Lazer',         type: 'despesa', color: '#a855f7' },
    { id: 'cat_8',  name: 'Saúde',         type: 'despesa', color: '#1e90ff' },
    { id: 'cat_9',  name: 'Educação',      type: 'despesa', color: '#00cec9' },
    { id: 'cat_10', name: 'Outros',        type: 'despesa', color: '#8888a8' }
  ];

  /**
   * Gera um ID único baseado em timestamp + random
   */
  function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
  }

  // ==============================
  // Categorias
  // ==============================

  function getCategories() {
    const data = localStorage.getItem(KEYS.categories);
    return data ? JSON.parse(data) : [];
  }

  function saveCategories(categories) {
    localStorage.setItem(KEYS.categories, JSON.stringify(categories));
  }

  function addCategory(category) {
    const categories = getCategories();
    const newCat = { ...category, id: generateId() };
    categories.push(newCat);
    saveCategories(categories);
    return newCat;
  }

  function updateCategory(id, data) {
    const categories = getCategories();
    const index = categories.findIndex(c => c.id === id);
    if (index === -1) return null;
    categories[index] = { ...categories[index], ...data };
    saveCategories(categories);
    return categories[index];
  }

  function deleteCategory(id) {
    const categories = getCategories();
    saveCategories(categories.filter(c => c.id !== id));
  }

  function getCategoryById(id) {
    return getCategories().find(c => c.id === id) || null;
  }

  // ==============================
  // Transações
  // ==============================

  function getTransactions() {
    const data = localStorage.getItem(KEYS.transactions);
    return data ? JSON.parse(data) : [];
  }

  function saveTransactions(transactions) {
    localStorage.setItem(KEYS.transactions, JSON.stringify(transactions));
  }

  function addTransaction(transaction) {
    const transactions = getTransactions();
    const newTrans = { ...transaction, id: generateId() };
    transactions.push(newTrans);
    saveTransactions(transactions);
    return newTrans;
  }

  function updateTransaction(id, data) {
    const transactions = getTransactions();
    const index = transactions.findIndex(t => t.id === id);
    if (index === -1) return null;
    transactions[index] = { ...transactions[index], ...data };
    saveTransactions(transactions);
    return transactions[index];
  }

  function deleteTransaction(id) {
    const transactions = getTransactions();
    saveTransactions(transactions.filter(t => t.id !== id));
  }

  // ==============================
  // Inicialização
  // ==============================

  function init() {
    // Popula categorias padrão se estiver vazio
    if (getCategories().length === 0) {
      saveCategories(DEFAULT_CATEGORIES);
    }
  }

  // API pública
  return {
    generateId,
    getCategories,
    saveCategories,
    addCategory,
    updateCategory,
    deleteCategory,
    getCategoryById,
    getTransactions,
    saveTransactions,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    init
  };
})();

// Inicializa ao carregar o script
Storage.init();
