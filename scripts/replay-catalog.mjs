const SHORT_ID_PATTERN = /`([0-9a-f]{8})…`/g;

function decodeHtmlEntities(text) {
  return text
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"');
}

function stripMarkdownLinks(text) {
  return text.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1");
}

function normalizeVisibility(value) {
  const normalized = value.trim().toLowerCase();
  if (!normalized) {
    return "publishable";
  }
  if (normalized === "hide" || normalized === "hidden") {
    return "private";
  }
  throw new Error(`Unknown visibility value: ${value}`);
}

export function parseCatalog(markdown) {
  const entries = [];

  for (const line of markdown.split("\n")) {
    if (!line.startsWith("| ")) {
      continue;
    }
    if (line.startsWith("| Start (UTC)") || line.startsWith("| ---")) {
      continue;
    }

    const cells = line
      .slice(1, -1)
      .split("|")
      .map((cell) => cell.trim());
    if (cells.length !== 7) {
      throw new Error(`Expected 7 table cells, got ${cells.length}: ${line}`);
    }

    const [startUtc, endUtc, fileCell, source, visibility, bookmarks, summary] =
      cells;
    const shortIds = [...fileCell.matchAll(SHORT_ID_PATTERN)].map(
      (match) => match[1],
    );
    if (shortIds.length === 0) {
      throw new Error(`No session IDs found in row: ${line}`);
    }

    const visibilityState = normalizeVisibility(visibility);
    for (const shortId of shortIds) {
      entries.push({
        shortId,
        startUtc,
        endUtc,
        source,
        visibility: visibilityState,
        publishable: visibilityState === "publishable",
        bookmarks: stripMarkdownLinks(decodeHtmlEntities(bookmarks)),
        summary: stripMarkdownLinks(decodeHtmlEntities(summary)),
      });
    }
  }

  return entries;
}

export function resolveCatalog(entries, transcriptFiles) {
  return entries.map((entry) => {
    const matches = transcriptFiles.filter((filename) =>
      filename.replace(/\.jsonl$/, "").startsWith(entry.shortId),
    );
    if (matches.length === 0) {
      throw new Error(`No transcript file for short ID ${entry.shortId}`);
    }
    if (matches.length > 1) {
      throw new Error(
        `Ambiguous transcript file for short ID ${entry.shortId}: ${matches.join(", ")}`,
      );
    }

    const filename = matches[0];
    return {
      ...entry,
      id: filename.replace(/\.jsonl$/, ""),
      filename,
    };
  });
}

export function orderForGallery(entries, featuredIds) {
  const featuredSet = new Set(featuredIds);
  const featured = entries.filter((entry) => featuredSet.has(entry.id));
  const others = entries.filter((entry) => !featuredSet.has(entry.id));
  return [...featured, ...others];
}

export function publishableSessions(entries) {
  return entries.filter((entry) => entry.publishable);
}
