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

function findParentMunicipality(munName) {
  if (!munName) return null;
  const norm = String(munName).normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim().toLowerCase();
  return loadedMunicipalities.find(m => {
    const mNorm = String(m.nome || m.municipio || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim().toLowerCase();
    return mNorm === norm;
  }) || null;
}

function calculateMunicipioDevelopmentIndex(item) {
  if (!item) return null;
  if (item.indice_desenvolvimento && Array.isArray(item.indice_desenvolvimento.criterios)) {
    return item.indice_desenvolvimento;
  }

  const isAffirmative = (v) => {
    if (v === true || v === 1) return true;
    const s = String(v || "").trim().toLowerCase();
    return s === "sim" || s === "true" || s === "1" || s === "total" || s === "sim (total)" || s === "parcial";
  };

  const isJeppAttended = (v) => {
    const s = String(v || "").trim().toLowerCase();
    return s === "sim" || s === "true" || s === "1" || s === "total" || s === "sim (total)" || s === "parcial";
  };

  const criteriaDefs = [
    {
      ordem: 1,
      ordem_str: "1º",
      nome: "Possui Educação Empreendedora em mais de 70% do município",
      identificador: "educacao_70_porcento",
      peso: 13,
      atendido: isAffirmative(item.educacao_70_porcento) || isAffirmative(item.municipio_ee_70) || isAffirmative(item.edu70)
    },
    {
      ordem: 2,
      ordem_str: "2º",
      nome: "Parceria com Secretária Municipal de Educação",
      identificador: "parceria_secretaria_educacao",
      peso: 12,
      atendido: isAffirmative(item.parceria_secretaria_educacao) || isAffirmative(item.secretaria_educacao_possui) || isAffirmative(item.hasParceriaSecretariaEducacao) || isAffirmative(item.secretaria_educacao)
    },
    {
      ordem: 3,
      ordem_str: "3º",
      nome: "JEPP no município",
      identificador: "jepp_municipio",
      peso: 11,
      atendido: isJeppAttended(item.jepp_municipio) || isJeppAttended(item.status_jepp) || isJeppAttended(item.jeppStatus)
    },
    {
      ordem: 4,
      ordem_str: "4º",
      nome: "Produto Despertar implantado",
      identificador: "produto_despertar",
      peso: 10,
      atendido: isAffirmative(item.produto_despertar) || isAffirmative(item.despertar_possui) || isAffirmative(item.hasDespertar) || isAffirmative(item.produto_despertar_possui)
    },
    {
      ordem: 5,
      ordem_str: "5º",
      nome: "Parceria com superintendência de ensino",
      identificador: "parceria_superintendencia",
      peso: 9,
      atendido: isAffirmative(item.parceria_superintendencia) || isAffirmative(item.hasParceriaSuperintendencia) || isAffirmative(item.superintendencia_possui)
    },
    {
      ordem: 6,
      ordem_str: "6º",
      nome: "Parceria com instituição de ensino superior",
      identificador: "parceria_ies",
      peso: 8,
      atendido: isAffirmative(item.parceria_ies) || isAffirmative(item.ies_possui) || isAffirmative(item.hasIes)
    },
    {
      ordem: 7,
      ordem_str: "7º",
      nome: "Rede Aqui Tem Sebrae",
      identificador: "rede_aqui_tem_sebrae",
      peso: 7,
      atendido: isAffirmative(item.rede_aqui_tem_sebrae) || isAffirmative(item.aqui_tem_sebrae_possui) || isAffirmative(item.hasRedeAquiTemSebrae) || isAffirmative(item.aqui_tem_sebrae)
    },
    {
      ordem: 8,
      ordem_str: "8º",
      nome: "Convênio / termo de parceria",
      identificador: "convenio_parceria",
      peso: 6,
      atendido: isAffirmative(item.convenio_parceria) || isAffirmative(item.convenio_sebrae) || isAffirmative(item.hasConvenioSebrae)
    },
    {
      ordem: 9,
      ordem_str: "9º",
      nome: "Comitê e ações conjuntas",
      identificador: "comite_acoes_conjuntas",
      peso: 5,
      atendido: isAffirmative(item.comite_acoes_conjuntas) || isAffirmative(item.comite_possui) || isAffirmative(item.hasCommittee)
    },
    {
      ordem: 10,
      ordem_str: "10º",
      nome: "Empresa simulada",
      identificador: "empresa_simulada",
      peso: 4,
      atendido: isAffirmative(item.empresa_simulada) || isAffirmative(item.empresa_simulada_possui) || isAffirmative(item.hasEmpresaSimulada)
    },
    {
      ordem: 11,
      ordem_str: "11º",
      nome: "Sistema de Ensino Escola do Sebrae (Cursos Técnicos)",
      identificador: "escola_sebrae",
      peso: 3,
      atendido: isAffirmative(item.escola_sebrae) || isAffirmative(item.escola_sebrae_possui) || isAffirmative(item.hasEscolaSebrae)
    },
    {
      ordem: 12,
      ordem_str: "12º",
      nome: "Parceria com Cooperativa de Crédito",
      identificador: "cooperativa_credito",
      peso: 2,
      atendido: isAffirmative(item.cooperativa_credito) || isAffirmative(item.cooperativa_possui) || isAffirmative(item.hasCoop)
    },
    {
      ordem: 13,
      ordem_str: "13º",
      nome: "Lei da educação empreendedora",
      identificador: "lei_educacao_empreendedora",
      peso: 1,
      atendido: isAffirmative(item.lei_educacao_empreendedora) || isAffirmative(item.lei_possui) || isAffirmative(item.hasLaw)
    }
  ];

  let pontuacaoBruta = 0;
  const criterios = criteriaDefs.map(c => {
    const pontos = c.atendido ? c.peso : 0;
    pontuacaoBruta += pontos;
    return {
      ...c,
      pontos
    };
  });

  const percentual = Math.round((pontuacaoBruta / 91.0) * 1000) / 10;
  let classificacao = "Em Desenvolvimento";
  let classificacaoKey = "em_desenvolvimento";

  if (pontuacaoBruta <= 63) {
    classificacao = "Em Desenvolvimento";
    classificacaoKey = "em_desenvolvimento";
  } else {
    classificacao = "Desenvolvido";
    classificacaoKey = "desenvolvido";
  }

  // Instrumentos Aplicados (10 pts cada, mínimo 3 para destaque)
  let insts = item.instrumentos_aplicados;
  if (!insts && insts !== []) {
    const derived = new Set();
    if (isJeppAttended(item.jepp_municipio) || isJeppAttended(item.status_jepp) || isJeppAttended(item.jeppStatus)) {
      derived.add("material_didatico");
      derived.add("oficina");
    }
    if (isAffirmative(item.empresa_simulada) || isAffirmative(item.empresa_simulada_possui) || isAffirmative(item.hasEmpresaSimulada)) {
      derived.add("curso");
    }
    if (isAffirmative(item.escola_sebrae) || isAffirmative(item.escola_sebrae_possui) || isAffirmative(item.hasEscolaSebrae)) {
      derived.add("curso");
    }
    if (isAffirmative(item.convenio_parceria) || isAffirmative(item.convenio_sebrae) || isAffirmative(item.hasConvenioSebrae)) {
      derived.add("encontro_mediado");
    }
    if (isAffirmative(item.parceria_superintendencia) || isAffirmative(item.hasParceriaSuperintendencia)) {
      derived.add("encontro_mediado");
    }
    if (isAffirmative(item.parceria_secretaria_educacao) || isAffirmative(item.secretaria_educacao_possui) || isAffirmative(item.hasParceriaSecretariaEducacao)) {
      derived.add("encontro_mediado");
    }
    if (isAffirmative(item.lei_educacao_empreendedora) || isAffirmative(item.lei_possui) || isAffirmative(item.hasLaw)) {
      derived.add("encontro_mediado");
    }
    if (isAffirmative(item.parceria_ies) || isAffirmative(item.ies_possui) || isAffirmative(item.hasIes)) {
      derived.add("encontro_mediado");
    }
    insts = Array.from(derived);
  } else if (typeof insts === "string") {
    try { insts = JSON.parse(insts); } catch (e) { insts = insts.split(",").map(s => s.trim()).filter(Boolean); }
  }
  if (!Array.isArray(insts)) insts = [];

  const INSTRUMENTO_PESOS = {
    material_didatico: 10,
    oficina: 10,
    curso: 10,
    encontro_mediado: 10,
    palestra: 5
  };
  const pontuacao_instrumentos = insts.reduce((sum, code) => sum + (INSTRUMENTO_PESOS[code] !== undefined ? INSTRUMENTO_PESOS[code] : (code === "palestra" ? 5 : 10)), 0);
  const destaque_instrumentos = pontuacao_instrumentos >= 25;

  return {
    pontuacao: pontuacaoBruta,
    pontuacao_maxima: 91,
    percentual,
    classificacao,
    classificacao_key: classificacaoKey,
    criterios,
    instrumentos_aplicados: insts,
    pontuacao_instrumentos,
    destaque_instrumentos
  };
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

  // 1. Server Python API (supports port 8001 and relative /api, connecting directly to Supabase and merging overrides)
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

        loadedCases = (Array.isArray(casesData) ? casesData : []).map(normalizeCaseItem);
        loadedMunicipalities = (Array.isArray(munData) ? munData : []).filter(
          (m) => !(m.nome === "Ouro Preto" && !m.responsavel_nome && !m.responsavel_email && !m.status_jepp)
        );
        connectionMode = "cloud"; // conectado ao Supabase via proxy
        updateAdminConnectionBadge("cloud");
        success = true;
        break;
      }
    } catch (err) {
      // Tenta o próximo endpoint
    }
  }

  // 2. Direct Supabase Cloud REST (fallback se o backend local/servidor não responder)
  if (!success && supabaseUrl && supabaseKey) {
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
        loadedCases = (Array.isArray(casesData) ? casesData : []).map(normalizeCaseItem);
        loadedMunicipalities = (Array.isArray(munData) ? munData : []).filter(
          (m) => !(m.nome === "Ouro Preto" && !m.responsavel_nome && !m.responsavel_email && !m.status_jepp)
        );
        connectionMode = "cloud";
        updateAdminConnectionBadge("cloud");
        success = true;
      }
    } catch (err) {
      console.warn("Supabase direto indisponível, tentando proxy local/remoto...", err);
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
      // Discard automated test dummy entries
      const cleaned = localMun.filter((m) => !(m.nome === "Ouro Preto" && !m.responsavel_nome && !m.responsavel_email && !m.status_jepp));
      if (cleaned.length !== localMun.length) {
        localStorage.setItem("sebrae_pending_municipalities", JSON.stringify(cleaned));
      }
      cleaned.forEach((m) => {
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

// Municipality Advanced Filters State (Multi-select Sets)
const ALL_CRITERIA_KEYS = [
  "educacao_70_porcento",
  "parceria_secretaria_educacao",
  "jepp_municipio",
  "produto_despertar",
  "parceria_superintendencia",
  "parceria_ies",
  "rede_aqui_tem_sebrae",
  "convenio_parceria",
  "comite_acoes_conjuntas",
  "empresa_simulada",
  "escola_sebrae",
  "cooperativa_credito",
  "lei_educacao_empreendedora"
];

const CRITERIA_SHORT_LABELS = {
  educacao_70_porcento: "EE &gt; 70%",
  parceria_secretaria_educacao: "Sec. Educação",
  jepp_municipio: "JEPP",
  produto_despertar: "Despertar",
  parceria_superintendencia: "Superintendência",
  parceria_ies: "IES",
  rede_aqui_tem_sebrae: "Aqui Tem Sebrae",
  convenio_parceria: "Convênio",
  comite_acoes_conjuntas: "Comitê Gestor",
  empresa_simulada: "Emp. Simulada",
  escola_sebrae: "Escola Sebrae",
  cooperativa_credito: "Cooperativa",
  lei_educacao_empreendedora: "Lei EE"
};

let selectedMunRegionais = new Set();
let selectedMunTiers = new Set();
let selectedMunInstrumentos = new Set();
let selectedMunIndicadores = new Set();
let selectedMunVisibleIndicators = new Set(ALL_CRITERIA_KEYS);

const REGIONAL_NORMALIZATION = {
  "centro": "Centro",
  "centro-oeste e sudoeste": "Centro-Oeste e Sudoeste",
  "centro-oeste": "Centro-Oeste e Sudoeste",
  "centrooeste": "Centro-Oeste e Sudoeste",
  "jequitinhonha e mucuri": "Jequitinhonha e Mucuri",
  "jequitinhonha/mucuri": "Jequitinhonha e Mucuri",
  "noroeste e alto paranaíba": "Noroeste e Alto Paranaíba",
  "noroeste e alto paranaiba": "Noroeste e Alto Paranaíba",
  "noroeste": "Noroeste e Alto Paranaíba",
  "norte": "Norte",
  "rio doce e vale do aço": "Rio Doce e Vale do Aço",
  "rio doce e vale do aco": "Rio Doce e Vale do Aço",
  "rio doce": "Rio Doce e Vale do Aço",
  "sul": "Sul",
  "triângulo": "Triângulo",
  "triangulo": "Triângulo",
  "zona da mata e vertentes": "Zona da Mata e Vertentes",
  "zona da mata": "Zona da Mata e Vertentes"
};

function normalizeRegionalName(reg) {
  if (!reg) return "";
  const key = String(reg).trim().toLowerCase();
  return REGIONAL_NORMALIZATION[key] || reg;
}

function toggleMunMultiselect(id, event) {
  if (event) {
    event.stopPropagation();
  }
  const target = document.getElementById(id);
  const wasActive = target ? target.classList.contains("active") : false;

  // Fecha todos os outros dropdowns
  document.querySelectorAll(".mun-multiselect").forEach((el) => {
    el.classList.remove("active");
  });

  if (target && !wasActive) {
    target.classList.add("active");
  }
}

// Fechamento ao clicar fora
document.addEventListener("click", (e) => {
  if (!e.target.closest(".mun-multiselect")) {
    document.querySelectorAll(".mun-multiselect").forEach((el) => {
      el.classList.remove("active");
    });
  }
});

function onMunMultiselectChange(id) {
  const container = document.getElementById(id);
  if (!container) return;

  const checkboxes = container.querySelectorAll('.mun-multiselect-list input[type="checkbox"]');
  const checkedValues = [];

  checkboxes.forEach((cb) => {
    const parent = cb.closest(".mun-multiselect-option");
    if (cb.checked) {
      checkedValues.push(cb.value);
      if (parent) parent.classList.add("checked");
    } else {
      if (parent) parent.classList.remove("checked");
    }
  });

  if (id === "mun-ms-regional") {
    selectedMunRegionais = new Set(checkedValues);
    updateMultiselectButtonDisplay(id, checkedValues.length, checkedValues, "Todas as Regionais", "regionais");
  } else if (id === "mun-ms-tier") {
    selectedMunTiers = new Set(checkedValues);
    const labels = checkedValues.map((v) => (v === "desenvolvido" ? "Desenvolvido" : "Em Desenv."));
    updateMultiselectButtonDisplay(id, checkedValues.length, labels, "Todas as Classificações", "classificações");
  } else if (id === "mun-ms-instrumento") {
    selectedMunInstrumentos = new Set(checkedValues);
    const INSTRUMENT_SHORT_LABELS = {
      destaque: "Com Destaque",
      material_didatico: "Mat. Didático",
      oficina: "Oficina",
      curso: "Curso",
      encontro_mediado: "Encontro Med.",
      palestra: "Palestra",
      sem_instrumentos: "Sem Instr."
    };
    const labels = checkedValues.map((v) => INSTRUMENT_SHORT_LABELS[v] || v);
    updateMultiselectButtonDisplay(id, checkedValues.length, labels, "Todos os Instrumentos", "instrumentos");
  } else if (id === "mun-ms-indicador") {
    selectedMunIndicadores = new Set(checkedValues);
    const labels = checkedValues.map((k) => CRITERIA_SHORT_LABELS[k] || k);
    updateMultiselectButtonDisplay(id, checkedValues.length, labels, "Qualquer Indicador", "indicadores");
  } else if (id === "mun-ms-visible") {
    selectedMunVisibleIndicators = new Set(checkedValues);
    const count = checkedValues.length;
    const textEl = document.getElementById(`${id}-text`);
    const badgeEl = document.getElementById(`${id}-badge`);
    if (textEl) {
      if (count === ALL_CRITERIA_KEYS.length) {
        textEl.textContent = "Todos os 13 Indicadores";
      } else if (count === 0) {
        textEl.textContent = "Nenhum Indicador";
      } else {
        textEl.textContent = `${count} selecionado${count > 1 ? "s" : ""}`;
      }
    }
    if (badgeEl) {
      badgeEl.textContent = count;
      badgeEl.style.display = count > 0 && count < ALL_CRITERIA_KEYS.length ? "inline-block" : "none";
    }
  }

  renderMunicipalitiesTable();
}

function updateMultiselectButtonDisplay(id, count, labels, defaultText, pluralNoun) {
  const textEl = document.getElementById(`${id}-text`);
  const badgeEl = document.getElementById(`${id}-badge`);
  if (!textEl) return;

  if (count === 0) {
    textEl.textContent = defaultText;
    if (badgeEl) badgeEl.style.display = "none";
  } else if (count === 1) {
    textEl.textContent = labels[0];
    if (badgeEl) {
      badgeEl.textContent = "1";
      badgeEl.style.display = "inline-block";
    }
  } else {
    textEl.textContent = `${count} ${pluralNoun} selecionada${count > 1 ? "s" : ""}`;
    if (badgeEl) {
      badgeEl.textContent = count;
      badgeEl.style.display = "inline-block";
    }
  }
}

function selectAllMunMultiselect(id, selectAll) {
  const container = document.getElementById(id);
  if (!container) return;

  const checkboxes = container.querySelectorAll('.mun-multiselect-list input[type="checkbox"]');
  checkboxes.forEach((cb) => {
    cb.checked = selectAll;
    const parent = cb.closest(".mun-multiselect-option");
    if (parent) {
      if (selectAll) parent.classList.add("checked");
      else parent.classList.remove("checked");
    }
  });

  onMunMultiselectChange(id);
}

function setPresetVisibleIndicators(preset) {
  const container = document.getElementById("mun-ms-visible");
  if (!container) return;

  let targetKeys = [];
  if (preset === "all") {
    targetKeys = [...ALL_CRITERIA_KEYS];
  } else if (preset === "top5") {
    targetKeys = ALL_CRITERIA_KEYS.slice(0, 5);
  } else if (preset === "parcerias") {
    targetKeys = ["parceria_secretaria_educacao", "parceria_superintendencia", "parceria_ies", "cooperativa_credito", "convenio_parceria"];
  }

  const targetSet = new Set(targetKeys);
  const checkboxes = container.querySelectorAll('.mun-multiselect-list input[type="checkbox"]');
  checkboxes.forEach((cb) => {
    const isTarget = targetSet.has(cb.value);
    cb.checked = isTarget;
    const parent = cb.closest(".mun-multiselect-option");
    if (parent) {
      if (isTarget) parent.classList.add("checked");
      else parent.classList.remove("checked");
    }
  });

  onMunMultiselectChange("mun-ms-visible");
}

let showOnlyPositiveIndicators = false;

function toggleOnlyPositiveIndicators() {
  showOnlyPositiveIndicators = !showOnlyPositiveIndicators;
  const btn = document.getElementById("btn-toggle-positive-ind");
  if (btn) {
    btn.style.background = showOnlyPositiveIndicators ? "#dcfce7" : "";
    btn.style.color = showOnlyPositiveIndicators ? "#15803d" : "#16a34a";
  }
  renderMunicipalitiesTable();
}

function clearMunicipalityFilters() {
  selectedMunRegionais.clear();
  selectedMunTiers.clear();
  selectedMunInstrumentos.clear();
  selectedMunIndicadores.clear();
  selectedMunVisibleIndicators = new Set(ALL_CRITERIA_KEYS);
  showOnlyPositiveIndicators = false;

  const btnPos = document.getElementById("btn-toggle-positive-ind");
  if (btnPos) {
    btnPos.style.background = "";
    btnPos.style.color = "#16a34a";
  }

  // Desmarcar nos primeiros 4 dropdowns
  ["mun-ms-regional", "mun-ms-tier", "mun-ms-instrumento", "mun-ms-indicador"].forEach((id) => {
    const container = document.getElementById(id);
    if (!container) return;
    container.querySelectorAll('.mun-multiselect-list input[type="checkbox"]').forEach((cb) => {
      cb.checked = false;
      const parent = cb.closest(".mun-multiselect-option");
      if (parent) parent.classList.remove("checked");
    });
  });

  // Re-marcar todos em Indicadores Visíveis
  const visContainer = document.getElementById("mun-ms-visible");
  if (visContainer) {
    visContainer.querySelectorAll('.mun-multiselect-list input[type="checkbox"]').forEach((cb) => {
      cb.checked = true;
      const parent = cb.closest(".mun-multiselect-option");
      if (parent) parent.classList.add("checked");
    });
  }

  // Resetar textos e badges
  const resetMap = [
    { text: "mun-ms-regional-text", badge: "mun-ms-regional-badge", label: "Todas as Regionais" },
    { text: "mun-ms-tier-text", badge: "mun-ms-tier-badge", label: "Todas as Classificações" },
    { text: "mun-ms-instrumento-text", badge: "mun-ms-instrumento-badge", label: "Todos os Instrumentos" },
    { text: "mun-ms-indicador-text", badge: "mun-ms-indicador-badge", label: "Qualquer Indicador" },
    { text: "mun-ms-visible-text", badge: "mun-ms-visible-badge", label: "Todos os 13 Indicadores" }
  ];

  resetMap.forEach((item) => {
    const t = document.getElementById(item.text);
    const b = document.getElementById(item.badge);
    if (t) t.textContent = item.label;
    if (b) b.style.display = "none";
  });

  // Resetar campo de busca
  const searchInput = document.getElementById("admin-search-input");
  if (searchInput) searchInput.value = "";
  adminSearchQuery = "";

  renderMunicipalitiesTable();
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

  // 1. Apply Status Filter
  if (currentStatusFilter !== "all") {
    items = items.filter((m) => (m.status || "pending") === currentStatusFilter);
  }

  // 2. Apply Search Query
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

  // 3. Apply Regional Filter (Multi-select Acumulativo)
  if (selectedMunRegionais.size > 0) {
    items = items.filter((m) => {
      const norm = normalizeRegionalName(m.regional);
      if (selectedMunRegionais.has(norm)) return true;
      for (const reg of selectedMunRegionais) {
        if (norm.toLowerCase().includes(reg.toLowerCase()) || String(m.regional || "").toLowerCase().includes(reg.toLowerCase())) {
          return true;
        }
      }
      return false;
    });
  }

  // 4. Apply Tier / Classificacao Filter (Multi-select Acumulativo)
  if (selectedMunTiers.size > 0) {
    items = items.filter((m) => {
      const score = calculateMunicipioDevelopmentIndex(m);
      return score && selectedMunTiers.has(score.classificacao_key);
    });
  }

  // 5. Apply Instrument Filter (Multi-select Acumulativo)
  if (selectedMunInstrumentos.size > 0) {
    items = items.filter((m) => {
      const score = calculateMunicipioDevelopmentIndex(m);
      if (!score) return false;
      if (selectedMunInstrumentos.has("destaque") && score.destaque_instrumentos === true) {
        return true;
      }
      if (selectedMunInstrumentos.has("sem_instrumentos") && (!score.instrumentos_aplicados || score.instrumentos_aplicados.length === 0)) {
        return true;
      }
      if (Array.isArray(score.instrumentos_aplicados)) {
        for (const inst of score.instrumentos_aplicados) {
          if (selectedMunInstrumentos.has(inst)) return true;
        }
      }
      return false;
    });
  }

  // 6. Apply Indicator Filter (Multi-select Acumulativo: atende a QUALQUER um dos indicadores selecionados)
  if (selectedMunIndicadores.size > 0) {
    items = items.filter((m) => {
      const score = calculateMunicipioDevelopmentIndex(m);
      if (!score || !Array.isArray(score.criterios)) return false;
      return score.criterios.some((c) => c.atendido && selectedMunIndicadores.has(c.identificador));
    });
  }

  // Update dynamic count badge
  const countBadge = document.getElementById("mun-filtered-count-badge");
  if (countBadge) {
    countBadge.textContent = `Mostrando ${items.length} de ${loadedMunicipalities.length} municípios`;
  }

  if (items.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="8">
          <div class="admin-state-box">
            <i data-lucide="inbox"></i>
            <h4>Nenhuma solicitação de município encontrada</h4>
            <p>Tente ajustar os filtros ou a busca.</p>
          </div>
        </td>
      </tr>
    `;
    if (typeof lucide !== "undefined") lucide.createIcons();
    return;
  }

  const INSTRUMENT_LABELS = {
    material_didatico: "Mat. Didático (+10)",
    oficina: "Oficina (+10)",
    curso: "Curso (+10)",
    encontro_mediado: "Encontro Med. (+10)",
    palestra: "Palestra (+5)"
  };

  tbody.innerHTML = items.map((item) => {
    const status = item.status || "pending";
    const statusCfg = STATUS_CONFIG[status] || STATUS_CONFIG.pending;
    const protocol = item.request_code || (item.id ? `#${String(item.id).slice(-6)}` : "#000000");
    const munName = item.nome || item.municipio || "Município";
    const regionalMr = `${escapeHtml(item.regional || "-")} / ${escapeHtml(item.mr || "-")}`;
    const contact = (item.responsavel_nome || item.solicitante_nome || item.tecnico_nome)
      ? `<strong>${escapeHtml(item.responsavel_nome || item.solicitante_nome || item.tecnico_nome)}</strong><br><small style="color:#64748b;">${escapeHtml(item.responsavel_email || item.solicitante_email || item.tecnico_email || "")} ${(item.responsavel_telefone || item.solicitante_telefone || item.tecnico_telefone) ? `• ${escapeHtml(item.responsavel_telefone || item.solicitante_telefone || item.tecnico_telefone)}` : ""}</small>`
      : `<span style="color:#94a3b8;">Não informado</span>`;

    const scoreData = calculateMunicipioDevelopmentIndex(item) || {
      pontuacao: 0,
      classificacao: "Em Desenvolvimento",
      criterios: [],
      instrumentos_aplicados: [],
      pontuacao_instrumentos: 0,
      destaque_instrumentos: false
    };

    // Filter which criteria to display in table according to selectedMunVisibleIndicators and showOnlyPositiveIndicators
    let visibleCriterios = (scoreData.criterios || []).filter((c) => selectedMunVisibleIndicators.has(c.identificador));
    if (showOnlyPositiveIndicators) {
      visibleCriterios = visibleCriterios.filter((c) => c.atendido);
    }

    const indBadges = visibleCriterios.map((c) => {
      const cls = c.atendido ? "sim" : "nao";
      const icon = c.atendido ? "✓" : "✗";
      const statusText = c.atendido ? "Sim" : "Não";
      const label = CRITERIA_SHORT_LABELS[c.identificador] || c.identificador;
      return `<span class="mini-badge ${cls}" title="${c.ordem_str} - ${c.nome} (${c.peso} pts): ${statusText}" style="display:inline-flex; align-items:center; gap:2px; font-size:0.66rem; padding: 2px 4px; white-space:nowrap; border-radius:3px;"><span style="font-weight:700;">${icon}</span> ${label}</span>`;
    });

    const indicatorsHtml = visibleCriterios.length > 0
      ? `
        <div style="max-width: 195px;">
          <div style="display: flex; flex-wrap: wrap; gap: 3px;">
            ${indBadges.join("")}
          </div>
        </div>
      `
      : `<span style="color:#94a3b8; font-size: 0.78rem;">Nenhum no filtro</span>`;

    // Instruments badges & Destaque (horizontal flow)
    const instBadges = (scoreData.instrumentos_aplicados || []).map((code) => {
      const label = INSTRUMENT_LABELS[code] || code;
      return `<span class="mini-badge" style="background:#f1f5f9; color:#334155; border:1px solid #cbd5e1; font-size:0.72rem; padding: 3px 6px;">${label}</span>`;
    });

    const destaqueBadge = scoreData.destaque_instrumentos
      ? `<span class="mini-badge" style="background:#ecfdf5; color:#065f46; border:1px solid #a7f3d0; font-weight:700; display:inline-flex; align-items:center; gap:3px; padding: 3px 6px;"><i data-lucide="award" style="width:11px; height:11px;"></i> Destaque (${scoreData.pontuacao_instrumentos} pts)</span>`
      : (scoreData.pontuacao_instrumentos > 0 ? `<small style="color:#64748b; font-size:0.72rem; font-weight:600; padding: 2px 4px;">Total: ${scoreData.pontuacao_instrumentos} pts</small>` : `<span style="color:#94a3b8; font-size:0.75rem;">Nenhum</span>`);

    const instrumentosHtml = `
      <div style="display: flex; flex-wrap: wrap; gap: 3px; max-width: 135px; align-items: center;">
        ${instBadges.length > 0 ? instBadges.join("") : ""}
        ${destaqueBadge}
      </div>
    `;

    const tierBadge = scoreData.pontuacao >= 64
      ? `<span style="font-size: 0.73rem; font-weight: 700; color: #166534; background: #dcfce7; padding: 2px 7px; border-radius: 4px; border: 1px solid #86efac;">${scoreData.pontuacao} pts • Desenvolvido</span>`
      : `<span style="font-size: 0.73rem; font-weight: 700; color: #854d0e; background: #fef9c3; padding: 2px 7px; border-radius: 4px; border: 1px solid #fef08a;">${scoreData.pontuacao} pts • Em Desenv.</span>`;

    const actions = `
      <div class="row-actions">
        ${status === "pending" ? `
          <button class="btn-action btn-approve" onclick="approveMunicipality('${escapeHtml(item.id)}')" title="Aprovar Município">
            <i data-lucide="check"></i>
            <span>Aprovar</span>
          </button>
          <button class="btn-action btn-reject" onclick="rejectMunicipality('${escapeHtml(item.id)}')" title="Rejeitar Solicitação">
            <i data-lucide="x"></i>
            <span>Rejeitar</span>
          </button>
        ` : ""}
        <button class="btn-action btn-edit" onclick="openEditMunicipalityModal('${escapeHtml(item.id)}')" title="Editar Município">
          <i data-lucide="edit-3"></i>
          <span>Editar</span>
        </button>
        <button class="btn-action btn-delete" onclick="deleteMunicipality('${escapeHtml(item.id)}')" title="Excluir Município">
          <i data-lucide="trash-2"></i>
          <span>Excluir</span>
        </button>
        <button class="btn-action btn-details" onclick="openMunicipalityDetails('${escapeHtml(item.id)}')" title="Ver Detalhes">
          <i data-lucide="eye"></i>
          <span>Detalhes</span>
        </button>
      </div>
    `;

    return `
      <tr>
        <td><span class="protocol-code">${escapeHtml(protocol)}</span></td>
        <td>
          <div>
            <strong style="color: #0054a6; font-size: 0.95rem;">${escapeHtml(munName)}</strong>
            <div style="margin-top: 4px;">
              ${tierBadge}
            </div>
          </div>
        </td>
        <td>${regionalMr}</td>
        <td>${contact}</td>
        <td>
          <div class="table-indicator-badges">
            ${indicatorsHtml}
          </div>
        </td>
        <td>${instrumentosHtml}</td>
        <td><span class="badge-status ${statusCfg.class}">${statusCfg.label}</span></td>
        <td style="text-align: center;">${actions}</td>
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
        <td colspan="8">
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

    const devIndex = calculateMunicipioDevelopmentIndex(item);
    const indexBadge = devIndex ? `
      <div class="dev-index-badge ${devIndex.classificacao_key}" style="display: inline-flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; padding: 4px 8px; border-radius: 4px; box-sizing: border-box; width: 100%; max-width: 140px; margin: 0 auto;">
        <span class="dev-index-val ${devIndex.classificacao_key}" style="font-size: 0.75rem; font-weight: 800; text-align: center; width: 100%; display: block; padding: 0; background: transparent !important; border: none !important;">${escapeHtml(devIndex.classificacao)}</span>
        <span class="dev-index-sub" style="font-size: 0.68rem; font-weight: 700; text-align: center; width: 100%; display: block; margin-top: 2px; opacity: 0.85;">${devIndex.pontuacao}/${devIndex.pontuacao_maxima || 91} PTS (${devIndex.percentual}%)</span>
      </div>
    ` : `<span style="color: #94a3b8;">-</span>`;

    const parentMun = findParentMunicipality(item.municipio);
    const isParentRejected = parentMun && parentMun.status === "rejected";

    const actions = `
      <div class="row-actions">
        ${status === "pending" ? (
          isParentRejected ? `
            <button class="btn-action disabled" disabled title="Aprovação Bloqueada: O município '${escapeHtml(parentMun.nome)}' está REJEITADO. Aprove o município primeiro." style="opacity: 0.55; cursor: not-allowed; background: #fef2f2; border-color: #fca5a5; color: #b91c1c;">
              <i data-lucide="shield-alert"></i>
              <span>Bloqueado</span>
            </button>
            <button class="btn-action btn-reject" onclick="rejectCase('${escapeHtml(item.id)}')" title="Rejeitar Case">
              <i data-lucide="x"></i>
              <span>Rejeitar</span>
            </button>
          ` : `
            <button class="btn-action btn-approve" onclick="approveCase('${escapeHtml(item.id)}')" title="Aprovar Case">
              <i data-lucide="check"></i>
              <span>Aprovar</span>
            </button>
            <button class="btn-action btn-reject" onclick="rejectCase('${escapeHtml(item.id)}')" title="Rejeitar Case">
              <i data-lucide="x"></i>
              <span>Rejeitar</span>
            </button>
          `
        ) : ""}
        <button class="btn-action btn-edit" onclick="openEditCaseModal('${escapeHtml(item.id)}')" title="Editar Case">
          <i data-lucide="edit-3"></i>
          <span>Editar</span>
        </button>
        <button class="btn-action btn-delete" onclick="deleteCase('${escapeHtml(item.id)}')" title="Excluir Case">
          <i data-lucide="trash-2"></i>
          <span>Excluir</span>
        </button>
        <button class="btn-action btn-details" onclick="openCaseDetails('${escapeHtml(item.id)}')" title="Ver Detalhes">
          <i data-lucide="eye"></i>
          <span>Detalhes</span>
        </button>
      </div>
    `;

    return `
      <tr>
        <td><span class="protocol-code">${escapeHtml(protocol)}</span></td>
        <td><strong style="color: #1e293b;">${escapeHtml(title)}</strong></td>
        <td><span style="display: inline-flex; align-items: center; justify-content: center; white-space: nowrap; font-weight: 700; color: ${isEstudante ? '#047857' : '#0054a6'}; background: ${isEstudante ? '#ecfdf5' : '#e0f2fe'}; border: 1px solid ${isEstudante ? '#a7f3d0' : '#bae6fd'}; padding: 4px 8px; border-radius: 4px; font-size: 0.76rem; line-height: 1.2;">${typeLabel}</span></td>
        <td>${place}</td>
        <td style="text-align: center;">${indexBadge}</td>
        <td><strong>${escapeHtml(authorName)}</strong></td>
        <td>
          <span class="badge-status ${statusCfg.class}">${statusCfg.label}</span>
          ${isParentRejected ? `<div style="margin-top: 4px;"><span class="badge-status rejected" style="font-size: 0.65rem; padding: 2px 6px; display: inline-flex; align-items: center; gap: 3px;" title="Município Pai '${escapeHtml(parentMun.nome)}' está REJEITADO"><i data-lucide="shield-alert" style="width: 10px; height: 10px;"></i> Mun. Rejeitado</span></div>` : ""}
        </td>
        <td style="text-align: center;">${actions}</td>
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
  const item = loadedCases.find((c) => String(c.id) === String(id));
  if (item) {
    const parentMun = findParentMunicipality(item.municipio);
    if (parentMun && parentMun.status === "rejected") {
      showAdminToast(`Não é possível aprovar este case: o município '${parentMun.nome}' está REJEITADO. O município é a entidade pai e deve ser aprovado primeiro.`, "error");
      return;
    }
  }

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
  if (newStatus === "approved" && item) {
    const parentMun = findParentMunicipality(item.municipio);
    if (parentMun && parentMun.status === "rejected") {
      showAdminToast(`Não é possível aprovar este case: o município '${parentMun.nome}' está REJEITADO. Aprove o município primeiro.`, "error");
      return;
    }
  }

  // 1. Try Server backend PATCH first if online
  const action = newStatus === "approved" ? "approve" : "reject";
  try {
    const res = await fetch(getApiUrl(`/api/cases/${action}/${encodeURIComponent(id)}`), {
      method: "PATCH",
      headers: getAdminAuthHeaders()
    });
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      showAdminToast(errData.error || "Erro ao processar alteração de status do case.", "error");
      return;
    }
  } catch (err) {
    // Offline / direct fallback
  }

  if (item) item.status = newStatus;

  // 2. Update in local storage
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

  closeCaseDetailsModal();
  updateKPIs();
  renderCurrentAdminTab();
  showAdminToast(successMsg, newStatus === "approved" ? "success" : "error");
}

function getIndicatorBadge(val) {
  const isAffirmative = val === true || val === 1 || String(val || "").trim().toLowerCase() === "sim" || String(val || "").trim().toLowerCase() === "true" || String(val || "").trim().toLowerCase() === "total";
  return isAffirmative
    ? `<span class="indicator-tag sim">Sim</span>`
    : `<span class="indicator-tag nao">Não</span>`;
}

function renderDevIndexCalculationMemory(item) {
  const devIndex = calculateMunicipioDevelopmentIndex(item);
  if (!devIndex) return "";

  const { pontuacao, pontuacao_maxima, percentual, classificacao, classificacao_key, criterios } = devIndex;

  const isEmDesenv = classificacao_key === "em_desenvolvimento";
  const isDesenvolvido = classificacao_key === "desenvolvido";

  return `
    <div class="admin-detail-card card-indicators">
      <div class="admin-card-header">
        <div class="admin-card-title">
          <i data-lucide="bar-chart-2"></i>
          <span>Índice de Desenvolvimento do Município — Memória de Cálculo</span>
        </div>
        <span class="dev-index-val ${classificacao_key}" style="font-size: 0.78rem; padding: 3px 8px;">${escapeHtml(classificacao)}</span>
      </div>

      <!-- Card Consolidado e Faixas -->
      <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 14px; margin-bottom: 12px;">
        <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px; margin-bottom: 14px;">
          <div>
            <div style="font-size: 0.74rem; font-weight: 700; text-transform: uppercase; color: #64748b; letter-spacing: 0.4px;">Pontuação Consolidada</div>
            <div style="font-size: 1.35rem; font-weight: 800; color: #0f172a; line-height: 1.2; margin-top: 2px;">
              ${pontuacao} <span style="font-size: 0.92rem; font-weight: 600; color: #64748b;">/ ${pontuacao_maxima} pontos</span>
              <span style="font-size: 0.98rem; font-weight: 700; color: #0054a6; margin-left: 6px;">(${percentual}%)</span>
            </div>
          </div>

          <div style="display: flex; gap: 8px; flex-wrap: wrap;">
            <div style="padding: 6px 12px; border-radius: 6px; font-size: 0.75rem; font-weight: 700; display: flex; flex-direction: column; gap: 1px; ${isEmDesenv ? 'background: #e0f2fe; color: #0369a1; border: 2px solid #0284c7; box-shadow: 0 1px 4px rgba(2, 132, 199, 0.2);' : 'background: #f1f5f9; color: #64748b; border: 1px solid #cbd5e1; opacity: 0.75;'}">
              <span>Em Desenvolvimento</span>
              <small style="font-weight: 600; font-size: 0.68rem;">0 a 63 pts (0% - 69%)</small>
            </div>
            <div style="padding: 6px 12px; border-radius: 6px; font-size: 0.75rem; font-weight: 700; display: flex; flex-direction: column; gap: 1px; ${isDesenvolvido ? 'background: #dcfce7; color: #15803d; border: 2px solid #22c55e; box-shadow: 0 1px 4px rgba(34, 197, 94, 0.2);' : 'background: #f1f5f9; color: #64748b; border: 1px solid #cbd5e1; opacity: 0.75;'}">
              <span>Desenvolvido</span>
              <small style="font-weight: 600; font-size: 0.68rem;">64 a 91 pts (70% - 100%)</small>
            </div>
          </div>
        </div>

        <!-- Tabela com as 5 Colunas -->
        <div style="overflow-x: auto; border: 1px solid #e2e8f0; border-radius: 8px;">
          <table style="width: 100%; border-collapse: collapse; font-size: 0.82rem; background: #ffffff;">
            <thead>
              <tr style="background: #f1f5f9; color: #475569; text-transform: uppercase; font-size: 0.71rem; letter-spacing: 0.5px;">
                <th style="padding: 8px 10px; text-align: center; border-bottom: 1px solid #e2e8f0; width: 50px;">Ordem</th>
                <th style="padding: 8px 12px; text-align: left; border-bottom: 1px solid #e2e8f0;">Critério</th>
                <th style="padding: 8px 10px; text-align: center; border-bottom: 1px solid #e2e8f0; width: 65px;">Peso</th>
                <th style="padding: 8px 10px; text-align: center; border-bottom: 1px solid #e2e8f0; width: 95px;">Atendido?</th>
                <th style="padding: 8px 12px; text-align: right; border-bottom: 1px solid #e2e8f0; width: 110px;">Pontos Obtidos</th>
              </tr>
            </thead>
            <tbody>
              ${criterios.map(c => `
                <tr style="border-bottom: 1px solid #f1f5f9; ${c.atendido ? 'background: rgba(240, 253, 244, 0.45);' : ''}">
                  <td style="padding: 7px 10px; text-align: center; font-weight: 700; color: #64748b;">${escapeHtml(c.ordem_str)}</td>
                  <td style="padding: 7px 12px; color: #1e293b; font-weight: 500;">${escapeHtml(c.nome)}</td>
                  <td style="padding: 7px 10px; text-align: center; font-weight: 700; color: #0054a6;">${c.peso}</td>
                  <td style="padding: 7px 10px; text-align: center;">
                    ${c.atendido
                      ? `<span style="display: inline-flex; align-items: center; gap: 3px; color: #15803d; font-weight: 700; background: #dcfce7; padding: 2px 7px; border-radius: 4px; font-size: 0.75rem;"><i data-lucide="check" style="width: 12px; height: 12px;"></i> Sim</span>`
                      : `<span style="display: inline-flex; align-items: center; gap: 3px; color: #94a3b8; font-weight: 600; background: #f1f5f9; padding: 2px 7px; border-radius: 4px; font-size: 0.75rem;"><i data-lucide="x" style="width: 12px; height: 12px;"></i> Não</span>`
                    }
                  </td>
                  <td style="padding: 7px 12px; text-align: right; font-weight: 800; color: ${c.pontos > 0 ? '#15803d' : '#94a3b8'};">
                    ${c.pontos > 0 ? `+${c.pontos} pts` : `0 pts`}
                  </td>
                </tr>
              `).join("")}
            </tbody>
            <tfoot>
              <tr style="background: #f8fafc; border-top: 2px solid #cbd5e1; font-weight: 800;">
                <td colspan="2" style="padding: 10px 12px; color: #1e293b;">Total Consolidado</td>
                <td style="padding: 10px; text-align: center; color: #0054a6;">${pontuacao_maxima}</td>
                <td style="padding: 10px; text-align: center; color: #64748b;">${criterios.filter(c => c.atendido).length} / ${criterios.length}</td>
                <td style="padding: 10px 12px; text-align: right; color: #0054a6; font-size: 0.95rem;">${pontuacao} pts (${percentual}%)</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  `;
}

function renderAdminMunicipalityInstruments(item) {
  let insts = item.instrumentos_aplicados;
  if (!insts && insts !== []) {
    const devIdx = calculateMunicipioDevelopmentIndex(item);
    insts = devIdx && devIdx.instrumentos_aplicados ? devIdx.instrumentos_aplicados : [];
  } else if (typeof insts === "string") {
    try { insts = JSON.parse(insts); } catch (e) { insts = insts.split(",").map(s => s.trim()).filter(Boolean); }
  }
  if (!Array.isArray(insts)) insts = [];

  const priorityOrder = ["material_didatico", "oficina", "curso", "encontro_mediado", "palestra"];
  insts.sort((a, b) => priorityOrder.indexOf(a) - priorityOrder.indexOf(b));

  const pontuacao = insts.reduce((sum, code) => sum + (code === "palestra" ? 5 : 10), 0);
  const hasDestaque = pontuacao >= 25;

  const labels = {
    material_didatico: "Aplicação de Material Didático",
    oficina: "Oficina",
    curso: "Curso",
    encontro_mediado: "Encontro Mediado",
    palestra: "Palestra"
  };

  const pillsHtml = insts.length > 0
    ? insts.map(code => `
        <span class="instrument-pill">
          <i data-lucide="check" style="width: 14px; height: 14px;"></i>
          <span>${escapeHtml(labels[code] || code)}</span>
          <span class="instrument-pill-pts">+${code === "palestra" ? 5 : 10} pts</span>
        </span>
      `).join("")
    : `<span style="color: #94a3b8; font-size: 0.85rem; font-style: italic;">Nenhum instrumento informado</span>`;

  return `
    <div class="admin-detail-card instruments-detail-box" style="margin-top: 16px;">
      <div class="instruments-detail-header">
        <div class="admin-card-title" style="display: flex; align-items: center; gap: 8px; font-weight: 700; color: #0054a6;">
          <i data-lucide="layers"></i>
          <span>Instrumentos Aplicados no Município</span>
        </div>
        <div style="display: flex; align-items: center; gap: 8px;">
          <span class="badge" style="background: #eff6ff; color: #0054a6; border: 1px solid #bfdbfe; font-size: 0.8rem; font-weight: 700;">
            ${pontuacao} pontos (${insts.length}/5)
          </span>
          ${hasDestaque ? `
            <span class="badge" style="background: #fefce8; color: #854d0e; border: 1.5px solid #fde047; font-weight: 700; display: inline-flex; align-items: center; gap: 4px;">
              <i data-lucide="award" style="width: 14px; height: 14px; color: #ca8a04;"></i> Destaque
            </span>
          ` : ""}
        </div>
      </div>
      <div class="instruments-pills-container">
        ${pillsHtml}
      </div>
    </div>
  `;
}

function renderMunicipalityFinalConsolidatedScore(item) {
  const devIndex = calculateMunicipioDevelopmentIndex(item);
  let insts = item.instrumentos_aplicados;
  if (!insts && insts !== []) {
    insts = devIndex && devIndex.instrumentos_aplicados ? devIndex.instrumentos_aplicados : [];
  } else if (typeof insts === "string") {
    try { insts = JSON.parse(insts); } catch (e) { insts = insts.split(",").map(s => s.trim()).filter(Boolean); }
  }
  if (!Array.isArray(insts)) insts = [];

  const ptsIndice = devIndex ? devIndex.pontuacao : 0;
  const ptsMaxIndice = devIndex ? devIndex.pontuacao_maxima : 91;
  const ptsInst = insts.reduce((sum, code) => sum + (code === "palestra" ? 5 : 10), 0);
  const ptsTotal = ptsIndice + ptsInst;
  const isDesenvolvido = devIndex && devIndex.classificacao_key === "desenvolvido";

  return `
    <div class="admin-detail-card" style="background: linear-gradient(135deg, #f0fdf4 0%, #e0f2fe 100%); border: 2px solid #86efac; border-radius: 10px; padding: 18px; margin-top: 16px; box-shadow: 0 4px 12px rgba(16, 185, 129, 0.1);">
      <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 14px;">
        <div>
          <div style="font-size: 0.82rem; font-weight: 800; text-transform: uppercase; color: #047857; letter-spacing: 0.5px; display: flex; align-items: center; gap: 6px;">
            <i data-lucide="award" style="width: 18px; height: 18px; color: #15803d;"></i>
            <span>Pontuação Final: Índice de Desenvolvimento + Instrumentos Aplicados</span>
          </div>
          <div style="font-size: 1.6rem; font-weight: 800; color: #0f172a; margin-top: 4px; line-height: 1.2;">
            ${ptsTotal} <span style="font-size: 1rem; font-weight: 600; color: #64748b;">pontos totais</span>
          </div>
          <div style="font-size: 0.85rem; color: #334155; margin-top: 4px; line-height: 1.4;">
            Memória: <strong>${ptsIndice} pts</strong> (Índice de Desenvolvimento: ${ptsIndice}/${ptsMaxIndice}) + <strong>${ptsInst} pts</strong> (${insts.length} Instrumentos Aplicados: ${ptsInst}/45 pts)
          </div>
        </div>
        <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
          <span class="badge" style="background: ${isDesenvolvido ? '#dcfce7' : '#e0f2fe'}; color: ${isDesenvolvido ? '#15803d' : '#0369a1'}; border: 1.5px solid ${isDesenvolvido ? '#86efac' : '#7dd3fc'}; font-weight: 800; font-size: 0.85rem; padding: 6px 12px; border-radius: 8px;">
            ${isDesenvolvido ? 'Município Desenvolvido' : 'Município em Desenvolvimento'}
          </span>
          ${ptsInst >= 25 ? `
            <span class="badge" style="background: #fefce8; color: #854d0e; border: 1.5px solid #fde047; font-weight: 800; font-size: 0.85rem; padding: 6px 12px; border-radius: 8px; display: inline-flex; align-items: center; gap: 5px;">
              <i data-lucide="award" style="width: 14px; height: 14px; color: #ca8a04;"></i> Destaque em Instrumentos
            </span>
          ` : ""}
        </div>
      </div>
    </div>
  `;
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
    <div class="admin-detail-card card-project">
      <div class="admin-card-header">
        <div class="admin-card-title">
          <i data-lucide="map-pin"></i>
          <span>Dados Gerais do Município</span>
        </div>
        <div style="display: flex; align-items: center; gap: 8px;">
          <span class="badge-status ${statusCfg.class}">${statusCfg.label}</span>
          <span class="admin-card-tag">Município</span>
        </div>
      </div>
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
          <span class="detail-value" style="color: #0054a6; font-weight: 700; font-size: 1.05rem;">${escapeHtml(item.nome || item.municipio || "-")}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Regional / MR</span>
          <span class="detail-value">${escapeHtml(item.regional || "-")} • ${escapeHtml(item.mr || "-")}</span>
        </div>
      </div>
    </div>

    <div class="admin-detail-card card-technician">
      <div class="admin-card-header">
        <div class="admin-card-title">
          <i data-lucide="user-check"></i>
          <span>Responsável pelo Cadastro</span>
        </div>
        <span class="admin-card-tag">Cadastrador</span>
      </div>
      <div class="modal-grid-2">
        <div class="detail-item">
          <span class="detail-label">Nome Completo</span>
          <span class="detail-value" style="font-weight: 700; color: #0369a1;">${escapeHtml(item.responsavel_nome || item.solicitante_nome || item.tecnico_nome || "Não informado")}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">E-mail Corporativo</span>
          <span class="detail-value">
            ${item.responsavel_email || item.solicitante_email || item.tecnico_email ? `
              <a href="mailto:${escapeHtml(item.responsavel_email || item.solicitante_email || item.tecnico_email)}" class="contact-link">
                <i data-lucide="mail"></i>
                <span>${escapeHtml(item.responsavel_email || item.solicitante_email || item.tecnico_email)}</span>
              </a>
            ` : "Não informado"}
          </span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Telefone / WhatsApp</span>
          <span class="detail-value">
            ${item.responsavel_telefone || item.solicitante_telefone || item.tecnico_telefone ? `
              <a href="tel:${escapeHtml((item.responsavel_telefone || item.solicitante_telefone || item.tecnico_telefone).replace(/[^0-9+]/g, ''))}" class="contact-link">
                <i data-lucide="phone"></i>
                <span>${escapeHtml(item.responsavel_telefone || item.solicitante_telefone || item.tecnico_telefone)}</span>
              </a>
            ` : "Não informado"}
          </span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Data de Envio</span>
          <span class="detail-value">${item.created_at ? new Date(item.created_at).toLocaleString("pt-BR") : "Recentemente"}</span>
        </div>
      </div>
    </div>

    <div class="admin-detail-card card-indicators">
      <div class="admin-card-header">
        <div class="admin-card-title">
          <i data-lucide="check-circle-2"></i>
          <span>Indicadores de Educação Empreendedora</span>
        </div>
      </div>
      <div class="indicators-summary-list">
        <div class="indicator-check-row">
          <span>1º - Possui Educação Empreendedora em mais de 70% do município</span>
          ${getIndicatorBadge(item.educacao_70_porcento || item.municipio_ee_70 || item.edu70)}
        </div>
        <div class="indicator-check-row">
          <span>2º - Parceria com Secretária Municipal de Educação</span>
          ${getIndicatorBadge(item.parceria_secretaria_educacao || item.secretaria_educacao_possui || item.hasParceriaSecretariaEducacao || item.secretaria_educacao)}
        </div>
        <div class="indicator-check-row">
          <span>3º - JEPP no município</span>
          ${getIndicatorBadge(item.status_jepp || item.jepp_municipio || item.jeppStatus)}
        </div>
        <div class="indicator-check-row">
          <span>4º - Produto Despertar implantado</span>
          ${getIndicatorBadge(item.produto_despertar || item.despertar_possui || item.hasDespertar)}
        </div>
        <div class="indicator-check-row">
          <span>5º - Parceria com superintendência de ensino</span>
          ${getIndicatorBadge(item.parceria_superintendencia || item.hasParceriaSuperintendencia)}
        </div>
        <div class="indicator-check-row">
          <span>6º - Parceria com instituição de ensino superior</span>
          ${getIndicatorBadge(item.parceria_ies || item.ies_possui || item.hasIes)}
        </div>
        <div class="indicator-check-row">
          <span>7º - Rede Aqui Tem Sebrae</span>
          ${getIndicatorBadge(item.rede_aqui_tem_sebrae || item.aqui_tem_sebrae_possui || item.hasRedeAquiTemSebrae)}
        </div>
        <div class="indicator-check-row">
          <span>8º - Convênio / termo de parceria</span>
          ${getIndicatorBadge(item.convenio_parceria || item.convenio_sebrae || item.hasConvenioSebrae)}
        </div>
        <div class="indicator-check-row">
          <span>9º - Comitê e ações conjuntas</span>
          ${getIndicatorBadge(item.comite_acoes_conjuntas || item.comite_possui || item.hasCommittee)}
        </div>
        <div class="indicator-check-row">
          <span>10º - Empresa simulada</span>
          ${getIndicatorBadge(item.empresa_simulada || item.empresa_simulada_possui || item.hasEmpresaSimulada)}
        </div>
        <div class="indicator-check-row">
          <span>11º - Sistema de Ensino Escola do Sebrae (Cursos Técnicos)</span>
          ${getIndicatorBadge(item.escola_sebrae || item.escola_sebrae_possui || item.hasEscolaSebrae)}
        </div>
        <div class="indicator-check-row">
          <span>12º - Parceria com Cooperativa de Crédito</span>
          ${getIndicatorBadge(item.cooperativa_credito || item.cooperativa_possui || item.hasCoop)}
        </div>
        <div class="indicator-check-row">
          <span>13º - Lei da educação empreendedora</span>
          ${getIndicatorBadge(item.lei_educacao_empreendedora || item.lei_possui || item.hasLaw)}
        </div>
      </div>
    </div>
    ${renderAdminMunicipalityInstruments(item)}
    ${renderDevIndexCalculationMemory(item)}
    ${renderMunicipalityFinalConsolidatedScore(item)}
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

function normalizeCaseItem(c, idx) {
  if (!c) return c;
  if (!c.status) c.status = "approved";
  if (!c.request_code) c.request_code = `#${10000 * ((idx || 0) + 1)}`;
  
  const isEstudante = c.tipo_case === 'estudante' || c.tipoCase === 'estudante' || c.estudante_possui;
  c.tipo_case = isEstudante ? 'estudante' : 'professor';
  c.tipoCase = isEstudante ? 'estudante' : 'professor';
  
  // Extrai dados do professor se salvos em estudante_resumo legado
  let profNome = c.professor_nome || c.professorNome || "";
  let profEmail = c.professor_email || c.professorEmail || "";
  let profTel = c.professor_telefone || c.professorTelefone || "";
  if (!isEstudante && !profNome && c.estudante_resumo && c.estudante_resumo.startsWith("Professor:")) {
    const match = c.estudante_resumo.match(/^Professor:\s*([^(]+)(?:\(([^ -]+)?\s*-\s*([^)]+)?\))?/);
    if (match) {
      profNome = match[1] ? match[1].trim() : "";
      profEmail = match[2] ? match[2].trim() : "";
      profTel = match[3] ? match[3].trim() : "";
    }
  }

  let studNome = c.estudante_nome || c.estudanteNome || "";
  let studEmail = c.estudante_email || c.estudanteEmail || "";
  let studTel = c.estudante_telefone || c.estudanteTelefone || c.estudante_contato || "";

  c.professor_nome = profNome;
  c.professorNome = profNome;
  c.professor_email = profEmail;
  c.professorEmail = profEmail;
  c.professor_telefone = profTel;
  c.professorTelefone = profTel;

  c.estudante_nome = studNome;
  c.estudanteNome = studNome;
  c.estudante_email = studEmail;
  c.estudanteEmail = studEmail;
  c.estudante_telefone = studTel;
  c.estudanteTelefone = studTel;

  c.empresa_nome = c.empresa_nome || c.empresaNome || "";
  c.empresaNome = c.empresa_nome;
  c.empresa_tipo = c.empresa_tipo || c.empresaTipo || "";
  c.empresaTipo = c.empresa_tipo;
  c.empresa_descricao = c.empresa_descricao || c.empresaDescricao || "";
  c.empresaDescricao = c.empresa_descricao;

  return c;
}

function getCaseAuthorData(item) {
  if (!item) return { isEstudante: false, nome: "", email: "", telefone: "" };
  const isEstudante = item.tipo_case === 'estudante' || item.tipoCase === 'estudante' || item.estudante_possui;
  
  let profNome = item.professor_nome || item.professorNome || "";
  let profEmail = item.professor_email || item.professorEmail || "";
  let profTel = item.professor_telefone || item.professorTelefone || "";
  
  let studNome = item.estudante_nome || item.estudanteNome || "";
  let studEmail = item.estudante_email || item.estudanteEmail || "";
  let studTel = item.estudante_telefone || item.estudanteTelefone || item.estudante_contato || "";

  if (!isEstudante && !profNome && item.estudante_resumo && item.estudante_resumo.startsWith("Professor:")) {
    const match = item.estudante_resumo.match(/^Professor:\s*([^(]+)(?:\(([^ -]+)?\s*-\s*([^)]+)?\))?/);
    if (match) {
      profNome = match[1] ? match[1].trim() : "";
      profEmail = match[2] ? match[2].trim() : "";
      profTel = match[3] ? match[3].trim() : "";
    }
  }

  if (isEstudante && !studNome && item.estudante_resumo && !item.estudante_resumo.startsWith("Professor:")) {
    studNome = item.estudante_resumo.trim();
  }

  return {
    isEstudante,
    nome: isEstudante ? studNome : profNome,
    email: isEstudante ? studEmail : profEmail,
    telefone: isEstudante ? studTel : profTel,
    profNome,
    profEmail,
    profTel,
    studNome,
    studEmail,
    studTel
  };
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
  const authorData = getCaseAuthorData(item);
  const isEstudante = authorData.isEstudante;

  const parentMun = findParentMunicipality(item.municipio);
  const isParentRejected = parentMun && parentMun.status === "rejected";

  titleEl.textContent = title;

  body.innerHTML = `
    ${isParentRejected ? `
      <div style="background: #fef2f2; border: 1.5px solid #fca5a5; border-radius: 10px; padding: 14px 18px; margin-bottom: 18px; display: flex; align-items: center; gap: 14px; box-shadow: 0 2px 6px rgba(239, 68, 68, 0.08);">
        <i data-lucide="shield-alert" style="width: 24px; height: 24px; color: #dc2626; flex-shrink: 0;"></i>
        <div>
          <strong style="color: #991b1b; font-size: 0.95rem; display: block; margin-bottom: 2px;">Aprovação Bloqueada — Município Pai Rejeitado</strong>
          <span style="color: #b91c1c; font-size: 0.86rem; line-height: 1.4;">
            O município correspondente <strong>${escapeHtml(parentMun.nome)}</strong> está com status <strong>REJEITADO</strong>. Por regra de negócio hierárquica, cases só podem ser aprovados se seu município pai estiver aprovado.
          </span>
        </div>
      </div>
    ` : ""}
    <div class="admin-detail-card card-project">
      <div class="admin-card-header">
        <div class="admin-card-title">
          <i data-lucide="info"></i>
          <span>Identificação do Projeto</span>
        </div>
        <div style="display: flex; align-items: center; gap: 8px;">
          <span class="badge-status ${statusCfg.class}">${statusCfg.label}</span>
          <span class="admin-card-tag">${isEstudante ? 'Estudante' : 'Professor'}</span>
        </div>
      </div>
      <div class="modal-grid-2">
        <div class="detail-item">
          <span class="detail-label">Protocolo</span>
          <span class="detail-value"><span class="protocol-code">${escapeHtml(protocol)}</span></span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Modalidade</span>
          <span class="detail-value" style="color: ${isEstudante ? '#16a34a' : '#7c3aed'}; font-weight:700;">
            ${isEstudante ? 'Estudante Empreendedor' : 'Professor'}
          </span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Município</span>
          <span class="detail-value" style="color: #0054a6; font-weight: 700;">
            ${escapeHtml(item.municipio || "-")} ${item.regional ? `<span style="font-size: 0.85rem; font-weight: 500; color: #64748b;">(${escapeHtml(item.regional)})</span>` : ""}
          </span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Escola / Instituição</span>
          <span class="detail-value" style="font-weight: 600;">${escapeHtml(item.escola_instituicao || item.escola || "-")}</span>
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

    <div class="admin-detail-card card-description">
      <div class="admin-card-header">
        <div class="admin-card-title">
          <i data-lucide="file-text"></i>
          <span>Descrição Geral do Case</span>
        </div>
      </div>
      <div style="font-size: 0.92rem; color: #334155; line-height: 1.6; white-space: pre-line;">
        ${escapeHtml(item.descricao_geral || item.descricao || "Nenhuma descrição fornecida.")}
      </div>
    </div>

    ${(item.empresa_nome || item.empresaNome || item.empresa_tipo || item.empresaTipo || item.empresa_descricao || item.empresaDescricao) ? `
    <div class="admin-detail-card card-enterprise">
      <div class="admin-card-header">
        <div class="admin-card-title">
          <i data-lucide="briefcase"></i>
          <span>Dados do Empreendimento</span>
        </div>
        <span class="admin-card-tag">Negócio Criado</span>
      </div>
      <div class="modal-grid-2">
        <div class="detail-item">
          <span class="detail-label">Nome da Empresa</span>
          <span class="detail-value" style="color: #9a3412; font-weight: 800; font-size: 1.05rem;">
            ${escapeHtml(item.empresa_nome || item.empresaNome || "Não informado")}
          </span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Tipo de Negócio</span>
          <span class="detail-value" style="font-weight: 600;">
            ${escapeHtml(item.empresa_tipo || item.empresaTipo || "Não informado")}
          </span>
        </div>
        ${(item.empresa_descricao || item.empresaDescricao) ? `
        <div class="detail-item" style="grid-column: span 2;">
          <span class="detail-label">Descrição da Atuação</span>
          <div style="background: rgba(255, 255, 255, 0.7); border: 1px solid #fed7aa; border-radius: 8px; padding: 12px; font-size: 0.9rem; color: #7c2d12; line-height: 1.55; margin-top: 4px; white-space: pre-line;">
            ${escapeHtml(item.empresa_descricao || item.empresaDescricao)}
          </div>
        </div>` : ""}
      </div>
    </div>
    ` : ""}

    <div class="admin-detail-card card-technician">
      <div class="admin-card-header">
        <div class="admin-card-title">
          <i data-lucide="user-check"></i>
          <span>Técnico Responsável (Sebrae)</span>
        </div>
        <span class="admin-card-tag">Equipe Sebrae</span>
      </div>
      <div class="modal-grid-2">
        <div class="detail-item">
          <span class="detail-label">Nome do Técnico</span>
          <span class="detail-value" style="font-weight: 700; color: #0369a1;">
            ${escapeHtml(item.tecnico_nome || item.tecnicoNome || "Não informado")}
          </span>
        </div>
        <div class="detail-item">
          <span class="detail-label">E-mail Corporativo</span>
          <span class="detail-value">
            ${item.tecnico_email || item.tecnicoEmail ? `
              <a href="mailto:${escapeHtml(item.tecnico_email || item.tecnicoEmail)}" class="contact-link">
                <i data-lucide="mail"></i>
                <span>${escapeHtml(item.tecnico_email || item.tecnicoEmail)}</span>
              </a>
            ` : "Não informado"}
          </span>
        </div>
        <div class="detail-item" style="grid-column: span 2;">
          <span class="detail-label">Telefone / WhatsApp</span>
          <span class="detail-value">
            ${item.tecnico_telefone || item.tecnicoContato ? `
              <a href="tel:${escapeHtml((item.tecnico_telefone || item.tecnicoContato).replace(/[^0-9+]/g, ''))}" class="contact-link">
                <i data-lucide="phone"></i>
                <span>${escapeHtml(item.tecnico_telefone || item.tecnicoContato)}</span>
              </a>
            ` : "Não informado"}
          </span>
        </div>
      </div>
    </div>

    <div class="admin-detail-card ${isEstudante ? 'card-student' : 'card-professor'}">
      <div class="admin-card-header">
        <div class="admin-card-title">
          <i data-lucide="${isEstudante ? 'sparkles' : 'graduation-cap'}"></i>
          <span>${isEstudante ? 'Dados do Estudante Empreendedor' : 'Dados do Professor'}</span>
        </div>
        <span class="admin-card-tag">${isEstudante ? 'Aluno Empreendedor' : 'Docente'}</span>
      </div>
      <div class="modal-grid-2">
        <div class="detail-item">
          <span class="detail-label">Nome Completo</span>
          <span class="detail-value" style="font-weight: 800; font-size: 1.05rem; color: ${isEstudante ? '#15803d' : '#6b21a8'};">
            ${escapeHtml(authorData.nome || "Não informado")}
          </span>
        </div>
        <div class="detail-item">
          <span class="detail-label">E-mail</span>
          <span class="detail-value">
            ${authorData.email ? `
              <a href="mailto:${escapeHtml(authorData.email)}" class="contact-link">
                <i data-lucide="mail"></i>
                <span>${escapeHtml(authorData.email)}</span>
              </a>
            ` : "Não informado"}
          </span>
        </div>
        <div class="detail-item" style="grid-column: span 2;">
          <span class="detail-label">Telefone / Contato</span>
          <span class="detail-value">
            ${authorData.telefone ? `
              <a href="tel:${escapeHtml(authorData.telefone.replace(/[^0-9+]/g, ''))}" class="contact-link">
                <i data-lucide="phone"></i>
                <span>${escapeHtml(authorData.telefone)}</span>
              </a>
            ` : "Não informado"}
          </span>
        </div>
      </div>
    </div>
    ${renderDevIndexCalculationMemory(item)}
  `;

  actions.innerHTML = `
    ${status === "pending" ? (
      isParentRejected ? `
        <button class="btn-action btn-reject" onclick="rejectCase('${escapeHtml(item.id)}')" style="padding: 8px 16px; font-size: 0.9rem;">
          <i data-lucide="x"></i> Rejeitar
        </button>
        <button class="btn-action disabled" disabled title="Município pai rejeitado. Aprovação bloqueada." style="padding: 8px 16px; font-size: 0.9rem; opacity: 0.55; cursor: not-allowed; background: #fef2f2; color: #b91c1c; border-color: #fca5a5;">
          <i data-lucide="shield-alert" style="color: #ef4444;"></i> Aprovação Bloqueada
        </button>
      ` : `
        <button class="btn-action btn-reject" onclick="rejectCase('${escapeHtml(item.id)}')" style="padding: 8px 16px; font-size: 0.9rem;">
          <i data-lucide="x"></i> Rejeitar
        </button>
        <button class="btn-action btn-approve" onclick="approveCase('${escapeHtml(item.id)}')" style="padding: 8px 16px; font-size: 0.9rem;">
          <i data-lucide="check"></i> Aprovar Case
        </button>
      `
    ) : ""}
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
  document.getElementById("edit-mun-ee70").value = (item.municipio_ee_70 === 'sim' || item.municipio_ee_70 === true || item.educacao_70_porcento === true) ? "sim" : "nao";
  if (document.getElementById("edit-mun-secretaria-educacao")) {
    document.getElementById("edit-mun-secretaria-educacao").value = (item.parceria_secretaria_educacao === 'sim' || item.parceria_secretaria_educacao === true || item.secretaria_educacao_possui === true) ? "sim" : "nao";
  }
  document.getElementById("edit-mun-jepp").value = item.status_jepp || item.jepp_municipio || "Não";
  if (document.getElementById("edit-mun-despertar")) {
    document.getElementById("edit-mun-despertar").value = (item.produto_despertar === 'sim' || item.produto_despertar === true || item.despertar_possui === true) ? "sim" : "nao";
  }
  if (document.getElementById("edit-mun-superintendencia")) {
    document.getElementById("edit-mun-superintendencia").value = (item.parceria_superintendencia === 'sim' || item.parceria_superintendencia === true) ? "sim" : "nao";
  }
  document.getElementById("edit-mun-ies").value = (item.ies_possui === 'sim' || item.ies_possui === true || item.parceria_ies === true) ? "sim" : "nao";
  if (document.getElementById("edit-mun-aqui-tem-sebrae")) {
    document.getElementById("edit-mun-aqui-tem-sebrae").value = (item.rede_aqui_tem_sebrae === 'sim' || item.rede_aqui_tem_sebrae === true || item.aqui_tem_sebrae_possui === true) ? "sim" : "nao";
  }
  if (document.getElementById("edit-mun-convenio")) {
    document.getElementById("edit-mun-convenio").value = (item.convenio_sebrae === 'sim' || item.convenio_sebrae === true || item.convenio_parceria === true) ? "sim" : "nao";
  }
  document.getElementById("edit-mun-comite").value = (item.comite_possui === 'sim' || item.comite_possui === true || item.comite_acoes_conjuntas === true) ? "sim" : "nao";
  document.getElementById("edit-mun-emp-sim").value = (item.empresa_simulada === 'sim' || item.empresa_simulada === true) ? "sim" : "nao";
  document.getElementById("edit-mun-esc-seb").value = (item.escola_sebrae === 'sim' || item.escola_sebrae === true) ? "sim" : "nao";
  document.getElementById("edit-mun-cooperativa").value = (item.cooperativa_possui === 'sim' || item.cooperativa_possui === true || item.cooperativa_credito === true) ? "sim" : "nao";
  document.getElementById("edit-mun-lei").value = (item.lei_possui === 'sim' || item.lei_possui === true || item.lei_educacao_empreendedora === true) ? "sim" : "nao";

  // Instrumentos Aplicados
  let insts = item.instrumentos_aplicados;
  if (!insts && insts !== []) {
    const devIdx = calculateMunicipioDevelopmentIndex(item);
    insts = devIdx && devIdx.instrumentos_aplicados ? devIdx.instrumentos_aplicados : [];
  } else if (typeof insts === "string") {
    try { insts = JSON.parse(insts); } catch (e) { insts = insts.split(",").map(s => s.trim()).filter(Boolean); }
  }
  if (!Array.isArray(insts)) insts = [];

  const setEditInst = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.checked = insts.includes(val);
  };
  setEditInst("edit-inst-mat-didatico", "material_didatico");
  setEditInst("edit-inst-oficina", "oficina");
  setEditInst("edit-inst-curso", "curso");
  setEditInst("edit-inst-encontro-mediado", "encontro_mediado");
  setEditInst("edit-inst-palestra", "palestra");

  const modal = document.getElementById("modal-edit-municipality");
  if (modal) modal.classList.add("active");
  if (typeof lucide !== "undefined") lucide.createIcons();
}

function syncEditMunicipalityInstruments() {
  const jepp = document.getElementById("edit-mun-jepp")?.value;
  const empSim = document.getElementById("edit-mun-emp-sim")?.value;
  const escSeb = document.getElementById("edit-mun-esc-seb")?.value;
  const convSeb = document.getElementById("edit-mun-convenio")?.value;
  const parcSup = document.getElementById("edit-mun-superintendencia")?.value;
  const parcSec = document.getElementById("edit-mun-secretaria-educacao")?.value;
  const lei = document.getElementById("edit-mun-lei")?.value;
  const ies = document.getElementById("edit-mun-ies")?.value;

  const setChecked = (id) => {
    const el = document.getElementById(id);
    if (el) el.checked = true;
  };

  if (jepp === "Sim") {
    setChecked("edit-inst-mat-didatico");
    setChecked("edit-inst-oficina");
  }
  if (empSim === "sim" || escSeb === "sim") {
    setChecked("edit-inst-curso");
  }
  if (convSeb === "sim" || parcSup === "sim" || parcSec === "sim" || lei === "sim" || ies === "sim") {
    setChecked("edit-inst-encontro-mediado");
  }
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

  const selectedInsts = [];
  const checkEditInst = (id, val) => {
    const el = document.getElementById(id);
    if (el && el.checked) selectedInsts.push(val);
  };
  checkEditInst("edit-inst-mat-didatico", "material_didatico");
  checkEditInst("edit-inst-oficina", "oficina");
  checkEditInst("edit-inst-curso", "curso");
  checkEditInst("edit-inst-encontro-mediado", "encontro_mediado");
  checkEditInst("edit-inst-palestra", "palestra");

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
    jepp_municipio: document.getElementById("edit-mun-jepp").value,
    municipio_ee_70: document.getElementById("edit-mun-ee70").value,
    educacao_70_porcento: document.getElementById("edit-mun-ee70").value === "sim",
    parceria_secretaria_educacao: document.getElementById("edit-mun-secretaria-educacao") ? document.getElementById("edit-mun-secretaria-educacao").value === "sim" : false,
    secretaria_educacao_possui: document.getElementById("edit-mun-secretaria-educacao") ? document.getElementById("edit-mun-secretaria-educacao").value === "sim" : false,
    produto_despertar: document.getElementById("edit-mun-despertar") ? document.getElementById("edit-mun-despertar").value === "sim" : false,
    despertar_possui: document.getElementById("edit-mun-despertar") ? document.getElementById("edit-mun-despertar").value === "sim" : false,
    parceria_superintendencia: document.getElementById("edit-mun-superintendencia") ? document.getElementById("edit-mun-superintendencia").value === "sim" : false,
    ies_possui: document.getElementById("edit-mun-ies").value === "sim",
    parceria_ies: document.getElementById("edit-mun-ies").value === "sim",
    rede_aqui_tem_sebrae: document.getElementById("edit-mun-aqui-tem-sebrae") ? document.getElementById("edit-mun-aqui-tem-sebrae").value === "sim" : false,
    aqui_tem_sebrae_possui: document.getElementById("edit-mun-aqui-tem-sebrae") ? document.getElementById("edit-mun-aqui-tem-sebrae").value === "sim" : false,
    convenio_sebrae: document.getElementById("edit-mun-convenio") ? document.getElementById("edit-mun-convenio").value === "sim" : false,
    convenio_parceria: document.getElementById("edit-mun-convenio") ? document.getElementById("edit-mun-convenio").value === "sim" : false,
    comite_possui: document.getElementById("edit-mun-comite").value === "sim",
    comite_acoes_conjuntas: document.getElementById("edit-mun-comite").value === "sim",
    empresa_simulada: document.getElementById("edit-mun-emp-sim").value === "sim",
    escola_sebrae: document.getElementById("edit-mun-esc-seb").value === "sim",
    cooperativa_possui: document.getElementById("edit-mun-cooperativa").value === "sim",
    cooperativa_credito: document.getElementById("edit-mun-cooperativa").value === "sim",
    lei_possui: document.getElementById("edit-mun-lei").value === "sim",
    lei_educacao_empreendedora: document.getElementById("edit-mun-lei").value === "sim",
    instrumentos_aplicados: selectedInsts,
    pontuacao_instrumentos: selectedInsts.reduce((sum, code) => sum + (code === "palestra" ? 5 : 10), 0),
    destaque_instrumentos: selectedInsts.reduce((sum, code) => sum + (code === "palestra" ? 5 : 10), 0) >= 25
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

  const authorData = getCaseAuthorData(item);
  document.getElementById("edit-case-autor-nome").value = authorData.nome || "";
  document.getElementById("edit-case-autor-email").value = authorData.email || "";
  document.getElementById("edit-case-autor-tel").value = authorData.telefone || "";

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

  // Auto-sync de instrumentos no modal de edição de município
  const editMunSelectIds = [
    "edit-mun-jepp",
    "edit-mun-emp-sim",
    "edit-mun-esc-seb",
    "edit-mun-convenio",
    "edit-mun-superintendencia",
    "edit-mun-lei",
    "edit-mun-ies"
  ];
  editMunSelectIds.forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.addEventListener("change", syncEditMunicipalityInstruments);
  });

  checkAdminAuth();
});
