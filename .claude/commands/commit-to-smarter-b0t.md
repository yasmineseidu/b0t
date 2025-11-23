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

### Step 3: Pre-Commit Security & Quality Gates

Run all gates in sequence. BLOCKER gates must pass; WARNING gates show alerts but don't block.

#### Gate 1: Security Scan for API Keys/Secrets (🚫 BLOCKER)
```bash
# Check for API keys, tokens, passwords in code
git diff --cached --unified=0 | grep -iE "(api[_-]?key|secret|password|token|bearer|private[_-]?key|aws[_-]?access|stripe[_-]?key)" || echo "✓ No exposed secrets detected"
```
**If found**:
- STOP immediately
- Show matched lines
- Require user to remove secrets before continuing
- Suggest using environment variables or credential system

#### Gate 2: Sensitive Files Check (⚠️ WARNING)
```bash
# Check for .env files, credential files, or test API keys in staged files
git diff --cached --name-only | grep -E "(\.env$|\.env\.|credentials\.json|secrets\.|test.*api.*key)" || echo "✓ No sensitive files detected"
```
**If found**:
- Show warning
- List files
- Ask user to confirm these should be committed

#### Gate 3: TypeCheck + Lint (🚫 BLOCKER)
```bash
npm run typecheck
npm run lint
```
**If errors found**:
- STOP immediately
- Show all errors
- Require fixes before continuing
- Run `npm run lint -- --fix` to auto-fix if possible

#### Gate 4: Debug Code Detection (⚠️ WARNING)
```bash
# Check for console.log, debugger, or TODO comments in staged files
git diff --cached | grep -E "(console\.(log|debug|info)|debugger;|TODO:|FIXME:)" || echo "✓ No debug code detected"
```
**If found**:
- Show warning with line numbers
- Ask user to confirm this is intentional

#### Gate 5: Large Files Check (🚫 BLOCKER)
```bash
# Check for files larger than 1MB in staged changes
git diff --cached --name-only | while read file; do
  if [ -f "$file" ]; then
    size=$(wc -c < "$file" 2>/dev/null || echo 0)
    if [ "$size" -gt 1048576 ]; then
      echo "⚠️  Large file detected: $file ($(($size / 1024))KB)"
    fi
  fi
done
```
**If found**:
- STOP immediately
- List large files with sizes
- Suggest using Git LFS or external storage

#### Gate 6: Build Verification (🚫 BLOCKER)
```bash
# If changes affect server, worker, or core functionality
npm run build
```
**If build fails**:
- STOP immediately
- Show build errors
- Require fixes before continuing

#### Gate 7: Run Tests (⚠️ WARNING)
```bash
npm run test 2>&1 | head -50
```
**If tests fail**:
- Show warning
- Display failed test summary
- Ask user to confirm they want to proceed

**Gate Results Summary**:
- Display count of blockers vs warnings
- If any BLOCKER failed: STOP and require fixes
- If only WARNINGS: Ask user to confirm proceeding

### Step 4: Stage Changes
Ask: "Should I stage all changes?"
If yes: `git add .`

### Step 5: Analyze Changes
```bash
git diff --staged
```

### Step 6: Create Commit Message
Analyze the diff and create message:
- Format: Brief summary (max 50 chars, present tense)
- Be specific about what changed
- Examples: "Add custom webhook", "Fix dashboard layout"
- Avoid: "updates", "changes", "wip"

### Step 7: Show Message
Display proposed commit message
Ask: "Does this look good? (yes/no)"

### Step 8: Commit
```bash
git commit -m "Your message here"
```

### Step 9: Push
```bash
git push origin smarter-b0t
```

### Step 10: Confirm
Tell user: "Done! Changes committed and pushed to YOUR smarter-b0t branch."
## Process Summary:
1. Check you're on smarter-b0t branch (switches if needed)
2. Show what changed: `git status`
3. **Run 7 Security & Quality Gates** (new!)
   - Gate 1: Security scan for API keys/secrets (BLOCKER)
   - Gate 2: Sensitive files check (WARNING)
   - Gate 3: TypeCheck + Lint (BLOCKER)
   - Gate 4: Debug code detection (WARNING)
   - Gate 5: Large files check (BLOCKER)
   - Gate 6: Build verification (BLOCKER)
   - Gate 7: Run tests (WARNING)
4. Ask to stage: `git add .`
5. Analyze changes: `git diff --staged`
6. Create commit message (smart analysis)
7. Show message for approval
8. Commit: `git commit -m "message"`
9. Push: `git push origin smarter-b0t`
10. Confirm completion
