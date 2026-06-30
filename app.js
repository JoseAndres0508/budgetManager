const STORE_KEY = "finanzas-data";
let data = { mov: [], mens: [], pend: [] };

function fmt(n) {
  return "₡" + Math.round(n).toLocaleString("es-CR");
}

function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

function load() {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (raw) data = JSON.parse(raw);
  } catch (e) {}
  render();
}

function save() {
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify(data));
  } catch (e) {}
}

function switchTab(tab) {
  ["mov", "mens", "pend"].forEach(t => {
    const isActive = t === tab;
    document.getElementById("panel-" + t).hidden = !isActive;
    const btn = document.querySelector('.tab-btn[data-tab="' + t + '"]');
    btn.classList.toggle("active", isActive);
    btn.setAttribute("aria-selected", String(isActive));
  });
}

document.querySelectorAll(".tab-btn").forEach(b => {
  b.addEventListener("click", () => switchTab(b.dataset.tab));
});

function rowMov(item) {
  const sign = item.tipo === "ingreso" ? "+" : "-";
  const cls = item.tipo === "ingreso" ? "in" : "out";
  const li = document.createElement("li");
  li.className = "row";
  li.innerHTML =
    '<div><p class="desc">' + item.desc + '</p><p class="meta">' + (item.fecha || "sin fecha") + '</p></div>' +
    '<div class="right"><span class="amount ' + cls + '">' + sign + fmt(item.monto) + '</span>' +
    '<button data-id="' + item.id + '" class="icon-btn del-mov" aria-label="Eliminar">✕</button></div>';
  return li;
}

function rowMens(item) {
  const li = document.createElement("li");
  li.className = "row";
  li.innerHTML =
    '<div><p class="desc">' + item.desc + '</p><p class="meta">Día ' + item.dia + ' de cada mes</p></div>' +
    '<div class="right"><span class="amount">' + fmt(item.monto) + '</span>' +
    '<button data-id="' + item.id + '" class="icon-btn del-mens" aria-label="Eliminar">✕</button></div>';
  return li;
}

function rowPend(item) {
  const today = new Date().toISOString().slice(0, 10);
  const overdue = item.fecha < today;
  const li = document.createElement("li");
  li.className = "row";
  li.innerHTML =
    '<div><p class="desc">' + item.desc + '</p><p class="meta' + (overdue ? ' overdue' : '') + '">' + item.fecha + (overdue ? " · vencido" : "") + '</p></div>' +
    '<div class="right"><span class="amount">' + fmt(item.monto) + '</span>' +
    '<button data-id="' + item.id + '" class="icon-btn pay-pend" aria-label="Marcar pagado">✓</button>' +
    '<button data-id="' + item.id + '" class="icon-btn del-pend" aria-label="Eliminar">✕</button></div>';
  return li;
}

function render() {
  const sumIn = data.mov.filter(m => m.tipo === "ingreso").reduce((a, m) => a + m.monto, 0);
  const sumOut = data.mov.filter(m => m.tipo === "gasto").reduce((a, m) => a + m.monto, 0);
  document.getElementById("sum-in").textContent = fmt(sumIn);
  document.getElementById("sum-out").textContent = fmt(sumOut);
  document.getElementById("sum-bal").textContent = fmt(sumIn - sumOut);

  const listMov = document.getElementById("list-mov");
  listMov.innerHTML = "";
  [...data.mov].sort((a, b) => (b.fecha || "").localeCompare(a.fecha || "")).forEach(item => listMov.appendChild(rowMov(item)));
  if (data.mov.length === 0) listMov.innerHTML = '<li class="empty">Aún no hay movimientos.</li>';

  const listMens = document.getElementById("list-mens");
  listMens.innerHTML = "";
  [...data.mens].sort((a, b) => a.dia - b.dia).forEach(item => listMens.appendChild(rowMens(item)));
  if (data.mens.length === 0) listMens.innerHTML = '<li class="empty">Aún no hay mensualidades.</li>';

  const listPend = document.getElementById("list-pend");
  listPend.innerHTML = "";
  [...data.pend].sort((a, b) => a.fecha.localeCompare(b.fecha)).forEach(item => listPend.appendChild(rowPend(item)));
  if (data.pend.length === 0) listPend.innerHTML = '<li class="empty">Aún no hay pagos pendientes.</li>';

  document.querySelectorAll(".del-mov").forEach(b => b.addEventListener("click", () => {
    data.mov = data.mov.filter(m => m.id !== b.dataset.id);
    save();
    render();
  }));
  document.querySelectorAll(".del-mens").forEach(b => b.addEventListener("click", () => {
    data.mens = data.mens.filter(m => m.id !== b.dataset.id);
    save();
    render();
  }));
  document.querySelectorAll(".del-pend").forEach(b => b.addEventListener("click", () => {
    data.pend = data.pend.filter(m => m.id !== b.dataset.id);
    save();
    render();
  }));
  document.querySelectorAll(".pay-pend").forEach(b => b.addEventListener("click", () => {
    const item = data.pend.find(m => m.id === b.dataset.id);
    if (item) {
      data.mov.push({ id: uid(), desc: item.desc, tipo: "gasto", monto: item.monto, fecha: new Date().toISOString().slice(0, 10) });
      data.pend = data.pend.filter(m => m.id !== b.dataset.id);
      save();
      render();
    }
  }));
}

document.getElementById("form-mov").addEventListener("submit", e => {
  e.preventDefault();
  data.mov.push({
    id: uid(),
    desc: document.getElementById("mov-desc").value,
    tipo: document.getElementById("mov-tipo").value,
    monto: parseFloat(document.getElementById("mov-monto").value) || 0,
    fecha: document.getElementById("mov-fecha").value || new Date().toISOString().slice(0, 10)
  });
  e.target.reset();
  save();
  render();
});

document.getElementById("form-mens").addEventListener("submit", e => {
  e.preventDefault();
  data.mens.push({
    id: uid(),
    desc: document.getElementById("mens-desc").value,
    monto: parseFloat(document.getElementById("mens-monto").value) || 0,
    dia: parseInt(document.getElementById("mens-dia").value) || 1
  });
  e.target.reset();
  save();
  render();
});

document.getElementById("form-pend").addEventListener("submit", e => {
  e.preventDefault();
  data.pend.push({
    id: uid(),
    desc: document.getElementById("pend-desc").value,
    monto: parseFloat(document.getElementById("pend-monto").value) || 0,
    fecha: document.getElementById("pend-fecha").value
  });
  e.target.reset();
  save();
  render();
});

load();