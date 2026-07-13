import { execFileSync } from "node:child_process";
import {
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { join, resolve } from "node:path";
import {
  orderForGallery,
  parseCatalog,
  publishableSessions,
  resolveCatalog,
} from "./replay-catalog.mjs";

function escapeHtml(value) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function cardTitle(session) {
  return session.bookmarks.trim() || session.summary.trim();
}

function formatDateLabel(session) {
  if (session.startUtc === "—") {
    return "Undated";
  }
  return session.startUtc;
}

function sourceLogoMarkup(source) {
  if (source === "Claude Code") {
    return `<span class="source-logo claude" title="Claude Code" aria-hidden="true">✳</span>`;
  }
  return `<span class="source-logo cursor" title="Cursor" aria-hidden="true"><svg viewBox="0 0 24 24" width="18" height="18"><path fill="currentColor" d="M4 3l16 9-8 2-4 7L4 3zm4.2 4.5l1.3 8.2 1.5-2.7 3.2-.8-6-4.7z"/></svg></span>`;
}

function renderCard(session, featured) {
  const title = escapeHtml(cardTitle(session));
  const summary = escapeHtml(session.summary);
  const star = featured ? '<span class="star">★</span> ' : "";
  return `<article class="card" data-source="${escapeHtml(session.source)}">
  <div class="card-meta">${escapeHtml(session.source)} · ${escapeHtml(formatDateLabel(session))}</div>
  <h3>${star}${title}</h3>
  <p>${summary}</p>
  <div class="card-footer">
    <a class="card-link" href="sessions/${escapeHtml(session.id)}.html">Open replay →</a>
    ${sourceLogoMarkup(session.source)}
  </div>
</article>`;
}

export function expectedReplayIds(sessions) {
  return sessions.map((session) => session.id).sort();
}

export function renderGallery({ title, sessions, featuredIds }) {
  const featuredSet = new Set(featuredIds);
  const ordered = orderForGallery(sessions, featuredIds);
  const featured = ordered.filter((session) => featuredSet.has(session.id));
  const others = ordered.filter((session) => !featuredSet.has(session.id));
  const claudeCount = sessions.filter((session) => session.source === "Claude Code")
    .length;
  const cursorCount = sessions.filter((session) => session.source === "Cursor")
    .length;

  const featuredCards = featured
    .map((session) => renderCard(session, true))
    .join("\n");
  const otherCards = others.map((session) => renderCard(session, false)).join("\n");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(title)}</title>
  <style>
    :root {
      color-scheme: dark;
      --bg: #0f1117;
      --surface: #171a22;
      --border: #2a3140;
      --text: #e8ecf3;
      --muted: #9aa6bd;
      --accent: #6ea8ff;
      --star: #f5b942;
      --claude: #d97757;
      --cursor: #111111;
    }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      font-family: Inter, system-ui, sans-serif;
      background: var(--bg);
      color: var(--text);
      line-height: 1.5;
    }
    main {
      max-width: 1100px;
      margin: 0 auto;
      padding: 40px 24px 64px;
    }
    h1 { margin: 0 0 8px; font-size: 2rem; }
    .subtitle { color: var(--muted); margin: 0 0 28px; }
    .stats {
      display: flex;
      gap: 12px;
      flex-wrap: wrap;
      margin-bottom: 28px;
    }
    .stat {
      border: 1px solid var(--border);
      border-radius: 10px;
      padding: 12px 16px;
      background: var(--surface);
    }
    .stat-label {
      color: var(--muted);
      font-size: 0.75rem;
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }
    .stat strong { display: block; font-size: 1.4rem; margin-top: 4px; }
    h2 {
      display: flex;
      align-items: center;
      gap: 8px;
      margin: 0 0 16px;
      font-size: 1.1rem;
    }
    .section { margin-bottom: 32px; }
    .cards {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 16px;
    }
    .card {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 14px;
      padding: 18px;
      display: flex;
      flex-direction: column;
      min-height: 220px;
    }
    .card-meta {
      color: var(--muted);
      font-size: 0.85rem;
      margin-bottom: 8px;
    }
    .card h3 {
      margin: 0 0 10px;
      font-size: 1.05rem;
      line-height: 1.35;
    }
    .card p {
      margin: 0;
      color: var(--muted);
      font-size: 0.92rem;
      flex: 1;
    }
    .card-footer {
      margin-top: 18px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 12px;
    }
    .card-link {
      color: var(--accent);
      text-decoration: none;
      font-weight: 600;
    }
    .card-link:hover { text-decoration: underline; }
    .star { color: var(--star); }
    .source-logo {
      width: 34px;
      height: 34px;
      border-radius: 9px;
      display: grid;
      place-items: center;
      flex-shrink: 0;
    }
    .source-logo.claude {
      background: var(--claude);
      color: white;
      font-size: 1.3rem;
      font-weight: 700;
    }
    .source-logo.cursor {
      background: var(--cursor);
      color: white;
    }
  </style>
</head>
<body>
  <main>
    <h1>${escapeHtml(title)}</h1>
    <p class="subtitle">Visible sessions become individual, self-contained replays.</p>
    <div class="stats">
      <div class="stat">
        <div class="stat-label">Published sessions</div>
        <strong>${sessions.length}</strong>
      </div>
      <div class="stat">
        <div class="stat-label">Sources</div>
        <strong>${claudeCount} Claude Code · ${cursorCount} Cursor</strong>
      </div>
    </div>
    <section class="section">
      <h2><span class="star">★</span> Featured sessions</h2>
      <div class="cards">${featuredCards}</div>
    </section>
    <section class="section">
      <h2>All other sessions</h2>
      <div class="cards">${otherCards}</div>
    </section>
  </main>
</body>
</html>`;
}

function claudeReplayBin(rootDir) {
  return join(rootDir, "node_modules", ".bin", "claude-replay");
}

export function buildReplays({
  rootDir = process.cwd(),
  configPath = "replay.config.json",
  catalogPath = join("session-transcripts", "README.md"),
  outputDir = "replays",
} = {}) {
  const config = JSON.parse(readFileSync(join(rootDir, configPath), "utf8"));
  const catalogMarkdown = readFileSync(join(rootDir, catalogPath), "utf8");
  const transcriptDir = join(rootDir, "session-transcripts");
  const transcriptFiles = readdirSync(transcriptDir).filter((name) =>
    name.endsWith(".jsonl"),
  );

  const allEntries = parseCatalog(catalogMarkdown);
  const sessions = resolveCatalog(
    publishableSessions(allEntries),
    transcriptFiles,
  );
  const ordered = orderForGallery(sessions, config.featuredSessionIds);
  const sessionsDir = join(rootDir, outputDir, "sessions");
  const replayCli = claudeReplayBin(rootDir);

  if (!existsSync(replayCli)) {
    throw new Error("claude-replay is not installed. Run npm install first.");
  }

  rmSync(sessionsDir, { recursive: true, force: true });
  mkdirSync(sessionsDir, { recursive: true });

  for (const session of ordered) {
    const inputPath = join(transcriptDir, session.filename);
    const outputPath = join(sessionsDir, `${session.id}.html`);
    const timing = session.source === "Cursor" ? "paced" : "auto";
    execFileSync(
      replayCli,
      [inputPath, "-o", outputPath, "--timing", timing],
      { cwd: rootDir, stdio: "inherit" },
    );
  }

  const generatedIds = readdirSync(sessionsDir)
    .filter((name) => name.endsWith(".html"))
    .map((name) => name.replace(/\.html$/, ""))
    .sort();
  const expectedIds = expectedReplayIds(ordered);
  if (generatedIds.join(",") !== expectedIds.join(",")) {
    throw new Error(
      `Replay output mismatch. Expected ${expectedIds.length}, got ${generatedIds.length}`,
    );
  }

  const galleryHtml = renderGallery({
    title: config.title,
    sessions: ordered,
    featuredIds: config.featuredSessionIds,
  });
  writeFileSync(join(rootDir, outputDir, "index.html"), galleryHtml, "utf8");

  return { sessionCount: ordered.length, outputDir: join(rootDir, outputDir) };
}

if (import.meta.url === new URL(process.argv[1], "file:").href) {
  const result = buildReplays({ rootDir: resolve() });
  console.log(`Built ${result.sessionCount} replays in ${result.outputDir}`);
}
