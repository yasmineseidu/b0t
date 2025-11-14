# Sync From Original Repo Skill

## Description
Automatically sync your fork and custom branch with the latest updates from the original KenKaiii/b0t repository. This keeps your work up-to-date with all the new features and bug fixes from the main project.

## When This Skill Triggers

This skill activates when you say things like:
- "sync from original"
- "get updates from the original repo"
- "pull latest from upstream"
- "update my fork"
- "sync everything"
- "get the latest version"
- "pull from KenKaiii"
- "update from source"

---

## What This Skill Does

### Complete Sync Process:
1. Saves any uncommitted work (stash)
2. Switches to main branch
3. Pulls latest from original repo (upstream)
4. Pushes updated main to your fork
5. Switches to smarter-b0t branch
6. Merges main into smarter-b0t
7. Handles conflicts if any
8. Restores your work (unstash)
9. Reports what was updated

---

## Workflow

### Step 1: Save Current Work
First, check if there are uncommitted changes:

```bash
cd ~/Desktop/Coding/smarter-b0t
git status
```

If there are changes:
- Ask user: "You have uncommitted changes. Should I stash them? (yes/no)"
- If yes: `git stash save "Auto-stash before sync"`

### Step 2: Switch to Main Branch
```bash
git checkout main
```

### Step 3: Pull from Original Repo
```bash
git pull upstream main
```

Show the user what was pulled:
- Number of commits added
- Files that changed
- Summary of updates

### Step 4: Push to Your Fork
Update your fork on GitHub with the latest:
```bash
git push origin main
```

### Step 5: Switch to Custom Branch
```bash
git checkout smarter-b0t
```

### Step 6: Merge Main into Custom Branch
```bash
git merge main
```

**If merge succeeds:**
- Show what was merged
- List updated files
- Confirm success

**If conflicts occur:**
- List conflicted files
- Tell user: "There are merge conflicts that need manual fixing"
- Show which files have conflicts
- Guide them to resolve:
  1. Open conflicted files
  2. Look for conflict markers (<<<<<<, ======, >>>>>>)
  3. Choose which version to keep
  4. Remove conflict markers
  5. Save files
  6. Tell me "conflicts resolved"
  7. I'll complete the merge

### Step 7: Restore Stashed Work
If we stashed changes earlier:
```bash
git stash pop
```

### Step 8: Report Status

Tell the user:
```
Sync complete!

Updates pulled from: KenKaiii/b0t
Your main branch: Updated and pushed
Your smarter-b0t branch: Merged with latest

Changes merged:
- [List of files changed]
- [Number of commits added]

Current branch: smarter-b0t
Status: Up to date with original
```

---

## Detailed Steps Breakdown

### Before Syncing
```
Original Repo (KenKaiii/b0t):    A---B---C---D---[NEW]
Your Fork (yasmineseidu/b0t):    A---B---C---D
Your Computer main:               A---B---C---D
Your Computer smarter-b0t:        A---B---C---D---E---F (your work)
```

### After Syncing
```
Original Repo:                   A---B---C---D---NEW
Your Fork:                       A---B---C---D---NEW (updated)
Your Computer main:              A---B---C---D---NEW (updated)
Your Computer smarter-b0t:       A---B---C---D---NEW---E---F (your work + new updates)
```

---

## Handling Conflicts

### What are conflicts?
Conflicts happen when:
- You changed the same line as the original repo
- Both you and original modified the same file

### Conflict Example:
```
<<<<<<< HEAD (your version)
const API_URL = "https://my-custom-api.com";
=======
const API_URL = "https://new-api-endpoint.com";
>>>>>>> main (original version)
```

### How to resolve:
1. Decide which version to keep (or combine them)
2. Remove the markers (<<<<<<<, =======, >>>>>>>)
3. Save the file
4. Tell me "conflicts resolved"

---

## Error Handling

### Authentication Error
If pull/push fails:
- Check credential helper: `git config --global credential.helper`
- Remind about Personal Access Token

### Merge Conflicts
If automatic merge fails:
- Don't panic - this is normal
- List conflicted files
- Guide user through resolution
- After resolved: `git add .` then `git commit`

### Network Error
If can't connect to GitHub:
- Check internet connection
- Try again in a moment
- Verify GitHub is accessible

### Uncommitted Changes on Main
If main has changes (shouldn't happen):
- Ask if they want to discard or commit
- Guide appropriately

---

## Safety Features

### What This Skill Protects:
- ✅ Stashes your work before syncing
- ✅ Never overwrites your custom changes
- ✅ Asks before making destructive changes
- ✅ Shows you what will be updated
- ✅ Can abort at any step

### What Gets Updated:
- Main branch (synced with original)
- Your fork on GitHub (updated main)
- Your smarter-b0t branch (merged with updates)

### What Stays Unchanged:
- Your custom modifications
- Your commit history
- Your smarter-b0t branch commits

---

## When To Sync

### Sync Weekly:
Keep your project current with latest features and bug fixes

### Sync Before Contributing:
Ensure your contribution is based on latest code

### Sync After Major Updates:
When you hear about big changes to the original repo

### Don't Sync During Active Work:
Finish your current feature first, commit it, then sync

---

## Examples

**Example 1: Simple sync (no conflicts)**
```
You: "sync from original"

Me: 
- Checking current work... clean
- Switching to main...
- Pulling from KenKaiii/b0t...
- Found 5 new commits
- Pushing to your fork...
- Switching to smarter-b0t...
- Merging main...
- Merge successful!

Done! Your project is up to date.
Files updated: 12
New commits: 5
```

**Example 2: Sync with uncommitted changes**
```
You: "get updates from original"

Me:
- You have uncommitted changes
- Should I stash them? (yes/no)

You: "yes"

Me:
- Stashing changes...
- Pulling updates...
- Merging...
- Restoring your changes...
- Done!
```

**Example 3: Sync with conflicts**
```
You: "sync everything"

Me:
- Pulling from original...
- Found 3 new commits
- Merging into smarter-b0t...
- CONFLICT in src/config.js
- CONFLICT in README.md

Conflicts found in 2 files. Please resolve:
1. Open src/config.js
2. Look for <<<<<<< markers
3. Keep the version you want
4. Remove markers
5. Tell me "conflicts resolved"

You: *fixes conflicts*
You: "conflicts resolved"

Me:
- Completing merge...
- Testing build...
- Done! Sync complete with resolved conflicts.
```

**Example 4: Check sync status**
```
You: "am I up to date with original?"

Me:
- Checking...
- Your main: 3 commits behind KenKaiii/b0t
- Your smarter-b0t: Based on old main

Would you like to sync now? (yes/no)
```

---

## Commands Summary

| What You Say | What Happens |
|--------------|--------------|
| "sync from original" | Full sync process |
| "get latest updates" | Full sync process |
| "pull from upstream" | Full sync process |
| "am I up to date?" | Check sync status |
| "conflicts resolved" | Complete merge after fixing conflicts |

---

## Pro Tips

1. **Sync regularly** - Weekly keeps conflicts minimal
2. **Commit before syncing** - Clean working tree = easier sync
3. **Review changes** - Look at what's being merged
4. **Test after syncing** - Make sure everything still works
5. **Backup important work** - Commit to smarter-b0t before syncing

---

## What This Skill Does NOT Do

- ❌ Overwrite your custom modifications
- ❌ Delete your branches
- ❌ Push your custom work to original repo
- ❌ Modify the original repo
- ❌ Sync automatically (you trigger it)

---

## Important Notes

- This syncs FROM original TO your fork
- One-way sync (updates flow to you, not from you)
- Your custom work stays safe on smarter-b0t
- Main branch becomes identical to original
- Your fork stays updated
- No automatic syncing - you control when

---

## Troubleshooting

**"I synced but don't see updates"**
- Check which branch you're on: `git branch --show-current`
- Switch to smarter-b0t: `git checkout smarter-b0t`

**"Merge failed with conflicts"**
- Normal if you modified same files as original
- Follow conflict resolution steps
- Ask me for help if stuck

**"Sync broke my custom features"**
- Shouldn't happen - your work is on separate branch
- If it did, we can revert the merge
- Your commits are safe in git history

**"Want to undo sync"**
```bash
git reset --hard HEAD~1
```
But ask me first - I'll help you safely revert.
