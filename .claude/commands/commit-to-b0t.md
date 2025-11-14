---
description: Contribute to the ORIGINAL b0t repo
---

## Process:
1. Check current branch
   - If on main: Ask for feature branch name
   - If on smarter-b0t: Warn (don't contribute custom stuff)
2. Create feature branch: `git checkout -b fix-bug`
3. Show what changed
4. Ask to stage changes
5. Analyze changes professionally
6. Create quality commit message
7. Commit and push
8. Guide PR creation on GitHub

## Branch Naming:
- Bug fixes: `fix-[issue]` (e.g., fix-login-error)
- Features: `add-[feature]` (e.g., add-webhooks)
- Improvements: `improve-[area]` (e.g., improve-docs)

## Example:
```
You: /commit-to-b0t

Me:
You're on main. Create feature branch.
Name? (e.g., fix-memory-leak)

You: fix-login-bug

Me:
Created: fix-login-bug
Found changes in: auth.js
Proposed commit:
"Fix login validation error handling"
OK? (yes/no)

You: yes

Me:
✅ Committed to fix-login-bug
✅ Pushed to YOUR fork

Next: Create PR at github.com/yasmineseidu/b0t
Submit to: KenKaiii/b0t
```
