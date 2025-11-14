# Smarter-b0t Skills

This folder contains custom skills for managing your smarter-b0t project and contributions.

## Available Skills

### 1. Smarter-b0t Custom Commit
**Location:** `.skills/smarter-b0t-commit/SKILL.md`

**Triggers on:**
- "commit my changes"
- "save my work"
- "push my changes"
- "commit to smarter-b0t"

**What it does:**
- Commits to YOUR custom smarter-b0t branch
- Analyzes changes and creates clear commit messages
- Pushes to your fork automatically

### 2. Contribute to B0t
**Location:** `.skills/contribute-to-b0t/SKILL.md`

**Triggers on:**
- "contribute this back"
- "make a contribution"
- "create a pull request"
- "submit to original repo"

**What it does:**
- Creates proper feature branches
- Writes professional commit messages
- Pushes to your fork
- Guides you through creating PR on GitHub

---

## How To Use

Just tell me in natural language what you want to do:

**For your custom work:**
```
"hey, commit my changes"
"save this work"
"push my updates"
```

**For contributing:**
```
"I want to contribute this back"
"help me make a pull request"
"submit this bug fix"
```

The skills will activate automatically and handle all the git commands for you.

---

## What Makes Skills Better Than Commands

**Old way (manual):**
```bash
git status
git add .
git commit -m "message"
git push origin branch
```

**With skills (natural):**
```
"commit my changes"
```

Skills:
- Understand natural language
- Analyze your code changes
- Write better commit messages than you would manually
- Handle branch switching automatically
- Check for errors before committing
- Guide you through the process

---

## Skill Triggers Reference

| What You Say | Which Skill | What Happens |
|--------------|-------------|--------------|
| "commit my changes" | Custom Commit | Commits to smarter-b0t branch |
| "save my work" | Custom Commit | Commits to smarter-b0t branch |
| "contribute this" | Contribute | Creates feature branch, commits |
| "make a PR" | Contribute | Prepares contribution for GitHub |
| "push my updates" | Custom Commit | Commits and pushes custom work |
| "submit this fix" | Contribute | Prepares bug fix contribution |

---

## Branch Strategy

```
main (synced with KenKaiii/b0t)
├── smarter-b0t (YOUR custom modifications)
└── fix-* or add-* (feature branches for contributions)
```

**Custom Commit Skill** → Works on `smarter-b0t` branch
**Contribute Skill** → Creates/uses feature branches, avoids custom branch

---

## Tips

1. **Commit often** - Don't wait until you have 100 changes
2. **Be clear** - Say "commit my changes" not just "commit"
3. **Let skills decide** - They'll write better messages than manual ones
4. **Trust the process** - Skills check everything before committing
5. **Natural language** - Talk normally, don't use git syntax

---

## Examples

**Scenario 1: Working on custom features**
```
You: "I added a new dashboard, commit this"
Skill: *switches to smarter-b0t, analyzes changes*
Skill: "Proposed commit: 'Add custom analytics dashboard'"
You: "yes"
Skill: *commits and pushes*
```

**Scenario 2: Contributing a bug fix**
```
You: "I fixed the login bug, let's contribute it"
Skill: "What should we name the feature branch?"
You: "fix-login-bug"
Skill: *creates branch, analyzes changes*
Skill: "Proposed commit: 'Fix login validation error handling'"
You: "perfect"
Skill: *commits, pushes, guides to create PR*
```

**Scenario 3: Multiple commits**
```
You: "save my progress"
Skill: *commits to smarter-b0t*

*continue working*

You: "commit again"
Skill: *another commit*

*more work*

You: "push everything"
Skill: *ensures everything is pushed*
```

---

## No More Git Commands

You literally never have to type git commands again. Just talk to me:
- "commit my stuff"
- "save this"
- "contribute back"
- "make a PR"

The skills handle everything.
