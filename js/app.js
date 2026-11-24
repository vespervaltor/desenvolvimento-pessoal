/**
 * VÉSPER — Personal Development System
 * Controlador Principal da Aplicação
 * Filosofia: "Transformar potencial em capacidade e capacidade em realização."
 */

class VesperApp {
  constructor() {
    this.currentView = 'dashboard';
    this.storage = window.vesperStorage;
    this.icons = window.VesperIcons;
    this.charts = window.VesperCharts;

    // Estados de filtros
    this.goalHorizonFilter = 'all';
    this.goalStatusFilter = 'all';
    this.goalSearchTerm = '';

    this.diaryAreaFilter = 'all';
    this.diarySearchTerm = '';

    this.libraryTypeFilter = 'all';
    this.librarySearchTerm = '';

    this.activeReviewTab = 'weekly';

    // Elementos do Modal Genérico
    this.modalBackdrop = document.getElementById('genericModalBackdrop');
    this.modalTitle = document.getElementById('genericModalTitle');
    this.modalBody = document.getElementById('genericModalBody');
    this.modalSubmitBtn = document.getElementById('btnSubmitGenericModal');
    this.currentModalSubmitHandler = null;

    // Modal de Confirmação
    this.confirmBackdrop = document.getElementById('confirmModalBackdrop');
    this.confirmMessage = document.getElementById('confirmModalMessage');
    this.confirmAcceptBtn = document.getElementById('btnAcceptConfirmModal');
    this.currentConfirmHandler = null;

    this.init();
  }

  init() {
    this.setupIcons();
    this.setupNavigation();
    this.setupHeaderDateAndGreeting();
    this.setupGlobalEventListeners();
    this.renderAll();

    // Ouvinte para reatividade quando dados mudam
    window.addEventListener('vesper:data-changed', () => {
      this.updateBadges();
      this.renderCurrentView();
    });
  }

  // Insere os ícones SVG nos locais apropriados
  setupIcons() {
    const iconMappings = {
      'icon-nav-dashboard': this.icons.dashboard,
      'icon-nav-areas': this.icons.areas,
      'icon-nav-goals': this.icons.goals,
      'icon-nav-diary': this.icons.diary,
      'icon-nav-experiences': this.icons.experiences,
      'icon-nav-stats': this.icons.stats,
      'icon-nav-reviews': this.icons.reviews,
      'icon-nav-library': this.icons.library,
      'icon-nav-horizon': this.icons.horizon,
      'icon-nav-settings': this.icons.settings,
      'icon-quick-plus': this.icons.plus,
      'icon-menu-toggle': this.icons.menu,
      'icon-topbar-calendar': this.icons.calendar,
      'icon-dash-plus-goal': this.icons.plus,
      'icon-add-goal-btn': this.icons.plus,
      'icon-search-goals': this.icons.search,
      'icon-add-diary-btn': this.icons.plus,
      'icon-search-diary': this.icons.search,
      'icon-add-exp-btn': this.icons.plus,
      'icon-exp-sparkles': this.icons.sparkles,
      'icon-add-rev-w': this.icons.plus,
      'icon-add-rev-m': this.icons.plus,
      'icon-add-lib-btn': this.icons.plus,
      'icon-search-lib': this.icons.search,
      'icon-edit-horizon': this.icons.edit,
      'icon-horizon-mail': this.icons.diary,
      'icon-btn-download-json': this.icons.download,
      'icon-btn-upload-json': this.icons.upload,
      'icon-modal-close': this.icons.close,
      'icon-confirm-close': this.icons.close
    };

    Object.entries(iconMappings).forEach(([id, svg]) => {
      const el = document.getElementById(id);
      if (el) el.innerHTML = svg;
    });
  }

  // Configura a navegação entre as 10 telas
  setupNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        const view = item.getAttribute('data-view');
        this.switchView(view);

        // Fecha menu no mobile se aberto
        const sidebar = document.getElementById('vesperSidebar');
        if (sidebar.classList.contains('mobile-open')) {
          sidebar.classList.remove('mobile-open');
        }
      });
    });

    // Toggle menu mobile
    const btnToggleMobile = document.getElementById('btnToggleMobileMenu');
    const sidebar = document.getElementById('vesperSidebar');
    if (btnToggleMobile) {
      btnToggleMobile.addEventListener('click', () => {
        sidebar.classList.toggle('mobile-open');
      });
    }

    // Botões de atalho no dashboard
    const btnViewAllGoals = document.getElementById('btnViewAllGoals');
    if (btnViewAllGoals) {
      btnViewAllGoals.addEventListener('click', () => this.switchView('goals'));
    }

    const btnViewAllDiary = document.getElementById('btnViewAllDiary');
    if (btnViewAllDiary) {
      btnViewAllDiary.addEventListener('click', () => this.switchView('diary'));
    }
  }

  switchView(viewName) {
    this.currentView = viewName;

    // Atualiza classes ativas na sidebar
    document.querySelectorAll('.nav-item').forEach(item => {
      if (item.getAttribute('data-view') === viewName) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });

    // Exibe a seção correspondente
    document.querySelectorAll('.view-section').forEach(sec => {
      sec.classList.remove('active');
    });

    const targetSec = document.getElementById(`view-${viewName}`);
    if (targetSec) {
      targetSec.classList.add('active');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    this.renderCurrentView();
  }

  // Data em formato brasileiro e saudação personalizada
  setupHeaderDateAndGreeting() {
    const now = new Date();
    const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
    const dateFormatted = now.toLocaleDateString('pt-BR', options);
    
    // Capitaliza primeira letra
    const capitalizedDate = dateFormatted.charAt(0).toUpperCase() + dateFormatted.slice(1);
    
    const dateDisplay = document.getElementById('currentDateDisplay');
    if (dateDisplay) {
      dateDisplay.textContent = capitalizedDate;
    }

    // Saudação com base na hora
    const hour = now.getHours();
    let greeting = 'Olá';
    if (hour >= 5 && hour < 12) greeting = 'Bom dia';
    else if (hour >= 12 && hour < 18) greeting = 'Boa tarde';
    else greeting = 'Boa noite';

    const userName = this.storage.data.profile.name || 'Gabriel Santos';
    const userRole = this.storage.data.profile.subtitle || 'Personal Development';

    const greetingEl = document.getElementById('dashboardGreeting');
    if (greetingEl) {
      greetingEl.textContent = `${greeting}, ${userName}`;
    }

    const headerNameEl = document.getElementById('userHeaderName');
    if (headerNameEl) {
      headerNameEl.textContent = userName;
    }

    // Formulário de configurações
    const inputName = document.getElementById('settingUserName');
    if (inputName) inputName.value = userName;
    const inputRole = document.getElementById('settingUserRole');
    if (inputRole) inputRole.value = userRole;
    const inputAge = document.getElementById('settingHorizonAge');
    if (inputAge) inputAge.value = this.storage.data.profile.horizonAge || 25;
  }

  setupGlobalEventListeners() {
    // Registro Rápido
    const btnQuickRecord = document.getElementById('btnOpenQuickRecord');
    if (btnQuickRecord) {
      btnQuickRecord.addEventListener('click', () => this.openQuickRecordModal());
    }

    // Fechar modais
    document.getElementById('btnCloseGenericModal')?.addEventListener('click', () => this.closeGenericModal());
    document.getElementById('btnCancelGenericModal')?.addEventListener('click', () => this.closeGenericModal());
    document.getElementById('btnCloseConfirmModal')?.addEventListener('click', () => this.closeConfirmModal());
    document.getElementById('btnCancelConfirmModal')?.addEventListener('click', () => this.closeConfirmModal());

    // Fechar ao clicar fora
    this.modalBackdrop?.addEventListener('click', (e) => {
      if (e.target === this.modalBackdrop) this.closeGenericModal();
    });
    this.confirmBackdrop?.addEventListener('click', (e) => {
      if (e.target === this.confirmBackdrop) this.closeConfirmModal();
    });

    // Botões de adição de Metas
    document.getElementById('btnDashboardNewGoal')?.addEventListener('click', () => this.openGoalModal());
    document.getElementById('btnAddNewGoal')?.addEventListener('click', () => this.openGoalModal());

    // Botão de novo diário
    document.getElementById('btnAddNewDiaryEntry')?.addEventListener('click', () => this.openDiaryModal());

    // Botão de nova experiência
    document.getElementById('btnAddNewExperience')?.addEventListener('click', () => this.openExperienceModal());

    // Botões de revisões
    document.getElementById('btnNewWeeklyReview')?.addEventListener('click', () => this.openWeeklyReviewModal());
    document.getElementById('btnNewMonthlyReview')?.addEventListener('click', () => this.openMonthlyReviewModal());

    // Abas de revisões
    document.getElementById('tabReviewsWeekly')?.addEventListener('click', () => {
      this.activeReviewTab = 'weekly';
      document.getElementById('tabReviewsWeekly').classList.add('active');
      document.getElementById('tabReviewsMonthly').classList.remove('active');
      this.renderReviewsView();
    });
    document.getElementById('tabReviewsMonthly')?.addEventListener('click', () => {
      this.activeReviewTab = 'monthly';
      document.getElementById('tabReviewsMonthly').classList.add('active');
      document.getElementById('tabReviewsWeekly').classList.remove('active');
      this.renderReviewsView();
    });

    // Biblioteca
    document.getElementById('btnAddNewLibraryItem')?.addEventListener('click', () => this.openLibraryModal());

    // Horizonte 25
    document.getElementById('btnEditHorizon')?.addEventListener('click', () => this.openHorizonModal());

    // Filtros de Metas
    document.getElementById('inputSearchGoals')?.addEventListener('input', (e) => {
      this.goalSearchTerm = e.target.value.toLowerCase();
      this.renderGoalsView();
    });

    document.querySelectorAll('#goalHorizonFilters .filter-pill').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('#goalHorizonFilters .filter-pill').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.goalHorizonFilter = btn.getAttribute('data-horizon');
        this.renderGoalsView();
      });
    });

    document.querySelectorAll('#goalStatusFilters .filter-pill').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('#goalStatusFilters .filter-pill').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.goalStatusFilter = btn.getAttribute('data-status');
        this.renderGoalsView();
      });
    });

    // Filtros do Diário
    document.getElementById('inputSearchDiary')?.addEventListener('input', (e) => {
      this.diarySearchTerm = e.target.value.toLowerCase();
      this.renderDiaryView();
    });

    // Filtros da Biblioteca
    document.getElementById('inputSearchLibrary')?.addEventListener('input', (e) => {
      this.librarySearchTerm = e.target.value.toLowerCase();
      this.renderLibraryView();
    });

    document.querySelectorAll('#libraryTypeFilters .filter-pill').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('#libraryTypeFilters .filter-pill').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.libraryTypeFilter = btn.getAttribute('data-type');
        this.renderLibraryView();
      });
    });

    // Formulário de perfil em configurações
    document.getElementById('formUserProfile')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const userName = document.getElementById('settingUserName').value.trim();
      const userRole = document.getElementById('settingUserRole').value.trim();
      const horizonAge = parseInt(document.getElementById('settingHorizonAge').value) || 25;

      this.storage.saveSettings({ userName, userRole });
      this.storage.data.profile.horizonAge = horizonAge;
      this.storage.save();

      this.setupHeaderDateAndGreeting();
      this.showToast('Perfil atualizado com sucesso!');
    });

    // Backups e CSV
    document.getElementById('btnExportJSON')?.addEventListener('click', () => {
      this.storage.exportJSON();
      this.showToast('Backup JSON exportado com sucesso!');
    });

    document.getElementById('btnTriggerImportJSON')?.addEventListener('click', () => {
      document.getElementById('inputImportJSON').click();
    });

    document.getElementById('inputImportJSON')?.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = this.storage.importJSON(event.target.result);
        if (result.success) {
          this.showToast('Dados restaurados com sucesso!');
          this.renderAll();
        } else {
          alert(result.message);
        }
      };
      reader.readAsText(file);
    });

    document.getElementById('btnExportGoalsCSV')?.addEventListener('click', () => {
      this.storage.exportCSV('metas');
      this.showToast('Metas exportadas para CSV!');
    });

    document.getElementById('btnExportDiaryCSV')?.addEventListener('click', () => {
      this.storage.exportCSV('diario');
      this.showToast('Diário exportado para CSV!');
    });

    document.getElementById('btnReloadDemoData')?.addEventListener('click', () => {
      this.showConfirm(
        'Restaurar Dados de Demonstração',
        'Deseja recarregar o conjunto inicial de demonstração? Isso substituirá as informações atuais.',
        () => {
          this.storage.resetData(false);
          this.setupHeaderDateAndGreeting();
          this.renderAll();
          this.showToast('Dados de demonstração restaurados.');
        }
      );
    });

    document.getElementById('btnClearAllData')?.addEventListener('click', () => {
      this.showConfirm(
        'Limpar Todos os Dados',
        'ATENÇÃO: Isso apagará todas as metas, registros de diário e configurações armazenadas no navegador. Deseja prosseguir com o sistema zerado?',
        () => {
          this.storage.resetData(true);
          this.setupHeaderDateAndGreeting();
          this.renderAll();
          this.showToast('Todos os dados foram resetados.');
        }
      );
    });
  }

  // Notificação Toast Elegante
  showToast(message, type = 'gold') {
    const container = document.getElementById('vesperToastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = 'vesper-toast';
    toast.innerHTML = `
      <span style="color: var(--accent-gold);">${this.icons.sparkles}</span>
      <span>${message}</span>
    `;

    container.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3200);
  }

  // Diálogo de Confirmação Seguro
  showConfirm(title, message, onAccept) {
    this.confirmMessage.textContent = message;
    document.getElementById('confirmModalTitle').textContent = title;
    this.confirmBackdrop.classList.add('open');

    this.confirmAcceptBtn.onclick = () => {
      onAccept();
      this.closeConfirmModal();
    };
  }

  closeConfirmModal() {
    this.confirmBackdrop.classList.remove('open');
  }

  // Modal Genérico Helper
  openGenericModal(title, bodyHtml, onSubmit) {
    this.modalTitle.textContent = title;
    this.modalBody.innerHTML = bodyHtml;
    this.modalBackdrop.classList.add('open');

    this.modalSubmitBtn.onclick = (e) => {
      e.preventDefault();
      onSubmit();
    };
  }

  closeGenericModal() {
    this.modalBackdrop.classList.remove('open');
  }

  // Atualiza Badges Numéricos na Sidebar
  updateBadges() {
    const goalsCount = this.storage.data.goals.filter(g => g.status === 'em_andamento').length;
    const diaryCount = this.storage.data.diary.length;
    const expCount = this.storage.data.experiences.length;

    const bGoals = document.getElementById('badge-goals-count');
    if (bGoals) bGoals.textContent = goalsCount;

    const bDiary = document.getElementById('badge-diary-count');
    if (bDiary) bDiary.textContent = diaryCount;

    const bExp = document.getElementById('badge-exp-count');
    if (bExp) bExp.textContent = expCount;
  }

  renderAll() {
    this.updateBadges();
    this.renderCurrentView();
  }

  renderCurrentView() {
    switch (this.currentView) {
      case 'dashboard':
        this.renderDashboardView();
        break;
      case 'areas':
        this.renderAreasView();
        break;
      case 'goals':
        this.renderGoalsView();
        break;
      case 'diary':
        this.renderDiaryView();
        break;
      case 'experiences':
        this.renderExperiencesView();
        break;
      case 'stats':
        this.renderStatsView();
        break;
      case 'reviews':
        this.renderReviewsView();
        break;
      case 'library':
        this.renderLibraryView();
        break;
      case 'horizon':
        this.renderHorizonView();
        break;
      case 'settings':
        // Já configurado nos inputs
        break;
    }
  }

  /* ========================================================
     1. DASHBOARD PRINCIPAL
     ======================================================== */
  renderDashboardView() {
    const goals = this.storage.data.goals;
    const diary = this.storage.data.diary;
    const exp = this.storage.data.experiences;

    const activeGoals = goals.filter(g => g.status === 'em_andamento');
    const completedGoals = goals.filter(g => g.status === 'concluido');
    const completionRate = goals.length > 0 ? Math.round((completedGoals.length / goals.length) * 100) : 0;

    // Métricas dos cards superiores
    document.getElementById('dash-active-goals-num').textContent = activeGoals.length;
    document.getElementById('dash-active-goals-pill').textContent = `${activeGoals.length} ativas`;

    document.getElementById('dash-completed-num').textContent = completedGoals.length;
    document.getElementById('dash-completed-pill').textContent = `${completionRate}% concluídas`;

    document.getElementById('dash-diary-num').textContent = diary.length;
    document.getElementById('dash-diary-count-pill').textContent = `${diary.length} notas`;

    document.getElementById('dash-exp-num').textContent = exp.length;
    document.getElementById('dash-exp-pill').textContent = `${exp.filter(e => e.status === 'concluida').length} feitas`;

    // Metas Prioritárias da Semana
    const priorityContainer = document.getElementById('dashPriorityGoalsList');
    const priorityGoals = goals
      .filter(g => g.status === 'em_andamento')
      .sort((a, b) => (b.priority === 'essencial' ? 1 : 0) - (a.priority === 'essencial' ? 1 : 0))
      .slice(0, 4);

    if (priorityGoals.length === 0) {
      priorityContainer.innerHTML = `
        <div class="empty-state" style="padding: 24px;">
          <p class="empty-state-title">Nenhum objetivo em andamento no momento</p>
          <p class="empty-state-desc">Defina metas para orientar seu foco semanal.</p>
        </div>
      `;
    } else {
      priorityContainer.innerHTML = priorityGoals.map(g => {
        const areaInfo = AREAS_DEFINITION[g.area] || { name: g.area, color: '#d4af37' };
        return `
          <div style="background-color: var(--bg-surface); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 14px 16px; margin-bottom: 10px;">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 8px;">
              <div>
                <span class="area-tag" style="border-color: ${areaInfo.color}40; color: ${areaInfo.color}; margin-bottom: 4px;">
                  ${areaInfo.name}
                </span>
                <div style="font-weight: 600; font-size: 0.95rem; color: #fff;">${g.title}</div>
              </div>
              <span class="badge ${g.priority === 'essencial' ? 'badge-gold' : 'badge-neutral'}">
                ${g.priority}
              </span>
            </div>

            <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 10px; font-size: 0.78rem; color: var(--text-muted);">
              <span>Progresso</span>
              <span style="font-weight: 600; color: var(--accent-gold-light);">${g.progress}%</span>
            </div>
            <div class="progress-bar-container">
              <div class="progress-bar-fill" style="width: ${g.progress}%;"></div>
            </div>
          </div>
        `;
      }).join('');
    }

    // Atividades e Registros Recentes
    const activityContainer = document.getElementById('dashRecentActivityList');
    const recentDiary = diary.slice(0, 3);

    if (recentDiary.length === 0) {
      activityContainer.innerHTML = `
        <div class="empty-state" style="padding: 24px;">
          <p class="empty-state-title">Nenhum registro recente no diário</p>
          <p class="empty-state-desc">Use o botão Registro Rápido para registrar reflexões.</p>
        </div>
      `;
    } else {
      activityContainer.innerHTML = recentDiary.map(d => {
        const areaInfo = AREAS_DEFINITION[d.area] || { name: d.area, color: '#d4af37' };
        const dateStr = new Date(d.date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
        return `
          <div style="padding: 12px 0; border-bottom: 1px solid var(--border-subtle); display: flex; gap: 14px; align-items: flex-start;">
            <div style="font-size: 0.75rem; color: var(--text-muted); font-weight: 600; min-width: 48px; padding-top: 2px;">
              ${dateStr}
            </div>
            <div style="flex: 1;">
              <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 3px;">
                <span class="area-tag" style="font-size: 0.68rem; padding: 1px 6px;">${areaInfo.name}</span>
                <span style="font-weight: 600; font-size: 0.88rem; color: #fff;">${d.title}</span>
              </div>
              <p style="font-size: 0.82rem; color: var(--text-secondary); line-height: 1.45;">
                ${d.learned || d.description.slice(0, 110) + '...'}
              </p>
            </div>
          </div>
        `;
      }).join('');
    }

    // Gráfico de Teia das 8 Áreas no Dashboard
    const areaScores = {};
    Object.keys(AREAS_DEFINITION).forEach(key => {
      const areaGoals = goals.filter(g => g.area === key);
      const areaDiary = diary.filter(d => d.area === key);
      // Cálculo de score ponderado e harmonioso
      let score = 30; // base
      if (areaGoals.length > 0) {
        const avgProg = areaGoals.reduce((acc, g) => acc + g.progress, 0) / areaGoals.length;
        score += avgProg * 0.45;
      }
      score += Math.min(25, areaDiary.length * 8);
      areaScores[key] = Math.min(100, Math.round(score));
    });

    this.charts.renderRadarChart('radarDashboardChart', areaScores);

    // Ciclo de Revisões
    const reviewReminderBox = document.getElementById('dashReviewReminderBox');
    const latestWeekly = this.storage.data.reviews.weekly[0];
    const weeklyDate = latestWeekly ? new Date(latestWeekly.date).toLocaleDateString('pt-BR') : 'Pendente';

    reviewReminderBox.innerHTML = `
      <div style="background-color: var(--bg-surface); padding: 14px; border-radius: var(--radius-md); font-size: 0.82rem; margin-bottom: 12px;">
        <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
          <span style="color: var(--text-muted);">Última Revisão Semanal:</span>
          <strong style="color: var(--text-primary);">${weeklyDate}</strong>
        </div>
        <div style="font-size: 0.78rem; color: var(--text-secondary);">
          Reserve um momento de silêncio para avaliar o que funcionou e redefinir o curso.
        </div>
      </div>
      <button class="btn btn-outline-gold" style="width: 100%; font-size: 0.82rem;" id="btnDashQuickReview">
        Realizar Revisão Semanal Agora
      </button>
    `;

    document.getElementById('btnDashQuickReview')?.addEventListener('click', () => {
      this.switchView('reviews');
      this.openWeeklyReviewModal();
    });
  }

  /* ========================================================
     2. ÁREAS DE DESENVOLVIMENTO
     ======================================================== */
  renderAreasView() {
    const grid = document.getElementById('areasCardsGrid');
    const detailContainer = document.getElementById('areaDetailView');
    detailContainer.style.display = 'none';

    grid.innerHTML = Object.entries(AREAS_DEFINITION).map(([key, area]) => {
      const areaGoals = this.storage.data.goals.filter(g => g.area === key);
      const areaDiary = this.storage.data.diary.filter(d => d.area === key);
      const activeCount = areaGoals.filter(g => g.status === 'em_andamento').length;
      const completedCount = areaGoals.filter(g => g.status === 'concluido').length;
      const iconSvg = this.icons[key] || this.icons.areas;

      return `
        <div class="area-card" data-area="${key}">
          <div>
            <div class="area-card-top">
              <div class="area-icon-box" style="color: ${area.color};">
                ${iconSvg}
              </div>
              <h3 class="area-card-title">${area.name}</h3>
            </div>
            <p class="area-card-desc">${area.description}</p>
          </div>

          <div>
            <div class="area-card-stats">
              <span><strong>${activeCount}</strong> metas ativas</span>
              <span><strong>${areaDiary.length}</strong> reflexões</span>
            </div>
            <button class="btn btn-secondary" style="width: 100%; margin-top: 12px; font-size: 0.78rem;" data-open-area="${key}">
              Aprofundar Área
            </button>
          </div>
        </div>
      `;
    }).join('');

    // Listener para aprofundar na área selecionada
    grid.querySelectorAll('[data-open-area]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const areaKey = btn.getAttribute('data-open-area');
        this.renderAreaDetail(areaKey);
      });
    });
  }

  renderAreaDetail(areaKey) {
    const area = AREAS_DEFINITION[areaKey];
    if (!area) return;

    const detailContainer = document.getElementById('areaDetailView');
    detailContainer.style.display = 'block';

    const areaGoals = this.storage.data.goals.filter(g => g.area === areaKey);
    const areaDiary = this.storage.data.diary.filter(d => d.area === areaKey);

    detailContainer.innerHTML = `
      <div class="vesper-card" style="border-top: 3px solid ${area.color};">
        <div class="card-header" style="margin-bottom: 20px;">
          <div>
            <span class="area-tag" style="color: ${area.color}; border-color: ${area.color}40;">Dimensão Estratégica</span>
            <h2 style="font-size: 1.4rem; font-weight: 700; margin-top: 6px; color: #fff;">${area.name}</h2>
            <p style="color: var(--text-secondary); font-size: 0.88rem; max-width: 750px; margin-top: 4px;">${area.description}</p>
          </div>
          <div style="display: flex; gap: 8px;">
            <button class="btn btn-outline-gold" id="btnAddAreaGoal">Nova Meta Aqui</button>
            <button class="btn btn-secondary" id="btnAddAreaDiary">Nova Reflexão</button>
            <button class="btn btn-secondary" id="btnCloseAreaDetail">Fechar Detalhe</button>
          </div>
        </div>

        <div class="grid-2">
          <!-- Metas desta área -->
          <div>
            <h4 style="font-size: 0.95rem; margin-bottom: 12px; color: var(--accent-gold-light);">Objetivos Vinculados (${areaGoals.length})</h4>
            ${areaGoals.length === 0 ? '<p style="color: var(--text-muted); font-size: 0.84rem;">Nenhum objetivo cadastrado nesta dimensão.</p>' : ''}
            ${areaGoals.map(g => `
              <div style="background-color: var(--bg-surface); padding: 12px 14px; border-radius: var(--radius-md); margin-bottom: 10px;">
                <div style="display: flex; justify-content: space-between; font-weight: 600; font-size: 0.9rem;">
                  <span>${g.title}</span>
                  <span class="badge ${g.status === 'concluido' ? 'badge-success' : 'badge-gold'}">${g.status.replace('_', ' ')}</span>
                </div>
                <div class="progress-bar-container">
                  <div class="progress-bar-fill" style="width: ${g.progress}%;"></div>
                </div>
              </div>
            `).join('')}
          </div>

          <!-- Registros de diário desta área -->
          <div>
            <h4 style="font-size: 0.95rem; margin-bottom: 12px; color: var(--accent-gold-light);">Reflexões & Lições (${areaDiary.length})</h4>
            ${areaDiary.length === 0 ? '<p style="color: var(--text-muted); font-size: 0.84rem;">Nenhuma reflexão documentada nesta dimensão.</p>' : ''}
            ${areaDiary.map(d => `
              <div style="background-color: var(--bg-surface); padding: 12px 14px; border-radius: var(--radius-md); margin-bottom: 10px;">
                <div style="font-weight: 600; font-size: 0.88rem; color: #fff;">${d.title}</div>
                <p style="font-size: 0.8rem; color: var(--text-secondary); margin-top: 4px;">${d.learned || d.description}</p>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;

    detailContainer.scrollIntoView({ behavior: 'smooth' });

    document.getElementById('btnCloseAreaDetail')?.addEventListener('click', () => {
      detailContainer.style.display = 'none';
    });

    document.getElementById('btnAddAreaGoal')?.addEventListener('click', () => {
      this.openGoalModal({ area: areaKey });
    });

    document.getElementById('btnAddAreaDiary')?.addEventListener('click', () => {
      this.openDiaryModal({ area: areaKey });
    });
  }

  /* ========================================================
     3. METAS E OBJETIVOS
     ======================================================== */
  renderGoalsView() {
    const container = document.getElementById('goalsContainerList');
    let goals = [...this.storage.data.goals];

    // Filtro por horizonte
    if (this.goalHorizonFilter !== 'all') {
      goals = goals.filter(g => g.horizon === this.goalHorizonFilter);
    }

    // Filtro por status
    if (this.goalStatusFilter !== 'all') {
      goals = goals.filter(g => g.status === this.goalStatusFilter);
    }

    // Filtro por busca
    if (this.goalSearchTerm) {
      goals = goals.filter(g => 
        g.title.toLowerCase().includes(this.goalSearchTerm) ||
        (g.description && g.description.toLowerCase().includes(this.goalSearchTerm))
      );
    }

    if (goals.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">${this.icons.goals}</div>
          <div class="empty-state-title">Nenhum objetivo encontrado</div>
          <div class="empty-state-desc">Tente ajustar os filtros ou crie um novo objetivo para começar.</div>
          <button class="btn btn-primary" id="btnEmptyStateNewGoal">Novo Objetivo</button>
        </div>
      `;
      document.getElementById('btnEmptyStateNewGoal')?.addEventListener('click', () => this.openGoalModal());
      return;
    }

    container.innerHTML = goals.map(g => {
      const area = AREAS_DEFINITION[g.area] || { name: g.area, color: '#d4af37' };
      const deadlineStr = g.deadline ? new Date(g.deadline + 'T00:00:00').toLocaleDateString('pt-BR') : 'Sem prazo definido';

      const statusLabels = {
        nao_iniciado: 'Não iniciado',
        em_andamento: 'Em andamento',
        concluido: 'Concluído',
        pausado: 'Pausado'
      };

      const statusBadgeClass = {
        nao_iniciado: 'badge-neutral',
        em_andamento: 'badge-gold',
        concluido: 'badge-success',
        pausado: 'badge-warning'
      };

      const stagesHtml = (g.stages || []).map(st => `
        <div class="stage-item ${st.done ? 'done' : ''}" data-goal-id="${g.id}" data-stage-id="${st.id}">
          <div class="stage-checkbox">
            ${st.done ? this.icons.check : ''}
          </div>
          <span class="stage-text">${st.title}</span>
        </div>
      `).join('');

      return `
        <div class="goal-card" data-goal-id="${g.id}">
          <div class="goal-card-header">
            <div>
              <div class="goal-meta-row" style="margin-bottom: 6px;">
                <span class="area-tag" style="color: ${area.color}; border-color: ${area.color}40;">${area.name}</span>
                <span class="badge ${statusBadgeClass[g.status] || 'badge-neutral'}">${statusLabels[g.status] || g.status}</span>
                <span class="badge badge-neutral">Horizonte: ${g.horizon.replace('_', ' ')}</span>
                <span class="badge ${g.priority === 'essencial' ? 'badge-gold' : 'badge-neutral'}">Prioridade: ${g.priority}</span>
              </div>
              <h3 class="goal-card-title">${g.title}</h3>
            </div>
            <div style="display: flex; gap: 6px;">
              <button class="btn-icon btn-edit-goal" data-id="${g.id}" title="Editar Objetivo">
                ${this.icons.edit}
              </button>
              <button class="btn-icon btn-delete-goal" data-id="${g.id}" title="Excluir Objetivo">
                ${this.icons.trash}
              </button>
            </div>
          </div>

          <p class="goal-card-desc">${g.description || ''}</p>

          <!-- Lista de Etapas (Checklist Interativo) -->
          ${stagesHtml ? `<div class="goal-stages-list">${stagesHtml}</div>` : ''}

          <!-- Barra de Progresso e Prazo -->
          <div style="display: flex; justify-content: space-between; align-items: center; font-size: 0.78rem; color: var(--text-muted); margin-top: 10px;">
            <span>Prazo: <strong>${deadlineStr}</strong></span>
            <span>Progresso: <strong style="color: var(--accent-gold-light);">${g.progress}%</strong></span>
          </div>
          <div class="progress-bar-container">
            <div class="progress-bar-fill" style="width: ${g.progress}%;"></div>
          </div>
        </div>
      `;
    }).join('');

    // Listeners nos checkboxes de etapas
    container.querySelectorAll('.stage-item').forEach(item => {
      item.addEventListener('click', (e) => {
        const goalId = item.getAttribute('data-goal-id');
        const stageId = item.getAttribute('data-stage-id');
        this.storage.toggleGoalStage(goalId, stageId);
        this.renderGoalsView();
      });
    });

    // Listeners de edição
    container.querySelectorAll('.btn-edit-goal').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const goalId = btn.getAttribute('data-id');
        const goal = this.storage.data.goals.find(g => g.id === goalId);
        if (goal) this.openGoalModal(goal, true);
      });
    });

    // Listeners de exclusão
    container.querySelectorAll('.btn-delete-goal').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const goalId = btn.getAttribute('data-id');
        const goal = this.storage.data.goals.find(g => g.id === goalId);
        if (!goal) return;
        this.showConfirm(
          'Excluir Objetivo',
          `Tem certeza que deseja excluir "${goal.title}"?`,
          () => {
            this.storage.deleteGoal(goalId);
            this.showToast('Objetivo removido.');
            this.renderGoalsView();
          }
        );
      });
    });
  }

  openGoalModal(initialData = {}, isEdit = false) {
    const areaOptions = Object.entries(AREAS_DEFINITION).map(([k, a]) => `
      <option value="${k}" ${initialData.area === k ? 'selected' : ''}>${a.name}</option>
    `).join('');

    const horizons = [
      { id: 'diario', label: 'Diário' },
      { id: 'semanal', label: 'Semanal' },
      { id: 'mensal', label: 'Mensal' },
      { id: 'anual', label: 'Anual' },
      { id: 'longo_prazo', label: 'Longo Prazo' }
    ];

    const horizonOptions = horizons.map(h => `
      <option value="${h.id}" ${initialData.horizon === h.id ? 'selected' : ''}>${h.label}</option>
    `).join('');

    const priorities = ['baixa', 'media', 'alta', 'essencial'];
    const priorityOptions = priorities.map(p => `
      <option value="${p}" ${initialData.priority === p ? 'selected' : ''}>${p.charAt(0).toUpperCase() + p.slice(1)}</option>
    `).join('');

    const statuses = [
      { id: 'nao_iniciado', label: 'Não Iniciado' },
      { id: 'em_andamento', label: 'Em Andamento' },
      { id: 'concluido', label: 'Concluído' },
      { id: 'pausado', label: 'Pausado' }
    ];

    const statusOptions = statuses.map(s => `
      <option value="${s.id}" ${(initialData.status || 'em_andamento') === s.id ? 'selected' : ''}>${s.label}</option>
    `).join('');

    // Etapas pré-existentes ou campo vazio
    const stagesText = (initialData.stages || []).map(s => s.title).join('\n');

    const formHtml = `
      <form id="formGoal">
        <div class="form-group">
          <label class="form-label">Título do Objetivo</label>
          <input type="text" class="form-input" id="goalTitle" required placeholder="Ex: Dominar Algoritmos e Estruturas de Dados" value="${initialData.title || ''}">
        </div>

        <div class="grid-2">
          <div class="form-group">
            <label class="form-label">Área Relacionada</label>
            <select class="form-select" id="goalArea">
              ${areaOptions}
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Horizonte Temporal</label>
            <select class="form-select" id="goalHorizon">
              ${horizonOptions}
            </select>
          </div>
        </div>

        <div class="grid-3">
          <div class="form-group">
            <label class="form-label">Prioridade</label>
            <select class="form-select" id="goalPriority">
              ${priorityOptions}
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Status</label>
            <select class="form-select" id="goalStatus">
              ${statusOptions}
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Prazo Final</label>
            <input type="date" class="form-input" id="goalDeadline" value="${initialData.deadline || ''}">
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">Descrição & Contexto</label>
          <textarea class="form-textarea" id="goalDescription" placeholder="Detalhes do objetivo, por que ele importa e como será medido...">${initialData.description || ''}</textarea>
        </div>

        <div class="form-group">
          <label class="form-label">Etapas Necessárias para Conclusão (uma por linha)</label>
          <textarea class="form-textarea" id="goalStages" placeholder="Etapa 1: Leitura inicial da bibliografia&#10;Etapa 2: Resolução de 50 exercícios&#10;Etapa 3: Revisão final">${stagesText}</textarea>
          <div style="font-size: 0.72rem; color: var(--text-muted); margin-top: 4px;">
            Cada linha se tornará uma caixinha de verificação clicável que calcula o progresso automaticamente.
          </div>
        </div>
      </form>
    `;

    this.openGenericModal(
      isEdit ? 'Editar Objetivo' : 'Criar Novo Objetivo',
      formHtml,
      () => {
        const title = document.getElementById('goalTitle').value.trim();
        if (!title) {
          alert('Por favor, informe o título do objetivo.');
          return;
        }

        const stagesLines = document.getElementById('goalStages').value.split('\n').map(l => l.trim()).filter(Boolean);
        const existingStages = initialData.stages || [];
        const stages = stagesLines.map((line, idx) => {
          const matchExisting = existingStages.find(s => s.title === line);
          return {
            id: matchExisting ? matchExisting.id : 's-' + Date.now() + '-' + idx,
            title: line,
            done: matchExisting ? matchExisting.done : false
          };
        });

        const goalPayload = {
          title,
          area: document.getElementById('goalArea').value,
          horizon: document.getElementById('goalHorizon').value,
          priority: document.getElementById('goalPriority').value,
          status: document.getElementById('goalStatus').value,
          deadline: document.getElementById('goalDeadline').value,
          description: document.getElementById('goalDescription').value.trim(),
          stages
        };

        if (isEdit && initialData.id) {
          this.storage.updateGoal(initialData.id, goalPayload);
          this.showToast('Objetivo atualizado.');
        } else {
          this.storage.addGoal(goalPayload);
          this.showToast('Objetivo cadastrado com sucesso!');
        }

        this.closeGenericModal();
        this.renderGoalsView();
      }
    );
  }

  /* ========================================================
     4. DIÁRIO DE DESENVOLVIMENTO
     ======================================================== */
  renderDiaryView() {
    const container = document.getElementById('diaryTimelineList');
    const areaFilterContainer = document.getElementById('diaryAreaFilters');

    // Injeta botões de áreas nos filtros se ainda não o fez
    if (areaFilterContainer.children.length === 1) {
      Object.entries(AREAS_DEFINITION).forEach(([k, a]) => {
        const btn = document.createElement('button');
        btn.className = 'filter-pill';
        btn.setAttribute('data-area', k);
        btn.textContent = a.name;
        btn.addEventListener('click', () => {
          document.querySelectorAll('#diaryAreaFilters .filter-pill').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          this.diaryAreaFilter = k;
          this.renderDiaryView();
        });
        areaFilterContainer.appendChild(btn);
      });

      // Botão "Todas"
      areaFilterContainer.children[0].addEventListener('click', () => {
        document.querySelectorAll('#diaryAreaFilters .filter-pill').forEach(b => b.classList.remove('active'));
        areaFilterContainer.children[0].classList.add('active');
        this.diaryAreaFilter = 'all';
        this.renderDiaryView();
      });
    }

    let diary = [...this.storage.data.diary];

    if (this.diaryAreaFilter !== 'all') {
      diary = diary.filter(d => d.area === this.diaryAreaFilter);
    }

    if (this.diarySearchTerm) {
      diary = diary.filter(d =>
        d.title.toLowerCase().includes(this.diarySearchTerm) ||
        (d.description && d.description.toLowerCase().includes(this.diarySearchTerm)) ||
        (d.learned && d.learned.toLowerCase().includes(this.diarySearchTerm)) ||
        (d.reflection && d.reflection.toLowerCase().includes(this.diarySearchTerm))
      );
    }

    if (diary.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">${this.icons.diary}</div>
          <div class="empty-state-title">Nenhum registro encontrado no diário</div>
          <div class="empty-state-desc">Documente suas reflexões, conquistas e dificuldades para acompanhar seu amadurecimento.</div>
          <button class="btn btn-primary" id="btnEmptyStateNewDiary">Novo Registro</button>
        </div>
      `;
      document.getElementById('btnEmptyStateNewDiary')?.addEventListener('click', () => this.openDiaryModal());
      return;
    }

    container.innerHTML = diary.map(d => {
      const area = AREAS_DEFINITION[d.area] || { name: d.area, color: '#d4af37' };
      const dateObj = new Date(d.date);
      const formattedDate = dateObj.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });
      const formattedTime = dateObj.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

      return `
        <div class="timeline-entry">
          <div class="timeline-node"></div>
          <div class="diary-card">
            <div class="diary-header">
              <div>
                <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
                  <span class="area-tag" style="color: ${area.color}; border-color: ${area.color}40;">${area.name}</span>
                  <span class="diary-date">${formattedDate} às ${formattedTime}</span>
                </div>
                <h3 class="diary-title">${d.title}</h3>
              </div>
              <div style="display: flex; gap: 6px;">
                <button class="btn-icon btn-edit-diary" data-id="${d.id}" title="Editar">${this.icons.edit}</button>
                <button class="btn-icon btn-delete-diary" data-id="${d.id}" title="Excluir">${this.icons.trash}</button>
              </div>
            </div>

            <p class="diary-body">${d.description}</p>

            <div class="diary-breakdown">
              ${d.learned ? `
                <div class="breakdown-item">
                  <strong>Aprendizado Adquirido</strong>
                  <p>${d.learned}</p>
                </div>
              ` : ''}

              ${d.difficulty ? `
                <div class="breakdown-item">
                  <strong>Dificuldade Enfrentada</strong>
                  <p>${d.difficulty}</p>
                </div>
              ` : ''}

              ${d.result ? `
                <div class="breakdown-item">
                  <strong>Resultado Obtido</strong>
                  <p>${d.result}</p>
                </div>
              ` : ''}

              ${d.reflection ? `
                <div class="breakdown-item">
                  <strong>Reflexão Pessoal</strong>
                  <p>${d.reflection}</p>
                </div>
              ` : ''}
            </div>
          </div>
        </div>
      `;
    }).join('');

    // Listeners nos botões
    container.querySelectorAll('.btn-edit-diary').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const entry = this.storage.data.diary.find(d => d.id === id);
        if (entry) this.openDiaryModal(entry, true);
      });
    });

    container.querySelectorAll('.btn-delete-diary').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        this.showConfirm(
          'Excluir Registro do Diário',
          'Tem certeza que deseja apagar esta reflexão? Esta ação não pode ser desfeita.',
          () => {
            this.storage.deleteDiaryEntry(id);
            this.showToast('Registro excluído.');
            this.renderDiaryView();
          }
        );
      });
    });
  }

  openDiaryModal(initialData = {}, isEdit = false) {
    const areaOptions = Object.entries(AREAS_DEFINITION).map(([k, a]) => `
      <option value="${k}" ${initialData.area === k ? 'selected' : ''}>${a.name}</option>
    `).join('');

    const nowIso = new Date().toISOString().slice(0, 16);

    const formHtml = `
      <form id="formDiary">
        <div class="form-group">
          <label class="form-label">Título da Reflexão ou Acontecimento</label>
          <input type="text" class="form-input" id="diaryTitle" required placeholder="Ex: Superação da hesitação na fala pública" value="${initialData.title || ''}">
        </div>

        <div class="grid-2">
          <div class="form-group">
            <label class="form-label">Área Relacionada</label>
            <select class="form-select" id="diaryArea">
              ${areaOptions}
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Data e Horário</label>
            <input type="datetime-local" class="form-input" id="diaryDate" value="${initialData.date || nowIso}">
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">Descrição Livre do Acontecimento</label>
          <textarea class="form-textarea" id="diaryDesc" required placeholder="O que exatamente aconteceu? Descreva os fatos com objetividade...">${initialData.description || ''}</textarea>
        </div>

        <div class="grid-2">
          <div class="form-group">
            <label class="form-label">Aprendizado Adquirido</label>
            <textarea class="form-textarea" style="min-height: 70px;" id="diaryLearned" placeholder="O que esta experiência ensinou de forma clara?">${initialData.learned || ''}</textarea>
          </div>
          <div class="form-group">
            <label class="form-label">Dificuldade Enfrentada</label>
            <textarea class="form-textarea" style="min-height: 70px;" id="diaryDifficulty" placeholder="Onde esteve o atrito ou hesitação interna?">${initialData.difficulty || ''}</textarea>
          </div>
        </div>

        <div class="grid-2">
          <div class="form-group">
            <label class="form-label">Resultado Obtido</label>
            <textarea class="form-textarea" style="min-height: 70px;" id="diaryResult" placeholder="Qual foi o desfecho concreto?">${initialData.result || ''}</textarea>
          </div>
          <div class="form-group">
            <label class="form-label">Reflexão Pessoal / Princípio Extraído</label>
            <textarea class="form-textarea" style="min-height: 70px;" id="diaryReflection" placeholder="Princípio perene para guardar para a vida...">${initialData.reflection || ''}</textarea>
          </div>
        </div>
      </form>
    `;

    this.openGenericModal(
      isEdit ? 'Editar Registro no Diário' : 'Novo Registro no Diário',
      formHtml,
      () => {
        const title = document.getElementById('diaryTitle').value.trim();
        const description = document.getElementById('diaryDesc').value.trim();

        if (!title || !description) {
          alert('Por favor, preencha o título e a descrição do acontecimento.');
          return;
        }

        const payload = {
          title,
          area: document.getElementById('diaryArea').value,
          date: document.getElementById('diaryDate').value,
          description,
          learned: document.getElementById('diaryLearned').value.trim(),
          difficulty: document.getElementById('diaryDifficulty').value.trim(),
          result: document.getElementById('diaryResult').value.trim(),
          reflection: document.getElementById('diaryReflection').value.trim()
        };

        if (isEdit && initialData.id) {
          this.storage.updateDiaryEntry(initialData.id, payload);
          this.showToast('Registro atualizado.');
        } else {
          this.storage.addDiaryEntry(payload);
          this.showToast('Reflexão registrada no diário!');
        }

        this.closeGenericModal();
        this.renderDiaryView();
      }
    );
  }

  // Modal de Registro Rápido
  openQuickRecordModal() {
    const areaOptions = Object.entries(AREAS_DEFINITION).map(([k, a]) => `
      <option value="${k}">${a.name}</option>
    `).join('');

    const formHtml = `
      <form id="formQuickRecord">
        <div class="form-group">
          <label class="form-label">O que você aprendeu ou observou agora?</label>
          <input type="text" class="form-input" id="quickTitle" placeholder="Título ou insight rápido..." required>
        </div>

        <div class="form-group">
          <label class="form-label">Área Relacionada</label>
          <select class="form-select" id="quickArea">
            ${areaOptions}
          </select>
        </div>

        <div class="form-group">
          <label class="form-label">Reflexão / Anotação Rápida</label>
          <textarea class="form-textarea" id="quickNotes" placeholder="Escreva sucintamente o acontecimento ou pensamento..." required></textarea>
        </div>
      </form>
    `;

    this.openGenericModal(
      'Registro Rápido de Evolução',
      formHtml,
      () => {
        const title = document.getElementById('quickTitle').value.trim();
        const notes = document.getElementById('quickNotes').value.trim();
        if (!title || !notes) {
          alert('Preencha os campos para salvar.');
          return;
        }

        this.storage.addDiaryEntry({
          title,
          area: document.getElementById('quickArea').value,
          description: notes,
          reflection: notes
        });

        this.showToast('Registro rápido salvo no Diário!');
        this.closeGenericModal();
        this.renderCurrentView();
      }
    );
  }

  /* ========================================================
     5. EXPERIÊNCIAS E DESAFIOS
     ======================================================== */
  renderExperiencesView() {
    const container = document.getElementById('experiencesListContainer');
    const suggestionsGrid = document.getElementById('quickChallengeSuggestions');
    const badgeCount = document.getElementById('totalExpCountBadge');

    const expList = this.storage.data.experiences;
    badgeCount.textContent = `${expList.length} experiências registradas`;

    // Sugestões de desafios para romper inércia
    const suggestions = [
      {
        title: 'Diálogo Espontâneo com Desconhecido',
        area: 'social',
        objective: 'Vencer o receio da rejeição e treinar carisma e escuta genuína.'
      },
      {
        title: 'Desconexão Total de Telas por 24 Horas',
        area: 'emocional',
        objective: 'Desintoxicar atenção e recuperar a capacidade de leitura profunda.'
      },
      {
        title: 'Conduzir Apresentação ou Aula Técnica',
        area: 'profissional',
        objective: 'Testar didática e segurança ao comunicar conceitos complexos de ADS.'
      }
    ];

    suggestionsGrid.innerHTML = suggestions.map((s, idx) => `
      <div style="background-color: var(--bg-surface); padding: 14px; border-radius: var(--radius-md); border: 1px solid var(--border-subtle); display: flex; flex-direction: column; justify-content: space-between;">
        <div>
          <span class="area-tag" style="margin-bottom: 6px;">${AREAS_DEFINITION[s.area]?.name || s.area}</span>
          <div style="font-weight: 600; font-size: 0.88rem; color: #fff; margin-bottom: 4px;">${s.title}</div>
          <p style="font-size: 0.78rem; color: var(--text-secondary); line-height: 1.4;">${s.objective}</p>
        </div>
        <button class="btn btn-outline-gold btn-take-challenge" data-idx="${idx}" style="font-size: 0.75rem; margin-top: 12px; padding: 5px 10px;">
          Assumir Desafio
        </button>
      </div>
    `).join('');

    suggestionsGrid.querySelectorAll('.btn-take-challenge').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = btn.getAttribute('data-idx');
        const s = suggestions[idx];
        this.openExperienceModal({
          title: s.title,
          area: s.area,
          objective: s.objective,
          status: 'planejada'
        });
      });
    });

    if (expList.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">${this.icons.experiences}</div>
          <div class="empty-state-title">Nenhuma experiência registrada ainda</div>
          <div class="empty-state-desc">Assuma desafios do mundo real para transformar potencial em capacidade concreta.</div>
        </div>
      `;
      return;
    }

    container.innerHTML = expList.map(e => {
      const area = AREAS_DEFINITION[e.area] || { name: e.area, color: '#d4af37' };
      const dateStr = e.date ? new Date(e.date + 'T00:00:00').toLocaleDateString('pt-BR') : 'Data não informada';

      return `
        <div class="experience-card">
          <div class="diary-header">
            <div>
              <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
                <span class="area-tag" style="color: ${area.color}; border-color: ${area.color}40;">${area.name}</span>
                <span class="badge ${e.status === 'concluida' ? 'badge-success' : 'badge-gold'}">
                  ${e.status === 'concluida' ? 'Concluída' : 'Planejada'}
                </span>
                <span class="diary-date">${dateStr}</span>
              </div>
              <h3 style="font-size: 1.05rem; font-weight: 600; color: #fff;">${e.title}</h3>
            </div>
            <div style="display: flex; gap: 6px;">
              <button class="btn-icon btn-edit-exp" data-id="${e.id}" title="Editar">${this.icons.edit}</button>
              <button class="btn-icon btn-delete-exp" data-id="${e.id}" title="Excluir">${this.icons.trash}</button>
            </div>
          </div>

          <div style="margin: 10px 0; font-size: 0.86rem; color: var(--text-secondary);">
            <strong>Objetivo:</strong> ${e.objective || 'Não informado'}
          </div>

          <div class="experience-grid">
            ${e.whatWasDone ? `
              <div class="exp-box">
                <div class="exp-box-title">O Que Foi Feito</div>
                <p style="color: var(--text-primary); font-size: 0.82rem;">${e.whatWasDone}</p>
              </div>
            ` : ''}

            ${e.learned ? `
              <div class="exp-box">
                <div class="exp-box-title">O Que Aprendeu</div>
                <p style="color: var(--text-primary); font-size: 0.82rem;">${e.learned}</p>
              </div>
            ` : ''}

            ${e.whatToDoDifferently ? `
              <div class="exp-box">
                <div class="exp-box-title">O Que Faria Diferente</div>
                <p style="color: var(--text-primary); font-size: 0.82rem;">${e.whatToDoDifferently}</p>
              </div>
            ` : ''}
          </div>
        </div>
      `;
    }).join('');

    container.querySelectorAll('.btn-edit-exp').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const exp = this.storage.data.experiences.find(e => e.id === id);
        if (exp) this.openExperienceModal(exp, true);
      });
    });

    container.querySelectorAll('.btn-delete-exp').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        this.showConfirm(
          'Excluir Experiência',
          'Tem certeza que deseja apagar o registro desta experiência?',
          () => {
            this.storage.deleteExperience(id);
            this.showToast('Experiência removida.');
            this.renderExperiencesView();
          }
        );
      });
    });
  }

  openExperienceModal(initialData = {}, isEdit = false) {
    const areaOptions = Object.entries(AREAS_DEFINITION).map(([k, a]) => `
      <option value="${k}" ${initialData.area === k ? 'selected' : ''}>${a.name}</option>
    `).join('');

    const formHtml = `
      <form id="formExperience">
        <div class="form-group">
          <label class="form-label">Título da Experiência ou Desafio</label>
          <input type="text" class="form-input" id="expTitle" required placeholder="Ex: Conversar com um palestrante no intervalo do evento" value="${initialData.title || ''}">
        </div>

        <div class="grid-3">
          <div class="form-group">
            <label class="form-label">Área Relacionada</label>
            <select class="form-select" id="expArea">
              ${areaOptions}
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Data de Realização</label>
            <input type="date" class="form-input" id="expDate" value="${initialData.date || new Date().toISOString().slice(0, 10)}">
          </div>
          <div class="form-group">
            <label class="form-label">Status</label>
            <select class="form-select" id="expStatus">
              <option value="concluida" ${initialData.status === 'concluida' ? 'selected' : ''}>Concluída</option>
              <option value="planejada" ${initialData.status === 'planejada' ? 'selected' : ''}>Planejada</option>
            </select>
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">Qual era o Objetivo da Experiência?</label>
          <input type="text" class="form-input" id="expObjective" placeholder="Ex: Quebrar o medo de abordagem social e praticar oratória" value="${initialData.objective || ''}">
        </div>

        <div class="form-group">
          <label class="form-label">O Que Foi Feito na Prática? (Como foi a experiência)</label>
          <textarea class="form-textarea" id="expWhatWasDone" placeholder="Descreva os acontecimentos de forma precisa...">${initialData.whatWasDone || ''}</textarea>
        </div>

        <div class="grid-2">
          <div class="form-group">
            <label class="form-label">O Que Aprendeu?</label>
            <textarea class="form-textarea" id="expLearned" placeholder="Qual conclusão prática ficou?">${initialData.learned || ''}</textarea>
          </div>
          <div class="form-group">
            <label class="form-label">O Que Faria Diferente Numa Próxima Vez?</label>
            <textarea class="form-textarea" id="expDiff" placeholder="Pontos de melhoria identificados...">${initialData.whatToDoDifferently || ''}</textarea>
          </div>
        </div>
      </form>
    `;

    this.openGenericModal(
      isEdit ? 'Editar Experiência' : 'Registrar Nova Experiência',
      formHtml,
      () => {
        const title = document.getElementById('expTitle').value.trim();
        if (!title) {
          alert('Por favor, informe o título da experiência.');
          return;
        }

        const payload = {
          title,
          area: document.getElementById('expArea').value,
          date: document.getElementById('expDate').value,
          status: document.getElementById('expStatus').value,
          objective: document.getElementById('expObjective').value.trim(),
          whatWasDone: document.getElementById('expWhatWasDone').value.trim(),
          learned: document.getElementById('expLearned').value.trim(),
          whatToDoDifferently: document.getElementById('expDiff').value.trim()
        };

        if (isEdit && initialData.id) {
          this.storage.updateExperience(initialData.id, payload);
          this.showToast('Experiência atualizada.');
        } else {
          this.storage.addExperience(payload);
          this.showToast('Experiência registrada!');
        }

        this.closeGenericModal();
        this.renderExperiencesView();
      }
    );
  }

  /* ========================================================
     6. ESTATÍSTICAS E INDICADORES
     ======================================================== */
  renderStatsView() {
    const goals = this.storage.data.goals;
    const diary = this.storage.data.diary;

    // Frequência de Registros Mensais
    const monthsData = [
      { label: 'Jul', value: 8 },
      { label: 'Ago', value: 12 },
      { label: 'Set', value: 15 },
      { label: 'Out', value: 19 },
      { label: 'Nov', value: diary.length + 8 },
      { label: 'Dez', value: 24 }
    ];
    this.charts.renderEvolutionLineChart('statsLineChartContainer', monthsData);

    // Donut de Metas
    const statusCounts = {
      concluido: goals.filter(g => g.status === 'concluido').length,
      em_andamento: goals.filter(g => g.status === 'em_andamento').length,
      pausado: goals.filter(g => g.status === 'pausado').length,
      nao_iniciado: goals.filter(g => g.status === 'nao_iniciado').length
    };
    this.charts.renderStatusDonut('statsDonutChartContainer', statusCounts);

    // Barras por Área
    const barItems = Object.entries(AREAS_DEFINITION).map(([k, a]) => ({
      name: a.name,
      value: goals.filter(g => g.area === k).length,
      color: a.color
    }));
    this.charts.renderBarChart('statsBarChartContainer', barItems);

    // Resumo de Indicadores
    const metricsContainer = document.getElementById('statsSummaryMetrics');
    metricsContainer.innerHTML = `
      <div style="background-color: var(--bg-surface); padding: 12px 16px; border-radius: var(--radius-md); display: flex; justify-content: space-between; align-items: center;">
        <span style="color: var(--text-secondary); font-size: 0.85rem;">Dimensão Mais Ativa Atualmente</span>
        <strong style="color: var(--accent-gold-light); font-size: 0.9rem;">Profissional & ADS</strong>
      </div>
      <div style="background-color: var(--bg-surface); padding: 12px 16px; border-radius: var(--radius-md); display: flex; justify-content: space-between; align-items: center;">
        <span style="color: var(--text-secondary); font-size: 0.85rem;">Regularidade de Registro no Diário</span>
        <strong style="color: var(--status-success); font-size: 0.9rem;">Alta Consistência</strong>
      </div>
      <div style="background-color: var(--bg-surface); padding: 12px 16px; border-radius: var(--radius-md); display: flex; justify-content: space-between; align-items: center;">
        <span style="color: var(--text-secondary); font-size: 0.85rem;">Total de Etapas Concluídas em Metas</span>
        <strong style="color: #fff; font-size: 0.9rem;">
          ${goals.reduce((acc, g) => acc + (g.stages || []).filter(s => s.done).length, 0)} etapas
        </strong>
      </div>
      <div style="background-color: var(--bg-surface); padding: 12px 16px; border-radius: var(--radius-md); display: flex; justify-content: space-between; align-items: center;">
        <span style="color: var(--text-secondary); font-size: 0.85rem;">Maturidade de Autoavaliação</span>
        <strong style="color: var(--accent-bronze); font-size: 0.9rem;">Sóbria & Reflexiva</strong>
      </div>
    `;
  }

  /* ========================================================
     7. REVISÕES PERIÓDICAS (Semanal e Mensal)
     ======================================================== */
  renderReviewsView() {
    const container = document.getElementById('reviewsListContainer');
    const isWeekly = this.activeReviewTab === 'weekly';
    const reviews = isWeekly ? this.storage.data.reviews.weekly : this.storage.data.reviews.monthly;

    if (reviews.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">${this.icons.reviews}</div>
          <div class="empty-state-title">Nenhuma revisão ${isWeekly ? 'semanal' : 'mensal'} registrada</div>
          <div class="empty-state-desc">A revisão periódica é o momento em que a bússola é ajustada com honestidade.</div>
          <button class="btn btn-primary" id="btnEmptyStateReview">
            Criar ${isWeekly ? 'Revisão Semanal' : 'Revisão Mensal'}
          </button>
        </div>
      `;
      document.getElementById('btnEmptyStateReview')?.addEventListener('click', () => {
        if (isWeekly) this.openWeeklyReviewModal();
        else this.openMonthlyReviewModal();
      });
      return;
    }

    container.innerHTML = reviews.map(r => {
      const dateFormatted = new Date(r.date).toLocaleDateString('pt-BR');

      if (isWeekly) {
        return `
          <div class="vesper-card" style="margin-bottom: 24px;">
            <div class="card-header" style="border-bottom: 1px solid var(--border-subtle); padding-bottom: 12px;">
              <div>
                <span class="badge badge-gold">Revisão Semanal</span>
                <h3 style="font-size: 1.15rem; font-weight: 600; color: #fff; margin-top: 4px;">${r.period || 'Semana'}</h3>
                <span style="font-size: 0.78rem; color: var(--text-muted);">Realizada em ${dateFormatted}</span>
              </div>
              <button class="btn-icon btn-delete-rev" data-type="weekly" data-id="${r.id}" title="Excluir Revisão">
                ${this.icons.trash}
              </button>
            </div>

            <div style="display: flex; flex-direction: column; gap: 14px; margin-top: 16px;">
              <div class="review-question-card">
                <div class="review-q-num">Questão 01</div>
                <div class="review-q-title">O que consegui realizar?</div>
                <div class="review-q-answer">${r.q1_achieved}</div>
              </div>

              <div class="review-question-card">
                <div class="review-q-num">Questão 02</div>
                <div class="review-q-title">O que não consegui realizar?</div>
                <div class="review-q-answer">${r.q2_notAchieved}</div>
              </div>

              <div class="review-question-card">
                <div class="review-q-num">Questão 03</div>
                <div class="review-q-title">Quais foram minhas principais dificuldades?</div>
                <div class="review-q-answer">${r.q3_difficulties}</div>
              </div>

              <div class="review-question-card">
                <div class="review-q-num">Questão 04</div>
                <div class="review-q-title">O que aprendi?</div>
                <div class="review-q-answer">${r.q4_learned}</div>
              </div>

              <div class="review-question-card">
                <div class="review-q-num">Questão 05</div>
                <div class="review-q-title">Qual comportamento preciso melhorar?</div>
                <div class="review-q-answer">${r.q5_improveBehavior}</div>
              </div>

              <div class="review-question-card">
                <div class="review-q-num">Questão 06</div>
                <div class="review-q-title">Quais são minhas prioridades para a próxima semana?</div>
                <div class="review-q-answer">${r.q6_nextPriorities}</div>
              </div>
            </div>
          </div>
        `;
      } else {
        // Mensal
        return `
          <div class="vesper-card" style="margin-bottom: 24px;">
            <div class="card-header" style="border-bottom: 1px solid var(--border-subtle); padding-bottom: 12px;">
              <div>
                <span class="badge badge-gold">Revisão Mensal</span>
                <h3 style="font-size: 1.15rem; font-weight: 600; color: #fff; margin-top: 4px;">${r.period || 'Mês'}</h3>
                <span style="font-size: 0.78rem; color: var(--text-muted);">Realizada em ${dateFormatted}</span>
              </div>
              <button class="btn-icon btn-delete-rev" data-type="monthly" data-id="${r.id}" title="Excluir Revisão">
                ${this.icons.trash}
              </button>
            </div>

            <div style="display: flex; flex-direction: column; gap: 14px; margin-top: 16px;">
              <div class="review-question-card">
                <div class="review-q-num">Questão 01</div>
                <div class="review-q-title">Quais foram minhas principais conquistas?</div>
                <div class="review-q-answer">${r.q1_achievements}</div>
              </div>

              <div class="review-question-card">
                <div class="review-q-num">Questão 02</div>
                <div class="review-q-title">Em quais áreas evoluí?</div>
                <div class="review-q-answer">${r.q2_areasEvolved}</div>
              </div>

              <div class="review-question-card">
                <div class="review-q-num">Questão 03</div>
                <div class="review-q-title">Onde fiquei estagnado?</div>
                <div class="review-q-answer">${r.q3_stagnantAreas}</div>
              </div>

              <div class="review-question-card">
                <div class="review-q-num">Questão 04</div>
                <div class="review-q-title">Quais objetivos perderam relevância?</div>
                <div class="review-q-answer">${r.q4_goalsLostRelevance}</div>
              </div>

              <div class="review-question-card">
                <div class="review-q-num">Questão 05</div>
                <div class="review-q-title">Quais decisões preciso tomar?</div>
                <div class="review-q-answer">${r.q5_decisionsToTake}</div>
              </div>

              <div class="review-question-card">
                <div class="review-q-num">Questão 06</div>
                <div class="review-q-title">O que quero experimentar no próximo mês?</div>
                <div class="review-q-answer">${r.q6_experimentsNextMonth}</div>
              </div>
            </div>
          </div>
        `;
      }
    }).join('');

    container.querySelectorAll('.btn-delete-rev').forEach(btn => {
      btn.addEventListener('click', () => {
        const type = btn.getAttribute('data-type');
        const id = btn.getAttribute('data-id');
        this.showConfirm(
          'Excluir Revisão',
          'Deseja apagar este registro de revisão periódica?',
          () => {
            this.storage.deleteReview(type, id);
            this.showToast('Revisão excluída.');
            this.renderReviewsView();
          }
        );
      });
    });
  }

  openWeeklyReviewModal() {
    const formHtml = `
      <form id="formWeeklyReview">
        <div class="form-group">
          <label class="form-label">Identificação do Período (Ex: Semana 48 / 2026)</label>
          <input type="text" class="form-input" id="rwPeriod" required value="Semana de ${new Date().toLocaleDateString('pt-BR')}">
        </div>

        <div class="form-group">
          <label class="form-label">1. O que consegui realizar nesta semana?</label>
          <textarea class="form-textarea" id="rwQ1" required placeholder="Liste os marcos concluídos, treinos, estudos e entregas..."></textarea>
        </div>

        <div class="form-group">
          <label class="form-label">2. O que não consegui realizar?</label>
          <textarea class="form-textarea" id="rwQ2" required placeholder="O que ficou pendente ou foi negligenciado?"></textarea>
        </div>

        <div class="form-group">
          <label class="form-label">3. Quais foram minhas principais dificuldades?</label>
          <textarea class="form-textarea" id="rwQ3" required placeholder="Onde esteve o atrito: cansaço, imprevistos, desorganização?"></textarea>
        </div>

        <div class="form-group">
          <label class="form-label">4. O que aprendi?</label>
          <textarea class="form-textarea" id="rwQ4" required placeholder="A lição central que essa semana gravou..."></textarea>
        </div>

        <div class="form-group">
          <label class="form-label">5. Qual comportamento preciso melhorar?</label>
          <textarea class="form-textarea" id="rwQ5" required placeholder="Ajuste de postura, uso do celular, pontualidade..."></textarea>
        </div>

        <div class="form-group">
          <label class="form-label">6. Quais são minhas prioridades para a próxima semana?</label>
          <textarea class="form-textarea" id="rwQ6" required placeholder="As 3 tarefas prioritárias inegociáveis..."></textarea>
        </div>
      </form>
    `;

    this.openGenericModal(
      'Nova Revisão Semanal',
      formHtml,
      () => {
        const payload = {
          period: document.getElementById('rwPeriod').value.trim(),
          q1_achieved: document.getElementById('rwQ1').value.trim(),
          q2_notAchieved: document.getElementById('rwQ2').value.trim(),
          q3_difficulties: document.getElementById('rwQ3').value.trim(),
          q4_learned: document.getElementById('rwQ4').value.trim(),
          q5_improveBehavior: document.getElementById('rwQ5').value.trim(),
          q6_nextPriorities: document.getElementById('rwQ6').value.trim()
        };

        if (!payload.q1_achieved || !payload.q4_learned) {
          alert('Preencha as respostas para concluir a revisão.');
          return;
        }

        this.storage.addReview('weekly', payload);
        this.showToast('Revisão semanal salva com sucesso!');
        this.closeGenericModal();
        this.activeReviewTab = 'weekly';
        this.renderReviewsView();
      }
    );
  }

  openMonthlyReviewModal() {
    const formHtml = `
      <form id="formMonthlyReview">
        <div class="form-group">
          <label class="form-label">Identificação do Mês (Ex: Novembro / 2026)</label>
          <input type="text" class="form-input" id="rmPeriod" required value="${new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}">
        </div>

        <div class="form-group">
          <label class="form-label">1. Quais foram minhas principais conquistas?</label>
          <textarea class="form-textarea" id="rmQ1" required placeholder="Grandes avanços nas metas, projetos e caráter..."></textarea>
        </div>

        <div class="form-group">
          <label class="form-label">2. Em quais áreas evoluí?</label>
          <textarea class="form-textarea" id="rmQ2" required placeholder="Quais das 8 dimensões tiveram maior tração?"></textarea>
        </div>

        <div class="form-group">
          <label class="form-label">3. Onde fiquei estagnado?</label>
          <textarea class="form-textarea" id="rmQ3" required placeholder="Onde o progresso foi nulo ou recuou?"></textarea>
        </div>

        <div class="form-group">
          <label class="form-label">4. Quais objetivos perderam relevância?</label>
          <textarea class="form-textarea" id="rmQ4" required placeholder="O que faz sentido abandonar ou pausar conscientemente?"></textarea>
        </div>

        <div class="form-group">
          <label class="form-label">5. Quais decisões preciso tomar?</label>
          <textarea class="form-textarea" id="rmQ5" required placeholder="Decisões difíceis ou cortes necessários..."></textarea>
        </div>

        <div class="form-group">
          <label class="form-label">6. O que quero experimentar no próximo mês?</label>
          <textarea class="form-textarea" id="rmQ6" required placeholder="Novas práticas, rotinas ou desafios..."></textarea>
        </div>
      </form>
    `;

    this.openGenericModal(
      'Nova Revisão Mensal',
      formHtml,
      () => {
        const payload = {
          period: document.getElementById('rmPeriod').value.trim(),
          q1_achievements: document.getElementById('rmQ1').value.trim(),
          q2_areasEvolved: document.getElementById('rmQ2').value.trim(),
          q3_stagnantAreas: document.getElementById('rmQ3').value.trim(),
          q4_goalsLostRelevance: document.getElementById('rmQ4').value.trim(),
          q5_decisionsToTake: document.getElementById('rmQ5').value.trim(),
          q6_experimentsNextMonth: document.getElementById('rmQ6').value.trim()
        };

        if (!payload.q1_achievements) {
          alert('Preencha os campos para salvar a revisão mensal.');
          return;
        }

        this.storage.addReview('monthly', payload);
        this.showToast('Revisão mensal arquivada!');
        this.closeGenericModal();
        this.activeReviewTab = 'monthly';
        this.renderReviewsView();
      }
    );
  }

  /* ========================================================
     8. BIBLIOTECA PESSOAL
     ======================================================== */
  renderLibraryView() {
    const grid = document.getElementById('libraryCardsGrid');
    let items = [...this.storage.data.library];

    if (this.libraryTypeFilter !== 'all') {
      items = items.filter(i => i.category === this.libraryTypeFilter);
    }

    if (this.librarySearchTerm) {
      items = items.filter(i =>
        i.title.toLowerCase().includes(this.librarySearchTerm) ||
        (i.author && i.author.toLowerCase().includes(this.librarySearchTerm)) ||
        (i.notes && i.notes.toLowerCase().includes(this.librarySearchTerm))
      );
    }

    if (items.length === 0) {
      grid.innerHTML = `
        <div class="empty-state" style="grid-column: 1 / -1;">
          <div class="empty-state-icon">${this.icons.library}</div>
          <div class="empty-state-title">Nenhum item encontrado na biblioteca</div>
          <div class="empty-state-desc">Guarde livros, ensaios, referências, frases e ideias de projetos.</div>
        </div>
      `;
      return;
    }

    grid.innerHTML = items.map(item => {
      const area = AREAS_DEFINITION[item.area] || { name: item.area, color: '#d4af37' };

      const categoryLabels = {
        livro: 'Livro',
        curso: 'Curso',
        frase: 'Frase & Reflexão',
        projeto: 'Ideia de Projeto',
        filme: 'Filme & Documentário'
      };

      const starsHtml = '★'.repeat(item.rating || 5) + '☆'.repeat(5 - (item.rating || 5));

      return `
        <div class="library-card">
          <div>
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 6px;">
              <span class="library-card-type">${categoryLabels[item.category] || item.category}</span>
              <div style="display: flex; gap: 4px;">
                <button class="btn-icon btn-edit-lib" data-id="${item.id}" title="Editar">${this.icons.edit}</button>
                <button class="btn-icon btn-delete-lib" data-id="${item.id}" title="Excluir">${this.icons.trash}</button>
              </div>
            </div>

            <h3 class="library-card-title">${item.title}</h3>
            <div class="library-card-author">${item.author || 'Autor desconhecido'}</div>

            ${item.keyTakeaway ? `
              <div class="library-quote-box">
                "${item.keyTakeaway}"
              </div>
            ` : ''}

            <p style="font-size: 0.82rem; color: var(--text-secondary); line-height: 1.5; margin-bottom: 12px;">
              ${item.notes || ''}
            </p>
          </div>

          <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--border-subtle); padding-top: 10px; font-size: 0.76rem;">
            <span class="area-tag" style="color: ${area.color}; border-color: ${area.color}40;">${area.name}</span>
            <span style="color: var(--accent-gold); font-size: 0.9rem; letter-spacing: 2px;">${starsHtml}</span>
          </div>
        </div>
      `;
    }).join('');

    grid.querySelectorAll('.btn-edit-lib').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const item = this.storage.data.library.find(l => l.id === id);
        if (item) this.openLibraryModal(item, true);
      });
    });

    grid.querySelectorAll('.btn-delete-lib').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        this.showConfirm(
          'Excluir Item da Biblioteca',
          'Deseja remover este item do repositório?',
          () => {
            this.storage.deleteLibraryItem(id);
            this.showToast('Item removido.');
            this.renderLibraryView();
          }
        );
      });
    });
  }

  openLibraryModal(initialData = {}, isEdit = false) {
    const areaOptions = Object.entries(AREAS_DEFINITION).map(([k, a]) => `
      <option value="${k}" ${initialData.area === k ? 'selected' : ''}>${a.name}</option>
    `).join('');

    const categories = [
      { id: 'livro', label: 'Livro' },
      { id: 'curso', label: 'Curso' },
      { id: 'frase', label: 'Frase & Citação' },
      { id: 'projeto', label: 'Ideia de Projeto' },
      { id: 'filme', label: 'Filme & Documentário' }
    ];

    const catOptions = categories.map(c => `
      <option value="${c.id}" ${initialData.category === c.id ? 'selected' : ''}>${c.label}</option>
    `).join('');

    const formHtml = `
      <form id="formLibrary">
        <div class="form-group">
          <label class="form-label">Título da Obra, Curso ou Citação</label>
          <input type="text" class="form-input" id="libTitle" required placeholder="Ex: Meditações ou Arquitetura Limpa" value="${initialData.title || ''}">
        </div>

        <div class="grid-2">
          <div class="form-group">
            <label class="form-label">Autor / Criador / Fonte</label>
            <input type="text" class="form-input" id="libAuthor" placeholder="Ex: Marco Aurélio ou Prof. Robert C. Martin" value="${initialData.author || ''}">
          </div>
          <div class="form-group">
            <label class="form-label">Categoria</label>
            <select class="form-select" id="libCategory">
              ${catOptions}
            </select>
          </div>
        </div>

        <div class="grid-2">
          <div class="form-group">
            <label class="form-label">Área Relacionada</label>
            <select class="form-select" id="libArea">
              ${areaOptions}
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Avaliação Pessoal (1 a 5 estrelas)</label>
            <select class="form-select" id="libRating">
              <option value="5" ${initialData.rating === 5 ? 'selected' : ''}>★★★★★ (Essencial / 5 Estrelas)</option>
              <option value="4" ${initialData.rating === 4 ? 'selected' : ''}>★★★★☆ (Excelente / 4 Estrelas)</option>
              <option value="3" ${initialData.rating === 3 ? 'selected' : ''}>★★★☆☆ (Bom / 3 Estrelas)</option>
              <option value="2" ${initialData.rating === 2 ? 'selected' : ''}>★★☆☆☆ (Regular / 2 Estrelas)</option>
            </select>
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">Citação Marcante ou Lição Central</label>
          <input type="text" class="form-input" id="libKeyTakeaway" placeholder="A frase ou princípio mais impactante..." value="${initialData.keyTakeaway || ''}">
        </div>

        <div class="form-group">
          <label class="form-label">Anotações e Comentários Pessoais</label>
          <textarea class="form-textarea" id="libNotes" placeholder="Como isso se aplica à sua vida prática ou aos seus estudos?">${initialData.notes || ''}</textarea>
        </div>
      </form>
    `;

    this.openGenericModal(
      isEdit ? 'Editar Item da Biblioteca' : 'Adicionar à Biblioteca',
      formHtml,
      () => {
        const title = document.getElementById('libTitle').value.trim();
        if (!title) {
          alert('Por favor, informe o título.');
          return;
        }

        const payload = {
          title,
          author: document.getElementById('libAuthor').value.trim(),
          category: document.getElementById('libCategory').value,
          area: document.getElementById('libArea').value,
          rating: parseInt(document.getElementById('libRating').value) || 5,
          keyTakeaway: document.getElementById('libKeyTakeaway').value.trim(),
          notes: document.getElementById('libNotes').value.trim()
        };

        if (isEdit && initialData.id) {
          this.storage.updateLibraryItem(initialData.id, payload);
          this.showToast('Item atualizado.');
        } else {
          this.storage.addLibraryItem(payload);
          this.showToast('Item adicionado à biblioteca!');
        }

        this.closeGenericModal();
        this.renderLibraryView();
      }
    );
  }

  /* ========================================================
     9. HORIZONTE 25
     ======================================================== */
  renderHorizonView() {
    const horizon = this.storage.data.horizon25;

    document.getElementById('horizonManifestoText').textContent = horizon.manifesto || 
      '"Transformar potencial em capacidade e capacidade em realização."';

    document.getElementById('horizonLetterText').textContent = horizon.letterToSelf || 
      'Escreva sua carta para o seu eu aos 25 anos nas configurações de visão.';

    const grid = document.getElementById('horizonMilestonesGrid');
    const milestones = horizon.milestones || [];

    grid.innerHTML = milestones.map(m => {
      const area = AREAS_DEFINITION[m.area] || { name: m.area, color: '#d4af37' };
      return `
        <div class="vesper-card" style="border-left: 3px solid ${area.color};">
          <span class="area-tag" style="color: ${area.color}; border-color: ${area.color}40; margin-bottom: 8px;">
            ${area.name}
          </span>
          <h4 style="font-size: 1rem; font-weight: 600; color: #fff; margin-bottom: 6px;">${m.title}</h4>
          <p style="font-size: 0.84rem; color: var(--text-secondary); line-height: 1.55;">
            ${m.description}
          </p>
        </div>
      `;
    }).join('');
  }

  openHorizonModal() {
    const horizon = this.storage.data.horizon25;

    const formHtml = `
      <form id="formHorizon">
        <div class="form-group">
          <label class="form-label">Manifesto Central dos 25 Anos</label>
          <textarea class="form-textarea" id="horizonManifesto" style="min-height: 110px;">${horizon.manifesto || ''}</textarea>
        </div>

        <div class="form-group">
          <label class="form-label">Carta para o Meu Eu aos 25 Anos</label>
          <textarea class="form-textarea" id="horizonLetter" style="min-height: 200px;">${horizon.letterToSelf || ''}</textarea>
        </div>
      </form>
    `;

    this.openGenericModal(
      'Editar Visão do Horizonte 25',
      formHtml,
      () => {
        const manifesto = document.getElementById('horizonManifesto').value.trim();
        const letterToSelf = document.getElementById('horizonLetter').value.trim();

        this.storage.saveHorizon25({ manifesto, letterToSelf });
        this.showToast('Visão do Horizonte 25 atualizada com sucesso!');
        this.closeGenericModal();
        this.renderHorizonView();
      }
    );
  }
}

// Inicialização da Aplicação
document.addEventListener('DOMContentLoaded', () => {
  window.app = new VesperApp();
});
