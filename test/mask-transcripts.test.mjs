import assert from "node:assert/strict";
import test from "node:test";
import {
  findUnmaskedEmails,
  maskEmails,
  maskHomePaths,
  maskJsonlContent,
  maskSensitiveText,
  maskUuids,
} from "../scripts/mask-transcripts.mjs";

test("maskEmails replaces local part with **** and keeps domain", () => {
  assert.equal(
    maskEmails("Owner: person.name+tag@gmail.com"),
    "Owner: ****@gmail.com",
  );
  assert.equal(maskEmails("Event: abc123@google.com"), "Event: ****@google.com");
  assert.equal(
    maskEmails("Calendar (laneymichaelparker@gmail.com)"),
    "Calendar (****@gmail.com)",
  );
  assert.equal(maskEmails("No email here"), "No email here");
  assert.equal(
    maskEmails("Already masked ****@gmail.com"),
    "Already masked ****@gmail.com",
  );
});

test("maskUuids keeps first and last segments visible", () => {
  assert.equal(
    maskUuids("ID: A0D48476-00B9-4520-8890-97324033BA29"),
    "ID: A0D48476-****-****-****-97324033BA29",
  );
});

test("maskHomePaths hides macOS username", () => {
  assert.equal(
    maskHomePaths("/Users/michaelparker/Documents/working_folders"),
    "/Users/****/Documents/working_folders",
  );
});

test("maskSensitiveText leaves message GUIDs unchanged", () => {
  const guid =
    "messages://open?message-guid=AF4E7EB4-20E2-F2A0-8B05-7B8BEDBB5420";
  assert.equal(maskSensitiveText(guid), guid);
});

test("maskSensitiveText applies all masking rules", () => {
  const input =
    "Contact elenakspencer@gmail.com at /Users/michaelparker/repo ID FE539655-8813-4EDA-90BE-C46B32E03CAF";
  const output = maskSensitiveText(input);
  assert.match(output, /\*\*\*\*@gmail\.com/);
  assert.ok(output.includes("/Users/****/"));
  assert.match(output, /FE539655-\*\*\*\*-\*\*\*\*-\*\*\*\*-C46B32E03CAF/);
  assert.equal(findUnmaskedEmails(output).length, 0);
});

test("maskJsonlContent preserves valid JSONL", () => {
  const line = JSON.stringify({
    message: {
      content: [
        {
          text: "Calendar (laneymichaelparker@gmail.com) ID A0D48476-00B9-4520-8890-97324033BA29 path /Users/michaelparker/Documents",
        },
      ],
    },
  });
  const masked = maskJsonlContent(`${line}\n`);
  const parsed = JSON.parse(masked.trim());
  const text = parsed.message.content[0].text;
  assert.match(text, /\*\*\*\*@gmail\.com/);
  assert.ok(text.includes("/Users/****/"));
  assert.match(text, /A0D48476-\*\*\*\*-\*\*\*\*-\*\*\*\*-97324033BA29/);
});

test("maskJsonlContent masks sensitive object keys", () => {
  const line = JSON.stringify({
    snapshot: {
      trackedFileBackups: {
        "/Users/michaelparker/.claude/projects/foo/memory.md": {
          version: 1,
        },
      },
    },
  });
  const masked = maskJsonlContent(`${line}\n`);
  const parsed = JSON.parse(masked.trim());
  const keys = Object.keys(parsed.snapshot.trackedFileBackups);
  assert.equal(keys.length, 1);
  assert.equal(
    keys[0],
    "/Users/****/.claude/projects/foo/memory.md",
  );
});
