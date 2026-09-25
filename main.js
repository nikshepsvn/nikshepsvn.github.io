"use strict";

const SITE = window.SITE;
const m = SITE.meta;
const $ = (id) => document.getElementById(id);
const esc = (s) => String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const host = (url) => (url || "").replace(/^https?:\/\/(www\.)?/, "").replace(/\/.*$/, "");
const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

// Logos are local files keyed by domain; anything without one falls back to a colored monogram.
const LOGOS = new Set([...SITE.community.orgs.map((o) => o.domain), "humanplane.com", "deliverr.com", "moltlaunch.com", "kalshi.com", "instacart.com", "coinbase.com", "seatgeek.com",
  "pagerduty.com", "uwaterloo.ca", "viberank.app", "modelgrep.com", "bloomberg.com", "businessinsider.com", "aijourn.com", "shanghai.nyu.edu", "pymnts.com"]);
const LOGO_ALIAS = { "rits.shanghai.nyu.edu": "shanghai.nyu.edu" };
const NAME_LOGOS = { RealmPlay: "realmplay.png", SoulBazaar: "soulbazaar.png", "MC-Bench": "mcbench.png" };

// Project SVGs use isolated image documents, so repeated prose/list icons never
// share gradient IDs. Company and venture marks keep their original artwork.
const projectLogo = (name) => `<span class="logo project-logo" aria-hidden="true"><img src="logos/projects/${slug(name)}.svg" alt="" width="48" height="48" decoding="async"></span>`;

const logoFor = (name, url, { size } = {}) => {
  let d = host(url);
  d = LOGO_ALIAS[d] || d;
  // Repos in the humanplane org wear the HumanPlane mark.
  if (d === "github.com" && url.includes("/humanplane/")) d = "humanplane.com";
  const sizeVar = size ? `--s:${size};` : "";
  const file = NAME_LOGOS[name] || (LOGOS.has(d) ? `${d}.png` : null);
  if (file) return `<span class="logo" style="${sizeVar}"><img src="logos/${file}" alt=""></span>`;
  return `<span class="logo ghost" style="${sizeVar}" aria-hidden="true">${esc(name[0].toUpperCase())}</span>`;
};

// Pills are links to the matching entry further down the page.
const pill = (target, name, url) =>
  `<a class="pill" href="#${target}" data-jump="${target}">${logoFor(name, url)}${esc(name)}</a>`;
const ventureById = Object.fromEntries(SITE.ventures.map((v) => [v.name, v]));
const expByCo = Object.fromEntries(SITE.experience.map((x) => [x.company, x]));
const pressBySource = Object.fromEntries(SITE.press.map((p) => [p.source, p]));
const vp = (n) => pill("v-" + slug(n), n, ventureById[n].url);
const xp = (n, label) => pill("x-" + slug(n), label || n, expByCo[n].url);
const pp = (n) => `<a class="pill" href="#p-${slug(n)}" data-jump="p-${slug(n)}">${projectLogo(n)}${esc(n)}</a>`;
const prp = (n) => pill("pr-" + slug(n), n, pressBySource[n].url);
const ep = (title) => {
  const i = SITE.essays.findIndex((e) => e.title === title);
  return `<a class="pill" href="#writing" data-essay="${i}"><span class="logo ghost" aria-hidden="true">¶</span>${esc(title)}</a>`;
};
const prose = (paras, lead = false) => `<div class="prose${lead ? " lead" : ""}">${paras.map((p) => lead ? `<h1>${p}</h1>` : `<p>${p}</p>`).join("")}</div>`;

const totalStars = SITE.projects.reduce((sum, p) => sum + (p.stars || 0), 0);
const now = m.now.url ? `<a href="${esc(m.now.url)}" target="_blank" rel="noreferrer">${esc(m.now.label)}</a>` : `<b>${esc(m.now.label)}</b>`;

// Source links are siblings of the main entry link, never nested inside it.
const highlights = (items, kind) => items?.length ? `<div class="highlights ${kind}-highlights">${items.map((item) => {
  if (typeof item === "string") return `<span class="highlight">${esc(item)}</span>`;
  return `<a class="highlight" href="${esc(item.url)}" target="_blank" rel="noreferrer" title="Source: ${esc(item.source)}" aria-label="${esc(item.label)} — source: ${esc(item.source)}">${esc(item.label)}<span aria-hidden="true">↗</span></a>`;
}).join("")}</div>` : "";

const ventureItem = (v) => `
  <li class="entry"><${v.url ? "a" : "div"} class="item" id="v-${slug(v.name)}"${v.url ? ` href="${esc(v.url)}" target="_blank" rel="noreferrer"` : ""}>
    ${logoFor(v.name, v.url)}
    <span class="item-t">${esc(v.name)} <span>· ${esc(v.status)}</span></span>
    <span class="item-k">${v.kpi ? `${esc(v.kpi.value)}<small>${esc(v.kpi.label)}</small>` : ""}</span>
    <span class="item-d">${esc(v.summary)}</span>
  </${v.url ? "a" : "div"}>
  ${highlights(v.metrics, "entry")}</li>`;

const expItem = (x) => `
  <li class="entry"><a class="item" id="x-${slug(x.company)}" href="${esc(x.url)}" target="_blank" rel="noreferrer">
    ${logoFor(x.company, x.url)}
    <span class="item-t">${esc(x.company)} <span>· ${esc(x.role)}${x.team ? `, ${esc(x.team)}` : ""}</span></span>
    <span class="item-m">${esc(x.period)}</span>
    <span class="item-d">${esc(x.description)}</span>
  </a>${highlights(x.highlights, "entry")}</li>`;

// Recent releases stay visible when the longer project list is folded.
const monthLabel = (d) => new Date(d + "-15").toLocaleDateString("en-US", { month: "short", year: "numeric" });
const isNew = (d) => (Date.now() - new Date(d + "-15")) / 864e5 < 75;

const GROUPS = [
  ["products", "Products", "live, with real traffic"],
  ["research", "Research", "models, papers, and agents"],
  ["oss", "Open source", "tools people star and fork"],
  ["experiments", "Earlier products", ""],
];
const OSS_SHOWN = 5;
const compact = (n) => (n >= 1000 ? (n / 1000).toFixed(1).replace(/\.0$/, "") + "K" : String(n));

const projItem = (p, foldIndex) => {
  const tag = p.url ? "a" : "div";
  const attrs = p.url ? ` href="${esc(p.url)}" target="_blank" rel="noreferrer"` : "";
  const fresh = p.date && isNew(p.date);
  const feature = Boolean(p.stats);
  // Products link to their site; everything with a repo shows stars and forks.
  const meta = p.group !== "products" && p.stars != null
    ? `<b>★ ${compact(p.stars)}</b>${p.forks ? `<span>${p.forks} forks</span>` : ""}`
    : (p.url ? `<span>${esc(host(p.url))} ↗</span>` : "");
  const fold = foldIndex !== null && foldIndex >= OSS_SHOWN && !fresh;
  return `<li class="project${fresh ? " is-new" : ""}"${fold ? " data-fold hidden" : ""}><${tag} class="proj${feature ? " feature" : ""}" id="p-${slug(p.name)}"${attrs}>
    ${projectLogo(p.name)}
    <span class="proj-name"><span>${esc(p.name)}</span>${fresh ? `<span class="new-chip">New · ${monthLabel(p.date)}</span>` : ""}<small>${esc(p.tag)}</small></span>
    <span class="proj-meta">${meta}</span>
    <span class="proj-sum">${esc(p.summary)}</span>
    ${p.stats ? `<span class="stats">${p.stats.map((x) => `<span class="stat"><b>${esc(x.value)}</b><span>${esc(x.label)}</span></span>`).join("")}</span>` : ""}
  </${tag}>${highlights(p.wins, "project")}</li>`;
};

// Starred-and-followed-by band: headline numbers, company badges, then where people are.
const communityBand = () => {
  const c = SITE.community;
  const fmt = (n) => n.toLocaleString("en-US");
  return `<div class="community">
    <p class="community-h">Starred and followed by <b>${fmt(c.people)}</b> developers in <b>${c.countries}</b> countries, including people at</p>
    <div class="orgs">${c.orgs.map((o) => `<span class="org">${logoFor(o.name, "https://" + o.domain)}${esc(o.name)}</span>`).join("")}</div>
    <div class="where">${c.topCountries.map(([name, n]) => `<span><b>${n}</b> ${esc(name)}</span>`).join("")}<span class="more-c">+${c.countries - c.topCountries.length} more countries</span></div>
    <p class="makers">Also on the list: the creators of ${c.makers.slice(0, -1).map(esc).join(", ")} and ${esc(c.makers.at(-1))}.</p>
  </div>`;
};

const projectGroups = () => GROUPS.map(([id, label, blurb]) => {
  const items = SITE.projects.filter((p) => p.group === id);
  if (!items.length) return "";
  // Only the long open-source list folds; everything else is always visible.
  const folds = id === "oss" || id === "experiments";
  const body = items.map((p, i) => projItem(p, folds ? (id === "experiments" ? OSS_SHOWN + i : i) : null)).join("");
  return `<div class="group" data-group="${id}"${id === "experiments" ? " data-fold hidden" : ""}>
    <div class="group-h"><h3>${label}</h3>${blurb ? `<span>${blurb}</span>` : ""}</div>
    <ol class="plist">${body}</ol></div>`;
}).join("");

const essayItem = (e, i) => e.url ? `
  <li><a class="item item-essay" href="${esc(e.url)}" target="_blank" rel="noreferrer">
    <span class="item-h">${esc(e.title)} <span class="ext">↗</span></span><span class="item-m">${esc(e.kind)} · ${esc(e.date)}</span>
    <span class="item-d">${esc(e.subtitle)}</span>
  </a></li>` : `
  <li><button type="button" class="item item-essay" data-essay="${i}" aria-haspopup="dialog">
    <span class="item-h">${esc(e.title)}</span><span class="item-m">${esc(e.date)}</span>
    <span class="item-d">${esc(e.subtitle)}</span>
  </button></li>`;

const pressItem = (p) => `
  <li><a class="item" id="pr-${slug(p.source)}" href="${esc(p.url)}" target="_blank" rel="noreferrer">
    ${logoFor(p.source, p.url)}
    <span class="item-h">${esc(p.title)}</span>
    <span class="item-m">${esc(p.date)}</span>
    <span class="item-d">${esc(p.source)} — ${esc(p.blurb)}</span>
  </a></li>`;

const email = SITE.links.find((l) => l.href.startsWith("mailto:"));

// Each chapter: a nav label, a side label, prose, then the items the prose refers to.
const chapters = [
  { id: "about", label: "About", side: "Hello", body: `
      <span class="status"><span class="status-now"><span class="dot" aria-hidden="true"></span><span>Building ${m.now.url ? `${now}, ${esc(m.now.note)}` : `a consumer product, <b>in stealth</b>`}</span></span><span class="status-time" id="clock">Toronto</span></span>
      ${prose([`I'm <b>Nikshep</b>, an engineer in Toronto. I build first versions of things at the edges of AI, crypto, and markets — two exits so far, and a protocol that moved $50M+.`], true)}
      ${prose([`<em>${esc(m.philosophy)}</em> Right now that's pointed at a consumer product I can't talk about yet. Away from the keyboard: techno, psydub, and mountains with friends.`])}` },
  { id: "ventures", label: "Ventures", side: "Ventures", body: `
      ${prose([`I built ${vp("HumanPlane")}, a chart room for prediction markets, and ${vp("Moltlaunch")}, a work protocol for agents that cleared $50M+ in volume. I exited ${vp("RealmPlay")}, and ${vp("SoulBazaar")} was acquired before it launched.`])}
      <ul class="list">${SITE.ventures.map(ventureItem).join("")}</ul>` },
  { id: "experience", label: "Experience", side: "Experience", body: `
      ${prose([`I was a ${xp("Kalshi")} Builder Fellow, and before going independent spent three years as a senior engineer and tech lead at ${xp("Instacart")}. Earlier: ${xp("Coinbase")}, ${xp("Deliverr")}, ${xp("SeatGeek")}, ${xp("PagerDuty")}, and computer science at ${xp("University of Waterloo", "Waterloo")}.`])}
      <ul class="list">${SITE.experience.map(expItem).join("")}</ul>` },
  { id: "projects", label: "Projects", side: "Projects", body: `
      ${prose([`Some of it finds a real audience. ${pp("modelgrep")} drew 400K+ Google impressions in the last three months, and ${pp("viberank")} has ranked 1,238 developers across 18 trillion tokens. ${pp("homunculus")} helped inspire the learning system in everything-claude-code.`, `On the research side, ${pp("thimble")} puts structured tool calling into a 48M-parameter model, ${pp("bankai")} adapts 1-bit LLMs with tiny XOR patches, and I built the orchestrator behind ${pp("MC-Bench")}. In all: ${totalStars.toLocaleString("en-US")} GitHub stars across ${SITE.projects.length} projects.`])}
      ${communityBand()}
      <div class="projects" id="project-list">${projectGroups()}</div>
      <button type="button" class="more" id="more" aria-expanded="false" aria-controls="project-list">Show more projects</button>
      <p class="source">Search figures from Google Search Console; viberank figures from viberank.app/api/stats. September 2026.</p>` },
  { id: "writing", label: "Writing", side: "Essays", body: `
      ${prose([`I write about where AI and markets are heading — start with ${ep("Control Surface")} or ${ep("Liquid Talent")}.`])}
      <ul class="list">${SITE.essays.map(essayItem).join("")}</ul>` },
  { id: "press", label: "Press", side: "Coverage", body: `
      ${prose([`My work has been covered by ${prp("Bloomberg")}, ${prp("Business Insider")}, ${prp("PYMNTS")} and others.`])}
      <ul class="list">${SITE.press.map(pressItem).join("")}</ul>` },
  { id: "contact", label: "Contact", side: "Contact", body: `
      ${prose([`The best way to reach me is a DM on <a href="https://twitter.com/${esc(m.handle)}" target="_blank" rel="noreferrer">X</a>, or email.`])}
      <div class="links">
        ${SITE.links.filter((l) => l !== email).map((l) => `<a href="${esc(l.href)}" target="_blank" rel="noreferrer">${esc(l.label)} <span>${esc(l.handle)}</span></a>`).join("")}
        ${email ? `<button type="button" id="copy-email" aria-label="Copy email address"><span id="email-address">${esc(email.handle)}</span><span id="copy-state" role="status">copy</span></button>` : ""}
      </div>` },
];

$("main").innerHTML = chapters.map((c) => `
  <section class="chap" id="${c.id}" aria-labelledby="${c.id}-h">
    <h2 class="side" id="${c.id}-h">${c.side}</h2>
    <div class="body">${c.body}</div>
  </section>`).join("");
$("nav").innerHTML = chapters.map((c) => `<a href="#${c.id}" data-nav="${c.id}">${c.label}</a>`).join("");
$("who").textContent = m.name;
$("foot").textContent = `© ${new Date().getFullYear()} ${m.name} · Toronto`;

const tick = () => ($("clock").textContent = new Date().toLocaleTimeString("en-CA", { hour: "numeric", minute: "2-digit", timeZone: "America/Toronto" }) + " in Toronto");
tick(); setInterval(tick, 30000);

// Follow the reading position; scrolling the nav must never move the page.
const navLinks = [...document.querySelectorAll("[data-nav]")];
const sections = chapters.map((c) => $(c.id));
let activeChapter = "";
let navFrame = 0;
const updateNav = () => {
  navFrame = 0;
  const threshold = document.querySelector(".bar").getBoundingClientRect().bottom + 80;
  let current = sections[0];
  sections.forEach((section) => {
    if (section.getBoundingClientRect().top <= threshold) current = section;
  });
  if (window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2) current = sections.at(-1);
  if (activeChapter === current.id) return;
  activeChapter = current.id;
  navLinks.forEach((a) => {
    if (a.dataset.nav === current.id) {
      a.setAttribute("aria-current", "true");
      const linkRect = a.getBoundingClientRect();
      const navRect = $("nav").getBoundingClientRect();
      if (linkRect.left < navRect.left + 5) $("nav").scrollLeft += linkRect.left - navRect.left - 5;
      else if (linkRect.right > navRect.right - 5) $("nav").scrollLeft += linkRect.right - navRect.right + 5;
    } else a.removeAttribute("aria-current");
  });
};
const queueNav = () => { if (!navFrame) navFrame = requestAnimationFrame(updateNav); };
window.addEventListener("scroll", queueNav, { passive: true });
window.addEventListener("resize", queueNav);
updateNav();

// Pills scroll to their entry and flash it; hidden projects are revealed first.
const reveal = () => {
  const firstHidden = document.querySelector("#projects li[data-fold] a");
  const moveFocus = document.activeElement === $("more");
  document.querySelectorAll("#projects [data-fold]").forEach((el) => (el.hidden = false));
  $("more").setAttribute("aria-expanded", "true");
  $("more").hidden = true;
  if (moveFocus) firstHidden?.focus({ preventScroll: true });
};
// Fresh releases never fold, so count what is actually hidden (experiments count as one list).
$("more").textContent = `Show ${document.querySelectorAll("#projects li[data-fold], #projects .group[data-fold] li").length} more projects`;
document.addEventListener("click", (ev) => {
  const jump = ev.target.closest("[data-jump]");
  if (jump) {
    ev.preventDefault();
    const el = $(jump.dataset.jump);
    if (el?.closest("[hidden]")) reveal();
    el?.scrollIntoView({ block: "center" });
    el?.classList.remove("flash"); void el?.offsetWidth; el?.classList.add("flash");
    return;
  }
  const essay = ev.target.closest("[data-essay]");
  if (essay) { ev.preventDefault(); openEssay(+essay.dataset.essay, essay); }
});
$("more").addEventListener("click", reveal);

let copyTimer;
$("copy-email")?.addEventListener("click", async () => {
  clearTimeout(copyTimer);
  try {
    await navigator.clipboard.writeText(email.handle);
    $("copy-state").textContent = "copied";
  } catch {
    const range = document.createRange();
    range.selectNodeContents($("email-address"));
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
    $("copy-state").textContent = "select to copy";
  }
  copyTimer = setTimeout(() => ($("copy-state").textContent = "copy"), 3000);
});

// Reader overlay for essays, with scroll progress and a pointer to the next one.
const reader = $("reader");
let lastFocus = null;
let readerScroll = 0;
const background = [...document.querySelectorAll("body > :is(.skip-link, .bar, main, footer)")];
const openEssay = (i, opener) => {
  const e = SITE.essays[i];
  // Skip externally published pieces when pointing to the next essay.
  let nextIndex = (i + 1) % SITE.essays.length;
  while (SITE.essays[nextIndex].url) nextIndex = (nextIndex + 1) % SITE.essays.length;
  if (reader.hidden) {
    lastFocus = opener || document.activeElement;
    readerScroll = window.scrollY;
    document.body.style.position = "fixed";
    document.body.style.top = `-${readerScroll}px`;
    document.body.style.width = "100%";
    background.forEach((el) => (el.inert = true));
  }
  $("reader-crumb").textContent = `${e.title} · ${e.date}`;
  $("reader-body").innerHTML = `<p class="kicker">${esc(e.kind)} · ${esc(e.date)}</p><h1 id="reader-h">${esc(e.title)}</h1><p class="sub">${esc(e.subtitle)}</p>` +
    e.body.split(/\n\n+/).map((para) => /^##\s/.test(para) ? `<h2>${esc(para.replace(/^##\s+/, ""))}</h2>` : `<p class="txt">${esc(para)}</p>`).join("") +
    `<button type="button" class="next" data-essay="${nextIndex}"><span>Next essay</span><b>${esc(SITE.essays[nextIndex].title)}</b></button>`;
  reader.hidden = false; reader.scrollTop = 0; document.body.style.overflow = "hidden";
  $("progress").style.setProperty("--p", 0);
  $("reader-close").focus();
};
const closeEssay = () => {
  reader.hidden = true;
  document.body.style.overflow = "";
  document.body.style.position = "";
  document.body.style.top = "";
  document.body.style.width = "";
  background.forEach((el) => (el.inert = false));
  window.scrollTo({ top: readerScroll, behavior: "instant" });
  lastFocus?.focus({ preventScroll: true });
  queueNav();
};
reader.addEventListener("scroll", () => {
  const max = reader.scrollHeight - reader.clientHeight;
  $("progress").style.setProperty("--p", max > 0 ? reader.scrollTop / max : 1);
});
$("reader-close").addEventListener("click", closeEssay);
document.addEventListener("keydown", (ev) => {
  if (reader.hidden) return;
  if (ev.key === "Escape") { ev.preventDefault(); closeEssay(); }
  if (ev.key === "Tab") {
    const first = $("reader-close");
    const last = reader.querySelector(".next");
    if (ev.shiftKey && document.activeElement === first) { ev.preventDefault(); last.focus(); }
    else if (!ev.shiftKey && document.activeElement === last) { ev.preventDefault(); first.focus(); }
  }
});
