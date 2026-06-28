// ==============================
// FinTrack — UI Utilities
// Funções utilitárias de interface
// ==============================

const UI = (() => {
  'use strict';

  // ==============================
  // Formatação
  // ==============================

  /**
   * Formata um valor numérico como moeda BRL
   */
  function formatCurrency(value) {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  }

  /**
   * Formata uma data no padrão DD/MM/AAAA
   */
  function formatDate(dateString) {
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
  }

  // ==============================
  // Modal
  // ==============================

  function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  function closeAllModals() {
    document.querySelectorAll('.modal-overlay.active').forEach(m => {
      m.classList.remove('active');
    });
    document.body.style.overflow = '';
  }

  // ==============================
  // Toast Notifications
  // ==============================

  /**
   * Exibe uma notificação toast
   * @param {string} message - Mensagem a exibir
   * @param {'success'|'error'|'info'} type - Tipo do toast
   */
  function showToast(message, type = 'info') {
    let container = document.querySelector('.toast-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    container.appendChild(toast);

    // Remove o toast após a animação
    setTimeout(() => {
      if (toast.parentNode) toast.remove();
    }, 3100);
  }

  // ==============================
  // Confirm Dialog
  // ==============================

  /**
   * Exibe um diálogo de confirmação
   * @param {string} message - Mensagem de confirmação
   * @returns {Promise<boolean>} true se confirmou, false se cancelou
   */
  function confirm(message) {
    return new Promise(resolve => {
      // Cria o overlay se não existir
      let overlay = document.getElementById('confirmOverlay');
      if (!overlay) {
        overlay = document.createElement('div');
        overlay.id = 'confirmOverlay';
        overlay.className = 'confirm-overlay';
        overlay.innerHTML = `
          <div class="confirm-dialog">
            <p class="confirm-message" id="confirmMessage"></p>
            <div class="confirm-actions">
              <button class="btn btn-secondary" id="confirmCancel">Cancelar</button>
              <button class="btn btn-danger" id="confirmOk">Confirmar</button>
            </div>
          </div>
        `;
        document.body.appendChild(overlay);
      }

      document.getElementById('confirmMessage').textContent = message;
      overlay.classList.add('active');
      document.body.style.overflow = 'hidden';

      function cleanup() {
        overlay.classList.remove('active');
        document.body.style.overflow = '';
        document.getElementById('confirmOk').removeEventListener('click', onConfirm);
        document.getElementById('confirmCancel').removeEventListener('click', onCancel);
      }

      function onConfirm() {
        cleanup();
        resolve(true);
      }

      function onCancel() {
        cleanup();
        resolve(false);
      }

      document.getElementById('confirmOk').addEventListener('click', onConfirm);
      document.getElementById('confirmCancel').addEventListener('click', onCancel);
    });
  }

  // ==============================
  // Sidebar (mobile)
  // ==============================

  /**
   * Inicializa a sidebar responsiva e os event listeners de modais
   */
  function initSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');
    const toggle = document.getElementById('menuToggle');
    const closeBtn = document.getElementById('sidebarClose');

    function openSidebar() {
      if (sidebar) sidebar.classList.add('open');
      if (overlay) overlay.classList.add('active');
    }

    function closeSidebar() {
      if (sidebar) sidebar.classList.remove('open');
      if (overlay) overlay.classList.remove('active');
    }

    if (toggle) toggle.addEventListener('click', openSidebar);
    if (closeBtn) closeBtn.addEventListener('click', closeSidebar);
    if (overlay) overlay.addEventListener('click', closeSidebar);

    // Fechar modais clicando no overlay
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('modal-overlay')) {
        e.target.classList.remove('active');
        document.body.style.overflow = '';
      }
    });

    // Fechar modais via botão .modal-close
    document.querySelectorAll('.modal-close').forEach(btn => {
      btn.addEventListener('click', () => {
        const modal = btn.closest('.modal-overlay');
        if (modal) {
          modal.classList.remove('active');
          document.body.style.overflow = '';
        }
      });
    });

    // Fechar modais com ESC
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeAllModals();
        closeSidebar();
        // Fechar confirm dialog também
        const confirmOverlay = document.getElementById('confirmOverlay');
        if (confirmOverlay && confirmOverlay.classList.contains('active')) {
          const cancelBtn = document.getElementById('confirmCancel');
          if (cancelBtn) cancelBtn.click();
        }
      }
    });
  }

  // API pública
  return {
    formatCurrency,
    formatDate,
    openModal,
    closeModal,
    closeAllModals,
    showToast,
    confirm,
    initSidebar
  };
})();
