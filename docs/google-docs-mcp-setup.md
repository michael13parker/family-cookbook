# Google Docs setup (recipe delivery)

The weekly planner writes **each dinner's recipe to its own Google Doc**, grouped in a
shared weekly Drive folder, so the recipes are on your phone while you cook. This uses the
open-source [`@a-bonus/google-docs-mcp`](https://github.com/a-bonus/google-docs-mcp) server,
which is **already declared in this repo's `.mcp.json`**. You just create your own Google
credentials once.

> One-time, per household. ~15 minutes, mostly clicking in the Google Cloud Console.
> This is separate from the Apple Calendar/Reminders integration, which stays local.

## Prerequisites
- macOS with Node.js 16+ (check: `node -v`)
- A Google account

## 1. Create a Google Cloud project
1. Open <https://console.cloud.google.com/>
2. Project dropdown → **New Project** → name it (e.g. "Family Cookbook") → **Create**.

## 2. Enable the APIs
**APIs & Services → Library**, then enable both:
- **Google Docs API**
- **Google Drive API**

## 3. Configure the OAuth consent screen
**APIs & Services → OAuth consent screen**:
- User type: **External** → Create
- App name + your support/developer email
- **Scopes:** add `.../auth/documents` and `.../auth/drive`
- **Test users:** add your own Google email
- Save

## 4. Create OAuth credentials
**APIs & Services → Credentials → + Create credentials → OAuth client ID**:
- Application type: **Desktop app**
- Create → copy the **Client ID** and **Client Secret**

## 5. Store the credentials as environment variables
`.mcp.json` reads these from your environment, so **secrets never get committed**. Add to
your shell profile (`~/.zshrc`):

```bash
export GOOGLE_CLIENT_ID="your-client-id.apps.googleusercontent.com"
export GOOGLE_CLIENT_SECRET="your-client-secret"
```

Reload: `source ~/.zshrc` (or open a new terminal).

> ⚠️ Never paste these into the repo, a commit, or a chat. They live only in your shell env
> and (after step 6) a token file under `~/.config`.

## 6. Authorize once
Run the one-time auth — it opens your browser to approve access:

```bash
GOOGLE_CLIENT_ID="$GOOGLE_CLIENT_ID" GOOGLE_CLIENT_SECRET="$GOOGLE_CLIENT_SECRET" \
  npx -y @a-bonus/google-docs-mcp auth
```

Approve. A refresh token is saved to `~/.config/google-docs-mcp/token.json` (outside this repo).

## 7. Restart Claude Code
The `google-docs` server is already in `.mcp.json`, scoped to `docs,drive` tools only.
Restart Claude Code so it loads the server with your env vars. Approve/trust it if prompted.

## 8. Verify
Ask Claude to **"create a test Google Doc"** or **"list my 5 most recent Google Docs."**
If it works, you're set — the planner will create a `Family Dinners / Week of …` folder and
one Doc per dinner.

## Notes & troubleshooting
- **Scoped to Docs + Drive only** (`MCP_TOOL_GROUPS=docs,drive`) — it won't touch Gmail,
  Calendar, or Sheets.
- **Authorization errors:** confirm both APIs are enabled and your email is a **Test user**;
  re-run the `auth` command; if upgrading, delete `~/.config/google-docs-mcp/token.json` and
  re-auth.
- **Revoke access** anytime at <https://myaccount.google.com/permissions>.
- **Sharing with your partner:** share the top **`Family Dinners`** Drive folder once, and
  they'll see every week/day automatically.
