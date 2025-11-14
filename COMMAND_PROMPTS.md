# Smarter-B0t Command Prompts

## 1. /commit-to-smarter-b0t

**Purpose:** Save YOUR custom work to smarter-b0t branch

**When to use:** After making custom changes for yourself

**What it does:**
1. Checks you're on smarter-b0t branch
2. Shows what changed
3. Analyzes your code changes
4. Creates smart commit message
5. Commits and pushes to YOUR fork

**Example:**
```
/commit-to-smarter-b0t

→ Found changes in: dashboard.js, api.js
→ Proposed commit: "Add custom analytics dashboard"
→ OK? yes
→ ✅ Committed and pushed to YOUR fork
```

---

## 2. /commit-to-b0t

**Purpose:** Contribute to ORIGINAL b0t repo

**When to use:** You fixed a bug or added a feature for everyone

**What it does:**
1. Creates a feature branch (e.g., fix-login-bug)
2. Analyzes your changes professionally
3. Creates quality commit message
4. Pushes to YOUR fork
5. Guides you to create Pull Request on GitHub

**Example:**
```
/commit-to-b0t

→ Create feature branch name? fix-memory-leak
→ Found changes in: handler.js
→ Proposed commit: "Fix memory leak in connection handler"
→ OK? yes
→ ✅ Committed to fix-memory-leak
→ Next: Create PR at github.com/yasmineseidu/b0t
```

---

## 3. /sync-with-b0t

**Purpose:** Get latest updates from KenKaiii/b0t (original repo)

**When to use:** 
- Weekly to stay current
- Before contributing back
- After seeing new releases

**What it does:**
1. Saves any uncommitted work (stash)
2. Pulls latest from KenKaiii/b0t
3. Updates YOUR main branch
4. Merges into YOUR smarter-b0t branch
5. Restores your uncommitted work

**Example:**
```
/sync-with-b0t

→ Checking for updates from KenKaiii/b0t...
→ Found 5 new commits
→ Proceed? yes
→ ✅ Main updated from KenKaiii/b0t
→ ✅ Smarter-b0t merged with latest
→ ✅ Your custom work preserved
```

---

## Natural Language Alternatives

You can also just say these instead of typing commands:

| Say This | Same As |
|----------|---------|
| "commit my changes" | /commit-to-smarter-b0t |
| "save my work" | /commit-to-smarter-b0t |
| "contribute this back" | /commit-to-b0t |
| "make a pull request" | /commit-to-b0t |
| "sync from original" | /sync-with-b0t |
| "get updates" | /sync-with-b0t |

---

## Quick Decision Tree

**Ask yourself:** "What am I doing?"

```
Made custom changes for ME?
    ↓
/commit-to-smarter-b0t

Fixed something for EVERYONE?
    ↓
/commit-to-b0t

Want LATEST from original?
    ↓
/sync-with-b0t
```

---

## Complete Files Location

All command prompts are stored at:
- `/Users/yasmineseidu/Desktop/Coding/smarter-b0t/.claude/commands/commit-to-smarter-b0t.md`
- `/Users/yasmineseidu/Desktop/Coding/smarter-b0t/.claude/commands/commit-to-b0t.md`
- `/Users/yasmineseidu/Desktop/Coding/smarter-b0t/.claude/commands/sync-with-b0t.md`