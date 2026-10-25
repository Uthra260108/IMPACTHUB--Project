/**
 * IMPACTHUB - COMMON UTILITIES & DOM HELPERS
 */

const Utils = (() => {
  // Safe HTML Escaping to prevent injection in user-entered demo content
  const escapeHtml = (str) => {
    if (!str && str !== 0) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  };

  // Toast Notification System
  const showToast = (title, message, type = 'info') => {
    let container = document.querySelector('.toast-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    // Choose appropriate icon
    let iconSvg = '';
    if (type === 'success') {
      iconSvg = '<svg class="toast-icon success" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>';
    } else if (type === 'danger') {
      iconSvg = '<svg class="toast-icon danger" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>';
    } else if (type === 'warning') {
      iconSvg = '<svg class="toast-icon warning" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>';
    } else {
      iconSvg = '<svg class="toast-icon info" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>';
    }

    toast.innerHTML = `
      ${iconSvg}
      <div class="toast-content">
        <div class="toast-title">${escapeHtml(title)}</div>
        <div class="toast-message">${escapeHtml(message)}</div>
      </div>
      <button class="toast-close" aria-label="Close notification">&times;</button>
    `;

    container.appendChild(toast);

    // Trigger animation
    requestAnimationFrame(() => {
      toast.classList.add('show');
    });

    const closeToast = () => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 260);
    };

    toast.querySelector('.toast-close').addEventListener('click', closeToast);

    // Auto dismiss after 4 seconds
    setTimeout(closeToast, 4000);
  };

  // Reusable Confirmation Dialog Modal
  const showConfirmDialog = (title, message, onConfirm, confirmText = 'Confirm', isDanger = false) => {
    let modal = document.getElementById('global-confirm-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'global-confirm-modal';
      modal.className = 'modal-backdrop';
      modal.innerHTML = `
        <div class="modal-card modal-sm" role="dialog" aria-modal="true">
          <div class="modal-header">
            <h3 id="confirm-modal-title">Confirm Action</h3>
            <button class="modal-close-btn" id="confirm-modal-close" aria-label="Close">&times;</button>
          </div>
          <div class="modal-body">
            <p id="confirm-modal-message">Are you sure you want to proceed?</p>
          </div>
          <div class="modal-footer">
            <button class="btn btn-outline btn-sm" id="confirm-modal-cancel">Cancel</button>
            <button class="btn btn-primary btn-sm" id="confirm-modal-action">Confirm</button>
          </div>
        </div>
      `;
      document.body.appendChild(modal);
    }

    const titleEl = document.getElementById('confirm-modal-title');
    const msgEl = document.getElementById('confirm-modal-message');
    const actionBtn = document.getElementById('confirm-modal-action');
    const cancelBtn = document.getElementById('confirm-modal-cancel');
    const closeBtn = document.getElementById('confirm-modal-close');

    titleEl.textContent = title;
    msgEl.textContent = message;
    actionBtn.textContent = confirmText;

    if (isDanger) {
      actionBtn.className = 'btn btn-danger btn-sm';
    } else {
      actionBtn.className = 'btn btn-primary btn-sm';
    }

    const closeModal = () => {
      modal.classList.remove('open');
    };

    cancelBtn.onclick = closeModal;
    closeBtn.onclick = closeModal;

    actionBtn.onclick = () => {
      closeModal();
      if (typeof onConfirm === 'function') {
        onConfirm();
      }
    };

    modal.classList.add('open');
  };

  // Generic Modal Open / Close
  const openModal = (modalId) => {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.add('open');
      const firstInput = modal.querySelector('input, select, textarea');
      if (firstInput) setTimeout(() => firstInput.focus(), 100);
    }
  };

  const closeModal = (modalId) => {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.remove('open');
    }
  };

  // Status Badge HTML Builder
  const renderStatusBadge = (status) => {
    const cleanStatus = (status || 'Active').toLowerCase();
    return `<span class="status-pill status-${cleanStatus}">${escapeHtml(status)}</span>`;
  };

  // Date Formatting Helper
  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch {
      return dateStr;
    }
  };

  const formatMonthAndDay = (dateStr) => {
    if (!dateStr) return { month: 'TBD', day: '--' };
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return { month: 'TBD', day: '--' };
      return {
        month: d.toLocaleDateString('en-US', { month: 'short' }),
        day: d.getDate()
      };
    } catch {
      return { month: 'TBD', day: '--' };
    }
  };

  // Show / Hide Password Helper
  const setupPasswordToggles = () => {
    document.querySelectorAll('.password-toggle-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const input = btn.previousElementSibling;
        if (!input) return;
        const isPassword = input.getAttribute('type') === 'password';
        input.setAttribute('type', isPassword ? 'text' : 'password');
        btn.setAttribute('aria-label', isPassword ? 'Hide password' : 'Show password');
        btn.innerHTML = isPassword
          ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>'
          : '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>';
      });
    });
  };

  // Setup Sidebar Mobile Drawer Toggle
  const initMobileSidebar = () => {
    const toggleBtn = document.querySelector('.mobile-menu-toggle');
    const closeBtn = document.querySelector('.sidebar-close-btn');
    const backdrop = document.querySelector('.sidebar-backdrop');

    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => {
        document.body.classList.toggle('sidebar-open');
      });
    }

    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        document.body.classList.remove('sidebar-open');
      });
    }

    if (backdrop) {
      backdrop.addEventListener('click', () => {
        document.body.classList.remove('sidebar-open');
      });
    }
  };

  return {
    escapeHtml,
    showToast,
    showConfirmDialog,
    openModal,
    closeModal,
    renderStatusBadge,
    formatDate,
    formatMonthAndDay,
    setupPasswordToggles,
    initMobileSidebar
  };
})();
