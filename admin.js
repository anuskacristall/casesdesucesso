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
    if (res.ok) {
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
    errorBox.classList.add("active");
  }
}

function handleAdminLogout() {
  localStorage.removeItem("sebrae_admin_authenticated");
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

    // Indicators mini badges
    const jeppBadge = `<span class="mini-badge ${item.status_jepp === 'Sim' ? 'active' : ''}">JEPP: ${escapeHtml(item.status_jepp || 'Não')}</span>`;
    const ee70Badge = item.municipio_ee_70 === 'sim' ? `<span class="mini-badge active" title="EE > 70%">EE &gt; 70%</span>` : '';
    const empSimBadge = item.empresa_simulada ? `<span class="mini-badge active" title="Empresa Simulada">Emp. Simulada</span>` : '';
    const escSebBadge = item.escola_sebrae ? `<span class="mini-badge active" title="Sistema de Ensino / Escola Sebrae">Escola Sebrae</span>` : '';

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
        <button class="btn-action btn-details" onclick="openMunicipalityDetails('${escapeHtml(item.id)}')">
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
            ${jeppBadge}
            ${ee70Badge}
            ${empSimBadge}
            ${escSebBadge}
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
    const typeLabel = isEstudante ? 'Estudante' : 'Professor';
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
        <button class="btn-action btn-details" onclick="openCaseDetails('${escapeHtml(item.id)}')">
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
    await fetch(getApiUrl(`/api/municipalities/${action}/${encodeURIComponent(id)}`), { method: "PATCH" });
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
    await fetch(getApiUrl(`/api/cases/${action}/${encodeURIComponent(id)}`), { method: "PATCH" });
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
          <span>EE em &gt; 70% da Rede</span>
          ${getIndicatorBadge(item.municipio_ee_70)}
        </div>
        <div class="indicator-check-row">
          <span>Cooperativa Escolar/Crédito</span>
          ${getIndicatorBadge(item.cooperativa_possui)}
        </div>
        <div class="indicator-check-row">
          <span>Lei Municipal de EE</span>
          ${getIndicatorBadge(item.lei_possui)}
        </div>
        <div class="indicator-check-row">
          <span>Comitê Gestor Municipal</span>
          ${getIndicatorBadge(item.comite_possui)}
        </div>
        <div class="indicator-check-row">
          <span>Parceria com IES</span>
          ${getIndicatorBadge(item.ies_possui)}
        </div>
        <div class="indicator-check-row">
          <span>Empresa Simulada</span>
          ${getIndicatorBadge(item.empresa_simulada)}
        </div>
        <div class="indicator-check-row">
          <span>Sistema de Ensino / Escola Sebrae</span>
          ${getIndicatorBadge(item.escola_sebrae)}
        </div>
      </div>
    </div>
  `;

  actions.innerHTML = status === "pending" ? `
    <button class="btn-action btn-reject" onclick="rejectMunicipality('${escapeHtml(item.id)}')" style="padding: 8px 16px; font-size: 0.9rem;">
      <i data-lucide="x"></i> Rejeitar
    </button>
    <button class="btn-action btn-approve" onclick="approveMunicipality('${escapeHtml(item.id)}')" style="padding: 8px 16px; font-size: 0.9rem;">
      <i data-lucide="check"></i> Aprovar Município
    </button>
  ` : "";

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
          <span class="detail-value" style="color: ${isEstudante ? '#10b981' : '#0054a6'}; font-weight:700;">${isEstudante ? 'Estudante' : 'Professor'}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Município</span>
          <span class="detail-value">${escapeHtml(item.municipio || "-")} (${escapeHtml(item.regional || "-")})</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Escola / Instituição</span>
          <span class="detail-value">${escapeHtml(item.escola_instituicao || item.escola || "-")}</span>
        </div>
      </div>
    </div>

    <div>
      <div class="modal-section-title">Descrição Geral do Case</div>
      <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px; font-size: 0.9rem; color: #334155; line-height: 1.5;">
        ${escapeHtml(item.descricao_geral || item.descricao || "Nenhuma descrição fornecida.")}
      </div>
    </div>

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

  actions.innerHTML = status === "pending" ? `
    <button class="btn-action btn-reject" onclick="rejectCase('${escapeHtml(item.id)}')" style="padding: 8px 16px; font-size: 0.9rem;">
      <i data-lucide="x"></i> Rejeitar
    </button>
    <button class="btn-action btn-approve" onclick="approveCase('${escapeHtml(item.id)}')" style="padding: 8px 16px; font-size: 0.9rem;">
      <i data-lucide="check"></i> Aprovar Case
    </button>
  ` : "";

  modal.classList.add("active");
  if (typeof lucide !== "undefined") lucide.createIcons();
}

function closeCaseDetailsModal() {
  const modal = document.getElementById("modal-case-details");
  if (modal) modal.classList.remove("active");
}

// ============================================================================
// 9. INITIALIZATION & EVENT LISTENERS
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

  // Close modals on clicking outside backdrop
  window.addEventListener("click", (e) => {
    if (e.target.id === "modal-municipality-details") closeMunicipalityDetailsModal();
    if (e.target.id === "modal-case-details") closeCaseDetailsModal();
  });

  checkAdminAuth();
});
