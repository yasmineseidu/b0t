# Sync From Original Repo Skill

Automatically sync your fork with the latest from KenKaiii/b0t.

## Triggers:
- "sync from original"
- "get updates from original"
- "pull latest from upstream"
- "update my fork"
- "sync everything"

## Workflow:

### Step 1: Save Current Work
```bash
git status
```
If uncommitted changes: Ask "Should I stash them?"
If yes: `git stash save "Auto-stash before sync"`

### Step 2: Switch to Main
```bash
git checkout main
```

### Step 3: Pull from Original
```bash
git pull upstream main
```
Show: Number of commits added, files changed

### Step 4: Push to Your Fork
```bash
git push origin main
```

### Step 5: Switch to Custom Branch
```bash
git checkout smarter-b0t
```

### Step 6: Merge Main
```bash
git merge main
```

**If successful:** Show what was merged
**If conflicts:** List conflicted files and guide resolution

### Step 7: Restore Stashed Work
If stashed earlier: `git stash pop`

### Step 8: Report Status
Tell user:
"Sync complete!
- Main: Updated from KenKaiii/b0t
- Smarter-b0t: Merged with latest
- Changes merged: [list]"
