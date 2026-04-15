// Hydrates the DOM from window.SITE (see content.js).

(function () {
  const S = window.SITE;
  if (!S) return;

  document.title = S.meta.title;
  setMeta("description", S.meta.description);

  // ---- sidebar ----
  set("#hero-name", S.meta.name);
  set("#hero-role", S.meta.role + " · " + S.meta.location);
  set("#hero-tag", S.meta.tagline);

  // "Previously" logo row with rich hover tooltip
  const prevEl = $("#prev-items");
  if (prevEl && Array.isArray(S.previously)) {
    prevEl.innerHTML = S.previously
      .map((p) => `
        <a class="prev-item"
           href="${esc(p.url)}"
           target="_blank"
           rel="noreferrer"
           aria-label="${esc(p.name)} · ${esc(p.role)} · ${esc(p.period)}">
          <img src="https://www.google.com/s2/favicons?sz=128&domain=${esc(p.domain)}"
               alt="${esc(p.name)}"
               onerror="this.style.display='none';this.nextElementSibling.style.display='flex'" />
          <span class="prev-fallback">${esc(p.name.slice(0,2).toUpperCase())}</span>
          <span class="prev-tip" role="tooltip">
            <strong>${esc(p.name)}</strong>
            <span class="prev-tip-role">${esc(p.role)}</span>
            <span class="prev-tip-period">${esc(p.period)}</span>
          </span>
        </a>`)
      .join("");
  }

  // CTA email: click-to-copy
  const ctaEmail = $("#cta-email");
  if (ctaEmail) {
    ctaEmail.addEventListener("click", async (e) => {
      const email = ctaEmail.getAttribute("href").replace(/^mailto:/, "");
      try {
        await navigator.clipboard.writeText(email);
        e.preventDefault();
        showToast("copied · " + email);
      } catch {
        /* fall back to mailto */
      }
    });
  }

  // live Toronto time
  const timeEl = $("#hero-time");
  if (timeEl) {
    const updateTime = () => {
      try {
        const t = new Date()
          .toLocaleTimeString("en-US", {
            timeZone: "America/Toronto",
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
          })
          .replace(/\s?(AM|PM)/i, (m) => m.trim().toLowerCase());
        timeEl.textContent = t;
      } catch {
        timeEl.textContent = "";
      }
    };
    updateTime();
    setInterval(updateTime, 20_000);
  }

  // links as icon row
  const linksEl = $("#links-list");
  if (linksEl) {
    const ICONS = {
      github: `<svg viewBox="0 0 16 16" width="15" height="15" fill="currentColor" aria-hidden="true"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z"/></svg>`,
      "x / twitter": `<svg viewBox="0 0 16 16" width="13" height="13" fill="currentColor" aria-hidden="true"><path d="M12.6 0h2.45L9.7 6.12 16 14.4h-4.93l-3.86-5.05L2.79 14.4H.33l5.72-6.53L0 0h5.06l3.49 4.62L12.6 0zm-.86 12.9h1.36L4.33 1.42H2.87L11.74 12.9z"/></svg>`,
      sculpt: `<svg viewBox="0 0 16 16" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="8" cy="8" r="6"/><circle cx="8" cy="8" r="2" fill="currentColor" stroke="none"/></svg>`,
      email: `<svg viewBox="0 0 16 16" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2 4h12v8H2z"/><path d="M2 4l6 4 6-4"/></svg>`,
    };
    S.links.forEach((l) => {
      const li = document.createElement("li");
      const a = document.createElement("a");
      a.href = l.href;
      const isMail = l.href.startsWith("mailto:");
      if (!isMail) {
        a.target = "_blank";
        a.rel = "noreferrer";
      }
      const iconSvg = ICONS[l.label.toLowerCase()] || "";
      a.setAttribute("title", l.label + (l.handle ? " · " + l.handle : ""));
      a.setAttribute("aria-label", l.label + (l.handle ? " · " + l.handle : ""));
      a.innerHTML = iconSvg || `<span class="icon-text">${esc(l.label[0].toUpperCase())}</span>`;
      if (isMail) {
        a.addEventListener("click", async (e) => {
          const email = l.href.replace(/^mailto:/, "");
          try {
            await navigator.clipboard.writeText(email);
            e.preventDefault();
            showToast("copied · " + email);
          } catch {
            /* fall back to mailto */
          }
        });
      }
      li.appendChild(a);
      linksEl.appendChild(li);
    });
  }

  // ---- ventures (startups / closed-source) ----
  set("#ventures-count", String((S.ventures || []).length).padStart(2, "0"));

  const vs = $("#ventures-rows");
  if (vs && S.ventures) {
    S.ventures.forEach((v, i) => {
      const row = document.createElement("button");
      row.className = "erow";
      row.type = "button";
      const hasMetrics = Array.isArray(v.metrics) && v.metrics.length > 0;
      row.innerHTML = `
        <div class="erow-body">
          <div class="etitle">${esc(v.name)}</div>
          <span class="edesc">${esc(v.summary)}</span>
        </div>
        <div class="ekind emetrics">
          ${hasMetrics
            ? v.metrics.map((m) => `<span>${esc(m)}</span>`).join("")
            : ""}
        </div>
      `;
      row.addEventListener("click", () => openVenture(i));
      vs.appendChild(row);
    });
  }

  function openVenture(i) {
    const v = S.ventures[i];
    if (!modalContent || !modal || !v) return;
    const d = v.detail || {};
    const metrics = (v.metrics || [])
      .map((m) => `<span class="vd-metric">${esc(m)}</span>`)
      .join("");
    const paragraphs = (d.paragraphs || [])
      .map((p) => `<p>${esc(p)}</p>`)
      .join("");
    const highlights = (d.highlights || [])
      .map((h) => `<li>${esc(h)}</li>`)
      .join("");
    const images = (d.images || [])
      .map(
        (img) => `
          <a href="${esc(img.src)}" target="_blank" rel="noreferrer">
            <img src="${esc(img.src)}" alt="${esc(img.alt || "")}" loading="lazy" />
          </a>`
      )
      .join("");
    modalContent.innerHTML = `
      <article class="venture-detail">
        <div class="vd-head">
          <h2 class="vd-name">${esc(v.name)}</h2>
        </div>
        ${metrics ? `<div class="vd-metrics">${metrics}</div>` : ""}
        ${paragraphs ? `<div class="vd-paras">${paragraphs}</div>` : ""}
        ${highlights
          ? `<div class="vd-section"><div class="vd-section-label">Highlights</div><ul class="vd-highlights">${highlights}</ul></div>`
          : ""}
        ${images ? `<div class="d-images">${images}</div>` : ""}
        ${v.url
          ? `<div class="d-links"><a href="${esc(v.url)}" class="d-link primary" target="_blank" rel="noreferrer">visit ↗</a></div>`
          : ""}
      </article>
    `;
    prevFocus = document.activeElement;
    modal.hidden = false;
    document.body.style.overflow = "hidden";
    modal.querySelector(".pmodal-close")?.focus();
  }
  // expose for potential external use
  let prevFocus = null;

  // ---- work ----
  set("#work-count", String(S.projects.length).padStart(2, "0"));

  const list = $("#work-list");
  const modal = $("#pmodal");
  const modalContent = $("#pmodal-content");

  if (list) {
    S.projects.forEach((p, i) => {
      const btn = document.createElement("button");
      btn.className = "prow" + (i < 2 ? " is-flag" : "");
      btn.type = "button";
      const stars = p.stars != null ? p.stars : "";
      btn.innerHTML = `
        <div class="prow-body">
          <div class="prow-name">${esc(p.name)}</div>
          <div class="prow-sum">${esc(p.summary)}</div>
        </div>
        <div class="prow-tag">${esc(p.tag)}</div>
        <div class="prow-meta ${stars === "" ? "dim" : ""}">
          ${stars !== "" ? `${esc(stars)} ★` : "—"}
        </div>
      `;
      btn.addEventListener("click", () => openModal(i));
      list.appendChild(btn);
    });
  }

  if (modal) {
    let prevFocus = null;
    modal.addEventListener("click", (e) => {
      if (e.target.hasAttribute("data-close")) closeModal();
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && !modal.hidden) closeModal();
    });

    window._openProject = openModal;
    window._closeProject = closeModal;

    function openModal(i) {
      renderModal(S.projects[i]);
      prevFocus = document.activeElement;
      modal.hidden = false;
      document.body.style.overflow = "hidden";
      modal.querySelector(".pmodal-close")?.focus();
    }
    function closeModal() {
      modal.hidden = true;
      document.body.style.overflow = "";
      modalContent.closest(".pmodal-card")?.classList.remove("is-essay");
      prevFocus?.focus?.();
    }
  }

  function renderModal(p) {
    if (!modalContent) return;
    const d = p.detail || {};
    const paragraphs = (d.paragraphs || []).map((t) => `<p>${esc(t)}</p>`).join("");
    const images = (d.images || [])
      .map(
        (img) => `
          <a href="${esc(img.src)}" target="_blank" rel="noreferrer">
            <img src="${esc(img.src)}" alt="${esc(img.alt || "")}" loading="lazy" />
          </a>`
      )
      .join("");
    const tweets = (d.tweets || [])
      .map(
        (t) => `
          <div class="d-tweet">
            <div class="t-text">${esc(t.text)}</div>
            <footer>
              <a href="${esc(t.url)}" target="_blank" rel="noreferrer">@${esc(
            t.author
          )}${t.date ? " · " + esc(t.date) : ""}</a>
            </footer>
          </div>`
      )
      .join("");
    const links = (d.links || [])
      .map(
        (l, i) => `
          <a href="${esc(l.href)}" class="d-link ${
            i === 0 ? "primary" : ""
          }" target="_blank" rel="noreferrer">${esc(l.label)}</a>`
      )
      .join("");

    const stars = p.stars != null ? p.stars + " ★" : "";
    modalContent.innerHTML = `
      <div class="d-head">
        <div class="d-name">${esc(p.name)}</div>
        <div class="d-meta">
          ${esc(p.tag)}
          ${stars ? `<span class="stars">${esc(stars)}</span>` : ""}
        </div>
      </div>
      <div class="d-paragraphs">${paragraphs}</div>
      ${images ? `<div class="d-images">${images}</div>` : ""}
      ${tweets ? `<div class="d-tweets">${tweets}</div>` : ""}
      ${links ? `<div class="d-links">${links}</div>` : ""}
    `;
  }

  // ---- writing ----
  set("#writing-count", String(S.essays.length).padStart(2, "0"));

  const es = $("#writing-rows");
  if (es) {
    S.essays.forEach((e, i) => {
      const row = document.createElement("button");
      row.className = "erow";
      row.type = "button";
      row.innerHTML = `
        <div class="erow-body">
          <div class="etitle">${esc(e.title)}</div>
          <span class="edesc">${esc(e.desc)}</span>
        </div>
        <div class="ekind">${esc(e.kind.toLowerCase())}</div>
      `;
      row.addEventListener("click", () => openEssay(i));
      es.appendChild(row);
    });
  }

  // Full-page reader
  const reader = $("#reader");
  const readerInner = $("#reader-inner");
  const readerScroll = $("#reader-scroll");
  const readerBar = $("#reader-progress-bar");
  const readerTitle = $("#reader-title");
  let currentEssay = -1;
  let readerPrev = null;

  function openEssay(i) {
    if (!reader || !readerInner) return;
    const e = S.essays[i];
    if (!e) return;
    currentEssay = i;

    const mins = readingTime(e.body);
    readerInner.innerHTML = `
      <article class="essay">
        <div class="e-meta">
          <span>${esc(e.kind)}</span>
          ${e.date ? `<span class="e-dot">·</span><span>${esc(e.date)}</span>` : ""}
          <span class="e-dot">·</span><span>${mins} min read</span>
        </div>
        <h1 class="e-title">${esc(e.title)}</h1>
        ${e.subtitle ? `<div class="e-subtitle">${esc(e.subtitle)}</div>` : ""}
        <div class="e-body">${renderMd(e.body || "")}</div>
      </article>
      ${renderPrevNext(i)}
    `;

    if (readerTitle) {
      readerTitle.textContent = e.title;
    }

    readerPrev = document.activeElement;
    reader.hidden = false;
    document.body.style.overflow = "hidden";
    readerScroll.scrollTop = 0;
    updateReaderProgress();
    reader.querySelector(".reader-close")?.focus();
  }

  function closeEssay() {
    if (!reader) return;
    reader.hidden = true;
    document.body.style.overflow = "";
    currentEssay = -1;
    readerPrev?.focus?.();
  }

  function updateReaderProgress() {
    if (!readerScroll || !readerBar) return;
    const max = readerScroll.scrollHeight - readerScroll.clientHeight;
    const pct = max > 0 ? (readerScroll.scrollTop / max) * 100 : 0;
    readerBar.style.width = Math.min(100, Math.max(0, pct)) + "%";
  }

  function readingTime(text) {
    const words = String(text).trim().split(/\s+/).length;
    return Math.max(1, Math.round(words / 220));
  }

  function renderPrevNext(i) {
    const prev = i > 0 ? S.essays[i - 1] : null;
    const next = i < S.essays.length - 1 ? S.essays[i + 1] : null;
    return `
      <div class="reader-pn">
        <button class="pn-btn pn-prev" ${!prev ? "disabled" : ""} data-essay-idx="${i - 1}">
          <span class="pn-dir">← previous</span>
          <span class="pn-title ${!prev ? "muted" : ""}">${prev ? esc(prev.title) : "—"}</span>
        </button>
        <button class="pn-btn pn-next" ${!next ? "disabled" : ""} data-essay-idx="${i + 1}">
          <span class="pn-dir">next →</span>
          <span class="pn-title ${!next ? "muted" : ""}">${next ? esc(next.title) : "—"}</span>
        </button>
      </div>
    `;
  }

  if (reader) {
    reader.addEventListener("click", (e) => {
      if (e.target.hasAttribute("data-reader-close") || e.target.closest("[data-reader-close]")) {
        closeEssay();
        return;
      }
      const nav = e.target.closest("[data-essay-idx]");
      if (nav && !nav.disabled) {
        const idx = parseInt(nav.dataset.essayIdx, 10);
        if (!isNaN(idx)) openEssay(idx);
      }
    });
    readerScroll?.addEventListener("scroll", updateReaderProgress, { passive: true });
    document.addEventListener("keydown", (ev) => {
      if (reader.hidden) return;
      if (ev.key === "Escape") { ev.preventDefault(); closeEssay(); }
      if (ev.key === "ArrowLeft" && currentEssay > 0) {
        ev.preventDefault();
        openEssay(currentEssay - 1);
      }
      if (ev.key === "ArrowRight" && currentEssay < S.essays.length - 1) {
        ev.preventDefault();
        openEssay(currentEssay + 1);
      }
    });
  }

  // Minimal markdown renderer: supports ## h2, ### h3, paragraphs, - lists.
  function renderMd(src) {
    const lines = String(src).split("\n");
    let html = "";
    let para = [];
    let list = [];
    const flushPara = () => {
      if (para.length) {
        html += `<p>${para.map(esc).join(" ")}</p>`;
        para = [];
      }
    };
    const flushList = () => {
      if (list.length) {
        html += `<ul>${list.map((x) => `<li>${esc(x)}</li>`).join("")}</ul>`;
        list = [];
      }
    };
    for (const raw of lines) {
      const line = raw.trim();
      if (!line) { flushPara(); flushList(); continue; }
      if (line.startsWith("## ")) {
        flushPara(); flushList();
        html += `<h2>${esc(line.slice(3))}</h2>`;
      } else if (line.startsWith("### ")) {
        flushPara(); flushList();
        html += `<h3>${esc(line.slice(4))}</h3>`;
      } else if (line.startsWith("- ") || line.startsWith("* ")) {
        flushPara();
        list.push(line.slice(2));
      } else {
        flushList();
        para.push(line);
      }
    }
    flushPara(); flushList();
    return html;
  }

  // ---- press ----
  set("#press-count", String((S.press || []).length).padStart(2, "0"));
  const pressEl = $("#press-rows");
  if (pressEl && Array.isArray(S.press)) {
    S.press.forEach((pr) => {
      const row = document.createElement("a");
      row.className = "erow";
      row.href = pr.url;
      row.target = "_blank";
      row.rel = "noreferrer";
      row.innerHTML = `
        <div class="erow-body">
          <div class="etitle">${esc(pr.title)}</div>
          <span class="edesc">${esc(pr.source)}${pr.blurb ? " — " + esc(pr.blurb) : ""}</span>
        </div>
        <div class="ekind">${esc(pr.date)}</div>
      `;
      pressEl.appendChild(row);
    });
  }

  // ---- footer year ----
  set("#foot-year", new Date().getFullYear());


  // ---- toast ----
  function showToast(text) {
    const existing = document.getElementById("toast");
    if (existing) existing.remove();
    const toast = document.createElement("div");
    toast.id = "toast";
    toast.className = "toast";
    toast.textContent = text;
    document.body.appendChild(toast);
    requestAnimationFrame(() => toast.classList.add("show"));
    setTimeout(() => {
      toast.classList.remove("show");
      setTimeout(() => toast.remove(), 250);
    }, 1800);
  }

  // ---- helpers ----
  function $(sel) { return document.querySelector(sel); }
  function set(sel, val) {
    const el = $(sel);
    if (el) el.textContent = val;
  }
  function setMeta(name, val) {
    let m = document.querySelector(`meta[name="${name}"]`);
    if (!m) {
      m = document.createElement("meta");
      m.setAttribute("name", name);
      document.head.appendChild(m);
    }
    m.setAttribute("content", val);
  }
  function esc(s) {
    if (s == null) return "";
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }
})();
