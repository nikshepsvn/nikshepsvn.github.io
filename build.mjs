// Pre-renders the site so crawlers, link previews and AI search see real HTML.
// Run `node build.mjs` after editing content.js or render.js; CI runs it too.
//   index.html          <main> and <nav> filled from render.js
//   writing/<slug>/     one page per hosted essay
//   sitemap.xml         home plus every essay page

import fs from "node:fs/promises";
import vm from "node:vm";

const ORIGIN = "https://nikshepsvn.com";

// content.js and render.js are browser scripts; run them in one shared global scope.
const context = vm.createContext({});
context.window = context;
for (const file of ["content.js", "render.js"]) vm.runInContext(await fs.readFile(file, "utf8"), context, { filename: file });
const { main, nav } = vm.runInContext("renderPage()", context);
const { SITE, esc, slug, readingTime, essayPath } = vm.runInContext("({ SITE, esc, slug, readingTime, essayPath })", context);

const fill = (html, open, close, inner) => {
  const start = html.indexOf(open);
  const end = html.indexOf(close, start);
  if (start < 0 || end < 0) throw new Error(`index.html is missing ${open}`);
  return html.slice(0, start + open.length) + inner + html.slice(end);
};

let index = await fs.readFile("index.html", "utf8");
index = fill(index, '<main class="page" id="main" tabindex="-1">', "</main>", `${main}\n    `);
index = fill(index, '<nav class="nav" id="nav" aria-label="Sections">', "</nav>", nav);
await fs.writeFile("index.html", index);

// "Jul 2025" -> "2025-07", for structured data.
const isoMonth = (label) => {
  const d = new Date(`1 ${label} UTC`);
  return Number.isNaN(+d) ? undefined : d.toISOString().slice(0, 7);
};

const essayBody = (body) => body.trim().split(/\n\n+/).map((para) =>
  /^##\s/.test(para) ? `<h2>${esc(para.replace(/^##\s+/, ""))}</h2>` : `<p class="txt">${esc(para)}</p>`).join("\n      ");

const essayPage = (e, next) => {
  const url = ORIGIN + essayPath(e);
  const title = `${e.title} — ${SITE.meta.name}`;
  const ld = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: e.title,
    description: e.subtitle,
    datePublished: isoMonth(e.date),
    url,
    image: SITE.meta.ogImage,
    author: { "@type": "Person", name: SITE.meta.name, url: SITE.meta.url },
  };
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
    <title>${esc(title)}</title>
    <meta name="description" content="${esc(e.subtitle)}" />
    <meta name="author" content="${esc(SITE.meta.name)}" />
    <meta name="theme-color" content="#f7f6f2" media="(prefers-color-scheme: light)" />
    <meta name="theme-color" content="#111412" media="(prefers-color-scheme: dark)" />
    <meta name="color-scheme" content="light dark" />
    <link rel="canonical" href="${url}" />
    <script type="application/ld+json">${JSON.stringify(ld)}</script>
    <meta property="og:type" content="article" />
    <meta property="og:url" content="${url}" />
    <meta property="og:title" content="${esc(e.title)}" />
    <meta property="og:description" content="${esc(e.subtitle)}" />
    <meta property="og:image" content="${SITE.meta.ogImage}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:creator" content="@${SITE.meta.handle}" />
    <meta name="twitter:title" content="${esc(e.title)}" />
    <meta name="twitter:description" content="${esc(e.subtitle)}" />
    <meta name="twitter:image" content="${SITE.meta.ogImage}" />
    <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
    <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
    <link rel="preload" href="/fonts/newsreader-normal-latin.woff2" as="font" type="font/woff2" crossorigin />
    <link rel="stylesheet" href="/styles.css" />
  </head>
  <body class="essay-page">
    <header class="reader-bar"><a href="/#writing">← ${esc(SITE.meta.name)}</a><span>${esc(e.title)} · ${esc(e.date)}</span><i class="progress" id="progress" aria-hidden="true"></i></header>
    <main id="main">
    <article class="essay">
      <p class="kicker">${esc(e.kind)} · ${esc(e.date)} · ${readingTime(e)}</p>
      <h1>${esc(e.title)}</h1>
      <p class="sub">${esc(e.subtitle)}</p>
      ${essayBody(e.body)}
      <a class="next" href="${essayPath(next)}"><span>Next essay</span><b>${esc(next.title)}</b></a>
      <p class="essay-foot">By <a href="/">${esc(SITE.meta.name)}</a>, based in Toronto. More writing on <a href="/#writing">nikshepsvn.com</a> and <a href="https://x.com/${esc(SITE.meta.handle)}">X</a>.</p>
    </article>
    </main>
    <script>
      const bar = document.getElementById("progress");
      const update = () => { const max = document.documentElement.scrollHeight - innerHeight; bar.style.setProperty("--p", max > 0 ? scrollY / max : 1); };
      addEventListener("scroll", update, { passive: true }); update();
    </script>
  </body>
</html>
`;
};

// Externally published pieces (reports, papers) link out and get no page here.
const hosted = SITE.essays.filter((e) => !e.url);
await fs.rm("writing", { recursive: true, force: true });
for (const [i, e] of hosted.entries()) {
  await fs.mkdir(`writing/${slug(e.title)}`, { recursive: true });
  await fs.writeFile(`writing/${slug(e.title)}/index.html`, essayPage(e, hosted[(i + 1) % hosted.length]));
}

const urls = [SITE.meta.url, ...hosted.map((e) => ORIGIN + essayPath(e))];
await fs.writeFile("sitemap.xml", `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url><loc>${u}</loc></url>`).join("\n")}
</urlset>
`);

console.log(`Built index.html, ${hosted.length} essay pages, sitemap.xml (${urls.length} URLs)`);
