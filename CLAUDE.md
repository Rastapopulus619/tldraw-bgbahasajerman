# CLAUDE.md

**Purpose**: AI agent quick reference and navigation hub for starting coding sessions
**Audience**: Claude Code and other AI assistants
**Philosophy**: "What do I need to know to start coding RIGHT NOW?"

This file provides fast orientation for AI agents working in this repository. For complete technical details, implementation history, and API specifications, see `MASTER_REFACTORING_LOG.md`.

## Project: tldraw custom whiteboard application

This is a customized fork of the tldraw monorepo - an infinite canvas SDK for React applications. The main development focus is a custom whiteboard application with advanced file management and color customization capabilities.

**Documentation structure**:

- **This file (CLAUDE.md)**: Quick start, current status, navigation
- **MASTER_REFACTORING_LOG.md**: Complete project history, technical specs, API reference
- **CONTEXT.md files**: Package-specific architecture (use `yarn context` to find them)

## Current phase

**Status**: Documentation restructure complete - Next: Build session-closing agent
**Branch**: `feature/color-picker-modification`
**Recent work**: Restructured CLAUDE.md as navigation hub, separated from MASTER_REFACTORING_LOG.md technical details
**Immediate priority**: Design and implement session-closing agent for automatic documentation updates

## Quick start

### Running the custom application

The custom vite template requires two servers running simultaneously:

```bash
# Terminal 1: Vite dev server (port 5424)
yarn dev

# Terminal 2: Express API server (port 3001)
node templates/vite/server/index.js

# Or use convenience command (if configured)
yarn dev:full
```

### Essential commands reference

**Development**: `yarn dev`, `yarn dev-template <name>`, `yarn context`
**Type checking**: `yarn typecheck` (NEVER use bare `tsc`)
**Testing**: `yarn test run` (in specific workspace), `yarn e2e`
**Code quality**: `yarn lint`, `yarn format`, `yarn api-check`

## Repository overview

**Base**: tldraw monorepo - infinite canvas SDK for React
**Organization**: Yarn workspaces with packages for core editor, UI components, shapes, tools, and infrastructure
**Main development location**: `templates/vite/` - Custom whiteboard application

**Important**: There are CONTEXT.md files throughout this repository designed specifically for AI agents. Always read the relevant CONTEXT.md files to understand packages and their architecture.

## Key files and locations

**Custom application core**:

- `templates/vite/src/components/AppContainer.tsx` - Root component managing sidebar and canvas state
- `templates/vite/src/components/Sidebar/` - File tree UI components
- `templates/vite/src/hooks/` - Custom hooks (useWhiteboardLoader, useAutoSave, useKeyboardShortcuts, useFileOperations)

**Backend**:

- `templates/vite/server/index.js` - Express API server
- `templates/vite/server/routes/` - API route handlers
- `templates/vite/server/utils/` - File system and validation utilities

**Configuration and data**:

- `templates/vite/config/` - Color palette configuration files
- `userdata/whiteboards/` - Stored whiteboard files (.tldr format)
- `userdata/config/views/` - View configuration files (future feature)

**Package architecture**: See CONTEXT.md files in `packages/editor/`, `packages/tldraw/`, `packages/store/`, etc.

## Decisions made

**Architecture choices**:

- **Wrapper pattern**: Sidebar and Tldraw exist as independent sibling components within AppContainer (not parent-child) to maintain separation of concerns and independent state management
- **Store lifecycle**: Create new store on each whiteboard load and dispose old store to prevent memory leaks when switching between boards
- **Keyboard routing**: Use capture phase (`addEventListener(..., true)`) to intercept keyboard events before tldraw receives them, enabling proper sidebar/canvas focus management
- **Theme propagation**: TldrawWrapper propagates theme changes to parent via callback rather than context to maintain wrapper independence

**File format**:

- Custom `.tldr` format embeds metadata (color palette, timestamps, board name, read-only flag) directly in file
- File-based persistence in `/userdata/whiteboards/` for simplicity and portability over database
- Auto-save with 2000ms debounce balances responsiveness with performance

**API design**:

- Express 5 query parameters (`?id=path`) instead of path parameters due to wildcard route limitations
- Modular route structure (`server/routes/`) for maintainability
- Separate validation layer (`server/utils/validation.js`) for security

**Color system**:

- Extended to 28 colors (7x4 grid) vs standard 13 for richer creative options
- Position-based naming (`color1_R1C1` through `color28_R7C4`) for predictable ordering
- HSL color picker with auto-generation of light/dark variants for accessibility
- Per-whiteboard color palette storage enables board-specific color schemes

**File management**:

- VS Code-inspired sidebar for familiarity to developers
- Protected `welcome.tldr` file prevents accidental deletion of onboarding content
- Root directory visible and functional for better spatial awareness

## Custom extensions in this repository

### Key custom features

**Extended color palette system**

- 28 colors (vs standard 13) with position-based naming: `color1_R1C1` through `color28_R7C4`
- Custom HSL color picker modal with auto-generation of light/dark variants
- File-based persistence via Express API endpoints
- Color palette embedded in `.tldr` file metadata
- Save/reset palette buttons in hamburger menu (Preferences → Color palette)

**Custom sidebar with file management**

- VS Code-style collapsible sidebar with file tree navigation
- File operations: rename (F2), delete, copy/paste (Ctrl+C/V), drag-and-drop
- Keyboard shortcuts: Ctrl+B (toggle sidebar), Ctrl+Shift+E (toggle focus), Arrow keys (navigation)
- Context menu for file operations
- Folder expand/collapse with visual hierarchy
- Root directory (`whiteboards/`) visible and functional
- Protected `welcome.tldr` file (cannot be deleted or renamed)

**Whiteboard persistence**

- File-based storage in `/userdata/whiteboards/` directory
- Auto-save with 2000ms debounce (via `useAutoSave.ts` hook)
- Custom `.tldr` file format with embedded metadata (color palette, timestamps, board name, read-only flag)
- Store lifecycle management to prevent memory leaks

**Express backend API (port 3001)**

- Routes use query parameters (not path parameters) due to Express 5 wildcard limitations
  - Example: `/api/whiteboards/load?id=path/to/board.tldr`
- Key endpoints:
  - Whiteboards: `/api/whiteboards/load`, `/api/whiteboards/save`, `/api/whiteboards/delete`
  - File operations: `/api/files/copy`, `/api/files/move`, `/api/files/rename`, `/api/files/tree`
  - Colors: `/api/colors/custom`, `/api/colors/default`, `/api/colors/reset`, `/api/colors/save-as-default`
- Modular structure: `server/routes/`, `server/utils/fileSystem.js`, `server/utils/validation.js`

## Known issues and next steps

**🚨 IMMEDIATE NEXT STEP**: Design and implement session-closing agent for documentation updates

**Top current blockers**:

1. Session-closing agent not yet implemented (needed to keep docs in sync)
2. Renaming mode mouse click unresponsiveness in sidebar (Phase 4 refinement)
3. Keyboard event routing needs final consolidation

**Complete details**: See `MASTER_REFACTORING_LOG.md` Section 6 (Known Issues & Technical Debt) and Section 7 (Active Project: Next Steps)

## Essential commands

### Development

- `yarn dev` - Start development server for examples app (main SDK showcase)
- `yarn dev-app` - Start tldraw.com client app development
- `yarn dev-docs` - Start documentation site development
- `yarn dev-vscode` - Start VSCode extension development
- `yarn dev-template <template name>` - Runs a template
- `yarn context` - Find and display nearest CONTEXT.md file (supports -v, -r, -u flags)
- `yarn refresh-context` - Update CONTEXT.md files using Claude Code CLI

### Testing

- `yarn test run` in root - Run all tests (slow, avoid unless necessary)
- `yarn test run` in a workspace - Run tests in specific workspace (cd to workspace first)
- `yarn e2e` - Run end-to-end tests for examples
- `yarn e2e-dotcom` - Run end-to-end tests for tldraw.com

### Code quality

- `yarn lint` - Lint package
- `yarn typecheck` in workspace root - Type check all packages
- `yarn format` - Format code with Prettier
- `yarn api-check` - Validate public API consistency

IMPORTANT: NEVER run bare `tsc` - always use `yarn typecheck`.
If the `typecheck` command is not found, it's because you're not running it from the root of the repo.

## Architecture overview

**High-level summary**: This is a Yarn monorepo using tldraw SDK with custom extensions. Core packages: @tldraw/editor (engine), @tldraw/tldraw (full SDK), @tldraw/store (reactive DB), @tldraw/tlschema (types).

**Custom architecture**: Wrapper pattern with AppContainer managing Sidebar and TldrawWrapper as independent siblings. Store lifecycle creates new store on whiteboard load, keyboard routing uses capture phase.

**Complete details**: See root `CONTEXT.md` for monorepo architecture and package-specific `CONTEXT.md` files throughout repository (use `yarn context` to find them)

## Writing style guidelines

**Sentence case for titles and headings**

- Always use sentence case for titles, headings, and labels (NOT Title Case)
- Examples:
  - ✅ "Database configuration"
  - ❌ "Database Configuration"
  - ✅ "Real-time updates"
  - ❌ "Real-Time Updates"
  - ✅ "Custom shapes"
  - ❌ "Custom Shapes"
- Exception: Proper nouns, acronyms, and class/component names remain capitalized
  - ✅ "PostgreSQL database"
  - ✅ "WebSocket connections"
  - ✅ "NodeShapeUtil implementation"
- This applies to:
  - Markdown headers (##, ###, etc.)
  - Bold labels in lists (**Label**:)
  - Documentation titles
  - Code comments describing features
  - CONTEXT.md files

# important-instruction-reminders

Do what has been asked; nothing more, nothing less.
NEVER create files unless they're absolutely necessary for achieving your goal.
ALWAYS prefer editing an existing file to creating a new one.
NEVER proactively create documentation files (\*.md) or README files. Only create documentation files if explicitly requested by the User.

# IDE and development conventions

**Cursor IDE**: When writing examples, be sure to read the `./apps/examples/writing-examples.md` file for proper example patterns and conventions.

## Reference documents

**Project tracking**:

- `MASTER_REFACTORING_LOG.md` - Complete development history and refactoring log
- Git commit history - Detailed change tracking (see recent commits in git status above)

**Development guidelines**:

- `./apps/examples/writing-examples.md` - Example code patterns and conventions
- CONTEXT.md files throughout repository - Package-specific architecture details

**Agent specifications**:

- `.claude/specs/session-closing-agent-spec.md` - Session-closing agent design and implementation guide

**Configuration files**:

- `templates/vite/config/customColors.json` - Current custom color palette
- `templates/vite/config/defaultColors.json` - Default color palette fallback
- `.cursorrules` - Cursor IDE specific rules (if present)

**External documentation**:

- tldraw.dev - Official tldraw SDK documentation
- CONTEXT.md files - AI-specific package documentation throughout the repository
