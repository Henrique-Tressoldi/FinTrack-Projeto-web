// ==============================
// FinTrack — Transações Logic
// CRUD completo + filtros
// ==============================

(function () {
  'use strict';

  let editingId = null;

  function init() {
    UI.initSidebar();
    setupEventListeners();
    populateCategoryFilters();
    renderTransactions();
  }

  // ==============================
  // Event Listeners
  // ==============================

  function setupEventListeners() {
    document.getElementById('btnAddTransaction').addEventListener('click', openAddModal);
    document.getElementById('transactionForm').addEventListener('submit', handleSubmit);
    document.getElementById('transType').addEventListener('change', updateCategoryOptions);

    // Filtros
    document.getElementById('filterType').addEventListener('change', renderTransactions);
    document.getElementById('filterCategory').addEventListener('change', renderTransactions);
    document.getElementById('filterDateStart').addEventListener('change', renderTransactions);
    document.getElementById('filterDateEnd').addEventListener('change', renderTransactions);
  }

  // ==============================
  // Populando selects de categorias
  // ==============================

  function populateCategoryFilters() {
    const categories = Storage.getCategories();
    const filterCat = document.getElementById('filterCategory');
    filterCat.innerHTML = '<option value="todas">Todas as categorias</option>';
    categories.forEach(cat => {
      filterCat.innerHTML += `<option value="${cat.id}">${escapeHtml(cat.name)}</option>`;
    });
  }

  function updateCategoryOptions() {
    const type = document.getElementById('transType').value;
    const categories = Storage.getCategories().filter(c => c.type === type);
    const select = document.getElementById('transCategory');
    select.innerHTML = categories.map(c =>
      `<option value="${c.id}">${escapeHtml(c.name)}</option>`
    ).join('');
  }

  // ==============================
  // Modal: Abrir para Adicionar
  // ==============================

  function openAddModal() {
    editingId = null;
    document.getElementById('transactionModalTitle').textContent = 'Nova Transação';
    document.getElementById('transactionForm').reset();
    document.getElementById('transType').value = 'despesa';
    document.getElementById('transDate').value = new Date().toISOString().split('T')[0];
    updateCategoryOptions();
    UI.openModal('transactionModal');
  }

  // ==============================
  // Modal: Abrir para Editar
  // ==============================

  function openEditModal(id) {
    const transaction = Storage.getTransactions().find(t => t.id === id);
    if (!transaction) return;

    editingId = id;
    document.getElementById('transactionModalTitle').textContent = 'Editar Transação';
    document.getElementById('transDescription').value = transaction.description;
    document.getElementById('transValue').value = transaction.value;
    document.getElementById('transDate').value = transaction.date;
    document.getElementById('transType').value = transaction.type;
    updateCategoryOptions();
    document.getElementById('transCategory').value = transaction.categoryId;
    UI.openModal('transactionModal');
  }

  // ==============================
  // Salvar (Criar ou Atualizar)
  // ==============================

  function handleSubmit(e) {
    e.preventDefault();

    const description = document.getElementById('transDescription').value.trim();
    const value = parseFloat(document.getElementById('transValue').value);
    const date = document.getElementById('transDate').value;
    const type = document.getElementById('transType').value;
    const categoryId = document.getElementById('transCategory').value;

    // Validação
    if (!description) {
      UI.showToast('Informe a descrição da transação.', 'error');
      return;
    }
    if (!value || value <= 0) {
      UI.showToast('Informe um valor válido maior que zero.', 'error');
      return;
    }
    if (!date) {
      UI.showToast('Selecione a data da transação.', 'error');
      return;
    }
    if (!categoryId) {
      UI.showToast('Selecione uma categoria.', 'error');
      return;
    }

    const data = { description, value, date, type, categoryId };

    if (editingId) {
      Storage.updateTransaction(editingId, data);
      UI.showToast('Transação atualizada com sucesso!', 'success');
    } else {
      Storage.addTransaction(data);
      UI.showToast('Transação adicionada com sucesso!', 'success');
    }

    UI.closeModal('transactionModal');
    renderTransactions();
  }

  // ==============================
  // Excluir Transação
  // ==============================

  async function handleDelete(id) {
    const confirmed = await UI.confirm('Tem certeza que deseja excluir esta transação?');
    if (confirmed) {
      Storage.deleteTransaction(id);
      UI.showToast('Transação excluída.', 'info');
      renderTransactions();
    }
  }

  // ==============================
  // Filtros
  // ==============================

  function getFilteredTransactions() {
    let transactions = Storage.getTransactions();

    const type = document.getElementById('filterType').value;
    const category = document.getElementById('filterCategory').value;
    const dateStart = document.getElementById('filterDateStart').value;
    const dateEnd = document.getElementById('filterDateEnd').value;

    if (type !== 'todas') {
      transactions = transactions.filter(t => t.type === type);
    }
    if (category !== 'todas') {
      transactions = transactions.filter(t => t.categoryId === category);
    }
    if (dateStart) {
      transactions = transactions.filter(t => t.date >= dateStart);
    }
    if (dateEnd) {
      transactions = transactions.filter(t => t.date <= dateEnd);
    }

    // Ordenar por data descendente
    return transactions.sort((a, b) => b.date.localeCompare(a.date) || b.id.localeCompare(a.id));
  }

  // ==============================
  // Renderizar lista de transações
  // ==============================

  function renderTransactions() {
    const container = document.getElementById('transactionList');
    const transactions = getFilteredTransactions();

    if (transactions.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <div class="empty-icon">📭</div>
          <p class="empty-text">Nenhuma transação encontrada</p>
          <p class="empty-subtext">Tente ajustar os filtros ou adicione uma nova transação.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = `<div class="transaction-list">${transactions.map(t => {
      const cat = Storage.getCategoryById(t.categoryId);
      const catName = cat ? cat.name : 'Sem categoria';
      const catColor = cat ? cat.color : '#8888a8';
      const sign = t.type === 'receita' ? '+' : '-';
      return `
        <div class="transaction-item">
          <span class="transaction-cat-dot" style="background: ${catColor};"></span>
          <div class="transaction-info">
            <div class="transaction-desc">${escapeHtml(t.description)}</div>
            <div class="transaction-meta">
              <span class="badge ${t.type === 'receita' ? 'badge-income' : 'badge-expense'}">${t.type === 'receita' ? 'Receita' : 'Despesa'}</span>
              <span>${escapeHtml(catName)}</span>
              <span>•</span>
              <span>${UI.formatDate(t.date)}</span>
            </div>
          </div>
          <span class="transaction-amount ${t.type === 'receita' ? 'income' : 'expense'}">
            ${sign} ${UI.formatCurrency(parseFloat(t.value))}
          </span>
          <div class="transaction-actions">
            <button class="btn-ghost btn-icon" onclick="editTransaction('${t.id}')" title="Editar" aria-label="Editar transação">✏️</button>
            <button class="btn-ghost btn-icon" onclick="removeTransaction('${t.id}')" title="Excluir" aria-label="Excluir transação">🗑️</button>
          </div>
        </div>
      `;
    }).join('')}</div>`;
  }

  // ==============================
  // Helpers
  // ==============================

  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  // Expor funções para os onclick inline
  window.editTransaction = openEditModal;
  window.removeTransaction = handleDelete;

  document.addEventListener('DOMContentLoaded', init);
})();
