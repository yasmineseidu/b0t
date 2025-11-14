---
description: Commit MY custom work to smarter-b0t branch
---

## Process:
1. Check you're on smarter-b0t branch (switches if needed)
2. Show what changed: `git status`
3. Ask to stage: `git add .`
4. Analyze changes: `git diff --staged`
5. Create commit message (smart analysis)
6. Show message for approval
7. Commit: `git commit -m "message"`
8. Push: `git push origin smarter-b0t`

## Example:
```
You: /commit-to-smarter-b0t

Me:
Found changes in: dashboard.js, api.js
Proposed commit: "Add custom analytics dashboard"
OK? (yes/no)

You: yes

Me:
✅ Committed to smarter-b0t
✅ Pushed to YOUR fork
```
