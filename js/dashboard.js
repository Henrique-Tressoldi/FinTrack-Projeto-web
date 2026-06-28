// ==============================
// FinTrack — Dashboard Logic
// ==============================

(function () {
  'use strict';

  function init() {
    UI.initSidebar();
    renderSummary();
    renderChart();
    renderRecentTransactions();
  }

  // ==============================
  // Resumo (Cards)
  // ==============================

  function renderSummary() {
    const transactions = Storage.getTransactions();
    let totalIncome = 0;
    let totalExpense = 0;

    transactions.forEach(t => {
      const val = parseFloat(t.value);
      if (t.type === 'receita') totalIncome += val;
      else totalExpense += val;
    });

    const balance = totalIncome - totalExpense;

    document.getElementById('totalBalance').textContent = UI.formatCurrency(balance);
    document.getElementById('totalIncome').textContent = UI.formatCurrency(totalIncome);
    document.getElementById('totalExpense').textContent = UI.formatCurrency(totalExpense);

    // Cor dinâmica do saldo
    const balanceEl = document.getElementById('totalBalance');
    balanceEl.style.color = balance >= 0 ? 'var(--income)' : 'var(--expense)';
  }

  // ==============================
  // Gráfico de Barras (Últimos 6 meses)
  // ==============================

  function renderChart() {
    const transactions = Storage.getTransactions();
    const months = {};
    const now = new Date();

    // Gerar os últimos 6 meses
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      months[key] = {
        income: 0,
        expense: 0,
        label: d.toLocaleDateString('pt-BR', { month: 'short' })
      };
    }

    // Agrupar transações por mês
    transactions.forEach(t => {
      const key = t.date.substring(0, 7); // YYYY-MM
      if (months[key]) {
        if (t.type === 'receita') months[key].income += parseFloat(t.value);
        else months[key].expense += parseFloat(t.value);
      }
    });

    const entries = Object.values(months);
    const maxVal = Math.max(...entries.map(e => Math.max(e.income, e.expense)), 1);

    const chartBars = document.getElementById('chartBars');
    chartBars.innerHTML = entries.map(entry => {
      const incomeH = (entry.income / maxVal) * 100;
      const expenseH = (entry.expense / maxVal) * 100;
      return `
        <div class="chart-bar-group">
          <div style="display: flex; gap: 3px; align-items: flex-end; height: 100%; width: 100%; justify-content: center;">
            <div class="chart-bar income-bar" style="height: ${Math.max(incomeH, 1)}%;" title="Receita: ${UI.formatCurrency(entry.income)}"></div>
            <div class="chart-bar expense-bar" style="height: ${Math.max(expenseH, 1)}%;" title="Despesa: ${UI.formatCurrency(entry.expense)}"></div>
          </div>
          <span class="chart-label">${entry.label}</span>
        </div>
      `;
    }).join('');
  }

  // ==============================
  // Transações Recentes
  // ==============================

  function renderRecentTransactions() {
    const transactions = Storage.getTransactions();
    const container = document.getElementById('recentTransactions');

    if (transactions.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <div class="empty-icon">📭</div>
          <p class="empty-text">Nenhuma transação registrada</p>
          <p class="empty-subtext">Adicione sua primeira transação na página de Transações.</p>
        </div>
      `;
      return;
    }

    // Ordenar por data mais recente e pegar as 5 últimas
    const recent = [...transactions]
      .sort((a, b) => b.date.localeCompare(a.date) || b.id.localeCompare(a.id))
      .slice(0, 5);

    container.innerHTML = `<div class="transaction-list">${recent.map(t => {
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
              <span>${escapeHtml(catName)}</span>
              <span>•</span>
              <span>${UI.formatDate(t.date)}</span>
            </div>
          </div>
          <span class="transaction-amount ${t.type === 'receita' ? 'income' : 'expense'}">
            ${sign} ${UI.formatCurrency(parseFloat(t.value))}
          </span>
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

  // Inicializa quando o DOM estiver pronto
  document.addEventListener('DOMContentLoaded', init);
})();
