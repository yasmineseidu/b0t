---
description: Sync YOUR fork with original KenKaiii/b0t repo
---

Get the latest updates from the original b0t project and merge into your branches.

## What This Does:
- Pulls latest from KenKaiii/b0t (original repo)
- Updates YOUR main branch
- Merges updates into YOUR smarter-b0t branch
- Keeps your fork current with original

## Process:
1. Save any uncommitted work (stash if needed)
2. Switch to main: `git checkout main`
3. Pull from original: `git pull upstream main`
4. Push to YOUR fork: `git push origin main`
5. Switch to smarter-b0t: `git checkout smarter-b0t`
6. Merge main into smarter-b0t: `git merge main`
7. Handle conflicts if any
8. Restore stashed work

## Example:
```
You: /sync-with-b0t

Me:
Checking for updates from KenKaiii/b0t...
Found 5 new commits:
- Updated dashboard
- Fixed memory leak
- Added new API

Proceed? (yes/no)

You: yes

Me:
✅ Main updated from KenKaiii/b0t
✅ Smarter-b0t merged with latest
✅ Your custom work preserved

New commits: 5
Files changed: 12
```

## When To Use:
- Weekly to stay current with original b0t
- Before contributing back
- After seeing new releases from KenKaiii
- When you want latest features/fixes from original

## Safety:
- Stashes your uncommitted work first
- Never overwrites your custom changes
- Shows preview before syncing
- Guides through conflicts
