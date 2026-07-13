import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { join, resolve } from "node:path";

const EMAIL_PATTERN =
  /(?<![A-Za-z0-9._%+-])([A-Za-z0-9._%+-]+)@([A-Za-z0-9.-]+\.[A-Za-z]{2,})/g;

const UUID_PATTERN =
  /\b([0-9A-Fa-f]{8})-([0-9A-Fa-f]{4})-([0-9A-Fa-f]{4})-([0-9A-Fa-f]{4})-([0-9A-Fa-f]{12})\b/g;

const UUID_EXACT_PATTERN =
  /^[0-9A-Fa-f]{8}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{12}$/;

const HOME_PATH_PATTERN = /\/Users\/[A-Za-z0-9._-]+(?=\/)/g;

export function maskEmails(text) {
  return text.replace(EMAIL_PATTERN, (match, local, domain) => {
    if (local === "****") {
      return match;
    }
    return `****@${domain}`;
  });
}

export function maskUuids(text) {
  return text.replace(
    UUID_PATTERN,
    (match, first, _second, _third, _fourth, last, offset, full) => {
      const prefix = full.slice(Math.max(0, offset - 13), offset);
      if (prefix.endsWith("message-guid=")) {
        return match;
      }
      return `${first}-****-****-****-${last}`;
    },
  );
}

export function maskHomePaths(text) {
  return text.replace(HOME_PATH_PATTERN, "/Users/****");
}

const PRESERVE_UUID_KEYS = new Set([
  "uuid",
  "sessionId",
  "session_id",
  "parentUuid",
  "promptId",
  "tool_use_id",
  "sourceToolAssistantUUID",
]);

export function maskSensitiveText(text) {
  return maskHomePaths(maskUuids(maskEmails(text)));
}

function shouldPreserveUuid(key, value) {
  return (
    PRESERVE_UUID_KEYS.has(key) &&
    typeof value === "string" &&
    UUID_EXACT_PATTERN.test(value)
  );
}

function maskJsonValue(value, key = "") {
  if (typeof value === "string") {
    if (shouldPreserveUuid(key, value)) {
      return value;
    }
    return maskSensitiveText(value);
  }
  if (Array.isArray(value)) {
    return value.map((item) => maskJsonValue(item));
  }
  if (value && typeof value === "object") {
    return maskJsonObject(value);
  }
  return value;
}

function maskJsonObject(object) {
  const masked = {};
  for (const [key, value] of Object.entries(object)) {
    const maskedKey = maskSensitiveText(key);
    masked[maskedKey] = maskJsonValue(value, key);
  }
  return masked;
}

export function maskJsonlContent(content) {
  const lines = content.split("\n");
  const maskedLines = [];

  for (const line of lines) {
    if (!line.trim()) {
      maskedLines.push(line);
      continue;
    }
    const parsed = JSON.parse(line);
    maskedLines.push(JSON.stringify(maskJsonObject(parsed)));
  }

  return maskedLines.join("\n");
}

export function findUnmaskedEmails(text) {
  const matches = [];
  for (const match of text.matchAll(EMAIL_PATTERN)) {
    const local = match[1];
    if (local !== "****") {
      matches.push(match[0]);
    }
  }
  return matches;
}

export function maskJsonlFile(sourcePath, destinationPath = sourcePath) {
  const content = readFileSync(sourcePath, "utf8");
  const masked = maskJsonlContent(content);
  const unmasked = findUnmaskedEmails(masked);
  if (unmasked.length > 0) {
    throw new Error(
      `Unmasked emails remain in ${sourcePath}: ${unmasked.slice(0, 3).join(", ")}`,
    );
  }
  writeFileSync(destinationPath, masked, "utf8");
}

function main() {
  const archiveDir = resolve("session-transcripts");
  const files = readdirSync(archiveDir).filter((name) => name.endsWith(".jsonl"));

  for (const file of files) {
    const path = join(archiveDir, file);
    maskJsonlFile(path);
    console.log(`masked ${file}`);
  }
}

if (import.meta.url === new URL(process.argv[1], "file:").href) {
  main();
}
