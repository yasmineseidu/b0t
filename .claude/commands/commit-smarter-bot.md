---
description: Commit MY custom work to smarter-bot branch
---

Save your custom modifications to YOUR smarter-bot branch.

## What This Does:
- Commits to YOUR smarter-bot branch (your custom version)
- Analyzes what you changed
- Creates a clear commit message
- Pushes to YOUR fork on GitHub

## Process:
1. Check you're on smarter-bot branch (switches if needed)
2. Show what changed: `git status`
3. Ask to stage: `git add .`
4. Analyze changes: `git diff --staged`
5. Create commit message (smart analysis)
6. Show message for approval
7. Commit: `git commit -m "message"`
8. Push: `git push origin smarter-bot`

## Example:
```
You: /commit-smarter-bot

Me:
Found changes in: dashboard.js, api.js
Proposed commit: "Add custom analytics dashboard"
OK? (yes/no)

You: yes

Me:
✅ Committed to smarter-bot
✅ Pushed to YOUR fork
```

## When To Use:
- After making custom changes
- When you want to save your work
- Daily commits to YOUR version
