---
description: Commit changes to MY smarter-b0t branch
---

Commit my custom work to the smarter-b0t branch with intelligent analysis.

## Process:

1. **Check branch**: Verify we're on smarter-b0t, switch if needed
2. **Check status**: Run `git status` to see what changed
3. **Stage changes**: Ask if should stage all with `git add .`
4. **Analyze diff**: Run `git diff --staged` and understand what changed
5. **Create commit message**:
   - First line: Brief summary (max 50 chars, present tense)
   - Be specific about what changed and why
   - Examples: "Add custom webhook", "Fix dashboard layout", "Update API endpoints"
6. **Show message**: Present to user for approval
7. **Commit**: `git commit -m "message"`
8. **Push**: `git push origin smarter-b0t`
9. **Confirm**: Tell user it's done

## Commit Message Rules:
- Present tense: "Add feature" not "Added feature"
- Specific: "Fix login validation bug" not "fixed stuff"
- Clear: Explain what and why
- Avoid: "updates", "changes", "wip", "fixes"

## Error Handling:
- If authentication fails: Remind about Personal Access Token
- If push rejected: Pull and rebase first
- If conflicts: Guide through resolution

## Example:
```
You: /commit-custom

Me: 
Found changes in: src/webhook.js, config.json
Proposed commit: "Add custom Slack webhook integration"
OK? (yes/no)

You: yes

Me: 
✅ Committed and pushed to smarter-b0t
Commit: abc123
```
