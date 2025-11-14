---
description: Sync fork with original KenKaiii/b0t repo
---

Pull latest updates from the original b0t repository and merge into your branches.

## Process:

1. **Save work**: Check for uncommitted changes
   - If found: Ask to stash with `git stash save "Auto-stash before sync"`

2. **Switch to main**: `git checkout main`

3. **Pull from original**: `git pull upstream main`
   - Show number of new commits
   - List files that changed

4. **Push to fork**: `git push origin main`

5. **Switch to custom**: `git checkout smarter-b0t`

6. **Merge main**: `git merge main`
   - If successful: Show what was merged
   - If conflicts: List conflicted files and guide resolution

7. **Restore work**: `git stash pop` (if stashed earlier)

8. **Report status**:
```
✅ Sync complete!
Pulled from: KenKaiii/b0t
Main: Updated
Smarter-b0t: Merged with latest
New commits: X
Files changed: Y
```

## Conflict Resolution:
If conflicts occur:
1. Show which files have conflicts
2. Explain conflict markers (<<<<<<<, =======, >>>>>>>)
3. Guide user to resolve
4. After resolved: `git add .` then `git commit`

## Safety:
- Stashes uncommitted work before syncing
- Never overwrites your custom changes
- Can abort at any step
- Shows preview of what will happen

## Example:
```
You: /sync-original

Me:
Checking for updates...
Found 3 new commits from KenKaiii/b0t
- Updated dashboard component
- Fixed memory leak
- Added new API endpoint

Proceed? (yes/no)

You: yes

Me:
✅ Synced successfully!
Main: Updated
Smarter-b0t: Merged
Your custom work: Preserved
```

## When To Use:
- Weekly to stay current
- Before contributing
- After major updates to original
- When you see new releases
