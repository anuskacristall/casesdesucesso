const statusLabels = {
  pending: "Pendente",
  approved: "Aprovado",
  rejected: "Rejeitado"
};
let loadedCases = [];

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function renderCases(cases) {
  loadedCases = cases;
  const list = document.getElementById("casesList");
  if (!cases.length) {
    list.innerHTML = '<tr><td colspan="5">Nenhuma solicitação encontrada.</td></tr>';
    return;
  }

  list.innerHTML = cases.map((item) => {
    const status = item.status || "pending";
    const actions = `${status === "pending"
      ? `<button class="approve" onclick="approveCase('${escapeHtml(item.id)}')">Aprovar</button>
         <button class="reject" onclick="rejectCase('${escapeHtml(item.id)}')">Rejeitar</button>`
      : ""}<button class="details" onclick="showCaseDetails('${escapeHtml(item.id)}')">Ver mais</button>`;
    return `<tr>
      <td><strong>${escapeHtml(item.request_code || item.id || "-")}</strong></td>
      <td>${escapeHtml(item.titulo_projeto || item.escola_instituicao || "-")}</td>
      <td>${escapeHtml(item.municipio || "-")}</td>
      <td>${escapeHtml(statusLabels[status] || status)}</td>
      <td>${actions}</td>
    </tr>`;
  }).join("");
}

function showCaseDetails(id) {
  const item = loadedCases.find((entry) => String(entry.id) === String(id));
  if (!item) return;
  document.getElementById("caseDetailsTitle").textContent = item.titulo_projeto || item.escola_instituicao || "Detalhes do case";
  document.getElementById("caseDetailsBody").innerHTML = Object.entries(item)
    .filter(([key, value]) => value !== null && value !== "" && key !== "id")
    .map(([key, value]) => `<p><strong>${escapeHtml(key)}:</strong> ${escapeHtml(value)}</p>`)
    .join("");
  document.getElementById("caseDetailsDialog").showModal();
}

function renderMunicipalities(items) {
  const list = document.getElementById("municipalitiesList");
  const pending = items.filter((item) => (item.status || "pending") === "pending");
  list.innerHTML = pending.length ? pending.map((item) => `<div class="item"><span>${escapeHtml(item.nome || item.municipio || "Município")}</span><span><button class="approve" onclick="approveMunicipality('${escapeHtml(item.id)}')">Aprovar</button><button class="reject" onclick="rejectMunicipality('${escapeHtml(item.id)}')">Rejeitar</button></span></div>`).join("") : "Nenhum município pendente.";
}

async function loadMunicipalities() {
  const response = await fetch("/api/municipalities");
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || `HTTP ${response.status}`);
  renderMunicipalities(Array.isArray(data) ? data : []);
}

async function loadCases() {
  const response = await fetch("/api/cases");
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || `HTTP ${response.status}`);
  renderCases(Array.isArray(data) ? data : []);
}

async function updateCaseStatus(id, action, message) {
  const response = await fetch(`/api/cases/${action}/${encodeURIComponent(id)}`, { method: "PATCH" });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || `HTTP ${response.status}`);
  alert(message);
  await loadCases();
}

async function approveCase(id) {
  try {
    await updateCaseStatus(id, "approve", "Case aprovado!");
  } catch (error) {
    document.getElementById("errorMsg").textContent = error.message;
  }
}

async function rejectCase(id) {
  try {
    await updateCaseStatus(id, "reject", "Case rejeitado!");
  } catch (error) {
    document.getElementById("errorMsg").textContent = error.message;
  }
}

async function updateMunicipalityStatus(id, action, message) {
  const response = await fetch(`/api/municipalities/${action}/${encodeURIComponent(id)}`, { method: "PATCH" });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || `HTTP ${response.status}`);
  alert(message);
  await loadMunicipalities();
}

async function approveMunicipality(id) {
  try { await updateMunicipalityStatus(id, "approve", "Município aprovado!"); }
  catch (error) { document.getElementById("errorMsg").textContent = error.message; }
}

async function rejectMunicipality(id) {
  try { await updateMunicipalityStatus(id, "reject", "Município rejeitado!"); }
  catch (error) { document.getElementById("errorMsg").textContent = error.message; }
}

Promise.all([loadCases(), loadMunicipalities()]).catch((error) => {
  document.getElementById("errorMsg").textContent = error.message;
});
