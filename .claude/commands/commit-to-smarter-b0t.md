---
description: Commit MY custom work to smarter-b0t branch
---

## Workflow:

### Step 1: Ensure Correct Branch
```bash
cd ~/Desktop/Coding/smarter-b0t
git branch --show-current
```
If NOT on smarter-b0t: `git checkout smarter-b0t`

### Step 2: Check for Changes
```bash
git status
```
If no changes: Stop and inform user

### Step 3: Stage Changes
Ask: "Should I stage all changes?"
If yes: `git add .`

### Step 4: Analyze Changes
```bash
git diff --staged
```

### Step 5: Create Commit Message
Analyze the diff and create message:
- Format: Brief summary (max 50 chars, present tense)
- Be specific about what changed
- Examples: "Add custom webhook", "Fix dashboard layout"
- Avoid: "updates", "changes", "wip"

### Step 6: Show Message
Display proposed commit message
Ask: "Does this look good? (yes/no)"

### Step 7: Commit
```bash
git commit -m "Your message here"
```

### Step 8: Push
```bash
git push origin smarter-b0t
```

### Step 9: Confirm
Tell user: "Done! Changes committed and pushed to YOUR smarter-b0t branch."
## Process:
1. Check you're on smarter-b0t branch (switches if needed)
2. Show what changed: `git status`
3. Ask to stage: `git add .`
4. Analyze changes: `git diff --staged`
5. Create commit message (smart analysis)
6. Show message for approval
7. Commit: `git commit -m "message"`
8. Push: `git push origin smarter-b0t`
