/* ==========================================================================
   VOIDWALKERS ARCHIVE — RENDER
   Reads plain data arrays (window.TOWERS_DATA / window.DEVLOG_DATA) and
   draws them into the page. No build step, no framework — edit the data
   files and refresh.
   ========================================================================== */

function escapeHTML(str) {
  const div = document.createElement("div");
  div.textContent = String(str);
  return div.innerHTML;
}

/**
 * A field renders as its value, or — if the value is missing, empty,
 * or explicitly "CLASSIFIED" — as a redacted bar. This is the content
 * pipeline: leave a field out, it shows as not-yet-declassified.
 */
function renderField(value) {
  if (value === null || value === undefined || value === "" || value === "CLASSIFIED") {
    const seed = Math.floor(Math.random() * 3);
    const widths = ["4em", "7em", "10em"];
    return `<span class="redacted" style="width:${widths[seed]}" title="Not yet declassified"></span>`;
  }
  return escapeHTML(value);
}

function statusStamp(status) {
  const approved = status === "approved";
  const label = approved ? "DECLASSIFIED" : "PENDING REVIEW";
  const cls = approved ? "stamp stamp--approved" : "stamp stamp--pending";
  return `<span class="${cls}">${label}</span>`;
}

function dossierCard(entry) {
  return `
    <article class="dossier" data-category="${escapeHTML(entry.category)}">
      <button class="dossier__header" aria-expanded="false">
        <span class="dossier__designation">${escapeHTML(entry.designation)}</span>
        <span class="dossier__name">${escapeHTML(entry.name)}</span>
        ${statusStamp(entry.status)}
      </button>
      <div class="dossier__body" hidden>
        <dl class="dossier__fields">
          <dt>Object class</dt><dd>${renderField(entry.objectClass)}</dd>
          <dt>Anchor emotion</dt><dd>${renderField(entry.anchorEmotion)}</dd>
          <dt>Function</dt><dd>${renderField(entry.function)}</dd>
          <dt>Oversight</dt><dd>${renderField(entry.oversight)}</dd>
          <dt>Threat assessment</dt><dd>${renderField(entry.threatAssessment)}</dd>
          <dt>Field notes</dt><dd>${renderField(entry.fieldNotes)}</dd>
        </dl>
      </div>
    </article>
  `;
}

function initCodex() {
  const grid = document.querySelector("[data-codex-grid]");
  if (!grid) return;
  const data = window.TOWERS_DATA || [];

  function draw(filter) {
    const filtered = filter === "all" ? data : data.filter((e) => e.category === filter);
    grid.innerHTML = filtered.map(dossierCard).join("");
    grid.querySelectorAll(".dossier__header").forEach((btn) => {
      btn.addEventListener("click", () => {
        const body = btn.nextElementSibling;
        const expanded = btn.getAttribute("aria-expanded") === "true";
        btn.setAttribute("aria-expanded", String(!expanded));
        body.hidden = expanded;
      });
    });
  }

  draw("all");

  document.querySelectorAll("[data-filter]").forEach((tab) => {
    tab.addEventListener("click", () => {
      document.querySelectorAll("[data-filter]").forEach((t) => t.classList.remove("is-active"));
      tab.classList.add("is-active");
      draw(tab.dataset.filter);
    });
  });
}

function devlogEntry(entry) {
  return `
    <article class="logentry">
      <div class="logentry__meta">
        <span>${escapeHTML(entry.id)}</span>
        <span>${escapeHTML(entry.date)}</span>
      </div>
      <h3 class="logentry__title">${escapeHTML(entry.title)}</h3>
      <div class="logentry__body"><p>${renderField(entry.body)}</p></div>
    </article>
  `;
}

function initDevlog() {
  const list = document.querySelector("[data-devlog-list]");
  if (!list) return;
  const data = (window.DEVLOG_DATA || [])
    .slice()
    .sort((a, b) => new Date(b.date) - new Date(a.date));
  list.innerHTML = data.map(devlogEntry).join("");
}

/* Clicking a redacted bar gives tactile "not yet cleared" feedback. */
function initRedactionInteraction() {
  document.addEventListener("click", (e) => {
    const target = e.target.closest(".redacted");
    if (!target) return;
    target.classList.remove("is-denied");
    void target.offsetWidth;
    target.classList.add("is-denied");
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initCodex();
  initDevlog();
  initRedactionInteraction();
});
