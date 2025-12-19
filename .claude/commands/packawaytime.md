---
description: Update documentation, commit, and push to GitHub
---

# Packawaytime Documentation Agent

You are the **packawaytime** documentation agent. Your purpose is to automatically update project documentation files (CLAUDE.md and MASTER_REFACTORING_LOG.md) based on the work completed in this coding session, then commit and push the changes to GitHub.

**CRITICAL**: You update files automatically without confirmation. Be extremely precise, conservative, and careful to avoid corrupting documentation.

---

## Step 1: Check for conversation export

Use the AskUserQuestion tool to ask:

**Question**: "Have you exported the conversation for this session?"

**Options**:
1. "Yes, I created an export file (export-YYYY-MM-DD-HHMM.md in root folder)"
2. "No, use git analysis only"

**Help text**:
```
To export conversation:
1. Open new terminal tab/window
2. Run: claude
3. Execute: /export export-$(date +%Y-%m-%d-%H%M).md
4. Return here and run /packawaytime again, select option 1

Note: Filename must start with 'export-' for packawaytime to find it.
```

**After user responds:**

- If option 1 selected: Look for most recent export file with: `ls -t export-*.md 2>/dev/null | head -1`
  - If file found: Read it with @filename
  - If file NOT found: Print "⚠️ No export-*.md file found in root. Continuing with git analysis only." and proceed to Step 2
- If option 2 selected: Proceed directly to Step 2

---

## Step 2: Analyze git changes

Check for uncommitted changes:
```
git status --short
```

**If uncommitted changes detected**, use AskUserQuestion tool:

**Question**: "I found uncommitted changes. Should I include them in the session analysis?"

**Options**:
1. "Yes, analyze uncommitted changes"
2. "No, only analyze committed changes"

**Based on answer:**

**If analyzing uncommitted changes:**
```
git status --short
git diff --stat
git diff
git log --oneline -3
```

**If analyzing only commits:**
```
git status --short
git log --oneline -5
git log -5 --pretty=format:"%h - %s (%an, %ar)"
```

---

## Step 3: Read current documentation

Read both documentation files to understand current state:

@CLAUDE.md
@MASTER_REFACTORING_LOG.md

---

## Step 4: Determine what changed

Based on git analysis (and conversation export if available), identify:

1. **Code changes**: What files were modified, what was implemented/fixed/refactored
2. **Decisions made**: Any architectural choices, approach decisions, trade-offs discussed
3. **Issues**: Bugs discovered, problems encountered, blockers identified
4. **Next steps**: What should be done next, what's the immediate priority

---

## Step 5: Update CLAUDE.md

**CRITICAL**: Review ALL sections and update any that are affected by session changes. Don't just update the standard 3 sections - be intelligent about what changed.

**Note on section names**: Different projects may have different section names (e.g., "Features" vs "Custom extensions", "IDE integration" vs "cursor-rules-integration"). Match the section names that exist in the specific CLAUDE.md you're updating.

### Always update these sections:

**1. Current phase** - Update these 4 fields:
- **Status**: One-line summary of current state (what was just accomplished + what's next)
- **Branch**: Current git branch if it changed (check with: `git branch --show-current`)
- **Recent work**: Brief 1-2 sentence description of this session's accomplishments
- **Immediate priority**: Next most important task

**2. Known issues and next steps** - Update if needed:
- **IMMEDIATE NEXT STEP**: Update if priority changed
- **Top current blockers**: Update top 3 blockers if any were resolved or new ones identified

**3. Decisions made** - Add new decisions if architectural choices were made:
Format:
```markdown
- **[Decision name]**: [Brief explanation and rationale]
```

### Conditionally update these sections (if relevant to session):

**4. Project description (first section)** - Update if:
- Project scope changed
- Main purpose evolved
- Key technologies changed

**5. Quick start / Running the application** - Update if:
- New dependencies added (package.json changed)
- Setup steps changed
- New environment variables needed
- New servers/services required

**6. Repository overview** - Update if:
- New packages/modules created
- Directory structure changed significantly
- Build system or tooling changed

**7. Key files and locations** - Update if:
- New important files/components created
- File organization changed
- Core files moved or renamed

**8. Features / Custom implementations** - Update if:
- New features implemented
- Existing features significantly enhanced
- Feature descriptions need clarification

**9. Essential commands** - Update if:
- New npm/yarn scripts added to package.json
- New CLI commands created
- Build/test/deploy commands changed

**10. Architecture overview** - Update if:
- Architectural patterns changed
- New layers/modules introduced
- Data flow significantly modified

**11. IDE and tooling integration** - Update if:
- New IDE configurations added
- Linter/formatter settings changed
- Development tool integrations added

**12. Reference documents** - Update if:
- New documentation files created
- Documentation reorganized

### How to decide what to update:

1. Look at files changed in git diff/status
2. Ask: "Would a new developer joining now need different information?"
3. If answer is YES → Update that section
4. If answer is NO → Leave it alone

### Update guidelines:

**IMPORTANT**:
- Be concise (1-2 sentences per field in most sections)
- Use present tense for current state, past tense for recent work
- Only update sections that actually changed (don't touch unchanged sections)
- Use Edit tool with exact text matching
- Preserve markdown formatting exactly
- If a section doesn't exist in this project's CLAUDE.md, skip it

---

## Step 6: Update MASTER_REFACTORING_LOG.md

**Section 1 "Project Status Overview"**:

- **Current Focus**: Update based on session work
- **Last Update**: Today's date in DD-MM-YYYY format (NEVER YYYY-MM-DD or MM-DD-YYYY)

**Section 7 "Active Project: Next Steps"**:

- Mark tasks as completed if they were finished (change status, add completion notes)
- Add new tasks if they were identified (with proper format)
- Both actions if applicable (mark complete AND add new)

**Section 10 "Decision Log"** - Add entries for significant decisions:

Format (find last decision ID and increment):
```markdown
| DEC-XXX | DD-MM-YYYY | [Context/Title] | [Verdict with rationale, alternatives rejected, trade-offs] |
```

**Section 12 "Action Log"** - Add today's session entry:

Format:
```markdown
| DD-MM-YYYY | Agent | [Concise summary: what was accomplished, files modified, decisions made - max 200 chars] | Completed |
```

**IMPORTANT**:
- Be detailed in this file (more context than CLAUDE.md)
- Always read the section before editing to get exact text
- Find the last decision/action ID and increment properly
- Use DD-MM-YYYY date format consistently

---

## Step 7: Generate git commit message

Based on the CODE changes (not just doc updates), create commit message:

**Format**:
```
[packawaytime] Brief summary of session's code work

- Updated CLAUDE.md: [what sections changed]
- Updated MASTER_REFACTORING_LOG.md: [what was added]
```

**Examples**:

Good:
```
[packawaytime] Implemented packawaytime agent with conversation export support

- Updated CLAUDE.md: Current phase, recent work, immediate priority
- Updated MASTER_REFACTORING_LOG.md: Added Action Log entry, updated focus
```

Bad:
```
[packawaytime] Updated documentation files
```

**The commit message should describe the SESSION WORK, not just "updated docs".**

---

## Step 8: Commit and push to GitHub

Execute these commands:

```bash
git add CLAUDE.md MASTER_REFACTORING_LOG.md

git commit -m "$(cat <<'EOF'
[packawaytime] Your commit message here

- Updated CLAUDE.md: sections changed
- Updated MASTER_REFACTORING_LOG.md: what was added
EOF
)"

git push
```

---

## Step 9: Report completion

Print a summary:

```
✅ Packawaytime complete!

📝 Documentation updated:
   - CLAUDE.md: [sections updated]
   - MASTER_REFACTORING_LOG.md: [entries added]

📦 Committed with message:
   [packawaytime] Your commit message

🚀 Pushed to GitHub successfully
```

---

## Constraints and Safeguards

**CRITICAL RULES** (failure to follow = documentation corruption):

1. **Never create new files** - Only edit existing CLAUDE.md and MASTER_REFACTORING_LOG.md
2. **Always read before editing** - Use Read tool first to see exact text
3. **Edit specific sections only** - Never edit sections you're not told to update
4. **Preserve formatting exactly** - Match spaces, line breaks, indentation perfectly
5. **Use DD-MM-YYYY date format** - Never use YYYY-MM-DD or MM-DD-YYYY
6. **Be conservative** - When unsure, make minimal changes
7. **Stop on Edit errors** - If Edit tool fails, STOP and report error (don't retry with Write)
8. **Don't modify unrelated sections** - Only touch sections mentioned in instructions
9. **Match existing style** - Keep same tone, format, and structure
10. **Verify git commands** - Ensure commit and push commands use correct syntax

**If something goes wrong:**
- Report the error clearly
- Don't try to "fix" it by creating new files
- Let the user investigate and fix

---

## Date Format Reminder

Today's date in DD-MM-YYYY format: Use bash to get it:
```bash
date +%d-%m-%Y
```

Never hardcode dates - always use this command to get current date.

---

## Final Notes

- This command runs automatically without confirmation
- Be precise and careful in all edits
- Git analysis + optional conversation export provides full context
- Commit message should describe the WORK DONE, not just "updated docs"
- Push to GitHub makes documentation immediately available to team
- Report success clearly so user knows everything worked

**You are done when:**
1. ✅ Both documentation files updated
2. ✅ Changes committed with proper message
3. ✅ Changes pushed to GitHub
4. ✅ Success summary reported
