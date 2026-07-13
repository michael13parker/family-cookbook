import assert from "node:assert/strict";
import test from "node:test";
import {
  expectedReplayIds,
  renderGallery,
} from "../scripts/build-replays.mjs";

const sessions = [
  {
    id: "4d01476d-e1af-468e-9a1e-019cb740c98f",
    startUtc: "07-09 16:30",
    source: "Claude Code",
    bookmarks: "requirements session",
    summary: "Requirements interview and ratings schema.",
    publishable: true,
  },
  {
    id: "893d1ee6-7032-470a-b83a-918e37db5fcf",
    startUtc: "07-09 18:27",
    source: "Claude Code",
    bookmarks: "build session",
    summary: "Phase 1 build and Google Docs pivot.",
    publishable: true,
  },
  {
    id: "518b8197-79de-48cc-b48b-779fb99c85bf",
    startUtc: "07-10 17:54",
    source: "Cursor",
    bookmarks: "add to bug log, Bugs 001–005",
    summary: "Log the example-recipe issue.",
    publishable: true,
  },
];

test("renderGallery highlights featured sessions in chronological order", () => {
  const html = renderGallery({
    title: "Family Cookbook — Build Session Replays",
    sessions,
    featuredIds: [
      "893d1ee6-7032-470a-b83a-918e37db5fcf",
      "4d01476d-e1af-468e-9a1e-019cb740c98f",
      "518b8197-79de-48cc-b48b-779fb99c85bf",
    ],
  });

  assert.match(html, /requirements session/);
  assert.match(html, /build session/);
  assert.ok(html.indexOf("requirements session") < html.indexOf("build session"));
  assert.match(html, /data-source="Claude Code"/);
  assert.match(html, /data-source="Cursor"/);
  assert.match(html, /class="source-logo claude"/);
  assert.match(html, /class="source-logo cursor"/);
  assert.match(html, /sessions\/4d01476d-e1af-468e-9a1e-019cb740c98f\.html/);
  assert.doesNotMatch(html, /Private sessions/);
  assert.doesNotMatch(html, /hidden-session-id/);
});

test("expectedReplayIds returns sorted publishable IDs", () => {
  assert.deepEqual(expectedReplayIds(sessions), [
    "4d01476d-e1af-468e-9a1e-019cb740c98f",
    "518b8197-79de-48cc-b48b-779fb99c85bf",
    "893d1ee6-7032-470a-b83a-918e37db5fcf",
  ]);
});
