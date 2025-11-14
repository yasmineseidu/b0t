# Smarter-b0t Custom Commit Skill

Automatically commit changes to YOUR custom smarter-b0t branch.

## Triggers:
- "commit my changes"
- "save my work" 
- "push my changes"
- "save and push"

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
