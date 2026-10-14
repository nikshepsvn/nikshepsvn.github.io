"use strict";

// Behaviour only: the page itself is pre-rendered by build.mjs from content.js + render.js.
const $ = (id) => document.getElementById(id);

// Essays used to open in an overlay at #essay/<slug>; send old links to their pages.
const legacyEssay = location.hash.match(/^#essay\/([a-z0-9-]+)$/);
if (legacyEssay) location.replace(`/writing/${legacyEssay[1]}/`);

const sections = [...document.querySelectorAll("main > section")];
const tick = () => ($("clock").textContent = new Date().toLocaleTimeString("en-CA", { hour: "numeric", minute: "2-digit", timeZone: "America/Toronto" }) + " in Toronto");
tick(); setInterval(tick, 30000);

// Follow the reading position; scrolling the nav must never move the page.
const navLinks = [...document.querySelectorAll("[data-nav]")];
let activeChapter = "";
let navFrame = 0;
const bar = document.querySelector(".bar");
// One indicator slides between links; it measures in the nav's own scroll space.
const moveInk = (a) => {
  const ink = $("nav-ink");
  ink.style.setProperty("--x", `${a.offsetLeft}px`);
  ink.style.setProperty("--w", `${a.offsetWidth}px`);
  ink.style.setProperty("--o", 1);
  if (!ink.classList.contains("is-ready")) requestAnimationFrame(() => requestAnimationFrame(() => ink.classList.add("is-ready")));
};
// Section offsets are measured only when layout changes, so scrolling reads nothing but scrollY.
let layout = { tops: [], heights: [], barBottom: 0, maxScroll: 0 };
const measure = () => {
  layout = {
    tops: sections.map((section) => section.offsetTop),
    heights: sections.map((section) => section.offsetHeight),
    barBottom: bar.offsetHeight,
    maxScroll: document.documentElement.scrollHeight - window.innerHeight,
  };
};
const updateNav = () => {
  navFrame = 0;
  const y = window.scrollY;
  bar.classList.toggle("is-scrolled", y > 4);
  const threshold = y + Math.max(layout.barBottom + 80, window.innerHeight * .35);
  let index = 0;
  layout.tops.forEach((top, i) => { if (top <= threshold) index = i; });
  if (y >= layout.maxScroll - 2) index = sections.length - 1;
  const current = sections[index];
  // The current sidebar rail fills with reading progress through its section.
  const read = (threshold - layout.tops[index]) / layout.heights[index];
  current.style.setProperty("--read", Math.min(1, Math.max(0, y >= layout.maxScroll - 2 ? 1 : read)).toFixed(3));
  if (activeChapter === current.id) return;
  activeChapter = current.id;
  // Sections already read stay full; ones ahead stay empty.
  sections.forEach((s, i) => {
    s.classList.toggle("is-current", i === index);
    if (i !== index) s.style.setProperty("--read", i < index ? 1 : 0);
  });
  if (!navLinks.some((a) => a.dataset.nav === current.id)) $("nav-ink").style.setProperty("--o", 0);
  navLinks.forEach((a) => {
    if (a.dataset.nav === current.id) {
      a.setAttribute("aria-current", "true");
      moveInk(a);
      const linkRect = a.getBoundingClientRect();
      const navRect = $("nav").getBoundingClientRect();
      const inset = 28;
      if (linkRect.left < navRect.left + inset) $("nav").scrollLeft += linkRect.left - navRect.left - inset;
      else if (linkRect.right > navRect.right - inset) $("nav").scrollLeft += linkRect.right - navRect.right + inset;
    } else a.removeAttribute("aria-current");
  });
};
const queueNav = () => { if (!navFrame) navFrame = requestAnimationFrame(updateNav); };
// Re-measure on anything that moves sections: resizes, webfonts, folds opening, the archive toggling.
const relayout = () => { measure(); activeChapter = ""; queueNav(); };
window.addEventListener("scroll", queueNav, { passive: true });
window.addEventListener("resize", relayout);
if ("ResizeObserver" in window) new ResizeObserver(relayout).observe($("main"));
measure();
updateNav();
document.fonts?.ready.then(relayout);

// Chapters below the fold ease in once; anything already on screen stays put.
if ("IntersectionObserver" in window && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
  const pending = sections.filter((s) => s.getBoundingClientRect().top > window.innerHeight);
  pending.forEach((s) => s.classList.add("is-pending"));
  document.documentElement.classList.add("js-reveal");
  const io = new IntersectionObserver((entries) => entries.forEach((e) => {
    if (!e.isIntersecting) return;
    e.target.classList.remove("is-pending");
    io.unobserve(e.target);
  }), { rootMargin: "0px 0px -8% 0px" });
  pending.forEach((s) => io.observe(s));
}

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
    if (el && !el.matches("a, button")) el.tabIndex = -1;
    el?.focus({ preventScroll: true });
    el?.classList.remove("flash"); void el?.offsetWidth; el?.classList.add("flash");
    return;
  }
});
$("more").addEventListener("click", reveal);

let copyTimer;
$("copy-email")?.addEventListener("click", async () => {
  clearTimeout(copyTimer);
  try {
    await navigator.clipboard.writeText($("email-address").textContent);
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
