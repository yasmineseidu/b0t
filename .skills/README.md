# Smarter-b0t Skills

This folder contains custom skills for managing your smarter-b0t project and contributions.

## Available Skills

### 1. Smarter-b0t Custom Commit
**Location:** `.skills/smarter-b0t-commit/SKILL.md`

**Triggers on:**
- "commit my changes"
- "save my work"
- "push my changes"
- "commit to smarter-b0t"

**What it does:**
- Commits to YOUR custom smarter-b0t branch
- Analyzes changes and creates clear commit messages
- Pushes to your fork automatically

---

### 2. Contribute to B0t
**Location:** `.skills/contribute-to-b0t/SKILL.md`

**Triggers on:**
- "contribute this back"
- "make a contribution"
- "create a pull request"
- "submit to original repo"

**What it does:**
- Creates proper feature branches
- Writes professional commit messages
- Pushes to your fork
- Guides you through creating PR on GitHub

---

### 3. Sync From Original (NEW!)
**Location:** `.skills/sync-from-original/SKILL.md`

**Triggers on:**
- "sync from original"
- "get updates from original"
- "pull latest from upstream"
- "update my fork"
- "sync everything"

**What it does:**
- Pulls latest updates from KenKaiii/b0t
- Updates your main branch
- Merges updates into smarter-b0t branch
- Handles conflicts if needed
- Keeps your fork up to date

---

## How To Use

Just tell me in natural language what you want to do:

**For your custom work:**
```
"hey, commit my changes"
"save this work"
"push my updates"
```

**For syncing updates:**
```
"sync from original"
"get the latest updates"
"am I up to date?"
```

**For contributing:**
```
"I want to contribute this back"
"help me make a pull request"
"submit this bug fix"
```

The skills will activate automatically and handle all the git commands for you.

---

## What Makes Skills Better Than Commands

**Old way (manual):**
```bash
git checkout main
git pull upstream main
git push origin main
git checkout smarter-b0t
git merge main
# ... hope nothing breaks
```

**With skills (natural):**
```
"sync from original"
```

Skills:
- Understand natural language
- Handle complex workflows automatically
- Check for errors before doing anything
- Guide you through problems
- Never require you to remember git commands

---

## Skill Triggers Reference

| What You Say | Which Skill | What Happens |
|--------------|-------------|--------------|
| "commit my changes" | Custom Commit | Commits to smarter-b0t branch |
| "save my work" | Custom Commit | Commits to smarter-b0t branch |
| "sync from original" | Sync | Updates your fork with latest |
| "get updates" | Sync | Pulls from upstream, merges |
| "contribute this" | Contribute | Creates feature branch, commits |
| "make a PR" | Contribute | Prepares contribution for GitHub |
| "am I up to date?" | Sync | Checks sync status |

---

## Complete Workflow Example

**Day 1 - Start working:**
```
You: "sync from original"
Me: *pulls latest updates, merges*
You: *start coding*
You: "commit my changes"
Me: *commits to smarter-b0t*
```

**Day 5 - More work:**
```
You: "save my progress"
Me: *commits to smarter-b0t*
```

**Week 2 - Get updates:**
```
You: "get latest from original"
Me: *syncs everything*
You: "commit this"
Me: *saves your new work*
```

**Week 3 - Contribute back:**
```
You: "I fixed a bug, let's contribute"
Me: *creates fix-bug branch, commits*
You: *create PR on GitHub*
```

---

## Branch Strategy

```
Original Repo (KenKaiii/b0t)
    ↓ (sync skill pulls from here)
main (synced with original)
├── smarter-b0t (YOUR custom modifications)
└── fix-* or add-* (feature branches for contributions)
```

**Custom Commit Skill** → Works on `smarter-b0t` branch
**Sync Skill** → Updates `main`, merges to `smarter-b0t`
**Contribute Skill** → Creates/uses feature branches

---

## Tips

1. **Sync weekly** - Get latest updates regularly
2. **Commit before syncing** - Clean working tree = easier merge
3. **Commit often** - Small commits are easier to manage
4. **Be clear** - Say "commit my changes" not just "commit"
5. **Let skills decide** - They write better messages than manual
6. **Natural language** - Talk normally, don't use git syntax

---

## All Natural Language Triggers

### Committing Work
- "commit my changes"
- "save this"
- "push my work"
- "commit to smarter-b0t"
- "save my progress"

### Syncing Updates
- "sync from original"
- "get updates"
- "pull latest"
- "update my fork"
- "am I up to date?"
- "sync everything"

### Contributing Back
- "contribute this"
- "make a pull request"
- "submit this fix"
- "create a PR"
- "help me contribute"

---

## Scenarios

**Scenario 1: Daily work**
```
You: "sync from original"
*work work work*
You: "commit my changes"
*more work*
You: "save this"
```

**Scenario 2: Contributing**
```
You: "get latest updates"
You: "I fixed the login bug"
You: "contribute this back"
*create PR on GitHub*
```

**Scenario 3: Checking status**
```
You: "am I up to date with original?"
Me: "You're 5 commits behind. Sync now?"
You: "yes"
Me: *syncs everything*
```

---

## No More Git Commands

You never have to type git commands again. Just talk naturally:
- "commit my stuff"
- "get updates"
- "save this"
- "sync everything"
- "contribute back"
- "make a PR"

The skills handle everything automatically.

---

## Safety & Protection

All skills are designed to be safe:
- ✅ Asks before destructive operations
- ✅ Stashes your work before risky operations
- ✅ Shows you what will happen
- ✅ Guides you through conflicts
- ✅ Never overwrites your custom work
- ✅ Can abort at any step

Your custom modifications are always protected on the smarter-b0t branch.
