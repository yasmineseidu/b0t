# Contribute to B0t Skill

## Description
Prepare and commit contributions to the original KenKaiii/b0t repository. This skill ensures your contributions are professional, well-documented, and follow best practices for open source collaboration.

## When This Skill Triggers

This skill activates when you say things like:
- "contribute this back"
- "make a contribution"
- "submit this to the original repo"
- "create a pull request"
- "contribute my changes"
- "help me contribute"
- "prepare a PR"
- "commit for contributing"

**Important:** This is for contributing back to the ORIGINAL repo, not your custom modifications.

---

## Workflow

### Step 1: Check Current Branch
```bash
cd ~/Desktop/Coding/smarter-b0t
git branch --show-current
```

**If on "main":**
- Tell user: "You're on main. Need to create a feature branch."
- Ask: "What should we name it? (Examples: fix-login-bug, add-dark-mode, update-readme)"
- Create branch: `git checkout -b [feature-name]`

**If on "smarter-b0t":**
- Alert: "You're on your custom branch! These changes probably shouldn't be contributed."
- Ask: "Switch to main and create a feature branch? (yes/no)"
- If yes: `git checkout main` then create feature branch

**If on feature branch:**
- Confirm: "You're on [branch-name]. Continue? (yes/no)"
- If no, help them switch branches

### Step 2: Check for Changes
```bash
git status
```

If no changes:
- "No changes to commit. You're all good!"
- Stop here

### Step 3: Review Changes
```bash
git diff
```

Show summary of what changed.

### Step 4: Stage Changes
Ask: "Should I stage all changes? (yes/no)"

If yes:
```bash
git add .
```

Show staged changes:
```bash
git diff --staged
```

### Step 5: Create Professional Commit Message

Analyze the diff and create a message following open source standards:

**Format:**
- First line: Clear summary (max 50 chars, present tense)
- Blank line
- Detailed explanation (if needed)
- Reference issues if applicable: "Fix #123"

**Rules:**
- Professional and clear (maintainers will read this)
- Explain WHAT and WHY
- Mention impact/benefits
- Be specific, not vague

**Good Examples:**
- "Add rate limiting to prevent API abuse"
- "Fix memory leak in WebSocket handler"
- "Improve error handling for invalid config"
- "Update Docker deployment documentation"

**Bad Examples:**
- "fixed stuff"
- "updates"
- "made changes"

### Step 6: Quality Check

Before committing, verify:
- [ ] Change is useful for original project
- [ ] Code follows their style
- [ ] Change is tested
- [ ] Commit message is professional
- [ ] Not including custom smarter-b0t modifications

Ask user: "Ready to commit? (yes/no)"

### Step 7: Commit
```bash
git commit -m "Your message here"
```

### Step 8: Push to Your Fork
```bash
git push origin [branch-name]
```

If first time:
```bash
git push -u origin [branch-name]
```

### Step 9: Guide Next Steps

Tell user:
```
Done! Your contribution is ready.

Next steps to create Pull Request:
1. Go to: https://github.com/yasmineseidu/b0t
2. Click "Compare & pull request"
3. Fill in PR description:
   - What you changed
   - Why you changed it
   - How to test it
4. Submit PR to KenKaiii/b0t

Your branch: [branch-name]
Commit: [commit-hash]
```

---

## Branch Naming Guide

**Bug Fixes:**
- `fix-[issue]`
- Examples: `fix-memory-leak`, `fix-login-error`, `fix-crash-on-null`

**New Features:**
- `add-[feature]`
- Examples: `add-webhooks`, `add-rate-limiting`, `add-dark-mode`

**Improvements:**
- `improve-[area]`
- Examples: `improve-performance`, `improve-docs`, `improve-error-handling`

**Updates:**
- `update-[what]`
- Examples: `update-dependencies`, `update-readme`, `update-docker`

---

## Error Handling

### Authentication Error
- Remind user about Personal Access Token
- Check: `git config --global credential.helper`

### Push Rejected
```bash
git pull origin [branch-name] --rebase
```
Then push again.

### On Wrong Branch
- Guide user to correct branch
- Help preserve their changes if needed

### Accidentally Including Custom Code
- Alert user if changes look like custom modifications
- Suggest reviewing what's being committed
- Offer to help separate custom vs contribution code

---

## Important Notes

- This is for contributing BACK to original repo
- Keep contributions focused (one feature/fix per PR)
- Write professional commit messages
- Test your changes before committing
- Follow the project's code style
- Don't mix custom modifications with contributions

---

## Examples

**User says:** "contribute this bug fix"
**Skill does:**
1. Checks branch, creates `fix-navigation-bug`
2. Reviews changes
3. Creates message: "Fix navigation menu overflow on mobile"
4. Commits and pushes
5. Guides to create PR on GitHub

**User says:** "I want to submit this to the original repo"
**Skill does:**
1. Verifies not on custom branch
2. Creates feature branch if needed
3. Analyzes contribution
4. Writes professional commit
5. Pushes to fork
6. Provides PR instructions

**User says:** "make a pull request"
**Skill does:**
1. Ensures proper branch structure
2. Reviews all changes
3. Creates detailed commit message
4. Pushes contribution
5. Walks through GitHub PR process
