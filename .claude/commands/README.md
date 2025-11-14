# Slash Commands for Smarter-b0t

Quick-access commands for git operations. Type the command and execute.

## Available Commands

### /commit-custom
**Usage:** `/commit-custom`

Commit your custom work to smarter-b0t branch.

**When:** After making changes to your custom version

**Does:**
- Analyzes your changes
- Creates clear commit message
- Commits and pushes to YOUR fork
- Shows confirmation

---

### /sync-original
**Usage:** `/sync-original`

Sync your fork with the original KenKaiii/b0t repo.

**When:** Weekly, or when you want latest updates

**Does:**
- Pulls from KenKaiii/b0t
- Updates your main branch
- Merges into smarter-b0t
- Handles conflicts
- Keeps everything current

---

### /contribute
**Usage:** `/contribute`

Prepare a contribution to submit back to original repo.

**When:** You fixed a bug or added a feature to contribute

**Does:**
- Creates feature branch
- Writes professional commit
- Pushes to your fork
- Guides you through PR creation

---

## Quick Reference

| Command | What It Does | When To Use |
|---------|-------------|-------------|
| `/commit-custom` | Save your custom work | After making changes |
| `/sync-original` | Get latest from original | Weekly updates |
| `/contribute` | Prepare contribution | Submitting fixes/features |

---

## Examples

### Daily Work:
```
*make changes*
/commit-custom
```

### Get Updates:
```
/sync-original
```

### Contribute Back:
```
*fix a bug*
/contribute
```

---

## Commands vs Skills

**Slash Commands** (`/command`):
- Direct and explicit
- Type the command to execute
- Faster for frequent operations

**Skills** (natural language):
- Conversational
- Say "commit my changes"
- More intuitive

Both do the same thing - use whichever you prefer!

---

## Workflow Examples

### Example 1: Daily Development
```
Day 1:
/sync-original
*code custom features*
/commit-custom

Day 2:
*more work*
/commit-custom

Day 3:
/sync-original
/commit-custom
```

### Example 2: Contributing
```
/sync-original
*fix a bug*
/contribute
*create PR on GitHub*
```

### Example 3: Multiple Sessions
```
Morning:
/sync-original
*work*
/commit-custom

Afternoon:
*more work*
/commit-custom

Evening:
/commit-custom
```

---

## Tips

1. **Use /sync-original weekly** - Stay current with original repo
2. **Use /commit-custom often** - Small commits are better
3. **Use /contribute for PRs** - Professional contributions
4. **They're safe** - All commands ask before destructive operations

---

## All Your Git Options

| Method | Example | Best For |
|--------|---------|----------|
| Slash Command | `/commit-custom` | Quick execution |
| Natural Language | "commit my changes" | Conversational |
| Manual Git | `git add . && git commit` | When you want control |

Pick whichever feels natural!
