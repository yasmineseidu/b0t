---
description: Prepare contribution to original b0t repo
---

Create a professional contribution to submit back to KenKaiii/b0t via Pull Request.

## Process:

1. **Check branch**: `git branch --show-current`
   - If on main: Ask for feature branch name, create it
   - If on smarter-b0t: Warn and suggest switching
   - If on feature branch: Confirm to continue

2. **Feature branch naming**:
   - Bug fixes: `fix-[issue]` (e.g., fix-login-bug)
   - Features: `add-[feature]` (e.g., add-webhooks)
   - Improvements: `improve-[area]` (e.g., improve-performance)
   - Updates: `update-[what]` (e.g., update-readme)

3. **Check changes**: `git status`

4. **Stage**: Ask if should stage all with `git add .`

5. **Analyze diff**: `git diff --staged`

6. **Create professional commit**:
   - First line: Clear summary (max 50 chars)
   - Format: Present tense, specific, explain impact
   - Reference issues if applicable: "Fix #123"
   - Examples:
     - "Fix memory leak in WebSocket handler"
     - "Add rate limiting to prevent API abuse"
     - "Improve error messages for invalid config"

7. **Show message**: Present for approval

8. **Commit**: `git commit -m "message"`

9. **Push**: `git push -u origin [branch-name]`

10. **Guide PR creation**:
```
Next steps:
1. Go to: https://github.com/yasmineseidu/b0t
2. Click "Compare & pull request"
3. Write PR description:
   - What changed
   - Why it's needed
   - How to test
4. Submit to KenKaiii/b0t
```

## Commit Quality Check:
Before committing, verify:
- [ ] Useful for original project
- [ ] Code follows their style
- [ ] Change is tested
- [ ] Professional message
- [ ] No custom smarter-b0t mods included

## Example:
```
You: /contribute

Me:
You're on main. Create feature branch.
Name? (e.g., fix-login-bug)

You: fix-memory-leak

Me:
Created: fix-memory-leak
Found changes in: handler.js
Proposed commit:
"Fix memory leak in WebSocket connection handler

- Close connections properly after timeout
- Add cleanup for orphaned connections
- Reduces memory usage by 40%"

OK? (yes/no)

You: yes

Me:
✅ Committed and pushed!
Branch: fix-memory-leak

Create PR at: https://github.com/yasmineseidu/b0t
```

## Important:
- This is for CONTRIBUTING to original repo
- Keep changes focused (one fix/feature per PR)
- Write professional commits (maintainers read them)
- Test before committing
- Don't include your custom modifications
