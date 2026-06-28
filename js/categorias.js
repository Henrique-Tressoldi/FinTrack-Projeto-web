// ==============================
// FinTrack — Categorias Logic
// CRUD completo + color picker
// ==============================

(function () {
  'use strict';

  // Paleta de cores disponíveis
  const COLORS = [
    '#ff4757', '#ff6b81', '#ffa502', '#f0c040',
    '#00d4aa', '#00cec9', '#1e90ff', '#6c5ce7',
    '#a855f7', '#fd79a8', '#e17055', '#00b894',
    '#0984e3', '#636e72', '#2d3436', '#8888a8'
  ];

  let editingId = null;
  let selectedColor = COLORS[0];

  function init() {
    UI.initSidebar();
    setupEventListeners();
    renderColorPicker();
    renderCategories();
  }

  // ==============================
  // Event Listeners
  // ==============================

  function setupEventListeners() {
    document.getElementById('btnAddCategory').addEventListener('click', openAddModal);
    document.getElementById('categoryForm').addEventListener('submit', handleSubmit);
    document.getElementById('filterCatType').addEventListener('change', renderCategories);
  }

  // ==============================
  // Color Picker
  // ==============================

  function renderColorPicker() {
    const grid = document.getElementById('colorPicker');
    grid.innerHTML = COLORS.map(color =>
      `<button type="button" class="color-option${color === selectedColor ? ' selected' : ''}"
        style="background: ${color};"
        data-color="${color}"
        title="${color}"
        aria-label="Cor ${color}"></button>`
    ).join('');

    grid.addEventListener('click', (e) => {
      const btn = e.target.closest('.color-option');
      if (!btn) return;
      selectedColor = btn.dataset.color;
      document.getElementById('catColor').value = selectedColor;
      grid.querySelectorAll('.color-option').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
    });

    document.getElementById('catColor').value = selectedColor;
  }

  // ==============================
  // Modal: Abrir para Adicionar
  // ==============================

  function openAddModal() {
    editingId = null;
    document.getElementById('categoryModalTitle').textContent = 'Nova Categoria';
    document.getElementById('categoryForm').reset();
    document.getElementById('catType').value = 'despesa';
    selectedColor = COLORS[0];
    renderColorPicker();
    UI.openModal('categoryModal');
  }

  // ==============================
  // Modal: Abrir para Editar
  // ==============================

  function openEditModal(id) {
    const category = Storage.getCategories().find(c => c.id === id);
    if (!category) return;

    editingId = id;
    document.getElementById('categoryModalTitle').textContent = 'Editar Categoria';
    document.getElementById('catName').value = category.name;
    document.getElementById('catType').value = category.type;
    selectedColor = category.color;
    renderColorPicker();
    UI.openModal('categoryModal');
  }

  // ==============================
  // Salvar (Criar ou Atualizar)
  // ==============================

  function handleSubmit(e) {
    e.preventDefault();

    const name = document.getElementById('catName').value.trim();
    const type = document.getElementById('catType').value;

    // Validação
    if (!name) {
      UI.showToast('Informe o nome da categoria.', 'error');
      return;
    }

    const data = { name, type, color: selectedColor };

    if (editingId) {
      Storage.updateCategory(editingId, data);
      UI.showToast('Categoria atualizada com sucesso!', 'success');
    } else {
      Storage.addCategory(data);
      UI.showToast('Categoria criada com sucesso!', 'success');
    }

    UI.closeModal('categoryModal');
    renderCategories();
  }

  // ==============================
  // Excluir Categoria
  // ==============================

  async function handleDelete(id) {
    const transactions = Storage.getTransactions().filter(t => t.categoryId === id);
    let msg = 'Tem certeza que deseja excluir esta categoria?';
    if (transactions.length > 0) {
      msg += ` Existem ${transactions.length} transação(ões) vinculada(s) que ficarão sem categoria.`;
    }

    const confirmed = await UI.confirm(msg);
    if (confirmed) {
      Storage.deleteCategory(id);
      UI.showToast('Categoria excluída.', 'info');
      renderCategories();
    }
  }

  // ==============================
  // Renderizar Grid de Categorias
  // ==============================

  function renderCategories() {
    const container = document.getElementById('categoryGrid');
    const filter = document.getElementById('filterCatType').value;
    let categories = Storage.getCategories();

    if (filter !== 'todas') {
      categories = categories.filter(c => c.type === filter);
    }

    if (categories.length === 0) {
      container.innerHTML = `
        <div class="empty-state" style="grid-column: 1 / -1;">
          <div class="empty-icon">🏷️</div>
          <p class="empty-text">Nenhuma categoria encontrada</p>
          <p class="empty-subtext">Crie uma nova categoria para organizar suas transações.</p>
        </div>
      `;
      return;
    }

    const transactions = Storage.getTransactions();

    container.innerHTML = categories.map(cat => {
      const count = transactions.filter(t => t.categoryId === cat.id).length;
      return `
        <div class="category-card">
          <div class="category-color" style="background: ${cat.color}20; color: ${cat.color};">
            ${cat.type === 'receita' ? '📈' : '📉'}
          </div>
          <div class="category-info">
            <div class="category-name">${escapeHtml(cat.name)}</div>
            <div class="category-type">
              <span class="badge ${cat.type === 'receita' ? 'badge-income' : 'badge-expense'}">
                ${cat.type === 'receita' ? 'Receita' : 'Despesa'}
              </span>
            </div>
            <div class="category-count">${count} transação(ões)</div>
          </div>
          <div class="category-actions">
            <button class="btn-ghost btn-icon" onclick="editCategory('${cat.id}')" title="Editar" aria-label="Editar categoria">✏️</button>
            <button class="btn-ghost btn-icon" onclick="removeCategory('${cat.id}')" title="Excluir" aria-label="Excluir categoria">🗑️</button>
          </div>
        </div>
      `;
    }).join('');
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
  window.editCategory = openEditModal;
  window.removeCategory = handleDelete;

  document.addEventListener('DOMContentLoaded', init);
})();
