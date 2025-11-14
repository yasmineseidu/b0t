# Smarter-b0t Custom Commit Skill

## Description
Automatically commit changes to YOUR custom smarter-b0t branch with intelligent commit messages. This skill analyzes your code changes and creates clear, professional commits.

## When This Skill Triggers

This skill activates when you say things like:
- "commit my changes"
- "save my work" 
- "commit this to smarter-b0t"
- "push my changes"
- "save and push"
- "commit my custom work"
- "add my changes to smarter-b0t"

**Important:** This skill is for YOUR custom modifications only, not for contributing back to the original repo.

---

## Workflow

### Step 1: Ensure Correct Branch
First, verify we're on the smarter-b0t branch:

```bash
cd ~/Desktop/Coding/smarter-b0t
git branch --show-current
```

If NOT on smarter-b0t:
- Switch: `git checkout smarter-b0t`
- If doesn't exist: `git checkout -b smarter-b0t`

### Step 2: Check for Changes
```bash
git status
```

If no changes:
- Inform user: "No changes to commit. You're all good!"
- Stop here

### Step 3: Review Changes
```bash
git diff
```

Show the user a summary of what files changed.

### Step 4: Stage Changes
Ask: "Should I stage all changes? (yes/no)"

If yes:
```bash
git add .
```

Then show staged changes:
```bash
git diff --staged
```

### Step 5: Analyze and Create Commit Message

Based on the diff output, create a commit message following these rules:

**Format:**
- First line: Brief, clear summary (max 50 characters)
- Use present tense: "Add feature" not "Added feature"
- Be specific: What changed and why

**Examples of good messages:**
- "Add custom webhook integration"
- "Fix navigation menu styling"
- "Update dashboard with real-time data"
- "Remove deprecated API calls"

**Avoid vague messages:**
- "fixed stuff"
- "updates"
- "changes"
- "wip"

### Step 6: Present Message to User

Show the proposed commit message:
```
Proposed commit message:
"[Your analyzed message here]"

Does this look good? (yes/no/edit)
```

If user says "edit", ask what they want to change.

### Step 7: Commit
```bash
git commit -m "Your message here"
```

### Step 8: Push to Fork
```bash
git push origin smarter-b0t
```

If first time pushing this branch:
```bash
git push -u origin smarter-b0t
```

### Step 9: Confirm Success

Tell the user:
```
Done! Your changes are committed and pushed to YOUR smarter-b0t branch.

Branch: smarter-b0t
Commit: [commit hash]
```

---

## Error Handling

### Authentication Error
If push fails with authentication:
- Remind user to use Personal Access Token (not password)
- Check credential helper: `git config --global credential.helper`

### Push Rejected (Behind Remote)
If push is rejected:
```bash
git pull origin smarter-b0t --rebase
```
Then push again.

### Merge Conflicts
If conflicts occur:
- Tell user there are conflicts
- Show conflicted files
- Guide them to resolve manually
- After resolving: `git add .` and `git commit`

---

## Important Notes

- This skill commits to YOUR custom branch only
- Changes stay on YOUR fork (yasmineseidu/b0t)
- You can make any modifications you want
- This is separate from contributing back to original
- No pull requests are created from this branch

---

## Examples

**User says:** "commit my changes"
**Skill does:**
1. Checks branch (switches to smarter-b0t if needed)
2. Shows what changed
3. Creates message: "Add custom analytics dashboard"
4. Commits and pushes
5. Confirms success

**User says:** "save my work to smarter-b0t"
**Skill does:**
1. Verifies on smarter-b0t branch
2. Analyzes changes
3. Suggests clear commit message
4. Gets approval
5. Commits and pushes

**User says:** "push my custom stuff"
**Skill does:**
1. Ensures on correct branch
2. Reviews all changes
3. Creates descriptive commit
4. Pushes to fork
5. Reports success
