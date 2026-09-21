/**
 * SEBRAE Minas - Painel do Administrador & Moderação
 * Gerenciamento de Solicitações de Novos Municípios e Cases de Sucesso
 */

// Global State
let loadedMunicipalities = [];
let loadedCases = [];
let currentAdminTab = 'municipalities'; // 'municipalities' | 'cases'
let currentStatusFilter = 'all'; // 'all' | 'pending' | 'approved' | 'rejected'
let adminSearchQuery = '';
let connectionMode = 'local'; // 'cloud' | 'server' | 'local'

function getApiUrl(path) {
  if (window.location.protocol === "file:") {
    return `http://localhost:8001${path}`;
  }
  return path;
}

function getAdminAuthHeaders(extraHeaders = {}) {
  const token = localStorage.getItem("sebrae_admin_token") || localStorage.getItem("sebrae_auth_token") || "";
  const headers = { "Content-Type": "application/json", ...extraHeaders };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
}

// Status formatting helper
const STATUS_CONFIG = {
  pending: { label: 'Pendente', class: 'pending' },
  approved: { label: 'Aprovado', class: 'approved' },
  rejected: { label: 'Rejeitado', class: 'rejected' }
};

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

// ============================================================================
// 1. ADMIN AUTHENTICATION MANAGEMENT
// ============================================================================

function checkAdminAuth() {
  const isAuth = localStorage.getItem("sebrae_admin_authenticated");
  const loginView = document.getElementById("admin-login-view");
  const dashboardView = document.getElementById("admin-dashboard-view");

  if (isAuth === "true") {
    if (loginView) loginView.style.display = "none";
    if (dashboardView) dashboardView.style.display = "block";
    refreshAdminData();
  } else {
    if (loginView) loginView.style.display = "flex";
    if (dashboardView) dashboardView.style.display = "none";
  }

  if (typeof lucide !== "undefined") {
    lucide.createIcons();
  }
}

async function handleAdminLoginSubmit(e) {
  e.preventDefault();
  const email = document.getElementById("admin-email").value.trim();
  const password = document.getElementById("admin-password").value;
  const errorBox = document.getElementById("admin-login-error");
  const submitBtn = document.getElementById("btn-admin-login-submit");

  errorBox.classList.remove("active");

  // Attempt server backend authentication
  let isAuthenticated = false;
  try {
    const res = await fetch(getApiUrl("/api/login/admin"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });
    if (res.status === 429) {
      const data = await res.json();
      errorBox.textContent = data.error || "Muitas tentativas incorretas. Bloqueio temporário por segurança.";
      errorBox.classList.add("active");
      return;
    }
    if (res.ok) {
      const data = await res.json();
      if (data.token) {
        localStorage.setItem("sebrae_admin_token", data.token);
      }
      isAuthenticated = true;
    }
  } catch (err) {
    // Offline / server not running: fallback to default admin credentials
  }

  // Fallback demo admin credentials
  if (!isAuthenticated) {
    if (email.toLowerCase() === "admin@sebraemg.com.br" && password === "admin123") {
      isAuthenticated = true;
    }
  }

  if (isAuthenticated) {
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i data-lucide="loader" class="animate-spin"></i> Acessando...';
    if (typeof lucide !== "undefined") lucide.createIcons();

    setTimeout(() => {
      localStorage.setItem("sebrae_admin_authenticated", "true");
      submitBtn.disabled = false;
      submitBtn.innerHTML = '<i data-lucide="log-in"></i><span>Acessar Painel Admin</span>';
      checkAdminAuth();
    }, 400);
  } else {
    errorBox.textContent = "Credenciais administrativas inválidas. Acesso restrito.";
    errorBox.classList.add("active");
  }
}

function handleAdminLogout() {
  localStorage.removeItem("sebrae_admin_authenticated");
  localStorage.removeItem("sebrae_admin_token");
  checkAdminAuth();
}

// ============================================================================
// 2. DATA LOADING & RESILIENT STORAGE
// ============================================================================

async function refreshAdminData() {
  updateAdminConnectionBadge("connecting");

  const supabaseUrl = (window.SEBRAE_CONFIG && window.SEBRAE_CONFIG.SUPABASE_URL) || "";
  const supabaseKey = (window.SEBRAE_CONFIG && window.SEBRAE_CONFIG.SUPABASE_KEY) || "";

  let success = false;

  // 1. Direct Supabase Cloud REST
  if (supabaseUrl && supabaseKey) {
    try {
      let munData = [];
      let casesData = [];
      let casesOk = false;

      try {
        const cRes = await fetch(`${supabaseUrl}/rest/v1/cases?select=*&order=id.desc`, {
          headers: { "apikey": supabaseKey, "Authorization": `Bearer ${supabaseKey}` }
        });
        if (cRes.ok) {
          casesData = await cRes.json();
          casesOk = true;
        }
      } catch (e) {}

      try {
        const mRes = await fetch(`${supabaseUrl}/rest/v1/municipalities?select=*&order=id.desc`, {
          headers: { "apikey": supabaseKey, "Authorization": `Bearer ${supabaseKey}` }
        });
        if (mRes.ok) {
          munData = await mRes.json();
        }
      } catch (e) {}

      if (casesOk) {
        loadedCases = Array.isArray(casesData) ? casesData : [];
        loadedMunicipalities = Array.isArray(munData) ? munData : [];
        loadedCases.forEach((c, idx) => {
          if (!c.status) c.status = "approved";
          if (!c.request_code) c.request_code = `#${10000 * (idx + 1)}`;
        });
        connectionMode = "cloud";
        updateAdminConnectionBadge("cloud");
        success = true;
      }
    } catch (err) {
      console.warn("Supabase direto indisponível, tentando proxy local/remoto...", err);
    }
  }

  // 2. Server Python API (supports port 8001 and relative /api, connecting directly to Supabase)
  if (!success) {
    const endpoints = [
      { mun: getApiUrl("/api/municipalities"), cases: getApiUrl("/api/cases") },
      { mun: "http://localhost:8001/api/municipalities", cases: "http://localhost:8001/api/cases" },
      { mun: "/api/municipalities", cases: "/api/cases" }
    ];

    for (const ep of endpoints) {
      try {
        const casesRes = await fetch(ep.cases);
        if (casesRes.ok) {
          const casesData = await casesRes.json();
          let munData = [];
          try {
            const muniRes = await fetch(ep.mun);
            if (muniRes.ok) munData = await muniRes.json();
          } catch (e) {}

          loadedCases = Array.isArray(casesData) ? casesData : [];
          loadedMunicipalities = Array.isArray(munData) ? munData : [];
          loadedCases.forEach((c, idx) => {
            if (!c.status) c.status = "approved";
            if (!c.request_code) c.request_code = `#${10000 * (idx + 1)}`;
          });
          connectionMode = "cloud"; // conectado ao Supabase via proxy
          updateAdminConnectionBadge("cloud");
          success = true;
          break;
        }
      } catch (err) {
        // Tenta o próximo endpoint
      }
    }
  }

  // 3. Fallback LocalStorage
  if (!success) {
    connectionMode = "local";
    updateAdminConnectionBadge("local");
    loadLocalStorageAdminData();
  } else {
    // Sync with local pending storage to ensure nothing is lost
    mergeLocalPendingData();
  }

  updateKPIs();
  renderCurrentAdminTab();
}

function loadLocalStorageAdminData() {
  try {
    const localMun = JSON.parse(localStorage.getItem("sebrae_pending_municipalities") || "[]");
    loadedMunicipalities = Array.isArray(localMun) ? localMun : [];
  } catch (e) {
    loadedMunicipalities = [];
  }

  try {
    const localCases = JSON.parse(localStorage.getItem("sebrae_success_cases") || "[]");
    loadedCases = Array.isArray(localCases) ? localCases.map((c, idx) => ({
      ...c,
      status: c.status || "approved",
      request_code: c.request_code || `#${10000 * (idx + 1)}`
    })) : [];
  } catch (e) {
    loadedCases = [];
  }
}

function mergeLocalPendingData() {
  try {
    const localMun = JSON.parse(localStorage.getItem("sebrae_pending_municipalities") || "[]");
    if (Array.isArray(localMun) && localMun.length > 0) {
      localMun.forEach((m) => {
        if (!loadedMunicipalities.some((x) => String(x.id) === String(m.id) || (m.request_code && x.request_code === m.request_code))) {
          loadedMunicipalities.unshift(m);
        }
      });
    }
  } catch (e) {
    console.error("Erro ao mesclar dados locais:", e);
  }
}

function updateAdminConnectionBadge(mode) {
  const badge = document.getElementById("admin-db-status-badge");
  const text = document.getElementById("admin-db-status-text");
  if (!badge || !text) return;

  if (mode === "cloud" || mode === "server") {
    badge.className = "db-status-badge cloud-online";
    text.textContent = "Modo Nuvem (Supabase)";
    badge.title = "Conectado ao Supabase na Nuvem";
  } else if (mode === "connecting") {
    badge.className = "db-status-badge cloud-connecting";
    text.textContent = "Conectando...";
  } else {
    badge.className = "db-status-badge local";
    text.textContent = "Modo Local";
    badge.title = "Operando com armazenamento LocalStorage";
  }

  if (typeof lucide !== "undefined") lucide.createIcons();
}

// ============================================================================
// 3. METRICS & COUNTERS (KPIS)
// ============================================================================

function updateKPIs() {
  const munPending = loadedMunicipalities.filter((m) => (m.status || "pending") === "pending").length;
  const casesPending = loadedCases.filter((c) => (c.status || "pending") === "pending").length;

  const munApproved = loadedMunicipalities.filter((m) => m.status === "approved").length;
  const casesApproved = loadedCases.filter((c) => c.status === "approved").length;

  const munRejected = loadedMunicipalities.filter((m) => m.status === "rejected").length;
  const casesRejected = loadedCases.filter((c) => c.status === "rejected").length;

  const totalApproved = munApproved + casesApproved;
  const totalRejected = munRejected + casesRejected;

  document.getElementById("kpi-mun-pending").textContent = munPending;
  document.getElementById("kpi-cases-pending").textContent = casesPending;
  document.getElementById("kpi-total-approved").textContent = totalApproved;
  document.getElementById("kpi-total-rejected").textContent = totalRejected;

  document.getElementById("tab-counter-municipalities").textContent = loadedMunicipalities.length;
  document.getElementById("tab-counter-cases").textContent = loadedCases.length;
}

// ============================================================================
// 4. TAB NAVIGATION & FILTERS
// ============================================================================

function switchAdminTab(tabName) {
  currentAdminTab = tabName;

  document.getElementById("tab-btn-municipalities").classList.toggle("active", tabName === "municipalities");
  document.getElementById("tab-btn-cases").classList.toggle("active", tabName === "cases");

  document.getElementById("admin-tab-content-municipalities").style.display = tabName === "municipalities" ? "block" : "none";
  document.getElementById("admin-tab-content-cases").style.display = tabName === "cases" ? "block" : "none";

  renderCurrentAdminTab();
}

function filterByStatus(status) {
  currentStatusFilter = status;
  document.querySelectorAll(".status-pill").forEach((pill) => {
    pill.classList.toggle("active", pill.getAttribute("data-status") === status);
  });
  renderCurrentAdminTab();
}

function handleAdminSearch() {
  const input = document.getElementById("admin-search-input");
  adminSearchQuery = (input ? input.value : "").trim().toLowerCase();
  renderCurrentAdminTab();
}

function renderCurrentAdminTab() {
  if (currentAdminTab === "municipalities") {
    renderMunicipalitiesTable();
  } else {
    renderCasesTable();
  }
}

// ============================================================================
// 5. RENDERING: MUNICIPALITIES TABLE
// ============================================================================

function renderMunicipalitiesTable() {
  const tbody = document.getElementById("admin-municipalities-tbody");
  if (!tbody) return;

  let items = [...loadedMunicipalities];

  // Apply Status Filter
  if (currentStatusFilter !== "all") {
    items = items.filter((m) => (m.status || "pending") === currentStatusFilter);
  }

  // Apply Search Query
  if (adminSearchQuery) {
    items = items.filter((m) => {
      const q = adminSearchQuery;
      return (
        (m.nome || m.municipio || "").toLowerCase().includes(q) ||
        (m.request_code || "").toLowerCase().includes(q) ||
        (m.regional || "").toLowerCase().includes(q) ||
        (m.responsavel_nome || "").toLowerCase().includes(q) ||
        (m.responsavel_email || "").toLowerCase().includes(q)
      );
    });
  }

  if (items.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="7">
          <div class="admin-state-box">
            <i data-lucide="inbox"></i>
            <h4>Nenhuma solicitação de município encontrada</h4>
            <p>Tente ajustar os filtros de status ou a busca.</p>
          </div>
        </td>
      </tr>
    `;
    if (typeof lucide !== "undefined") lucide.createIcons();
    return;
  }

  tbody.innerHTML = items.map((item) => {
    const status = item.status || "pending";
    const statusCfg = STATUS_CONFIG[status] || STATUS_CONFIG.pending;
    const protocol = item.request_code || (item.id ? `#${String(item.id).slice(-6)}` : "#000000");
    const munName = item.nome || item.municipio || "Município";
    const regionalMr = `${escapeHtml(item.regional || "-")} / ${escapeHtml(item.mr || "-")}`;
    const contact = (item.responsavel_nome || item.solicitante_nome || item.tecnico_nome)
      ? `<strong>${escapeHtml(item.responsavel_nome || item.solicitante_nome || item.tecnico_nome)}</strong><br><small style="color:#64748b;">${escapeHtml(item.responsavel_email || item.solicitante_email || item.tecnico_email || "")} ${(item.responsavel_telefone || item.solicitante_telefone || item.tecnico_telefone) ? `• ${escapeHtml(item.responsavel_telefone || item.solicitante_telefone || item.tecnico_telefone)}` : ""}</small>`
      : `<span style="color:#94a3b8;">Não informado</span>`;

    // Indicators: JEPP (Sim=azul, Parcial=amarelo, Não=só no detalhamento)
    let jeppBadge = "";
    const jeppVal = String(item.status_jepp || "").trim().toLowerCase();
    if (jeppVal === "sim") {
      jeppBadge = `<span class="mini-badge jepp-sim" title="Programa JEPP: Sim">JEPP: Sim</span>`;
    } else if (jeppVal === "parcial") {
      jeppBadge = `<span class="mini-badge jepp-parcial" title="Programa JEPP: Parcial">JEPP: Parcial</span>`;
    }

    // Todos os indicadores selecionados como SIM citados
    const isValSim = (v) => v === true || String(v || "").trim().toLowerCase() === "sim";
    const indBadges = [];
    if (isValSim(item.municipio_ee_70)) indBadges.push(`<span class="mini-badge sim" title="Possui Educação Empreendedora em mais de 70% do município?">EE &gt; 70%</span>`);
    if (isValSim(item.convenio_sebrae)) indBadges.push(`<span class="mini-badge sim" title="Convênio/termo de parceria com o Sebrae">Convênio Sebrae</span>`);
    if (isValSim(item.parceria_superintendencia)) indBadges.push(`<span class="mini-badge sim" title="Parceria com superintendência de ensino">Parceria Superintendência</span>`);
    if (isValSim(item.cooperativa_possui)) indBadges.push(`<span class="mini-badge sim" title="Cooperativa Escolar/Crédito">Cooperativa</span>`);
    if (isValSim(item.lei_possui)) indBadges.push(`<span class="mini-badge sim" title="Lei Municipal de Educação Empreendedora">Lei Educação Empreendedora</span>`);
    if (isValSim(item.comite_possui)) indBadges.push(`<span class="mini-badge sim" title="Comitê Gestor Municipal">Comitê Gestor</span>`);
    if (isValSim(item.ies_possui)) indBadges.push(`<span class="mini-badge sim" title="Parceria com Instituição de Ensino Superior">Parceria Inst. Ensino Superior</span>`);
    if (isValSim(item.empresa_simulada)) indBadges.push(`<span class="mini-badge sim" title="Empresa Simulada">Emp. Simulada</span>`);
    if (isValSim(item.escola_sebrae)) indBadges.push(`<span class="mini-badge sim" title="Sistema de Ensino Escola do Sebrae">Escola do Sebrae</span>`);

    const indicatorsHtml = (jeppBadge || indBadges.length > 0)
      ? `${jeppBadge}${indBadges.join("")}`
      : `<span style="color:#94a3b8; font-size:0.75rem;">Nenhum ativo</span>`;

    const actions = `
      <div class="row-actions" style="justify-content: flex-end;">
        ${status === "pending" ? `
          <button class="btn-action btn-approve" onclick="approveMunicipality('${escapeHtml(item.id)}')" title="Aprovar Município">
            <i data-lucide="check" style="width: 14px; height: 14px;"></i>
            <span>Aprovar</span>
          </button>
          <button class="btn-action btn-reject" onclick="rejectMunicipality('${escapeHtml(item.id)}')" title="Rejeitar Solicitação">
            <i data-lucide="x" style="width: 14px; height: 14px;"></i>
            <span>Rejeitar</span>
          </button>
        ` : ""}
        <button class="btn-action btn-edit" onclick="openEditMunicipalityModal('${escapeHtml(item.id)}')" title="Editar Município">
          <i data-lucide="edit-3" style="width: 14px; height: 14px;"></i>
          <span>Editar</span>
        </button>
        <button class="btn-action btn-delete" onclick="deleteMunicipality('${escapeHtml(item.id)}')" title="Excluir Município">
          <i data-lucide="trash-2" style="width: 14px; height: 14px;"></i>
          <span>Excluir</span>
        </button>
        <button class="btn-action btn-details" onclick="openMunicipalityDetails('${escapeHtml(item.id)}')" title="Ver Detalhes">
          <i data-lucide="eye" style="width: 14px; height: 14px;"></i>
          <span>Detalhes</span>
        </button>
      </div>
    `;

    return `
      <tr>
        <td><span class="protocol-code">${escapeHtml(protocol)}</span></td>
        <td><strong style="color: #0054a6; font-size: 0.95rem;">${escapeHtml(munName)}</strong></td>
        <td>${regionalMr}</td>
        <td>${contact}</td>
        <td>
          <div class="table-indicator-badges">
            ${indicatorsHtml}
          </div>
        </td>
        <td><span class="badge-status ${statusCfg.class}">${statusCfg.label}</span></td>
        <td style="text-align: right;">${actions}</td>
      </tr>
    `;
  }).join("");

  if (typeof lucide !== "undefined") lucide.createIcons();
}

// ============================================================================
// 6. RENDERING: CASES TABLE
// ============================================================================

function renderCasesTable() {
  const tbody = document.getElementById("admin-cases-tbody");
  if (!tbody) return;

  let items = [...loadedCases];

  // Apply Status Filter
  if (currentStatusFilter !== "all") {
    items = items.filter((c) => (c.status || "pending") === currentStatusFilter);
  }

  // Apply Search Query
  if (adminSearchQuery) {
    items = items.filter((c) => {
      const q = adminSearchQuery;
      return (
        (c.titulo_projeto || c.titulo || "").toLowerCase().includes(q) ||
        (c.request_code || "").toLowerCase().includes(q) ||
        (c.municipio || "").toLowerCase().includes(q) ||
        (c.escola_instituicao || c.escola || "").toLowerCase().includes(q) ||
        (c.tecnico_nome || c.tecnicoNome || "").toLowerCase().includes(q) ||
        (c.professor_nome || c.professorNome || "").toLowerCase().includes(q) ||
        (c.estudante_nome || c.estudanteNome || "").toLowerCase().includes(q)
      );
    });
  }

  if (items.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="7">
          <div class="admin-state-box">
            <i data-lucide="award"></i>
            <h4>Nenhum case de sucesso encontrado</h4>
            <p>Tente ajustar os filtros de status ou a busca.</p>
          </div>
        </td>
      </tr>
    `;
    if (typeof lucide !== "undefined") lucide.createIcons();
    return;
  }

  tbody.innerHTML = items.map((item) => {
    const status = item.status || "pending";
    const statusCfg = STATUS_CONFIG[status] || STATUS_CONFIG.pending;
    const protocol = item.request_code || (item.id ? `#${String(item.id).slice(-6)}` : "#000000");
    const title = item.titulo_projeto || item.titulo || "Case sem título";
    const isEstudante = item.tipo_case === 'estudante' || item.tipoCase === 'estudante' || item.estudante_possui;
    const typeLabel = isEstudante ? 'Estudante Empreendedor' : 'Professor';
    const typeColor = isEstudante ? '#10b981' : '#0054a6';
    const place = `${escapeHtml(item.municipio || "-")} • <small style="color:#64748b;">${escapeHtml(item.escola_instituicao || item.escola || "")}</small>`;

    let authorName = isEstudante ? (item.estudante_nome || item.estudanteNome) : (item.professor_nome || item.professorNome);
    if (!authorName) authorName = item.tecnico_nome || item.tecnicoNome || "Não informado";

    const actions = `
      <div class="row-actions" style="justify-content: flex-end;">
        ${status === "pending" ? `
          <button class="btn-action btn-approve" onclick="approveCase('${escapeHtml(item.id)}')" title="Aprovar Case">
            <i data-lucide="check" style="width: 14px; height: 14px;"></i>
            <span>Aprovar</span>
          </button>
          <button class="btn-action btn-reject" onclick="rejectCase('${escapeHtml(item.id)}')" title="Rejeitar Case">
            <i data-lucide="x" style="width: 14px; height: 14px;"></i>
            <span>Rejeitar</span>
          </button>
        ` : ""}
        <button class="btn-action btn-edit" onclick="openEditCaseModal('${escapeHtml(item.id)}')" title="Editar Case">
          <i data-lucide="edit-3" style="width: 14px; height: 14px;"></i>
          <span>Editar</span>
        </button>
        <button class="btn-action btn-delete" onclick="deleteCase('${escapeHtml(item.id)}')" title="Excluir Case">
          <i data-lucide="trash-2" style="width: 14px; height: 14px;"></i>
          <span>Excluir</span>
        </button>
        <button class="btn-action btn-details" onclick="openCaseDetails('${escapeHtml(item.id)}')" title="Ver Detalhes">
          <i data-lucide="eye" style="width: 14px; height: 14px;"></i>
          <span>Detalhes</span>
        </button>
      </div>
    `;

    return `
      <tr>
        <td><span class="protocol-code">${escapeHtml(protocol)}</span></td>
        <td><strong style="color: #1e293b;">${escapeHtml(title)}</strong></td>
        <td><span style="font-weight:700; color: ${typeColor}; background: ${isEstudante ? '#ecfdf5' : '#e0f2fe'}; padding: 3px 8px; border-radius: 4px; font-size: 0.76rem;">${typeLabel}</span></td>
        <td>${place}</td>
        <td><strong>${escapeHtml(authorName)}</strong></td>
        <td><span class="badge-status ${statusCfg.class}">${statusCfg.label}</span></td>
        <td style="text-align: right;">${actions}</td>
      </tr>
    `;
  }).join("");

  if (typeof lucide !== "undefined") lucide.createIcons();
}

// ============================================================================
// 7. APPROVAL & REJECTION ACTIONS (MODAL ELEGANTE & TOAST)
// ============================================================================

function showConfirmModal({ title, message, type = 'approve', confirmText, onConfirm }) {
  const modal = document.getElementById("modal-confirm-dialog");
  if (!modal) {
    if (confirm(message)) {
      if (typeof onConfirm === "function") onConfirm();
    }
    return;
  }

  const iconWrap = document.getElementById("confirm-dialog-icon-wrap");
  const icon = document.getElementById("confirm-dialog-icon");
  const titleEl = document.getElementById("confirm-dialog-title");
  const msgEl = document.getElementById("confirm-dialog-message");
  const cancelBtn = document.getElementById("btn-confirm-dialog-cancel");
  const actionBtn = document.getElementById("btn-confirm-dialog-action");

  if (titleEl) titleEl.textContent = title || "Confirmação";
  if (msgEl) msgEl.textContent = message || "Deseja realmente confirmar esta ação?";

  if (type === 'approve') {
    if (iconWrap) {
      iconWrap.style.background = "#dcfce7";
      iconWrap.style.color = "#15803d";
    }
    if (icon) icon.setAttribute("data-lucide", "check-circle");
    if (actionBtn) {
      actionBtn.style.background = "#15803d";
      actionBtn.textContent = confirmText || "Sim, Aprovar";
    }
  } else if (type === 'delete') {
    if (iconWrap) {
      iconWrap.style.background = "#fee2e2";
      iconWrap.style.color = "#b91c1c";
    }
    if (icon) icon.setAttribute("data-lucide", "trash-2");
    if (actionBtn) {
      actionBtn.style.background = "#b91c1c";
      actionBtn.textContent = confirmText || "Sim, Excluir";
    }
  } else {
    if (iconWrap) {
      iconWrap.style.background = "#fee2e2";
      iconWrap.style.color = "#b91c1c";
    }
    if (icon) icon.setAttribute("data-lucide", "alert-triangle");
    if (actionBtn) {
      actionBtn.style.background = "#b91c1c";
      actionBtn.textContent = confirmText || "Sim, Rejeitar";
    }
  }

  modal.classList.add("active");
  if (typeof lucide !== "undefined") lucide.createIcons();

  const closeDialog = () => {
    modal.classList.remove("active");
    if (cancelBtn) cancelBtn.onclick = null;
    if (actionBtn) actionBtn.onclick = null;
  };

  if (cancelBtn) cancelBtn.onclick = closeDialog;
  if (actionBtn) actionBtn.onclick = () => {
    closeDialog();
    if (typeof onConfirm === "function") onConfirm();
  };
}

function showAdminToast(message, type = "success") {
  const container = document.getElementById("admin-toast-container");
  const toast = document.createElement("div");
  const isSuccess = type === "success";
  toast.style.cssText = `
    background: #ffffff;
    color: #0f172a;
    border-left: 4px solid ${isSuccess ? '#15803d' : '#b91c1c'};
    border-radius: 8px;
    padding: 14px 20px;
    box-shadow: 0 10px 25px rgba(0,0,0,0.12);
    display: flex;
    align-items: center;
    gap: 12px;
    font-size: 0.92rem;
    font-weight: 600;
    pointer-events: auto;
    animation: fadeIn 0.2s ease;
    min-width: 280px;
    max-width: 440px;
  `;
  const iconName = isSuccess ? "check-circle-2" : "alert-circle";
  const iconColor = isSuccess ? "#15803d" : "#b91c1c";
  toast.innerHTML = `<i data-lucide="${iconName}" style="width: 20px; height: 20px; color: ${iconColor}; flex-shrink:0;"></i> <span>${escapeHtml(message)}</span>`;

  if (container) {
    container.appendChild(toast);
  } else {
    document.body.appendChild(toast);
  }
  if (typeof lucide !== "undefined") lucide.createIcons();

  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateY(10px)";
    toast.style.transition = "all 0.3s ease";
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

function approveMunicipality(id) {
  showConfirmModal({
    title: "Aprovar Município",
    message: "Deseja aprovar a solicitação deste município para o SEBRAE Minas?",
    type: "approve",
    confirmText: "Sim, Aprovar Município",
    onConfirm: () => updateMunicipalityStatus(id, "approved", "Município aprovado com sucesso!")
  });
}

function rejectMunicipality(id) {
  showConfirmModal({
    title: "Rejeitar Município",
    message: "Deseja realmente rejeitar a solicitação de cadastro deste município?",
    type: "reject",
    confirmText: "Sim, Rejeitar",
    onConfirm: () => updateMunicipalityStatus(id, "rejected", "Solicitação de município rejeitada.")
  });
}

async function updateMunicipalityStatus(id, newStatus, successMsg) {
  const item = loadedMunicipalities.find((m) => String(m.id) === String(id));
  if (item) item.status = newStatus;

  // 1. Update in local storage
  try {
    const localMun = JSON.parse(localStorage.getItem("sebrae_pending_municipalities") || "[]");
    const idx = localMun.findIndex((m) => String(m.id) === String(id));
    if (idx !== -1) {
      localMun[idx].status = newStatus;
      localStorage.setItem("sebrae_pending_municipalities", JSON.stringify(localMun));
    }
    if (newStatus === "approved" && item) {
      const approvedList = JSON.parse(localStorage.getItem("sebrae_approved_municipalities") || "[]");
      if (!approvedList.some(a => String(a.id) === String(item.id) || (item.nome && a.nome === item.nome))) {
        approvedList.push(item);
        localStorage.setItem("sebrae_approved_municipalities", JSON.stringify(approvedList));
      }
    }
  } catch (e) {
    console.error("Erro no localStorage:", e);
  }

  // 2. Try Server backend PATCH
  const action = newStatus === "approved" ? "approve" : "reject";
  try {
    await fetch(getApiUrl(`/api/municipalities/${action}/${encodeURIComponent(id)}`), {
      method: "PATCH",
      headers: getAdminAuthHeaders()
    });
  } catch (err) {
    // 3. Try Supabase REST Direct PATCH
    const supabaseUrl = (window.SEBRAE_CONFIG && window.SEBRAE_CONFIG.SUPABASE_URL) || "";
    const supabaseKey = (window.SEBRAE_CONFIG && window.SEBRAE_CONFIG.SUPABASE_KEY) || "";
    if (supabaseUrl && supabaseKey) {
      try {
        await fetch(`${supabaseUrl}/rest/v1/municipalities?id=eq.${encodeURIComponent(id)}`, {
          method: "PATCH",
          headers: {
            "apikey": supabaseKey,
            "Authorization": `Bearer ${supabaseKey}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ status: newStatus })
        });
      } catch (sbErr) {
        console.warn("Falha no PATCH direto Supabase:", sbErr);
      }
    }
  }

  closeMunicipalityDetailsModal();
  updateKPIs();
  renderCurrentAdminTab();
  showAdminToast(successMsg, newStatus === "approved" ? "success" : "error");
}

function approveCase(id) {
  showConfirmModal({
    title: "Aprovar Case de Sucesso",
    message: "Deseja aprovar este case de sucesso para publicação no mapa da rede?",
    type: "approve",
    confirmText: "Sim, Aprovar Case",
    onConfirm: () => updateCaseStatus(id, "approved", "Case de sucesso aprovado e publicado!")
  });
}

function rejectCase(id) {
  showConfirmModal({
    title: "Rejeitar Case de Sucesso",
    message: "Deseja rejeitar este case de sucesso da moderação?",
    type: "reject",
    confirmText: "Sim, Rejeitar Case",
    onConfirm: () => updateCaseStatus(id, "rejected", "Case de sucesso rejeitado.")
  });
}

async function updateCaseStatus(id, newStatus, successMsg) {
  const item = loadedCases.find((c) => String(c.id) === String(id));
  if (item) item.status = newStatus;

  // 1. Update in local storage
  try {
    const localCases = JSON.parse(localStorage.getItem("sebrae_success_cases") || "[]");
    const idx = localCases.findIndex((c) => String(c.id) === String(id));
    if (idx !== -1) {
      localCases[idx].status = newStatus;
      localStorage.setItem("sebrae_success_cases", JSON.stringify(localCases));
    }
  } catch (e) {
    console.error("Erro no localStorage:", e);
  }

  // 2. Try Server backend PATCH
  const action = newStatus === "approved" ? "approve" : "reject";
  try {
    await fetch(getApiUrl(`/api/cases/${action}/${encodeURIComponent(id)}`), {
      method: "PATCH",
      headers: getAdminAuthHeaders()
    });
  } catch (err) {
    // 3. Try Supabase REST Direct PATCH
    const supabaseUrl = (window.SEBRAE_CONFIG && window.SEBRAE_CONFIG.SUPABASE_URL) || "";
    const supabaseKey = (window.SEBRAE_CONFIG && window.SEBRAE_CONFIG.SUPABASE_KEY) || "";
    if (supabaseUrl && supabaseKey) {
      try {
        await fetch(`${supabaseUrl}/rest/v1/cases?id=eq.${encodeURIComponent(id)}`, {
          method: "PATCH",
          headers: {
            "apikey": supabaseKey,
            "Authorization": `Bearer ${supabaseKey}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ status: newStatus })
        });
      } catch (sbErr) {
        console.warn("Falha no PATCH direto Supabase:", sbErr);
      }
    }
  }

  closeCaseDetailsModal();
  updateKPIs();
  renderCurrentAdminTab();
  showAdminToast(successMsg, newStatus === "approved" ? "success" : "error");
}

function getIndicatorBadge(val) {
  if (typeof val === "boolean") {
    return val
      ? `<span class="indicator-tag sim">Sim</span>`
      : `<span class="indicator-tag nao">Não</span>`;
  }
  const s = String(val || "").trim().toLowerCase();
  if (s === "sim") {
    return `<span class="indicator-tag sim">Sim</span>`;
  }
  if (s === "parcial") {
    return `<span class="indicator-tag parcial">Parcial</span>`;
  }
  return `<span class="indicator-tag nao">Não</span>`;
}

// ============================================================================
// 8. MODALS: DETALHES DE MUNICÍPIO E CASE
// ============================================================================

function openMunicipalityDetails(id) {
  const item = loadedMunicipalities.find((m) => String(m.id) === String(id));
  if (!item) return;

  const modal = document.getElementById("modal-municipality-details");
  const body = document.getElementById("modal-municipality-body");
  const actions = document.getElementById("modal-municipality-actions");

  const protocol = item.request_code || `#${String(item.id).slice(-6)}`;
  const status = item.status || "pending";
  const statusCfg = STATUS_CONFIG[status] || STATUS_CONFIG.pending;

  body.innerHTML = `
    <div>
      <div class="modal-section-title">Dados Gerais do Município</div>
      <div class="modal-grid-2">
        <div class="detail-item">
          <span class="detail-label">Protocolo</span>
          <span class="detail-value"><span class="protocol-code">${escapeHtml(protocol)}</span></span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Status da Avaliação</span>
          <span class="detail-value"><span class="badge-status ${statusCfg.class}">${statusCfg.label}</span></span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Município</span>
          <span class="detail-value" style="color: #0054a6;">${escapeHtml(item.nome || item.municipio || "-")}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Regional / MR</span>
          <span class="detail-value">${escapeHtml(item.regional || "-")} • ${escapeHtml(item.mr || "-")}</span>
        </div>
      </div>
    </div>

    <div>
      <div class="modal-section-title">Responsável pelo Cadastro</div>
      <div class="modal-grid-2">
        <div class="detail-item">
          <span class="detail-label">Nome Completo</span>
          <span class="detail-value">${escapeHtml(item.responsavel_nome || item.solicitante_nome || item.tecnico_nome || "Não informado")}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">E-mail Corporativo</span>
          <span class="detail-value">${escapeHtml(item.responsavel_email || item.solicitante_email || item.tecnico_email || "Não informado")}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Telefone / WhatsApp</span>
          <span class="detail-value">${escapeHtml(item.responsavel_telefone || item.solicitante_telefone || item.tecnico_telefone || "Não informado")}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Data de Envio</span>
          <span class="detail-value">${item.created_at ? new Date(item.created_at).toLocaleString("pt-BR") : "Recentemente"}</span>
        </div>
      </div>
    </div>

    <div>
      <div class="modal-section-title">Indicadores de Educação Empreendedora</div>
      <div class="indicators-summary-list">
        <div class="indicator-check-row">
          <span>Programa JEPP</span>
          ${getIndicatorBadge(item.status_jepp)}
        </div>
        <div class="indicator-check-row">
          <span>Possui Educação Empreendedora em mais de 70% do município?</span>
          ${getIndicatorBadge(item.municipio_ee_70)}
        </div>
        <div class="indicator-check-row">
          <span>Convênio/termo de parceria com o Sebrae</span>
          ${getIndicatorBadge(item.convenio_sebrae)}
        </div>
        <div class="indicator-check-row">
          <span>Parceria com superintendência de ensino</span>
          ${getIndicatorBadge(item.parceria_superintendencia)}
        </div>
        <div class="indicator-check-row">
          <span>Cooperativa Escolar/Crédito</span>
          ${getIndicatorBadge(item.cooperativa_possui)}
        </div>
        <div class="indicator-check-row">
          <span>Lei Municipal de Educação Empreendedora</span>
          ${getIndicatorBadge(item.lei_possui)}
        </div>
        <div class="indicator-check-row">
          <span>Comitê Gestor Municipal</span>
          ${getIndicatorBadge(item.comite_possui)}
        </div>
        <div class="indicator-check-row">
          <span>Parceria com Instituição de Ensino Superior</span>
          ${getIndicatorBadge(item.ies_possui)}
        </div>
        <div class="indicator-check-row">
          <span>Empresa Simulada</span>
          ${getIndicatorBadge(item.empresa_simulada)}
        </div>
        <div class="indicator-check-row">
          <span>Sistema de Ensino Escola do Sebrae</span>
          ${getIndicatorBadge(item.escola_sebrae)}
        </div>
      </div>
    </div>
  `;

  actions.innerHTML = `
    ${status === "pending" ? `
      <button class="btn-action btn-reject" onclick="rejectMunicipality('${escapeHtml(item.id)}')" style="padding: 8px 16px; font-size: 0.9rem;">
        <i data-lucide="x"></i> Rejeitar
      </button>
      <button class="btn-action btn-approve" onclick="approveMunicipality('${escapeHtml(item.id)}')" style="padding: 8px 16px; font-size: 0.9rem;">
        <i data-lucide="check"></i> Aprovar Município
      </button>
    ` : ""}
    <button class="btn-action btn-edit" onclick="openEditMunicipalityModal('${escapeHtml(item.id)}')" style="padding: 8px 16px; font-size: 0.9rem;">
      <i data-lucide="edit-3"></i> Editar
    </button>
    <button class="btn-action btn-delete" onclick="deleteMunicipality('${escapeHtml(item.id)}')" style="padding: 8px 16px; font-size: 0.9rem;">
      <i data-lucide="trash-2"></i> Excluir
    </button>
  `;

  modal.classList.add("active");
  if (typeof lucide !== "undefined") lucide.createIcons();
}

function closeMunicipalityDetailsModal() {
  const modal = document.getElementById("modal-municipality-details");
  if (modal) modal.classList.remove("active");
}

function openCaseDetails(id) {
  const item = loadedCases.find((c) => String(c.id) === String(id));
  if (!item) return;

  const modal = document.getElementById("modal-case-details");
  const titleEl = document.getElementById("modal-case-title");
  const body = document.getElementById("modal-case-body");
  const actions = document.getElementById("modal-case-actions");

  const title = item.titulo_projeto || item.titulo || "Detalhes do Case";
  const protocol = item.request_code || `#${String(item.id).slice(-6)}`;
  const status = item.status || "pending";
  const statusCfg = STATUS_CONFIG[status] || STATUS_CONFIG.pending;
  const isEstudante = item.tipo_case === 'estudante' || item.tipoCase === 'estudante' || item.estudante_possui;

  titleEl.textContent = title;

  body.innerHTML = `
    <div>
      <div class="modal-section-title">Identificação do Projeto</div>
      <div class="modal-grid-2">
        <div class="detail-item">
          <span class="detail-label">Protocolo</span>
          <span class="detail-value"><span class="protocol-code">${escapeHtml(protocol)}</span></span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Modalidade</span>
          <span class="detail-value" style="color: ${isEstudante ? '#10b981' : '#0054a6'}; font-weight:700;">${isEstudante ? 'Estudante Empreendedor' : 'Professor'}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Município</span>
          <span class="detail-value">${escapeHtml(item.municipio || "-")} (${escapeHtml(item.regional || "-")})</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Escola / Instituição</span>
          <span class="detail-value">${escapeHtml(item.escola_instituicao || item.escola || "-")}</span>
        </div>
        ${item.nivel_ensino ? `
        <div class="detail-item">
          <span class="detail-label">Nível de Ensino</span>
          <span class="detail-value">${escapeHtml(item.nivel_ensino)}</span>
        </div>` : ""}
        ${item.dependencia_adm ? `
        <div class="detail-item">
          <span class="detail-label">Dependência Administrativa</span>
          <span class="detail-value">${escapeHtml(item.dependencia_adm)}</span>
        </div>` : ""}
      </div>
    </div>

    <div>
      <div class="modal-section-title">Descrição Geral do Case</div>
      <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px; font-size: 0.9rem; color: #334155; line-height: 1.5;">
        ${escapeHtml(item.descricao_geral || item.descricao || "Nenhuma descrição fornecida.")}
      </div>
    </div>

    ${(item.empresa_nome || item.empresaNome || item.empresa_tipo || item.empresaTipo || item.empresa_descricao || item.empresaDescricao) ? `
    <div>
      <div class="modal-section-title">Dados do Empreendimento</div>
      <div class="modal-grid-2">
        <div class="detail-item">
          <span class="detail-label">Nome da Empresa</span>
          <span class="detail-value"><strong>${escapeHtml(item.empresa_nome || item.empresaNome || "Não informado")}</strong></span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Tipo de Negócio</span>
          <span class="detail-value">${escapeHtml(item.empresa_tipo || item.empresaTipo || "Não informado")}</span>
        </div>
        <div class="detail-item" style="grid-column: span 2;">
          <span class="detail-label">Descrição da Empresa</span>
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 10px; font-size: 0.88rem; color: #475569; line-height: 1.5; margin-top: 4px;">
            ${escapeHtml(item.empresa_descricao || item.empresaDescricao || "Não informada.")}
          </div>
        </div>
      </div>
    </div>
    ` : ""}

    <div>
      <div class="modal-section-title">Autor / Responsável</div>
      <div class="modal-grid-2">
        <div class="detail-item">
          <span class="detail-label">Nome</span>
          <span class="detail-value">${escapeHtml((isEstudante ? (item.estudante_nome || item.estudanteNome) : (item.professor_nome || item.professorNome)) || item.tecnico_nome || item.tecnicoNome || "Não informado")}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">E-mail</span>
          <span class="detail-value">${escapeHtml((isEstudante ? (item.estudante_email || item.estudanteEmail) : (item.professor_email || item.professorEmail)) || item.tecnico_email || item.tecnicoEmail || "Não informado")}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Telefone / Contato</span>
          <span class="detail-value">${escapeHtml((isEstudante ? (item.estudante_telefone || item.estudanteTelefone || item.estudante_contato) : (item.professor_telefone || item.professorTelefone)) || item.tecnico_telefone || item.tecnicoContato || "Não informado")}</span>
        </div>
      </div>
    </div>
  `;

  actions.innerHTML = `
    ${status === "pending" ? `
      <button class="btn-action btn-reject" onclick="rejectCase('${escapeHtml(item.id)}')" style="padding: 8px 16px; font-size: 0.9rem;">
        <i data-lucide="x"></i> Rejeitar
      </button>
      <button class="btn-action btn-approve" onclick="approveCase('${escapeHtml(item.id)}')" style="padding: 8px 16px; font-size: 0.9rem;">
        <i data-lucide="check"></i> Aprovar Case
      </button>
    ` : ""}
    <button class="btn-action btn-edit" onclick="openEditCaseModal('${escapeHtml(item.id)}')" style="padding: 8px 16px; font-size: 0.9rem;">
      <i data-lucide="edit-3"></i> Editar
    </button>
    <button class="btn-action btn-delete" onclick="deleteCase('${escapeHtml(item.id)}')" style="padding: 8px 16px; font-size: 0.9rem;">
      <i data-lucide="trash-2"></i> Excluir
    </button>
  `;

  modal.classList.add("active");
  if (typeof lucide !== "undefined") lucide.createIcons();
}

function closeCaseDetailsModal() {
  const modal = document.getElementById("modal-case-details");
  if (modal) modal.classList.remove("active");
}


// ============================================================================
// 9. EXCLUSÃO E EDIÇÃO DE MUNICÍPIOS E CASES
// ============================================================================

function deleteMunicipality(id) {
  const item = loadedMunicipalities.find((m) => String(m.id) === String(id));
  const munName = item ? (item.nome || item.municipio || "este município") : "este município";

  showConfirmModal({
    title: "Excluir Município",
    message: `Deseja realmente excluir o cadastro do município ${munName}? Esta ação removerá o registro do sistema.`,
    type: "delete",
    confirmText: "Sim, Excluir Município",
    onConfirm: async () => {
      // 1. Remove from local state
      loadedMunicipalities = loadedMunicipalities.filter((m) => String(m.id) !== String(id));

      // 2. Remove from LocalStorage
      try {
        const localMun = JSON.parse(localStorage.getItem("sebrae_pending_municipalities") || "[]");
        localStorage.setItem("sebrae_pending_municipalities", JSON.stringify(localMun.filter((m) => String(m.id) !== String(id))));
        const appMun = JSON.parse(localStorage.getItem("sebrae_approved_municipalities") || "[]");
        localStorage.setItem("sebrae_approved_municipalities", JSON.stringify(appMun.filter((m) => String(m.id) !== String(id))));
      } catch (e) {
        console.error("Erro localStorage deleteMunicipality:", e);
      }

      // 3. Try server DELETE
      try {
        await fetch(getApiUrl(`/api/municipalities/${encodeURIComponent(id)}`), {
          method: "DELETE",
          headers: getAdminAuthHeaders()
        });
      } catch (err) {
        console.warn("Falha no DELETE servidor:", err);
      }

      // 4. Try Supabase DELETE
      const supabaseUrl = (window.SEBRAE_CONFIG && window.SEBRAE_CONFIG.SUPABASE_URL) || "";
      const supabaseKey = (window.SEBRAE_CONFIG && window.SEBRAE_CONFIG.SUPABASE_KEY) || "";
      if (supabaseUrl && supabaseKey) {
        try {
          await fetch(`${supabaseUrl}/rest/v1/municipalities?id=eq.${encodeURIComponent(id)}`, {
            method: "DELETE",
            headers: { "apikey": supabaseKey, "Authorization": `Bearer ${supabaseKey}` }
          });
        } catch (sbErr) {
          console.warn("Falha no DELETE Supabase:", sbErr);
        }
      }

      closeMunicipalityDetailsModal();
      updateKPIs();
      renderCurrentAdminTab();
      showAdminToast("Município excluído com sucesso!", "success");
    }
  });
}

function deleteCase(id) {
  const item = loadedCases.find((c) => String(c.id) === String(id));
  const title = item ? (item.titulo_projeto || item.titulo || "este case") : "este case";

  showConfirmModal({
    title: "Excluir Case de Sucesso",
    message: `Deseja realmente excluir "${title}"? Se o case já estava aprovado, ele deixará de ser exibido no mapa da rede.`,
    type: "delete",
    confirmText: "Sim, Excluir Case",
    onConfirm: async () => {
      // 1. Remove from local state
      loadedCases = loadedCases.filter((c) => String(c.id) !== String(id));

      // 2. Remove from LocalStorage
      try {
        const localCases = JSON.parse(localStorage.getItem("sebrae_success_cases") || "[]");
        localStorage.setItem("sebrae_success_cases", JSON.stringify(localCases.filter((c) => String(c.id) !== String(id))));
      } catch (e) {
        console.error("Erro localStorage deleteCase:", e);
      }

      // 3. Try server DELETE
      try {
        await fetch(getApiUrl(`/api/cases/${encodeURIComponent(id)}`), {
          method: "DELETE",
          headers: getAdminAuthHeaders()
        });
      } catch (err) {
        console.warn("Falha no DELETE servidor:", err);
      }

      // 4. Try Supabase DELETE
      const supabaseUrl = (window.SEBRAE_CONFIG && window.SEBRAE_CONFIG.SUPABASE_URL) || "";
      const supabaseKey = (window.SEBRAE_CONFIG && window.SEBRAE_CONFIG.SUPABASE_KEY) || "";
      if (supabaseUrl && supabaseKey) {
        try {
          await fetch(`${supabaseUrl}/rest/v1/cases?id=eq.${encodeURIComponent(id)}`, {
            method: "DELETE",
            headers: { "apikey": supabaseKey, "Authorization": `Bearer ${supabaseKey}` }
          });
        } catch (sbErr) {
          console.warn("Falha no DELETE Supabase:", sbErr);
        }
      }

      closeCaseDetailsModal();
      updateKPIs();
      renderCurrentAdminTab();
      showAdminToast("Case excluído com sucesso!", "success");
    }
  });
}

// Modal Editar Município
function openEditMunicipalityModal(id) {
  const item = loadedMunicipalities.find((m) => String(m.id) === String(id));
  if (!item) return;

  document.getElementById("edit-mun-id").value = item.id;
  document.getElementById("edit-mun-nome").value = item.nome || item.municipio || "";
  document.getElementById("edit-mun-regional").value = item.regional || "";
  document.getElementById("edit-mun-mr").value = item.mr || "";
  document.getElementById("edit-mun-status").value = item.status || "pending";

  document.getElementById("edit-mun-resp-nome").value = item.responsavel_nome || item.solicitante_nome || item.tecnico_nome || "";
  document.getElementById("edit-mun-resp-email").value = item.responsavel_email || item.solicitante_email || item.tecnico_email || "";
  document.getElementById("edit-mun-resp-tel").value = item.responsavel_telefone || item.solicitante_telefone || item.tecnico_telefone || "";

  // Indicators
  document.getElementById("edit-mun-jepp").value = item.status_jepp || "Não";
  document.getElementById("edit-mun-ee70").value = (item.municipio_ee_70 === 'sim' || item.municipio_ee_70 === true) ? "sim" : "nao";
  if (document.getElementById("edit-mun-convenio")) {
    document.getElementById("edit-mun-convenio").value = (item.convenio_sebrae === 'sim' || item.convenio_sebrae === true) ? "sim" : "nao";
  }
  if (document.getElementById("edit-mun-superintendencia")) {
    document.getElementById("edit-mun-superintendencia").value = (item.parceria_superintendencia === 'sim' || item.parceria_superintendencia === true) ? "sim" : "nao";
  }
  document.getElementById("edit-mun-cooperativa").value = (item.cooperativa_possui === 'sim' || item.cooperativa_possui === true) ? "sim" : "nao";
  document.getElementById("edit-mun-lei").value = (item.lei_possui === 'sim' || item.lei_possui === true) ? "sim" : "nao";
  document.getElementById("edit-mun-comite").value = (item.comite_possui === 'sim' || item.comite_possui === true) ? "sim" : "nao";
  document.getElementById("edit-mun-ies").value = (item.ies_possui === 'sim' || item.ies_possui === true) ? "sim" : "nao";
  document.getElementById("edit-mun-emp-sim").value = (item.empresa_simulada === 'sim' || item.empresa_simulada === true) ? "sim" : "nao";
  document.getElementById("edit-mun-esc-seb").value = (item.escola_sebrae === 'sim' || item.escola_sebrae === true) ? "sim" : "nao";

  const modal = document.getElementById("modal-edit-municipality");
  if (modal) modal.classList.add("active");
  if (typeof lucide !== "undefined") lucide.createIcons();
}

function closeEditMunicipalityModal() {
  const modal = document.getElementById("modal-edit-municipality");
  if (modal) modal.classList.remove("active");
}

async function handleSaveMunicipalityEdit(e) {
  e.preventDefault();
  const id = document.getElementById("edit-mun-id").value;
  const item = loadedMunicipalities.find((m) => String(m.id) === String(id));
  if (!item) return;

  const nome = document.getElementById("edit-mun-nome").value.trim();
  const regional = document.getElementById("edit-mun-regional").value.trim();
  const mr = document.getElementById("edit-mun-mr").value.trim();

  // Space string validation
  if (!nome || nome.length === 0 || !regional || regional.length === 0 || !mr || mr.length === 0) {
    showAdminToast("Os campos Nome, Regional e Microrregião não podem ficar vazios ou conter apenas espaços.", "error");
    return;
  }

  const updatedFields = {
    nome: nome,
    municipio: nome,
    regional: regional,
    mr: mr,
    status: document.getElementById("edit-mun-status").value,
    responsavel_nome: document.getElementById("edit-mun-resp-nome").value.trim(),
    responsavel_email: document.getElementById("edit-mun-resp-email").value.trim(),
    responsavel_telefone: document.getElementById("edit-mun-resp-tel").value.trim(),
    status_jepp: document.getElementById("edit-mun-jepp").value,
    municipio_ee_70: document.getElementById("edit-mun-ee70").value,
    convenio_sebrae: document.getElementById("edit-mun-convenio") ? document.getElementById("edit-mun-convenio").value === "sim" : false,
    parceria_superintendencia: document.getElementById("edit-mun-superintendencia") ? document.getElementById("edit-mun-superintendencia").value === "sim" : false,
    cooperativa_possui: document.getElementById("edit-mun-cooperativa").value === "sim",
    lei_possui: document.getElementById("edit-mun-lei").value === "sim",
    comite_possui: document.getElementById("edit-mun-comite").value === "sim",
    ies_possui: document.getElementById("edit-mun-ies").value === "sim",
    empresa_simulada: document.getElementById("edit-mun-emp-sim").value === "sim",
    escola_sebrae: document.getElementById("edit-mun-esc-seb").value === "sim"
  };

  Object.assign(item, updatedFields);

  // 1. Update localStorage
  try {
    const localMun = JSON.parse(localStorage.getItem("sebrae_pending_municipalities") || "[]");
    const idx = localMun.findIndex((m) => String(m.id) === String(id));
    if (idx !== -1) {
      Object.assign(localMun[idx], updatedFields);
      localStorage.setItem("sebrae_pending_municipalities", JSON.stringify(localMun));
    }
    const appMun = JSON.parse(localStorage.getItem("sebrae_approved_municipalities") || "[]");
    const appIdx = appMun.findIndex((m) => String(m.id) === String(id));
    if (appIdx !== -1) {
      Object.assign(appMun[appIdx], updatedFields);
      localStorage.setItem("sebrae_approved_municipalities", JSON.stringify(appMun));
    } else if (updatedFields.status === "approved") {
      appMun.push(item);
      localStorage.setItem("sebrae_approved_municipalities", JSON.stringify(appMun));
    }
  } catch (err) {
    console.error("Erro localStorage handleSaveMunicipalityEdit:", err);
  }

  // 2. Try server PUT
  try {
    await fetch(getApiUrl(`/api/municipalities/${encodeURIComponent(id)}`), {
      method: "PUT",
      headers: getAdminAuthHeaders(),
      body: JSON.stringify(updatedFields)
    });
  } catch (err) {
    console.warn("Falha no PUT servidor:", err);
  }

  // 3. Try Supabase PATCH
  const supabaseUrl = (window.SEBRAE_CONFIG && window.SEBRAE_CONFIG.SUPABASE_URL) || "";
  const supabaseKey = (window.SEBRAE_CONFIG && window.SEBRAE_CONFIG.SUPABASE_KEY) || "";
  if (supabaseUrl && supabaseKey) {
    try {
      await fetch(`${supabaseUrl}/rest/v1/municipalities?id=eq.${encodeURIComponent(id)}`, {
        method: "PATCH",
        headers: { "apikey": supabaseKey, "Authorization": `Bearer ${supabaseKey}`, "Content-Type": "application/json" },
        body: JSON.stringify(updatedFields)
      });
    } catch (sbErr) {
      console.warn("Falha no PATCH Supabase:", sbErr);
    }
  }

  closeEditMunicipalityModal();
  updateKPIs();
  renderCurrentAdminTab();
  showAdminToast("Alterações do município salvas com sucesso!", "success");
}

// Modal Editar Case
function openEditCaseModal(id) {
  const item = loadedCases.find((c) => String(c.id) === String(id));
  if (!item) return;

  const isEstudante = item.tipo_case === 'estudante' || item.tipoCase === 'estudante' || item.estudante_possui;

  document.getElementById("edit-case-id").value = item.id;
  document.getElementById("edit-case-titulo").value = item.titulo_projeto || item.titulo || "";
  document.getElementById("edit-case-modalidade").value = isEstudante ? "estudante" : "professor";
  document.getElementById("edit-case-status").value = item.status || "pending";
  document.getElementById("edit-case-municipio").value = item.municipio || "";
  document.getElementById("edit-case-regional").value = item.regional || "";
  document.getElementById("edit-case-escola").value = item.escola_instituicao || item.escola || "";
  document.getElementById("edit-case-descricao").value = item.descricao_geral || item.descricao || "";

  if (document.getElementById("edit-case-empresa-nome")) {
    document.getElementById("edit-case-empresa-nome").value = item.empresa_nome || item.empresaNome || "";
  }
  if (document.getElementById("edit-case-empresa-tipo")) {
    document.getElementById("edit-case-empresa-tipo").value = item.empresa_tipo || item.empresaTipo || "";
  }
  if (document.getElementById("edit-case-empresa-descricao")) {
    document.getElementById("edit-case-empresa-descricao").value = item.empresa_descricao || item.empresaDescricao || "";
  }

  const authorName = isEstudante ? (item.estudante_nome || item.estudanteNome) : (item.professor_nome || item.professorNome);
  const authorEmail = isEstudante ? (item.estudante_email || item.estudanteEmail) : (item.professor_email || item.professorEmail);
  const authorTel = isEstudante ? (item.estudante_telefone || item.estudanteTelefone || item.estudante_contato) : (item.professor_telefone || item.professorTelefone);

  document.getElementById("edit-case-autor-nome").value = authorName || item.tecnico_nome || item.tecnicoNome || "";
  document.getElementById("edit-case-autor-email").value = authorEmail || item.tecnico_email || item.tecnicoEmail || "";
  document.getElementById("edit-case-autor-tel").value = authorTel || item.tecnico_telefone || item.tecnicoContato || "";

  const modal = document.getElementById("modal-edit-case");
  if (modal) modal.classList.add("active");
  if (typeof lucide !== "undefined") lucide.createIcons();
}

function closeEditCaseModal() {
  const modal = document.getElementById("modal-edit-case");
  if (modal) modal.classList.remove("active");
}

async function handleSaveCaseEdit(e) {
  e.preventDefault();
  const id = document.getElementById("edit-case-id").value;
  const item = loadedCases.find((c) => String(c.id) === String(id));
  if (!item) return;

  const modalidade = document.getElementById("edit-case-modalidade").value;
  const isEstudante = modalidade === "estudante";

  const titulo = document.getElementById("edit-case-titulo").value.trim();
  const municipio = document.getElementById("edit-case-municipio").value.trim();
  const regional = document.getElementById("edit-case-regional").value.trim();
  const escola = document.getElementById("edit-case-escola").value.trim();
  const descricao = document.getElementById("edit-case-descricao").value.trim();

  // Space string validation
  if (!titulo || titulo.length === 0 || !municipio || municipio.length === 0 || !regional || regional.length === 0 || !escola || escola.length === 0 || !descricao || descricao.length === 0) {
    showAdminToast("Os campos Título, Município, Regional, Escola e Descrição não podem ficar vazios ou conter apenas espaços.", "error");
    return;
  }

  const updatedFields = {
    titulo_projeto: titulo,
    titulo: titulo,
    tipo_case: modalidade,
    tipoCase: modalidade,
    estudante_possui: isEstudante,
    status: document.getElementById("edit-case-status").value,
    municipio: municipio,
    regional: regional,
    escola_instituicao: escola,
    escola: escola,
    descricao_geral: descricao,
    descricao: descricao,
    empresa_nome: document.getElementById("edit-case-empresa-nome") ? document.getElementById("edit-case-empresa-nome").value.trim() : "",
    empresaNome: document.getElementById("edit-case-empresa-nome") ? document.getElementById("edit-case-empresa-nome").value.trim() : "",
    empresa_tipo: document.getElementById("edit-case-empresa-tipo") ? document.getElementById("edit-case-empresa-tipo").value.trim() : "",
    empresaTipo: document.getElementById("edit-case-empresa-tipo") ? document.getElementById("edit-case-empresa-tipo").value.trim() : "",
    empresa_descricao: document.getElementById("edit-case-empresa-descricao") ? document.getElementById("edit-case-empresa-descricao").value.trim() : "",
    empresaDescricao: document.getElementById("edit-case-empresa-descricao") ? document.getElementById("edit-case-empresa-descricao").value.trim() : ""
  };

  const autorNome = document.getElementById("edit-case-autor-nome").value.trim();
  const autorEmail = document.getElementById("edit-case-autor-email").value.trim();
  const autorTel = document.getElementById("edit-case-autor-tel").value.trim();

  if (isEstudante) {
    updatedFields.estudante_nome = autorNome;
    updatedFields.estudanteNome = autorNome;
    updatedFields.estudante_email = autorEmail;
    updatedFields.estudanteEmail = autorEmail;
    updatedFields.estudante_telefone = autorTel;
    updatedFields.estudanteTelefone = autorTel;
  } else {
    updatedFields.professor_nome = autorNome;
    updatedFields.professorNome = autorNome;
    updatedFields.professor_email = autorEmail;
    updatedFields.professorEmail = autorEmail;
    updatedFields.professor_telefone = autorTel;
    updatedFields.professorTelefone = autorTel;
  }

  Object.assign(item, updatedFields);

  // 1. Update localStorage
  try {
    const localCases = JSON.parse(localStorage.getItem("sebrae_success_cases") || "[]");
    const idx = localCases.findIndex((c) => String(c.id) === String(id));
    if (idx !== -1) {
      Object.assign(localCases[idx], updatedFields);
      localStorage.setItem("sebrae_success_cases", JSON.stringify(localCases));
    }
  } catch (err) {
    console.error("Erro localStorage handleSaveCaseEdit:", err);
  }

  // 2. Try server PUT
  try {
    await fetch(getApiUrl(`/api/cases/${encodeURIComponent(id)}`), {
      method: "PUT",
      headers: getAdminAuthHeaders(),
      body: JSON.stringify(updatedFields)
    });
  } catch (err) {
    console.warn("Falha no PUT servidor:", err);
  }

  // 3. Try Supabase PATCH
  const supabaseUrl = (window.SEBRAE_CONFIG && window.SEBRAE_CONFIG.SUPABASE_URL) || "";
  const supabaseKey = (window.SEBRAE_CONFIG && window.SEBRAE_CONFIG.SUPABASE_KEY) || "";
  if (supabaseUrl && supabaseKey) {
    try {
      await fetch(`${supabaseUrl}/rest/v1/cases?id=eq.${encodeURIComponent(id)}`, {
        method: "PATCH",
        headers: { "apikey": supabaseKey, "Authorization": `Bearer ${supabaseKey}`, "Content-Type": "application/json" },
        body: JSON.stringify(updatedFields)
      });
    } catch (sbErr) {
      console.warn("Falha no PATCH Supabase:", sbErr);
    }
  }

  closeEditCaseModal();
  updateKPIs();
  renderCurrentAdminTab();
  showAdminToast("Alterações do case salvas com sucesso!", "success");
}

// ============================================================================
// 10. INITIALIZATION & EVENT LISTENERS
// ============================================================================

document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("admin-login-form");
  if (loginForm) {
    loginForm.addEventListener("submit", handleAdminLoginSubmit);
  }

  const logoutBtn = document.getElementById("btn-admin-logout");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", handleAdminLogout);
  }

  // Close modals on clicking outside backdrop (only for read-only view modals)
  window.addEventListener("click", (e) => {
    if (e.target.id === "modal-municipality-details") closeMunicipalityDetailsModal();
    if (e.target.id === "modal-case-details") closeCaseDetailsModal();
  });

  checkAdminAuth();
});
