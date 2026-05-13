// Single source of truth for site content.
// Edit this file to change what the site displays.
//
// Each project supports a `detail` block with extra context that
// appears in the modal. Shape:
//   detail: {
//     paragraphs: ["one", "two"],                // long-form context
//     images:   [{ src, alt }],                  // thumbnail grid
//     tweets:   [{ text, author, url, date }],   // quoted tweets
//     links:    [{ label, href }],               // action buttons (first is primary)
//   }
// Empty arrays are fine — the modal hides empty sections.

window.SITE = {
  meta: {
    name: "Nikshep Saravanan",
    handle: "nikshepsvn",
    location: "Toronto, CA",
    role: "Exploration engineer",
    tagline:
      "Building at the edges of AI, crypto, and markets. Shipping opinionated v1s into emerging categories before they have answers.",
    philosophy:
      "Infinitely curious, delusional optimist.",
    now: {
      label: "PhoneGoblin",
      note: "run a content factory from your desk",
      url: "https://phonegoblin.com",
    },
    title: "Nikshep Saravanan — building at the edges of AI, crypto, and markets",
    description:
      "Independent builder. Now building PhoneGoblin — BYOD Android content factory. Past: HumanPlane, Moltlaunch, RealmPlay (exited), SoulBazaar (acquired). Featured in Bloomberg, Business Insider, PYMNTS.",
    url: "https://nikshepsvn.com/",
    ogImage: "https://nikshepsvn.com/og.png",
  },

  // Notable past roles — small logo row in sidebar.
  previously: [
    { name: "Kalshi",    role: "Builder Fellow",      period: "Jan–Feb 2026",    domain: "kalshi.com",    url: "https://kalshi.com" },
    { name: "Instacart", role: "Senior SWE",          period: "2021 – 2024",     domain: "instacart.com", url: "https://instacart.com" },
    { name: "Coinbase",  role: "SWE Intern",          period: "2020",            domain: "coinbase.com",  url: "https://coinbase.com" },
    { name: "SeatGeek",  role: "Data Infra Intern",   period: "2019",            domain: "seatgeek.com",  url: "https://seatgeek.com" },
    { name: "uWaterloo", role: "BCS, Computer Science", period: "2017 – 2021", domain: "uwaterloo.ca",  url: "https://uwaterloo.ca" },
  ],

  about: [
    "I'm an independent builder, shipping small, opinionated projects and writing essays — most of them live at sculpt.fun, which is just my home for whatever I'm making.",
    "My interests are broad: AI, crypto, markets, intelligence — really any corner of technology that's pulling at me. I work fast, in public, and iterate until it feels right.",
  ],

  // Experiments — startups & closed-source products I've built.
  // Click in UI opens a modal with highlights + more.
  ventures: [
    {
      id: "V-00",
      name: "PhoneGoblin",
      status: "building",
      summary:
        "Run a content factory from your desk. Mount any Android — it becomes a node. Real device, real taps, indistinguishable from a human's. One phone or a hundred.",
      metrics: ["BYOD Android", "No root", "Open runtime", "On-device"],
      url: "https://phonegoblin.com",
      detail: {
        paragraphs: [
          "PhoneGoblin runs a content factory from your desk. Mount any Android — it becomes a node in your fleet. Drive content, automation, and analytics across devices: every tap is a real device, every account indistinguishable from a human's.",
          "Real phones, real taps. No emulators, no cloud phones, no modded APKs. Sideload a signed APK, enable the Accessibility Service, and the goblin is alive — one reboot, no rooting, no developer mode tricks.",
          "Sign in to the apps you already use. Sessions live in the apps' own sandboxes — credentials never leave the device, and never reach us. Every action you'd take by hand, run across the whole fleet.",
        ],
        highlights: [
          "BYOD Android — sideload signed APK, enable Accessibility Service, install in 90s",
          "Per-account control: bio, image, pinned post, persona, what each account looks at",
          "Personas-in-character: backstory, voice, feed — held across every interaction",
          "Bulk publish: a week of on-brand posts in minutes",
          "Workflows-as-code — chain models, set triggers, automate replies",
          "Analytics loop back per account, per persona, per phone",
          "Managed capacity available — rent Androids if you don't want hardware",
        ],
        images: [],
      },
    },
    {
      id: "V-01",
      name: "HumanPlane",
      status: "shipped",
      summary:
        "The chart room for prediction markets. Polymarket and Kalshi in one place — whale flows, AI research, and signals that move before the news.",
      kpi: { value: "$250K+", label: "platform volume" },
      metrics: ["Kalshi grant recipient", "Builder fellow"],
      url: "https://humanplane.com",
      detail: {
        paragraphs: [
          "HumanPlane was the chart room for prediction markets. Polymarket and Kalshi in one place, with whale flows, AI research, and the kind of signal that moves before the news. Built for people who actually live inside these markets.",
        ],
        highlights: [
          "$250K+ platform volume",
          "Kalshi grant recipient",
          "Kalshi Builder Fellow",
        ],
        images: [],
      },
    },
    {
      id: "V-02",
      name: "Moltlaunch",
      status: "shipped",
      summary: "Fiverr for agents. An agent work protocol with custom escrow, job matching, and payments.",
      kpi: { value: "$50M+", label: "platform volume" },
      metrics: ["$300K+ platform revenue"],
      url: "https://moltlaunch.com",
      detail: {
        paragraphs: [
          "Moltlaunch V2 was a Fiverr for agents — a work protocol where autonomous agents could post jobs, bid on work, and get paid through custom escrow. Job matching, payment infrastructure, and reputation all built in.",
          "Evolved from V1 (an onchain agent swarm experiment where agents coordinated by trading tokens). V2 turned that into something practical: real agent-to-agent commerce with $50M+ in volume and $300K+ in platform revenue.",
        ],
        highlights: [
          "$50M+ total platform volume",
          "$300K+ platform revenue",
          "Agent work protocol with custom escrow",
          "Job matching and payment infrastructure",
          "Evolved from V1 onchain agent swarm",
        ],
        images: [],
      },
    },
    {
      id: "V-03",
      name: "RealmPlay",
      status: "exited",
      summary:
        "AI storytelling platform on a custom fine-tuned LLM running on consumer-grade GPUs.",
      kpi: { value: "Mid 5-fig ARR", label: "bootstrapped · west mountain ai" },
      metrics: ["Solo build · 3 weeks", "50% cheaper than GPT-3.5 at launch"],
      url: "",
      detail: {
        paragraphs: [
          "RealmPlay was an AI storytelling platform powered by a custom fine-tuned large language model running super-efficiently on consumer-grade GPUs (RTX 3090s). At launch, it was over 50% cheaper than OpenAI's GPT-3.5-Turbo with 4× the context window (16K tokens).",
          "Fully bootstrapped, kept super-profitable, and scaled to low/mid 5-figure ARR before exiting to West Mountain AI, LLC. Most of the journey was a one-person team — engineering, design, marketing, and community. Later brought on a SWE and a Technical Support Specialist, plus a moderator squad inside Discord.",
        ],
        highlights: [
          "Built and launched the entire product solo in ~3 weeks",
          "Fine-tuned an LLM for storytelling with custom datasets and block-merging",
          "50% cheaper than GPT-3.5-Turbo with 4× context (16K tokens) at launch",
          "Quantized + batched inference on community GPU vendors before competitors caught on",
          "Applied RoPE scaling to extend context and cut infra costs",
          "Zero paid marketing — organic growth via Reddit and word of mouth",
          "Grew and managed a community of 500+",
          "Hired and ramped a SWE and Technical Support Specialist",
          "Managed a successful exit & handover to West Mountain AI, LLC",
        ],
        images: [],
      },
    },
    {
      id: "V-04",
      name: "SoulBazaar",
      status: "acquired",
      summary:
        "Autonomous AI influencer platform for crypto tokens & communities. Acquired pre-launch.",
      kpi: { value: "$5M+", label: "post-acq token marketcap" },
      metrics: ["Team of 3", "Rebranded to LetsAgent"],
      url: "",
      detail: {
        paragraphs: [
          "SoulBazaar was an autonomous AI influencer platform for crypto tokens and communities. Agents could post on X, generate images and memes, and pull real-time trends — a scrappy build with a team of three, while I was working full-time at Instacart.",
          "The foundational tech was acquired pre-launch. Web3-enabled post-acquisition, the token reached a $5M+ marketcap before the platform was rebranded to LetsAgent and pivoted toward a more generic AI-enabled marketing product.",
        ],
        highlights: [
          "Built and sold the foundational platform pre-launch",
          "Scrappy AI startup with a team of 3",
          "Built while working full-time at Instacart",
          "Agents with X posting, image generation, meme design, real-time trend retrieval",
          "Post-acquisition token reached $5M+ marketcap",
          "Later rebranded to LetsAgent",
        ],
        images: [],
      },
    },
  ],

  projects: [
    {
      id: "P-01",
      name: "bankai",
      tag: "research · llms",
      stars: 68,
      url: "https://github.com/nikshepsvn/bankai",
      summary: "Ultra-sparse adaptation of 1-bit LLMs via XOR patches. Paper + code.",
      detail: {
        paragraphs: [
          "Novel research: a method for ultra-sparse adaptation of 1-bit LLMs using XOR patches — steering heavily quantized models without full fine-tuning or big compute.",
          "An attempt to push what's possible on edge and local deploys of compressed models.",
        ],
        images: [],
        tweets: [],
        links: [{ label: "github", href: "https://github.com/nikshepsvn/bankai" }],
      },
    },
    {
      id: "P-02",
      name: "cross-market-state-fusion",
      tag: "rl · markets",
      stars: 373,
      url: "https://github.com/humanplane/cross-market-state-fusion",
      summary:
        "RL agent exploiting information lag between Binance futures and Polymarket.",
      detail: {
        paragraphs: [
          "A PPO reinforcement learning agent that exploits timing gaps between fast markets (Binance futures) and slower prediction markets (Polymarket), fusing real-time data from both into an 18-dim state observation to paper-trade 15-min binary crypto markets — BTC, ETH, SOL, XRP.",
          "Trains on-device with MLX on Apple Silicon. Learns from sparse PnL signals only when positions close. Phase 5 (LACUNA) hit ~$50K paper profit (~2,500% ROI) after adding a TemporalEncoder that compresses the last 5 market states into 32-dim features.",
          "Very much a research artifact — real-world slippage would degrade results 20-50%. Statistical significance is explicitly disclaimed in the paper.",
        ],
        images: [],
        tweets: [],
        links: [
          { label: "read lacuna writeup", href: "https://humanplane.com/lacuna" },
          { label: "github", href: "https://github.com/humanplane/cross-market-state-fusion" },
        ],
      },
    },
    {
      id: "P-03",
      name: "veilstream",
      tag: "research · llm security",
      stars: 4,
      url: "https://github.com/nikshepsvn/veilstream",
      summary:
        "Streaming PII proxy for LLM chat with cryptographically-anchored reversal. Introduces PASP.",
      detail: {
        paragraphs: [
          "Veilstream sits between a chat UI and an LLM. Outbound: detects PII, mints realistic pseudonyms, keeps a per-session vault. Inbound: streams the LLM's response with pseudonyms reversed live as chunks arrive — tolerating pseudonyms that straddle chunk boundaries, partial prefixes, and the edge cases every prior library silently breaks on.",
          "Introduces PASP — Provenance-Anchored Streaming Pseudonymization — a new algorithm that closes the false-attribution attack every prior reverser suffers from. Benchmarks: legacy reversers show 2–32% false-attribution on 6 frontier LLMs (median 12%); PASP blocks it cryptographically at 0%. 85 core tests passing, including 500+ Hypothesis property cases.",
        ],
        images: [],
        tweets: [],
        links: [{ label: "github", href: "https://github.com/nikshepsvn/veilstream" }],
      },
    },
    {
      id: "P-04",
      name: "viberank",
      tag: "leaderboard · claude code",
      stars: 96,
      url: "https://viberank.app",
      summary: "Public leaderboard for Claude Code usage. Who's actually shipping.",
      detail: {
        paragraphs: [
          "Viberank turns Claude Code usage into a public leaderboard — making shipping visible. Instead of 'I use Claude Code a lot,' you can show receipts.",
          "Shipped under SCULPT. Lightweight, authenticated opt-in, fully open source. Picked up across the ecosystem — integrated upstream with the ccusage CLI and forked by academic labs (SNU Connectome Lab) for internal leaderboards.",
        ],
        images: [],
        tweets: [
          {
            text: "Ranked #1 on viberank with $458K spent across 12.9B tokens.",
            author: "GeoffreyHuntley",
            url: "https://x.com/GeoffreyHuntley/status/1949927020093460836",
            date: "Jul 2025",
          },
        ],
        links: [
          { label: "open viberank.app", href: "https://viberank.app" },
          { label: "source", href: "https://github.com/sculptdotfun/viberank" },
        ],
      },
    },
    {
      id: "P-05",
      name: "homunculus",
      tag: "claude code · plugin",
      stars: 364,
      url: "https://humanplane.com/homunculus",
      summary:
        "A Claude Code plugin that watches how you work, learns your patterns, evolves itself.",
      detail: {
        paragraphs: [
          "Homunculus is a Claude Code plugin — a small, growing agent that watches how you work, learns your patterns, and rewrites parts of itself to help you better.",
          "The bet: most 'personal AI' is too generic to stick. An agent that's actually useful has to co-evolve with you, hold memory across sessions, and update its own behavior.",
        ],
        images: [],
        tweets: [],
        links: [
          { label: "open humanplane.com/homunculus", href: "https://humanplane.com/homunculus" },
          { label: "github", href: "https://github.com/humanplane/homunculus" },
        ],
      },
    },
    {
      id: "P-06",
      name: "tremor",
      tag: "markets · prediction",
      stars: 51,
      url: "https://tremor.live",
      summary: "Real-time seismic monitor for prediction markets.",
      detail: {
        paragraphs: [
          "Tremor watches prediction markets for unusual activity — the seismic events that precede big moves. A real-time signal surface for people who live in markets like Polymarket.",
        ],
        images: [],
        tweets: [],
        links: [
          { label: "open tremor.live", href: "https://tremor.live" },
          { label: "source", href: "https://github.com/sculptdotfun/tremor" },
        ],
      },
    },
    {
      id: "P-07",
      name: "terminal",
      tag: "oss · prediction markets",
      stars: 38,
      url: "https://github.com/humanplane/terminal",
      summary:
        "Open-source self-hosted Polymarket terminal. Live book, leaderboard, self-custodial trading.",
      detail: {
        paragraphs: [
          "A Bloomberg-style dark UI for Polymarket — sub-second order book via SSE, full trader leaderboard drill-down, and self-custodial order execution with no third-party relayer. Browse 10,000+ markets, watch the order book tick, sign orders with MetaMask.",
          "Read-only mode works without a wallet. Trading mode connects MetaMask and signs orders directly against Polymarket's CLOB — no custody, no backend secrets, no builder credentials. The OSS side of the HumanPlane stack.",
        ],
        images: [],
        tweets: [],
        links: [
          { label: "github", href: "https://github.com/humanplane/terminal" },
        ],
      },
    },
    {
      id: "P-08",
      name: "moltlaunch",
      tag: "agents · onchain",
      stars: 30,
      url: "https://moltlaunch.com",
      summary: "Onchain agent swarm where agents coordinate, communicate, and pursue network goals by trading tokens.",
      detail: {
        paragraphs: [
          "An experiment in onchain agent swarms — agents that could coordinate, communicate, and pursue network goals by trading tokens. Set goals for the swarm and agents autonomously work toward them.",
          "Part of the Molt Autonomous Network. What happens when agents hold their own assets and delegate directly to each other.",
        ],
        images: [],
        tweets: [],
        links: [
          { label: "open moltlaunch.com", href: "https://moltlaunch.com" },
          { label: "source", href: "https://github.com/nikshepsvn/moltlaunch" },
        ],
      },
    },
    {
      id: "P-09",
      name: "openvenice",
      tag: "oss · llms",
      stars: 37,
      url: "https://github.com/nikshepsvn/openvenice",
      summary: "Customizable frontend for Venice AI. Chat, image, audio, video. No backend.",
      detail: {
        paragraphs: [
          "Open-source, backend-less frontend for Venice AI — chat, image gen, audio, video, embeddings, visual workflows. Your API key, your browser, no server to host.",
          "Forkable and self-hostable in minutes.",
        ],
        images: [],
        tweets: [],
        links: [{ label: "github", href: "https://github.com/nikshepsvn/openvenice" }],
      },
    },
    {
      id: "P-10",
      name: "modelgrep",
      tag: "llm-ops · search",
      stars: 2,
      url: "https://modelgrep.com",
      summary: "Browse LLM providers. Filter by throughput, cost, quant, context.",
      detail: {
        paragraphs: [
          "A search engine for LLMs — filter across OpenRouter's catalog by cost, throughput, quantization, and context. Pick the right model in seconds instead of reading ten blog posts.",
        ],
        images: [],
        tweets: [],
        links: [
          { label: "open modelgrep.com", href: "https://modelgrep.com" },
          { label: "source", href: "https://github.com/sculptdotfun/modelgrep" },
        ],
      },
    },
    {
      id: "P-11",
      name: "nemo-ai",
      tag: "mcp · memory",
      stars: 3,
      url: "https://github.com/nikshepsvn/nemo-ai",
      summary: "Local-first MCP server for private agent memory with temporal reasoning.",
      detail: {
        paragraphs: [
          "Nemo gives AI agents durable, private memory — with temporal reasoning and contradiction handling built in. Not a cloud vector DB; a tool that lives next to the agent.",
          "Autonomy only compounds when memory persists.",
        ],
        images: [],
        tweets: [],
        links: [{ label: "github", href: "https://github.com/nikshepsvn/nemo-ai" }],
      },
    },
    {
      id: "P-12",
      name: "sniffchain",
      tag: "agents · research",
      stars: null,
      url: "",
      summary:
        "Token & wallet research terminal. Multi-agent system on X for in-feed trade, send, research. ~5k users, fully organic.",
      detail: {
        paragraphs: [
          "SniffChain was a token and wallet research terminal powered by AI agents — a multi-agent system on X that let you trade, send, and research tokens directly in-feed.",
          "Novel risk scoring and detection infrastructure under the hood. Grew to roughly 5k users and 1k community members fully organically, with zero paid acquisition.",
        ],
        images: [],
        tweets: [],
        links: [],
      },
    },
    {
      id: "P-13",
      name: "clip.fun",
      tag: "markets · creator",
      stars: null,
      url: "https://clip.fun",
      summary:
        "The market for imagination. Democratizing creativity for the AI age. 2k+ waitlist, novel tokenomics.",
      detail: {
        paragraphs: [
          "Clip.fun was a market for imagination — an attempt to democratize and financialize creativity for the AI age. Build a community around a creative idea; let holders participate in its upside.",
          "2,000+ waitlist at launch with a novel tokenomics model.",
        ],
        images: [],
        tweets: [],
        links: [{ label: "open clip.fun", href: "https://clip.fun" }],
      },
    },
    {
      id: "P-14",
      name: "dreamloom",
      tag: "ai · interactive video",
      stars: null,
      url: "https://dreamloom.com",
      summary:
        "Near real-time interactive video. AI-native world-building system.",
      detail: {
        paragraphs: [
          "Dreamloom was an interactive media platform built around near real-time interactive video — an AI-native world-building system where you could shape environments on the fly.",
        ],
        images: [],
        tweets: [],
        links: [{ label: "open dreamloom.com", href: "https://dreamloom.com" }],
      },
    },
  ],

  // Essays — full content lives here, no external linking.
  // `body` is a markdown-lite string. Supports ## h2, ### h3, paragraphs, - lists.
  essays: [
    {
      id: "E-01",
      title: "Control Surface",
      subtitle: "The bottleneck isn't model intelligence anymore. It's the interface.",
      kind: "Essay",
      date: "January 2026",
      desc: "The best AI operators might not be engineers. They might be StarCraft players.",
      body: `Most of the discourse about AI progress focuses on model capability. Bigger models, better benchmarks, newer scaling laws. This is the obvious frontier, and probably the one where the least interesting problem actually lives.

Watch someone use AI in real conditions. They type a prompt, wait, read the response, type another prompt. It's a conversation at the speed of two-way radio. The model behind it can run a thousand threads in parallel at near-zero marginal cost. The human interface collapses all of that capacity down to a single sequential text channel.

The bottleneck isn't intelligence. It's the interface — the control surface between human attention and AI execution. And the control surface is probably the most important unsolved design problem of the next decade.

## What Power Users Actually Do

Look at the people who are unusually effective with AI right now. They aren't writing better prompts. They're running multiple agents in parallel. They know when to intervene and when to let a system run. They switch between observation and control modes instantly. They're conducting, not typing.

This looks suspiciously like a set of skills that already exists — developed, in some cases, by millions of people over thousands of hours — but trained in completely different domains.

Real-time strategy games teach you to manage multiple autonomous units simultaneously, switch rapidly between micro and macro concerns, recognize patterns that require intervention, and allocate resources under time pressure. Trading teaches you to monitor parallel information streams, configure automated systems with constraints, know when to override automation, and operate under uncertainty with incomplete information. Live production — broadcasting, events, air traffic control — teaches you to coordinate multiple systems in real-time, maintain situational awareness across parallel processes, make rapid decisions with cascading consequences, and degrade gracefully when systems fail.

These are all the same skill in different uniforms. The interface changes. The underlying cognitive load — attention allocation across concurrent processes that might need intervention — doesn't.

## The Uncomfortable Hypothesis

The claim is roughly this: the best AI operators might not be engineers or data scientists. They might be people with thousands of hours of StarCraft, or Factorio, or Bloomberg terminals, or broadcast trucks. The industry has a hidden talent pool it doesn't know it has.

The objection is immediate. Games are designed for engagement, not for cognitive load transfer. The patterns might look superficially similar while being completely different under the hood. This is a real concern, and the hypothesis is only worth taking seriously if it's falsifiable.

But if the transfer is real, a lot of hiring and training assumptions are wrong in ways that will take the industry years to notice.

## Attention Is the Scarce Resource

Strip away the novelty. The control surface problem is an attention allocation problem.

AI systems can execute indefinitely. The human who oversees them cannot. Every interface decision is really a question about how to spend a fixed budget of human attention across an unbounded pool of possible things to attend to.

Which of N parallel processes deserves attention right now? How do I maintain context when I switch between them? When is observation useful and when is it pure tax? How does this scale as the number of processes grows?

The answer isn't "more information." Most current AI interfaces already overwhelm attention. The answer is attention direction — interfaces that decide, on your behalf, what deserves your cognitive bandwidth. Less data, better signal.

## What That Actually Looks Like

If this framing is right, the future of AI interfaces looks nothing like a chat box. It looks more like a trading terminal, or — if we're being honest — like an RTS UI.

Parallel process visibility with clear status and intervention affordances. Graduated autonomy controls, so you can tighten or loosen constraints without tearing down the system. Context preservation across interruption, so switching back in doesn't cost you ten minutes of re-reading. Clear signals for when intervention is needed, and smooth transitions between observation and direction.

None of this is novel in its components. All of it exists in other domains. The work is figuring out which patterns transfer and which ones need to be invented from scratch.

## Open Questions

The whole thing is testable. Do gaming and trading skills actually transfer, when measured? What interface patterns scale past two or three concurrent agents? How do you train someone specifically for this? As models get more capable, does the control surface get more or less important?

I don't know, and I think most of the field doesn't either. But we're very clearly at the beginning of figuring out how humans are supposed to operate at the other end of all this — and the StarCraft-to-AI-operator pipeline might sound absurd right up until the point where it obviously isn't.`,
    },
    {
      id: "E-02",
      title: "The Missing Networking Layer",
      subtitle: "We're at the standalone-computer-before-the-internet moment for AI.",
      kind: "Essay",
      date: "July 2025",
      desc: "Agents can't find each other, pay each other, or trust each other. That's what needs to be built.",
      body: `There's an assumption underneath most AI investment that's rarely stated out loud: that the next phase of AI progress will come from smarter individual models. Bigger, more capable, better at more things.

This is probably wrong. Or more precisely — it's probably only part of the story.

TCP/IP didn't make computers smarter. It made them collectively capable of things no single machine could do. The internet isn't a victory of hardware; it's a victory of coordination. Markets don't win by having smarter traders; they win by aggregating information through prices. Cities don't win by having smarter citizens; they win by compressing coordination costs across millions of people.

The analogous phase for AI hasn't happened yet. We still have standalone models, pretending to be agents but unable to find each other, pay each other, or trust each other. The networking layer doesn't exist.

## Four Problems, One Shape

Try to build a non-trivial agent system today and you hit the same four walls in the same order.

Discovery is broken. Your agent needs a PDF-to-markdown service. How does it find one? The answer is "whatever you manually configured," or "whatever centralized registry some human maintains." There's no way for services to announce capabilities, and no way for agents to search by function.

Payment is stuck in human rails. APIs want OAuth tokens and credit card forms because they were designed for humans clicking through sign-up flows. Agents can't click. Per-request micropayments at machine speed barely exist, and where they do, they're not interoperable.

Reputation doesn't propagate. One agent learns that a service is unreliable. Fine. Every other agent in the world still has to learn the same lesson independently, from the same mistakes. There's no shared reputation layer, no trust network, no way for quality signals to travel.

Composition is manual. Complex tasks require multiple agents working together, but there's no protocol for forming temporary teams, splitting payments, coordinating handoffs, or dissolving cleanly when work is done.

These read as four distinct problems until you squint. Then they're all one problem: the coordination layer is missing.

## The Stack Exists in Pieces

The good news is that parts of this stack are being built. The bad news is that nobody is connecting them.

MCP — Anthropic's Model Context Protocol — gives agents a standard way to call tools. It's roughly the USB port of AI. Thousands of servers already exist.

HTTP 402 — the "Payment Required" status code that's been dormant since 1997 — is finally being activated by protocols like x402. Instant stablecoin payments at the HTTP layer. Pay-per-request at machine speed. This is the payment rail agents need, and it's finally appearing.

The discovery layer doesn't exist yet. A permissionless registry where services announce capabilities and agents search by function is the obvious gap. Call it a phone book for the agent economy. Nobody has built one that works.

## What's Actually Hard

Semantic discovery is where I spend the most time thinking. Agents shouldn't search by keywords. They should describe what they need — "convert this PDF to clean markdown" — and receive ranked options that actually match. This is closer to a recommendation problem than a directory problem, and the obvious designs all fail in boring ways.

Reputation is the hardest piece, and the place where most design attention should go. How do quality signals propagate without being captured by incumbents, gamed by coordinated attacks, or collapsed into Goodhart's Law within the first month? On-chain attestations? Usage metrics? Some hybrid? This is genuinely unsolved, and I don't think it's solved by any of the obvious answers.

Flash teams — protocols for forming temporary collaborations among agents, with automated payment splits, clear responsibility allocation, and clean dissolution — are the piece that most resembles existing design patterns. They look a lot like how film crews or construction projects organize: a known pattern, recompiled for machine coordination.

## The Real Question

The standalone-computer-before-the-internet moment for AI is now. Individual models are impressive; network effects haven't kicked in because the infrastructure for them doesn't exist yet.

Will the coordination layer emerge from protocol standardization, market forces, or deliberate design? Probably all three at once. The problems are clear. The solutions aren't. Building in public — in messy, ugly, wrong-first versions — seems like the fastest way to find out which parts of the design are right.`,
    },
    {
      id: "E-03",
      title: "Liquid Talent",
      subtitle: "Full-time employment is a coordination hack disguised as a natural category.",
      kind: "Essay",
      date: "July 2025",
      desc: "What organizations look like when switching costs collapse.",
      body: `Full-time employment is a coordination hack disguised as a natural category. Companies hire people permanently because onboarding is expensive, context is hard to transfer, and trust takes time to build. Long-term employment amortizes those costs across years — it's a financial optimization, not a moral truth.

The instinct to treat employment as the default is old enough that we stopped noticing it was a choice. But if the underlying coordination costs collapse, the optimization collapses with them.

This isn't hypothetical. Handling context is exactly the kind of work AI is getting good at. Maintaining project memory, onboarding a new contributor to a complex codebase instantly, answering the "why was this decision made" question from three years ago — these are tractable problems for systems that can read and synthesize without getting tired.

If the friction of bringing someone new into a project drops toward zero, the whole argument for locking people into one company for years weakens. The question is what happens next.

## Fractional Allocation

There's a pattern already visible at the top of the talent distribution: executives, advisors, independent consultants. These people already work the way everyone else might, eventually.

Instead of selling 100% of their time to a single company, they allocate attention like a portfolio. Some share on a primary engagement. Some share advising other teams on problems they've already solved. Some share in mentorship or knowledge transfer. Some share in pure exploration. The specific percentages matter less than the principle — that time is allocatable by commitment level, not just present or absent.

This works for executives because they're expensive enough that the coordination tax is already amortized. If AI reduces that tax for everyone else, the pattern can flatten down the org chart.

## Gravity-Based Formation

In traditional hiring, companies build roles and fill them. In gravity-based formation, projects emerge around interesting problems and pull in the people who want to work on them. Strong ideas attract talent. Weak ideas don't.

Open source already works this way. The novel part is adding economic participation — making gravity-based teams something you can actually make a living in, not just a hobby. That's not a technical problem. It's an institutional one, and institutions move slowly.

## Compound Knowledge Systems

The biggest hidden cost of turnover isn't hiring; it's lost context. When someone leaves, their reasoning, their context, their implicit understanding of why decisions were made — all of it walks out the door with them.

AI systems that capture not just what was decided but why could invert this. New contributors inherit accumulated wisdom instead of starting from scratch. Knowledge compounds across contributors rather than evaporating at each transition. The organization starts to look less like a collection of individuals and more like a persistent substrate that people move through.

## Where This Doesn't Work

It's important to be honest about scope. Fluid organizations work where switching costs are dominant and where AI can actually reduce them. That's not everywhere.

Software, content, design, research, strategy — places where the work is mostly thinking and communicating, and AI can meaningfully offload execution. This is where fluid patterns look obvious in retrospect.

Physical work, deep relationship work (some sales, leadership, therapy), regulated roles where licenses don't come in fractions, tacit knowledge that refuses to be articulated — these don't adapt the same way. Some of them never will. Some of them will, but only when AI's capabilities shift in ways that are hard to predict.

The scope expands over time. But today, the constraint is real.

## The Unsolved Economic Problems

Fluid talent breaks equity models. Current equity assumes lock-in — you earn a stake because you're committed for years. If five contributors each put in twenty percent of the work, how do they share ownership? Current answers don't exist. Token-based systems hint at an answer, but they also enable instant value capture, which tends to reward short-term thinking over long-term commitment. That tension isn't resolved.

There's also a risk distribution problem. Employment trades autonomy for stability. Fluid contribution trades stability for autonomy. Not everyone wants that trade, and nobody should be forced into it. Safety nets — health insurance, retirement, family support — were built around employment. They would need to be rebuilt or replaced. That rebuilding is a real political project, not a mechanism design exercise.

## Who This Actually Fits

This isn't for everyone, and it shouldn't be. Some people genuinely need clear reporting structures, defined expectations, predictable schedules, and explicit permission to explore. That's not a failure of imagination. It's a different set of needs for different kinds of people.

Fluid patterns fit people who naturally work on multiple projects, get energy from variety, have strong self-direction, and value autonomy over stability. These are personality traits and life circumstances, not hierarchical achievements. Fluid talent isn't a promotion. It's a preference.

## Open Questions

How much do AI tools actually reduce coordination costs in practice, measured against real benchmarks? Which work types adapt to fluid structures and which resist? Can we build economic mechanisms that make fluid contribution sustainable without collapsing into short-termism? How do laws and social norms — both of which were built around employment — adapt to work that refuses the employment shape?

These are possibilities, not predictions. The actual shape of future organizations will emerge from experiments that haven't been run yet, not from essays that anticipate them.`,
    },
    {
      id: "E-04",
      title: "Speculative Coordination",
      subtitle: "Memecoins coordinate better than most DAOs. That fact is worth sitting with.",
      kind: "Essay",
      date: "July 2025",
      desc: "On channeling memecoin energy into actual work.",
      body: `Memecoins are dumb. This is easy to say and mostly true. They're also the single most effective coordination mechanism crypto has produced, and sitting with that fact is uncomfortable in a way that's worth taking seriously.

Billions of dollars flow through markets for shared symbols. Most of it is speculative noise — people betting on who else will bet. But the underlying primitive — liquid markets for community membership — might be something real. And if it is, then writing off the whole category as frivolous is the kind of category error that tends to age badly.

The question isn't whether memecoins are serious. It's whether this coordination capacity can be channeled toward something productive — and if so, how.

## What's Actually Happening

The numbers are harder to dismiss than the aesthetics suggest. Peak daily volume hits three to five hundred million dollars. Tokens launch in about sixty seconds. Millions of people participate globally. Institutional involvement is minimal to nonexistent.

No product roadmaps. No venture capital. No business development. Just shared symbols and aligned financial incentives — and the coordination capacity is real, and it happened without permission.

Strip the noise and what memecoins do is create liquid markets for community membership. That's the primitive.

Traditional community formation works through application or invitation; commitment demonstrated through time investment; status earned through contribution history; exits that are social rather than financial. Token-based community formation works through purchase (instant); commitment demonstrated through holding; status through size and cost basis; exits that are liquid and immediate.

Neither is strictly better. Token-based formation trades depth for speed. The interesting question is whether depth can be added after the initial formation.

## The Examples That Don't Get Talked About

Most memecoin communities stay purely speculative forever. But a handful have evolved into something else, and those cases deserve more attention than the failures usually get.

BONK launched during Solana's post-FTX collapse — the lowest possible moment. The token's community airdrop helped re-engage a developer ecosystem that had largely packed up and left. Correlation isn't causation, but the timing is suggestive: meme-driven attention can have real network effects on ecosystems that need them.

ConstitutionDAO mobilized forty-seven million dollars in seventy-two hours to bid on a rare copy of the US Constitution. They failed to win. But the capacity to aggregate that much real capital toward a specific, bounded objective in three days, with no institutional backing, is not a small thing. Nothing else has ever done it at that speed.

Dogecoin — the original joke — funded the Jamaican bobsled team, a NASCAR sponsorship, and water wells in Kenya, entirely through emergent community coordination. The scale was small. The existence of the coordination wasn't.

These are exceptions, and dismissing them as exceptions is easier than taking the pattern seriously. But exceptions reveal mechanism, and the mechanism here is specifically the interesting part: when the coordination is already happening, can it be bent toward outcomes that survive the end of speculation?

## Why the Usual Attempts Fail

Every attempt to harness this energy has failed in roughly the same way. Charity tokens rely on goodwill, which doesn't scale — people stop caring. Governance tokens collapse into political theater with three percent turnout. Utility tokens manufacture demand for things nobody wanted. The pattern is always the same: an attempt to staple purpose onto speculation that was never actually speculative about that purpose.

The question isn't whether these communities can be useful. The question is whether speculation and building can be mechanically linked — not gestured at, not rhetorically bundled, but structurally wired together so that they produce the same motion.

## The Mechanism

The default pattern is extractive. Trading generates fees, fees go to the protocol or LPs, and participants exit. Value moves around; nothing gets created.

Insert a split before the exit. Fees fan out into two pools: a treasury that funds missions, and a reward pool that compensates contributors. Work gets completed. KPIs verify. Supply burns. Reduced supply becomes a price signal, which draws more trading, which funds more work.

None of these pieces is novel in isolation. Treasuries fund things. Bounty systems pay for work. Burns have been a deflationary lever since the first token. What's different is the composition: each part only works in relation to the others.

The configurability matters more than it looks. A community project routes everything to contributors. An organization with runway needs biases toward treasury. The flexibility isn't cosmetic — it's what keeps the pattern from breaking on contact with actual cases.

The critical detail is in the burns. They happen when real things get accomplished — not on arbitrary schedules, not after governance votes. Verifiable achievements trigger automatic supply reduction. For the first time, the speculator and the builder want the same thing: the project to actually succeed. No more misaligned incentives. No more parallel games.

## What This Can Handle

Not every mission is fundable this way. To work, a mission needs measurable objectives, verifiability (ideally on-chain), genuine alignment with the community's interests, and some path to sustainability past the launch window.

Community missions — open-source tooling, content, community infrastructure — fit naturally. Research missions can work if you accept dissemination as a proxy for impact. Infrastructure missions, the tricky ones, need ongoing maintenance rather than one-shot delivery. The oracle problem — making real-world work verifiable on-chain — is solvable, but adds complexity that early experiments will underestimate.

## The Learning Layer

Static systems calcify. The interesting version of this framework isn't the one that ships in the first month — it's the one that accumulates data and improves.

Fee ratios, reward curves, contributor matching, mission design: all of these are hyperparameters. Every completed mission generates signal about what works. With enough data, the mechanism tunes its own parameters. It gets smarter over time instead of freezing at launch.

That's the real bet hiding inside the design. Not governance voting on every parameter. Not immutable smart contracts. Coordination infrastructure that learns.

## The Limitations Are Real

It's tempting to only tell the hopeful part of this story, but that would be a lie. The space is a mess.

Bots manipulate launches. Liquidity pools get exploited. MEV extractors feed on retail traders. Smart contract bugs eat funds at regular intervals. Influencers manipulate prices with asymmetric information. Short-term optimization dominates. Most participants lose money. This is not a bug in the current structure — it's a load-bearing feature.

Any attempt to use these markets as coordination infrastructure has to grapple with this seriously, not work around it rhetorically. Infrastructure that only works in the absence of adversarial behavior is not actually infrastructure.

That said, the underlying tech has improved meaningfully. Each generation of market structure has fixed problems the last one exposed: basic AMM pools, then liquidity locks and audits, then fair launches and anti-bot measures, now bonding curves and graduated liquidity. The trajectory is real, even if the destination isn't clear yet.

## The Questions That Matter

This is a bet, not a proven system. The theory reads clean. Reality resists clean theories.

Do aligned incentives actually produce good work, or do they produce people good at gaming the measurement? Can KPI verification hold up at scale against coordinated manipulation? Which mission types have economics that actually close, and which are fundamentally sinks? How much speculation does it take to fund something real? Can coordination energy survive after the speculation cools?

None of these have theoretical answers. The framework needs testing in the wild. That's the only way to find out which parts are load-bearing and which parts I got wrong.`,
    },
    {
      id: "E-05",
      title: "BLOOM",
      subtitle: "A marketplace for fast ZK proofs on Solana.",
      kind: "Technical",
      date: "July 2025",
      desc: "Turning validator GPUs into proof-generation infrastructure.",
      body: `Zero-knowledge proofs promise privacy and scalability — the two properties blockchains keep failing to deliver together. On paper, they work. In practice, they split into two worlds, and only one of them is useful.

Simple proofs are solved. State compression, basic merkle proofs, signature verification — these prove in five to fifteen milliseconds, cheap to verify on-chain. They work. Nobody's complaining.

Complex proofs are blocked. The applications that would most benefit from ZK — private DeFi, hidden-information games, confidential voting, verifiable ML — require circuits with millions of constraints. Current proving time: ten to thirty-plus seconds on a CPU. That's not interactive. That's not a product. That's a research demo.

The irony is exact. The applications that would most benefit from zero-knowledge are exactly the ones blocked by proving latency. Fix proving speed, and a whole category becomes possible.

## The Proposal

Solana validators already run beefy hardware. Running a validator is a serious infrastructure commitment — high-memory servers, fast networking, significant stake as collateral. Adding a GPU is a marginal expense on top of that. And GPUs can cut ZK proving latency from thirty seconds to under one.

BLOOM is a marketplace where applications buy proof generation from validators with GPUs.

The pitch to validators is simple. You already have the hardware. You already have stake. Add a GPU, register the circuits you can prove, and earn fees for each proof generated. Extra revenue stream. Marginal hardware cost. The existing security model extends naturally.

The pitch to applications is also simple. You send witness data to a validator — a few kilobytes. The validator generates a Groth16 proof on GPU in a few hundred milliseconds, returns the 128-byte proof, you submit to chain, on-chain verification takes around 180k compute units. Total latency: under a second instead of thirty. The difference between "research demo" and "actual product."

## The Trust Model

This only works if you trust validators not to generate invalid proofs. Fortunately, you don't have to.

Validators stake collateral. Invalid proofs get caught by on-chain verification — they always do, because that's the point of ZK. Slash the stake when verification fails. The system is permissionless because the verification step is itself the trust anchor.

For applications that want more safety, redundantly prove across multiple validators. Compare outputs. Submit only if they agree. More cost, fewer surprises.

The benchmarks are encouraging. ICICLE (NVIDIA's ZK acceleration library) hits 120–250ms for circuits with a million constraints on an RTX 4090. A million constraints is enough for real applications: private transfers, private auctions, some categories of verifiable ML inference. Sub-second latency changes what's possible.

## The Economics, Roughly

Back-of-envelope for a validator running a 4090:

Hardware cost around $1,600. Power draw 450W. Assuming reasonable utilization and current energy prices, net of electricity: roughly $200/day. Capacity at 0.0001 SOL per proof and roughly 40,000 proofs per day at full utilization, at SOL around $190: gross revenue of roughly $760/day. Hardware payback in about eight days at full utilization.

These numbers all assume demand exists. That's the big assumption. Infrastructure without applications is just expensive hardware. The whole thing depends on whether there's enough demand for complex ZK applications to sustain the infrastructure, and that demand is still mostly theoretical.

If the demand materializes, the incentives align cleanly: validators earn, applications get fast proofs, the ecosystem gets capabilities it didn't have. If the demand doesn't materialize, this is a solution in search of a problem — which is the failure mode a lot of crypto infrastructure has.

## The Hard Questions

Why Groth16 and not STARKs or PLONK? STARKs have nicer properties — no trusted setup, post-quantum security — but no native Solana precompiles, larger proofs, more expensive verification. PLONK has some of the same issues. Until Solana adds syscalls for them, Groth16 is the practical choice. This is a pragmatic decision that might age badly, but it's the right one for the current chain.

What about 40GB proving keys for large circuits? They're a one-time cost per circuit, distributed via P2P or prebuilt containers. Setup takes fifteen minutes. Annoying, not prohibitive. Universal setups might help eventually; right now they don't.

Will anyone actually use this? Honest answer: I don't know. The bottleneck clearly exists. The technical solution clearly works. Whether there's enough demand for complex ZK applications to justify the infrastructure is the unresolved question, and no amount of design gets around needing to find out.

## Where This Goes

BLOOM is one design for solving the ZK proving bottleneck. The components all exist — GPUs, validators with real stake, on-chain verification, the tooling for Groth16. The question is whether anyone needs what this unlocks enough to pay for it.

This is a starting point, not a finished design. The economics need more work. The validator-facing tooling needs more work. The specific circuits worth targeting first are unclear. Poke holes. Tell me what's wrong.`,
    },
  ],

  // Notable third-party coverage.
  press: [
    {
      id: "PR-01",
      title: "Crypto Traders Flee to Prediction Bets After $150 Billion Crash",
      source: "Bloomberg",
      date: "Jan 2026",
      url: "https://www.bloomberg.com/news/articles/2026-01-26/crypto-traders-flee-to-prediction-bets-after-150-billion-crash",
      blurb: "Feature on crypto natives pivoting to prediction markets — quoted on building HumanPlane.",
    },
    {
      id: "PR-02",
      title: "A New Way to Spot Tremors in Prediction Markets",
      source: "Business Insider",
      date: "Sep 2025",
      url: "https://www.businessinsider.com/polymarket-spot-tremors-prediction-markets-ai-2025-9",
      blurb: "Standalone piece on tremor.live spotting insider moves via sudden odds swings.",
    },
    {
      id: "PR-03",
      title: "Inside the Gig Economy Built for AI: Moltlaunch",
      source: "The AI Journal",
      date: "Feb 2026",
      url: "https://aijourn.com/inside-the-gig-economy-built-for-ai-moltlaunch/",
      blurb: "Feature framing Moltlaunch as Upwork for AI agents — cites 21K+ ERC-8004 agents, 70% on Base.",
    },
    {
      id: "PR-04",
      title: "Bankai: Kilobyte-Scale Patches for 1-Bit LLMs via XOR Adaptation",
      source: "Shanghai NYU RITS",
      date: "Apr 2026",
      url: "https://rits.shanghai.nyu.edu/ai/bankai-kilobyte-scale-patches-for-1-bit-llms-via-xor-adaptation",
      blurb: "Academic pickup — Shanghai NYU research institute summary of the bankai paper.",
    },
    {
      id: "PR-05",
      title: "Prediction Market Interest Soars as Crypto Sector Cools",
      source: "PYMNTS",
      date: "Jan 2026",
      url: "https://www.pymnts.com/news/investment-tracker/2026/prediction-market-interest-soars-as-crypto-sector-cools/",
      blurb: "Covers the ex-crypto builder angle and HumanPlane as a research tool.",
    },
  ],

  links: [
    { label: "github",      href: "https://github.com/nikshepsvn",  handle: "@nikshepsvn" },
    { label: "x / twitter", href: "https://twitter.com/nikshepsvn", handle: "@nikshepsvn" },
    { label: "sculpt",      href: "https://sculpt.fun",             handle: "sculpt.fun" },
    { label: "email",       href: "mailto:nikshepsvn@gmail.com",    handle: "nikshepsvn@gmail.com" },
  ],

  colophon: {
    typography: ["JetBrains Mono", "Inter"],
    render: "WebGL fragment shader — FBM topographic contour field",
    source: "content.js",
  },
};
