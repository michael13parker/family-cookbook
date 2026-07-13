import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";
import {
  orderForGallery,
  parseCatalog,
  publishableSessions,
  resolveCatalog,
} from "../scripts/replay-catalog.mjs";

const sampleMarkdown = `
| Start (UTC) | End | File | Source | Visibility | Bookmarks | Summary |
| --- | --- | --- | --- | --- | --- | --- |
| 07-09 16:30 | 18:41 | \`4d01476d…\` | Claude Code |  | requirements session | Requirements work |
| 07-09 18:27 | 16:00 | \`893d1ee6…\` | Claude Code | hide | build session | Build work |
| 07-10 17:54 | — | \`518b8197…\` | Cursor | hidden | bug log | Bug log work |
`;

test("parseCatalog splits publishable and private rows", () => {
  const entries = parseCatalog(sampleMarkdown);
  assert.equal(publishableSessions(entries).length, 1);
  assert.equal(entries.filter((entry) => !entry.publishable).length, 2);
});

test("parseCatalog rejects unknown visibility values", () => {
  const markdown = sampleMarkdown.replace("hide", "maybe");
  assert.throws(() => parseCatalog(markdown), /Unknown visibility/);
});

test("parseCatalog rejects malformed row width", () => {
  const markdown = `${sampleMarkdown}\n| one | two |`;
  assert.throws(() => parseCatalog(markdown), /Expected 7 table cells/);
});

test("orderForGallery keeps featured sessions first in chronological order", () => {
  const items = [
    { id: "requirements-id", startUtc: "07-09 16:30" },
    { id: "build-id", startUtc: "07-09 18:27" },
    { id: "other-id", startUtc: "07-10 17:54" },
  ];
  assert.deepEqual(
    orderForGallery(items, ["build-id", "requirements-id"]).map(
      (item) => item.id,
    ),
    ["requirements-id", "build-id", "other-id"],
  );
});

test("resolveCatalog maps short IDs uniquely", () => {
  const entries = parseCatalog(sampleMarkdown).filter((entry) => entry.publishable);
  const resolved = resolveCatalog(entries, [
    "4d01476d-e1af-468e-9a1e-019cb740c98f.jsonl",
  ]);
  assert.equal(resolved[0].id, "4d01476d-e1af-468e-9a1e-019cb740c98f");
});

test("resolveCatalog rejects ambiguous and missing matches", () => {
  const entry = parseCatalog(sampleMarkdown)[0];
  assert.throws(
    () => resolveCatalog([entry], []),
    /No transcript file/,
  );
  assert.throws(
    () =>
      resolveCatalog([entry], [
        "4d01476d-e1af-468e-9a1e-019cb740c98f.jsonl",
        "4d01476d-aaaa-aaaa-aaaa-aaaaaaaaaaaa.jsonl",
      ]),
    /Ambiguous transcript file/,
  );
});

test("parseCatalog reads the live archive index", () => {
  const markdown = readFileSync(
    join("session-transcripts", "README.md"),
    "utf8",
  );
  const entries = parseCatalog(markdown);
  assert.equal(entries.length, 28);
  assert.equal(publishableSessions(entries).length, 13);
});
