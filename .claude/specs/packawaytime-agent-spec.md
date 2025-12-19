# Session-Closing Agent Specification

**Version**: 1.0
**Date**: 17-12-2025
**Status**: Design Complete - Ready for Implementation

---

## 1. Purpose and Goals

### Primary Goal
Create a reusable AI agent that automatically scans a coding session's chat history and updates project documentation files with accurate summaries of work completed, decisions made, and next steps identified.

### Key Objectives
1. **Eliminate manual documentation burden** - Developer shouldn't manually update docs
2. **Ensure documentation accuracy** - Agent reads actual chat, not assumptions
3. **Project-agnostic design** - Works across any project with similar doc structure
4. **Consistent updates** - Same sections updated every time

---

## 2. Requirements

### Functional Requirements
- **FR-1**: Read entire chat history from session start to current moment
- **FR-2**: Extract key information: accomplishments, decisions, issues, files modified
- **FR-3**: Update CLAUDE.md with high-level summary
- **FR-4**: Update MASTER_REFACTORING_LOG.md with detailed entries
- **FR-5**: Preserve existing structure and formatting of both files
- **FR-6**: Generate git commit message suggestions (optional output)

### Non-Functional Requirements
- **NFR-1**: Agent execution time <60 seconds for typical session
- **NFR-2**: Must not modify sections unrelated to current session
- **NFR-3**: Must handle sessions with no significant changes gracefully
- **NFR-4**: Output must be deterministic (same input → same output)

---

## 3. Implementation Options

### Option A: Claude Code Slash Command (RECOMMENDED)
**Pros:**
- Native to Claude Code CLI
- Easy to invoke: `/close-session` or `/wrap-up`
- Can be version controlled in `.claude/commands/`
- Can access conversation context automatically

**Cons:**
- Limited to Claude Code users
- May have token limit constraints

**Implementation Path:**
1. Create `.claude/commands/close-session.md`
2. Write comprehensive prompt template
3. Test with current session
4. Document usage in CLAUDE.md

### Option B: MCP Tool/Server
**Pros:**
- More powerful, can integrate with external tools
- Can read/write files directly
- Can generate git commits automatically
- Reusable across different AI tools

**Cons:**
- More complex to set up
- Requires MCP server development
- Overkill for simple documentation updates

**Implementation Path:**
1. Create MCP server in `~/.config/claude/mcp-servers/`
2. Implement `close-session` tool
3. Register in Claude Code settings

### Option C: Post-Session Hook
**Pros:**
- Fully automated (runs automatically)
- No manual invocation needed

**Cons:**
- May not exist in Claude Code yet (needs research)
- Less control over when it runs

**Recommendation:** Start with **Option A (Slash Command)** for MVP, migrate to Option B if needed.

---

## 4. Input Format

The agent receives:
- **Full conversation history** (from Claude Code context)
- **Current timestamp** (for Action Log entry)
- **Project root path** (to locate CLAUDE.md and MASTER_REFACTORING_LOG.md)

---

## 5. Output Format

### 5.1 CLAUDE.md Updates

**Section: "Current phase"**
```markdown
**Status**: [One-line status summary]
**Branch**: [Current git branch if changed]
**Recent work**: [Brief summary of this session's work]
**Immediate priority**: [Next most important task]
```

**Section: "Known issues and next steps"**
```markdown
**🚨 IMMEDIATE NEXT STEP**: [Top priority task]

**Top current blockers**:
1. [Blocker 1]
2. [Blocker 2]
3. [Blocker 3]

**Complete details**: See `MASTER_REFACTORING_LOG.md` Section 6 (Known Issues & Technical Debt) and Section 7 (Active Project: Next Steps)
```

**Section: "Decisions made" (if new decisions were made)**
```markdown
**[Category]**:
- **[Decision name]**: [Brief explanation and rationale]
```

### 5.2 MASTER_REFACTORING_LOG.md Updates

**Section 1: "Project Status Overview"**
```markdown
**Current Focus:** [Updated focus based on session work]
**Overall State:** [Updated state if phases changed]
**Last Update:** [Today's date in DD-MM-YYYY format]
```

**Section 7: "Active Project: Next Steps"**
- Update task status (pending → in_progress → completed)
- Add new tasks if identified during session
- Reorder priority queue if needed

**Section 10: "Decision Log"**
```markdown
| DEC-XXX | DD-MM-YYYY | [Context] | [Verdict with rationale, alternatives rejected, trade-offs] |
```

**Section 12: "Action Log"**
```markdown
| DD-MM-YYYY | Agent | [Summary of session accomplishments, decisions, files modified] | Completed |
```

---

## 6. Prompt Template

```markdown
# Session-Closing Agent Prompt

You are a session-closing documentation agent. Your task is to read the entire conversation history from this coding session and update the project documentation files with accurate information.

## Your Tasks

1. **Analyze the full conversation** from start to current message
2. **Extract key information**:
   - What was accomplished (features implemented, bugs fixed, refactoring done)
   - Architectural decisions made (with rationale and alternatives considered)
   - Known issues discovered or resolved
   - Files modified (for git commit reference)
   - Next steps identified or discussed
3. **Update CLAUDE.md** with high-level summary
4. **Update MASTER_REFACTORING_LOG.md** with detailed entries

## File Update Instructions

### CLAUDE.md Updates

**Section "Current phase":**
- Update `**Status**:` with one-line summary of current state
- Update `**Recent work**:` with brief description of this session's accomplishments
- Update `**Immediate priority**:` with next most important task

**Section "Known issues and next steps":**
- Update top 3 blockers based on discussion
- Keep only most critical issues visible

**Section "Decisions made" (if applicable):**
- Add any new architectural decisions made this session
- Keep only last 5-7 decisions (reference rest in MASTER_REFACTORING_LOG.md)

### MASTER_REFACTORING_LOG.md Updates

**Section 1 "Project Status Overview":**
- Update `**Current Focus**:` based on session work
- Update `**Last Update**:` to today's date (DD-MM-YYYY)

**Section 7 "Active Project: Next Steps":**
- Mark completed tasks as done
- Add new tasks if identified
- Reorder tasks by priority if needed

**Section 10 "Decision Log":**
- Add new decision entries with:
  - ID (DEC-XXX, increment from last)
  - Date (DD-MM-YYYY)
  - Context (brief title)
  - Verdict (full explanation, alternatives rejected, trade-offs)

**Section 12 "Action Log":**
- Add new entry:
  - Date: [today in DD-MM-YYYY]
  - Agent: Agent
  - Action: [Concise summary of session work - max 200 chars]
  - Status: Completed

## Important Guidelines

1. **Read the ENTIRE conversation** - Don't miss early discussions
2. **Be accurate** - Only document what actually happened, not assumptions
3. **Be concise in CLAUDE.md** - High-level summaries only
4. **Be detailed in MASTER_REFACTORING_LOG.md** - Full context and rationale
5. **Preserve formatting** - Match existing markdown structure exactly
6. **Don't modify unrelated sections** - Only update specific sections listed above
7. **If nothing significant happened** - Make minimal updates (just date and brief note)

## Current Date
[Today's date in DD-MM-YYYY format]

## Begin
Read the conversation history and update the files now.
```

---

## 7. File Update Strategy

### Update Algorithm

```
1. Read current CLAUDE.md and MASTER_REFACTORING_LOG.md
2. Scan conversation history from start to end
3. Extract:
   - Accomplishments (code written, bugs fixed, features added)
   - Decisions (architectural choices with rationale)
   - Issues (bugs discovered, problems identified)
   - Modified files (from tool calls and discussion)
   - Next steps (explicitly stated or implied)
4. Generate updates for each section
5. Use Edit tool to update specific sections (preserves formatting)
6. Verify updates don't corrupt file structure
```

### Safety Measures

- **Backup strategy**: Keep previous versions in git (rely on version control)
- **Validation**: Check that line numbers and section headers exist before editing
- **Rollback**: If edit fails, inform user and don't attempt further edits
- **Dry-run mode**: Optional flag to preview changes without applying

---

## 8. Usage Instructions

### As Slash Command

**Create file**: `.claude/commands/close-session.md`

**Invoke**: Type `/close-session` at end of coding session

**Expected behavior**:
1. Agent reads conversation
2. Asks for confirmation: "I'll update CLAUDE.md and MASTER_REFACTORING_LOG.md. Proceed?"
3. Updates files with Edit tool
4. Reports summary: "Updated X sections in CLAUDE.md, Y sections in MASTER_REFACTORING_LOG.md"
5. Optionally suggests git commit message

### As MCP Tool

**Install**: `npm install -g @user/session-closing-mcp-server`

**Configure**: Add to `.claude/settings.json`

**Invoke**: Use tool in Claude Code UI

---

## 9. Example Session

### Session Summary
- User asked about documentation consolidation
- Decided to keep CLAUDE.md and MASTER_REFACTORING_LOG.md separate
- Reduced CLAUDE.md from 429 to 256 lines
- Added session-closing agent as top priority task
- Made decision DEC-006 about documentation structure

### Agent Output

**CLAUDE.md Updates:**
- Current phase → Status: "Documentation restructure complete - Next: Build session-closing agent"
- Recent work → "Restructured CLAUDE.md as navigation hub, separated from MASTER_REFACTORING_LOG.md technical details"
- Known issues → Added "Session-closing agent not yet implemented" as top blocker

**MASTER_REFACTORING_LOG.md Updates:**
- Section 1 → Current Focus: "Documentation restructure complete. Next priority: Build session-closing agent for automatic documentation updates."
- Section 1 → Last Update: "17-12-2025"
- Section 7 → Added Task 0: "Design and Build Session-Closing Agent"
- Section 10 → Added DEC-006: Documentation Structure decision
- Section 12 → Added action log entry for 17-12-2025

**Git commit suggestion:**
```
docs: restructure CLAUDE.md as AI navigation hub

- Reduced CLAUDE.md from 429 to 256 lines (40% reduction)
- Separated AI quick reference (CLAUDE.md) from complete reference (MASTER_REFACTORING_LOG.md)
- Added session-closing agent specification
- Updated both files with current status and next steps
```

---

## 10. Testing Plan

### Test Cases

**TC-1: Normal session with accomplishments**
- Input: Session with code changes, decisions, and next steps
- Expected: All sections updated accurately

**TC-2: Session with no significant changes**
- Input: Session with just questions and discussion
- Expected: Minimal updates (date only, brief note)

**TC-3: Session with architectural decisions**
- Input: Session discussing trade-offs and making decisions
- Expected: Decision log entry added with full rationale

**TC-4: Session completing a task**
- Input: Session that finishes a task from Next Steps
- Expected: Task marked completed, next task promoted

**TC-5: Multiple decisions in one session**
- Input: Session with 3+ decisions
- Expected: All decisions logged correctly

### Success Criteria
- ✅ All sections updated accurately
- ✅ No corruption of markdown structure
- ✅ Updates match conversation content
- ✅ Execution time <60 seconds
- ✅ Works across different project structures

---

## 11. Future Enhancements

### Phase 2 Improvements
- Auto-generate git commit messages and offer to commit
- Detect file modifications from tool calls automatically
- Smart prioritization of tasks based on user comments
- Integration with issue trackers (GitHub Issues, Linear, etc.)
- Multi-session summaries (weekly/monthly rollups)

### Phase 3 Advanced Features
- Natural language queries: "What did we accomplish this week?"
- Automatic changelog generation
- Progress tracking with charts/graphs
- Team collaboration features (multi-user sessions)

---

## 12. References

- **Documentation best practices**: [GitHub example](https://github.com/theNetworkChuck/ai-in-the-terminal/blob/main/docs/07-context-files.md)
- **Claude Code slash commands**: `.claude/commands/` directory
- **MCP specification**: (TBD - research needed)

---

**END OF SPECIFICATION**

**Next Step**: Implement as `.claude/commands/close-session.md` slash command for MVP
