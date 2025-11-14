# Contribute to B0t Skill

Prepare professional contributions for the original KenKaiii/b0t repository.

## Triggers:
- "contribute this back"
- "make a contribution"
- "submit to original repo"
- "create a pull request"
- "prepare a PR"

## Workflow:

### Step 1: Check Current Branch
```bash
cd ~/Desktop/Coding/smarter-b0t
git branch --show-current
```

**If on "main":**
- Ask: "What should we name the feature branch?"
- Create: `git checkout -b [feature-name]`

**If on "smarter-b0t":**
- Warn: "You're on your custom branch. Switch to main first?"

**If on feature branch:**
- Confirm: "Continue with [branch-name]?"

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

### Step 5: Create Professional Commit Message
Format:
- First line: Clear summary (max 50 chars, present tense)
- Be professional (maintainers will read this)
- Explain WHAT and WHY
- Examples: "Fix memory leak in WebSocket handler", "Add rate limiting"

### Step 6: Show Message
Display proposed commit message
Ask: "Does this look good for the contribution?"

### Step 7: Commit
```bash
git commit -m "Your message here"
```

### Step 8: Push
```bash
git push origin [current-branch-name]
```

### Step 9: Guide PR Creation
Tell user:
"Done! Next steps:
1. Go to: https://github.com/yasmineseidu/b0t
2. Click 'Compare & pull request'
3. Submit to: KenKaiii/b0t"

## Branch Naming:
- Bug fixes: `fix-[issue]`
- Features: `add-[feature]`
- Improvements: `improve-[area]`
- Updates: `update-[what]`
