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

// Hand-drawn marks for projects with no logo of their own: one app-icon per idea,
// each on its own palette (scrim and thimble borrow their READMEs' colors).
const lin = (id, a, b, x2 = 1, y2 = 1) => `<linearGradient id="${id}" x1="0" y1="0" x2="${x2}" y2="${y2}"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient>`;
const ART = {
  thimble: `<defs>${lin("a-thimble", "#e4506a", "#8e1c33")}</defs><rect width="48" height="48" fill="url(#a-thimble)"/>
    <path d="M15.5 35 17.6 17.5a6.4 6.4 0 0 1 12.8 0L32.5 35z" fill="#fff4f2"/><rect x="13" y="34" width="22" height="5" rx="2.5" fill="#fff"/>
    <g fill="#d23a55" opacity=".5"><circle cx="21" cy="21" r="1.3"/><circle cx="27" cy="21" r="1.3"/><circle cx="24" cy="25" r="1.3"/><circle cx="20.3" cy="29" r="1.3"/><circle cx="27.7" cy="29" r="1.3"/><circle cx="24" cy="18" r="1.3"/></g>`,
  scrim: `<defs><radialGradient id="a-scrim" cx=".5" cy=".3" r=".55"><stop offset="0" stop-color="#f6b75d"/><stop offset="1" stop-color="#f6b75d" stop-opacity="0"/></radialGradient></defs>
    <rect width="48" height="48" fill="#17120d"/><circle cx="24" cy="15" r="20" fill="url(#a-scrim)"/>
    <path d="M12 12.5h24V33q-3 3-6 0t-6 0-6 0-6 0z" fill="#f4efe6" opacity=".82"/>
    <path d="M18 13v19M24 13v19M30 13v19" stroke="#17120d" stroke-opacity=".14" stroke-width="1.2"/><rect x="10" y="10" width="28" height="3" rx="1.5" fill="#f4efe6"/>`,
  bankai: `<rect width="48" height="48" fill="#0b0d12"/>` + [0, 1, 2, 3].flatMap((r) => [0, 1, 2, 3].map((c) => {
    // A 1-bit checkerboard with two cells flipped by the XOR patch.
    const patched = (r === 1 && c === 2) || (r === 2 && c === 1);
    const on = (r + c) % 2 === 0 || patched;
    return on ? `<rect x="${9 + c * 8}" y="${9 + r * 8}" width="6" height="6" rx="1.3" fill="${patched ? "#5eead4" : "#e6eaf2"}"/>` : "";
  })).join(""),
  veilstream: `<defs>${lin("a-veil", "#4f46e5", "#1e1b4b")}</defs><rect width="48" height="48" fill="url(#a-veil)"/>
    <g fill="none" stroke="#e0e7ff" stroke-width="2.8" stroke-linecap="round"><path d="M9 16q3.75-4 7.5 0t7.5 0 7.5 0 7.5 0"/><path d="M9 24q3.75-4 7.5 0t7.5 0 7.5 0 7.5 0"/><path d="M9 32q3.75-4 7.5 0t7.5 0 7.5 0 7.5 0"/></g>
    <rect x="18" y="18.5" width="12" height="11" rx="3" fill="#a5b4fc"/>`,
  "near-hydra": `<rect width="48" height="48" fill="#111214"/>
    <g fill="none" stroke="#f4f4f5" stroke-width="3.2" stroke-linecap="round"><path d="M24 40c0-10-12-13-12-24"/><path d="M24 40V12"/><path d="M24 40c0-10 12-13 12-24"/></g>
    <circle cx="12" cy="14" r="4.4" fill="#f7931a"/><circle cx="24" cy="10" r="4.4" fill="#7b8ff0"/><circle cx="36" cy="14" r="4.4" fill="#a45bff"/>`,
  blindcache: `<defs>${lin("a-bcache", "#14b8a6", "#083a37")}</defs><rect width="48" height="48" fill="url(#a-bcache)"/>
    <circle cx="24" cy="24" r="11" fill="none" stroke="#ccfbf1" stroke-width="6.5" stroke-dasharray="18.9 4.14" transform="rotate(-78 24 24)"/>
    <circle cx="24" cy="22.3" r="2.6" fill="#ecfeff"/><rect x="22.9" y="23" width="2.2" height="5.6" rx="1.1" fill="#ecfeff"/>`,
  blindchat: `<defs>${lin("a-bchat", "#8b5cf6", "#312e81")}</defs><rect width="48" height="48" fill="url(#a-bchat)"/>
    <path d="M15 11h18a4.5 4.5 0 0 1 4.5 4.5v12A4.5 4.5 0 0 1 33 32H22l-7 6v-6a4.5 4.5 0 0 1-4.5-4.5v-12A4.5 4.5 0 0 1 15 11z" fill="#f5f3ff"/>
    <circle cx="24" cy="19.2" r="3.1" fill="#6d28d9"/><path d="M22.4 21h3.2l1 5.6h-5.2z" fill="#6d28d9"/>`,
  "nemo-ai": `<defs>${lin("a-nemo", "#38bdf8", "#075985", 0, 1)}<clipPath id="c-nemo"><path d="M9 24c4-8.5 18-10 24 0-6 10-20 8.5-24 0z"/></clipPath></defs>
    <rect width="48" height="48" fill="url(#a-nemo)"/><path d="M31.5 24 40 16.5v15z" fill="#f97316"/>
    <path d="M9 24c4-8.5 18-10 24 0-6 10-20 8.5-24 0z" fill="#fb923c"/>
    <g clip-path="url(#c-nemo)" fill="#fff"><rect x="15" y="12" width="3.4" height="24"/><rect x="23.5" y="12" width="3.4" height="24"/></g>
    <circle cx="13.2" cy="22.6" r="1.5" fill="#0c1a2b"/><circle cx="37" cy="10" r="1.7" fill="#e0f2fe" opacity=".85"/><circle cx="33" cy="7" r="1.1" fill="#e0f2fe" opacity=".7"/>`,
  tremor: `<defs>${lin("a-tremor", "#fbbf24", "#ef4444", 1, 0)}</defs><rect width="48" height="48" fill="#121418"/>
    <path d="M6 17h36M6 35h36" stroke="#fff" stroke-opacity=".07"/>
    <path d="M6 26h8l3-6 3 13 4-23 4 28 3-16 3 6 2-2h6" fill="none" stroke="url(#a-tremor)" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>`,
  openvenice: `<defs>${lin("a-venice", "#fb7185", "#b91c1c", 0, 1)}</defs><rect width="48" height="48" fill="url(#a-venice)"/>
    <g fill="none" stroke="#fff" stroke-width="2.6" stroke-linejoin="round"><path d="M9 35V23a5 5 0 0 1 10 0v12M19 35V23a5 5 0 0 1 10 0v12M29 35V23a5 5 0 0 1 10 0v12"/><path d="M6.5 35h35" stroke-linecap="round"/></g>
    <path d="M11 40h6M21 40h6M31 40h6" stroke="#fecdd3" stroke-width="1.8" stroke-linecap="round"/>`,
  sniffchain: `<defs>${lin("a-sniff", "#22c55e", "#14532d")}</defs><rect width="48" height="48" fill="url(#a-sniff)"/>
    <circle cx="21" cy="21" r="9.5" fill="#052e16" fill-opacity=".35" stroke="#ecfdf5" stroke-width="3.2"/><path d="M28.2 28.2 37 37" stroke="#ecfdf5" stroke-width="4.6" stroke-linecap="round"/>
    <g fill="none" stroke="#86efac" stroke-width="2"><rect x="14.5" y="18.5" width="8" height="5" rx="2.5"/><rect x="19.5" y="18.5" width="8" height="5" rx="2.5"/></g>`,
  Spine: `<defs>${lin("a-spine", "#0f172a", "#334155")}</defs><rect width="48" height="48" fill="url(#a-spine)"/>
    <g stroke="#94a3b8" stroke-width="1.6"><path d="M24 24 12 13M24 24l12-11M24 24 11 34M24 24l13 10M12 13l24 0M11 34l26 0"/></g>
    <circle cx="12" cy="13" r="3.6" fill="#38bdf8"/><circle cx="36" cy="13" r="3.6" fill="#a78bfa"/><circle cx="11" cy="34" r="3.6" fill="#34d399"/><circle cx="37" cy="34" r="3.6" fill="#fbbf24"/>
    <circle cx="24" cy="24" r="5.2" fill="#f8fafc"/>`,
  "clip.fun": `<defs>${lin("a-clip", "#f472b6", "#f97316")}</defs><rect width="48" height="48" fill="url(#a-clip)"/>
    <path d="M18.5 15.5 33 24l-14.5 8.5z" fill="#fff" stroke="#fff" stroke-width="3" stroke-linejoin="round"/>
    <path d="M37 7.5l1.3 3.2 3.2 1.3-3.2 1.3L37 16.5l-1.3-3.2-3.2-1.3 3.2-1.3z" fill="#fff7ed"/>`,
  dreamloom: `<defs>${lin("a-dream", "#1e1b4b", "#7c3aed", 0, 1)}<mask id="m-dream"><rect width="48" height="48" fill="#fff"/><circle cx="28" cy="16.5" r="8.5" fill="#000"/></mask></defs>
    <rect width="48" height="48" fill="url(#a-dream)"/><circle cx="22" cy="20" r="9.5" fill="#fde68a" mask="url(#m-dream)"/>
    <g fill="none" stroke="#c4b5fd" stroke-width="1.8" stroke-linecap="round"><path d="M8 34q5-3 10 0t10 0 10 0 10 0"/><path d="M8 39q5 3 10 0t10 0 10 0 10 0"/></g>
    <circle cx="36" cy="11" r="1.1" fill="#fff"/><circle cx="12" cy="10" r=".9" fill="#fff" opacity=".7"/>`,
};

const logoFor = (name, url, { size } = {}) => {
  let d = host(url);
  d = LOGO_ALIAS[d] || d;
  // Repos in the humanplane org wear the HumanPlane mark.
  if (d === "github.com" && url.includes("/humanplane/")) d = "humanplane.com";
  const sizeVar = size ? `--s:${size};` : "";
  const file = NAME_LOGOS[name] || (LOGOS.has(d) ? `${d}.png` : null);
  if (file) return `<span class="logo" style="${sizeVar}"><img src="logos/${file}" alt=""></span>`;
  if (ART[name]) return `<span class="logo art" style="${sizeVar}" aria-hidden="true"><svg viewBox="0 0 48 48">${ART[name]}</svg></span>`;
  return `<span class="logo ghost" style="${sizeVar}" aria-hidden="true">${esc(name[0].toUpperCase())}</span>`;
};

// Pills are links to the matching entry further down the page.
const pill = (target, name, url) =>
  `<a class="pill" href="#${target}" data-jump="${target}">${logoFor(name, url)}${esc(name)}</a>`;
const ventureById = Object.fromEntries(SITE.ventures.map((v) => [v.name, v]));
const expByCo = Object.fromEntries(SITE.experience.map((x) => [x.company, x]));
const projByName = Object.fromEntries(SITE.projects.map((p) => [p.name, p]));
const pressBySource = Object.fromEntries(SITE.press.map((p) => [p.source, p]));
const vp = (n) => pill("v-" + slug(n), n, ventureById[n].url);
const xp = (n, label) => pill("x-" + slug(n), label || n, expByCo[n].url);
const pp = (n) => pill("p-" + slug(n), n, projByName[n].url);
const prp = (n) => pill("pr-" + slug(n), n, pressBySource[n].url);
const ep = (title) => {
  const i = SITE.essays.findIndex((e) => e.title === title);
  return `<a class="pill" href="#writing" data-essay="${i}"><span class="logo ghost" aria-hidden="true">¶</span>${esc(title)}</a>`;
};
const prose = (paras, lead = false) => `<div class="prose${lead ? " lead" : ""}">${paras.map((p) => `<p>${p}</p>`).join("")}</div>`;

const totalStars = SITE.projects.reduce((sum, p) => sum + (p.stars || 0), 0);
const byStars = [...SITE.projects].sort((a, b) => (b.stars ?? -1) - (a.stars ?? -1));
const now = m.now.url ? `<a href="${esc(m.now.url)}" target="_blank" rel="noreferrer">${esc(m.now.label)}</a>` : `<b>${esc(m.now.label)}</b>`;

const ventureItem = (v) => `
  <li><${v.url ? "a" : "div"} class="item" id="v-${slug(v.name)}"${v.url ? ` href="${esc(v.url)}" target="_blank" rel="noreferrer"` : ""}>
    ${logoFor(v.name, v.url)}
    <span class="item-t">${esc(v.name)} <span>· ${esc(v.status)}</span></span>
    <span class="item-k">${v.kpi ? `${esc(v.kpi.value)}<small>${esc(v.kpi.label)}</small>` : ""}</span>
    <span class="item-d">${esc(v.summary)}</span>
    ${v.metrics?.length ? `<span class="tags">${v.metrics.map((t) => `<span>${esc(t)}</span>`).join("")}</span>` : ""}
  </${v.url ? "a" : "div"}></li>`;

const expItem = (x) => `
  <li><a class="item" id="x-${slug(x.company)}" href="${esc(x.url)}" target="_blank" rel="noreferrer">
    ${logoFor(x.company, x.url)}
    <span class="item-t">${esc(x.company)} <span>· ${esc(x.role)}${x.team ? `, ${esc(x.team)}` : ""}</span></span>
    <span class="item-m">${esc(x.period)}</span>
    <span class="item-d">${esc(x.description)}</span>
  </a></li>`;

// Theme per project drives the filter chips in the open-source chapter.
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
  return `<li${fold ? " data-fold hidden" : ""}><${tag} class="proj${feature ? " feature" : ""}${fresh ? " is-new" : ""}" id="p-${slug(p.name)}"${attrs}>
    ${logoFor(p.name, p.url || "")}
    <span class="proj-name"><span>${esc(p.name)}</span>${fresh ? `<span class="new-chip">New · ${monthLabel(p.date)}</span>` : ""}<small>${esc(p.tag)}</small></span>
    <span class="proj-meta">${meta}</span>
    <span class="proj-sum">${esc(p.summary)}</span>
    ${p.stats ? `<span class="stats">${p.stats.map((x) => `<span class="stat"><b>${esc(x.value)}</b><span>${esc(x.label)}</span></span>`).join("")}</span>` : ""}
    ${p.wins?.length ? `<span class="wins">${p.wins.map((w) => `<span class="win">${esc(w)}</span>`).join("")}</span>` : ""}
  </${tag}></li>`;
};

// Starred-and-followed-by band: headline numbers, company badges, then where people are.
const communityBand = () => {
  const c = SITE.community;
  const fmt = (n) => n.toLocaleString("en-US");
  const shown = c.topCountries.reduce((sum, [, n]) => sum + n, 0);
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
  <li><a class="item" href="${esc(e.url)}" target="_blank" rel="noreferrer" style="grid-template-columns: minmax(0,1fr) auto">
    <span class="item-h">${esc(e.title)} <span class="ext">↗</span></span><span class="item-m">${esc(e.kind)} · ${esc(e.date)}</span>
    <span class="item-d" style="grid-column:1/-1">${esc(e.subtitle)}</span>
  </a></li>` : `
  <li><button type="button" class="item" data-essay="${i}" style="grid-template-columns: minmax(0,1fr) auto">
    <span class="item-h">${esc(e.title)}</span><span class="item-m">${esc(e.date)}</span>
    <span class="item-d" style="grid-column:1/-1">${esc(e.subtitle)}</span>
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
      <span class="status"><span class="dot" aria-hidden="true"></span><span>Building ${m.now.url ? `${now}, ${esc(m.now.note)}` : `a consumer product, <b>in stealth</b>`} · <span id="clock">Toronto</span></span></span>
      ${prose([`I'm <b>Nikshep</b>, an engineer in Toronto. I build first versions of things at the edges of AI, crypto, and markets — two exits so far, and a protocol that moved $50M+.`], true)}
      ${prose([`<em>${esc(m.philosophy)}</em> Right now that's pointed at a consumer product I can't talk about yet. Away from the keyboard: techno, psydub, and mountains with friends.`])}` },
  { id: "ventures", label: "Ventures", side: "Ventures", count: SITE.ventures.length, body: `
      ${prose([`I built ${vp("HumanPlane")}, a chart room for prediction markets, and ${vp("Moltlaunch")}, a work protocol for agents that cleared $50M+ in volume. I exited ${vp("RealmPlay")}, and ${vp("SoulBazaar")} was acquired before it launched.`])}
      <ul class="list">${SITE.ventures.map(ventureItem).join("")}</ul>` },
  { id: "experience", label: "Experience", side: "Experience", count: SITE.experience.length, body: `
      ${prose([`I was a ${xp("Kalshi")} Builder Fellow, and before going independent spent three years as a senior engineer and tech lead at ${xp("Instacart")}. Earlier: ${xp("Coinbase")}, ${xp("Deliverr")}, ${xp("SeatGeek")}, ${xp("PagerDuty")}, and computer science at ${xp("University of Waterloo", "Waterloo")}.`])}
      <ul class="list">${SITE.experience.map(expItem).join("")}</ul>` },
  { id: "projects", label: "Projects", side: "Projects", count: SITE.projects.length, body: `
      ${prose([`Some of it finds a real audience. ${pp("modelgrep")} drew 400K+ Google impressions in the last three months, and ${pp("viberank")} has ranked 1,238 developers across 18 trillion tokens. ${pp("homunculus")} helped inspire the learning system in everything-claude-code, a 266K-star repo.`, `On the research side, ${pp("thimble")} beats a funded team's tool-calling model at 48M parameters, ${pp("bankai")} has been independently verified and ported to Rust, and I built the orchestrator behind ${pp("MC-Bench")}. In all: ${totalStars.toLocaleString("en-US")} GitHub stars across ${SITE.projects.length} projects.`])}
      ${communityBand()}
      <div class="projects">${projectGroups()}</div>
      <button type="button" class="more" id="more">Show more projects</button>
      <p class="source">Search figures from Google Search Console; viberank figures from viberank.app/api/stats. September 2026.</p>` },
  { id: "writing", label: "Writing", side: "Essays", count: SITE.essays.length, body: `
      ${prose([`I write about where AI and markets are heading — start with ${ep("Control Surface")} or ${ep("Liquid Talent")}.`])}
      <ul class="list">${SITE.essays.map(essayItem).join("")}</ul>` },
  { id: "press", label: "Press", side: "Coverage", count: SITE.press.length, body: `
      ${prose([`My work has been covered by ${prp("Bloomberg")}, ${prp("Business Insider")}, ${prp("PYMNTS")} and others.`])}
      <ul class="list">${SITE.press.map(pressItem).join("")}</ul>` },
  { id: "contact", label: "Contact", side: "Contact", body: `
      ${prose([`The best way to reach me is a DM on <a href="https://twitter.com/${esc(m.handle)}" target="_blank" rel="noreferrer">X</a>, or email.`])}
      <div class="links">
        ${SITE.links.filter((l) => l !== email).map((l) => `<a href="${esc(l.href)}" target="_blank" rel="noreferrer">${esc(l.label)} <span>${esc(l.handle)}</span></a>`).join("")}
        ${email ? `<button type="button" id="copy-email">${esc(email.handle)} <span id="copy-state">copy</span></button>` : ""}
      </div>` },
];

$("main").innerHTML = chapters.map((c) => `
  <section class="chap" id="${c.id}" aria-labelledby="${c.id}-h">
    <h2 class="side" id="${c.id}-h">${c.side}${c.count ? `<small>${c.count}</small>` : ""}</h2>
    <div class="body">${c.body}</div>
  </section>`).join("");
$("nav").innerHTML = chapters.map((c) => `<a href="#${c.id}" data-nav="${c.id}">${c.label}</a>`).join("");
$("who").textContent = m.name;
$("foot").textContent = `© ${new Date().getFullYear()} ${m.name} · Toronto`;

const tick = () => ($("clock").textContent = new Date().toLocaleTimeString("en-CA", { hour: "numeric", minute: "2-digit", timeZone: "America/Toronto" }) + " in Toronto");
tick(); setInterval(tick, 30000);

// Highlight the chapter currently in view.
const navLinks = [...document.querySelectorAll("[data-nav]")];
const spy = new IntersectionObserver((entries) => {
  entries.filter((e) => e.isIntersecting).forEach((e) => {
    navLinks.forEach((a) => a.setAttribute("aria-current", String(a.dataset.nav === e.target.id)));
    document.querySelector(`[data-nav="${e.target.id}"]`)?.scrollIntoView({ block: "nearest", inline: "nearest" });
  });
}, { rootMargin: "-45% 0px -50% 0px" });
chapters.forEach((c) => spy.observe($(c.id)));

// Pills scroll to their entry and flash it; hidden projects are revealed first.
const reveal = () => {
  document.querySelectorAll("#projects [data-fold]").forEach((el) => (el.hidden = false));
  $("more").hidden = true;
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
  if (essay) { ev.preventDefault(); openEssay(+essay.dataset.essay); }
});
$("more").addEventListener("click", reveal);

$("copy-email")?.addEventListener("click", () => {
  navigator.clipboard?.writeText(email.handle).then(() => ($("copy-state").textContent = "copied"), () => ($("copy-state").textContent = "select to copy"));
});

// Reader overlay for essays, with scroll progress and a pointer to the next one.
const reader = $("reader");
let lastFocus = null;
const openEssay = (i) => {
  const e = SITE.essays[i];
  // Skip externally published pieces when pointing to the next essay.
  let nextIndex = (i + 1) % SITE.essays.length;
  while (SITE.essays[nextIndex].url) nextIndex = (nextIndex + 1) % SITE.essays.length;
  if (reader.hidden) lastFocus = document.activeElement;
  $("reader-crumb").textContent = `${e.title} · ${e.date}`;
  $("reader-body").innerHTML = `<p class="kicker">${esc(e.kind)} · ${esc(e.date)}</p><h1 id="reader-h">${esc(e.title)}</h1><p class="sub">${esc(e.subtitle)}</p>` +
    e.body.split(/\n\n+/).map((para) => `<p class="txt">${esc(para)}</p>`).join("") +
    `<button type="button" class="next" data-essay="${nextIndex}"><span>Next essay</span><b>${esc(SITE.essays[nextIndex].title)}</b></button>`;
  reader.hidden = false; reader.scrollTop = 0; document.body.style.overflow = "hidden";
  $("progress").style.setProperty("--p", 0);
  $("reader-close").focus();
};
const closeEssay = () => { reader.hidden = true; document.body.style.overflow = ""; lastFocus?.focus(); };
reader.addEventListener("scroll", () => {
  const max = reader.scrollHeight - reader.clientHeight;
  $("progress").style.setProperty("--p", max > 0 ? reader.scrollTop / max : 1);
});
$("reader-close").addEventListener("click", closeEssay);
document.addEventListener("keydown", (ev) => { if (ev.key === "Escape" && !reader.hidden) closeEssay(); });
