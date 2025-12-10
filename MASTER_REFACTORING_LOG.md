# 💡 MASTER_REFACTORING_LOG.md

> **SYSTEM INSTRUCTION FOR AI AGENTS:**
> This file is the Single Source of Truth (SSOT) for the project state.
> Do not trust your training data over this file.
> Do not hallucinate files that are not listed here.
> Adhere strictly to the "Maintenance Protocol" below and **do not** divert from the structure of the file when appending, removing, or updating points or sections.

## 🤖 AI MAINTENANCE PROTOCOL

**When you are asked to work on this project, you must first:**

1. Read this file completely.
2. Ask the user if they wish to perform a **State Synchronization** (Instruction A).

**STANDARD INSTRUCTIONS (The "Menu"):**
If triggered, perform the following strictly:

- **[Instruction A] SYNC & UPDATE:** Ask user: "Shall I update the 'Completed Phases' based on recent work?"
  - _CRITICAL:_ Do not move an item from "Planned" to "Completed" without explicit user confirmation that it is fully functional.
  - Update the **Action Log** (`## 8. ACTION LOG`) at the bottom.

- **[Instruction B] LOG NEW IDEA:** Add the user's thought to the `## 7. IDEA BACKLOG` section. Do not modify the active plan yet.

- **[Instruction C] PROMOTE IDEA:** Move an item from `## 7. IDEA BACKLOG` to `## 5. ACTIVE PROJECT: NEXT STEPS`.
  - Ask user: "I can promote this idea to the current task queue. Should I put it at the **Top Priority** (next item to work on), **Low Priority** (after existing plans), or should I create a **New Phase** (if it targets a distinct feature set)?"

- **[Instruction D] REALITY CHECK (AUDIT):** Scan the file's "Current State" sections and compare the **functionality, features, and logical approach** against the actual provided code files.
  - Report major discrepancies, especially where the code's approach logically changed from the plan (e.g., using a different component structure).
  - Minor technical details that do not change functionality should not be reported as a discrepancy.

- **[Instruction E] ARCHITECTURAL DECISION:** If a major decision is changed, log it in `## 6. DECISION LOG` and add a brief blockquote pointer `> [!NOTE] See Decision #X` in the relevant text section.

---

# 1. PROJECT STATUS OVERVIEW

**Current Focus:** Side-bar Refactoring: Testing and fixing bugs in Phase 4 (File Operations).
**Overall State:** Core architecture (Phases 1-3) is implemented and stable. Phase 4 implemented but requires testing and bug fixes. Phases 5-7 are planned.
**Last Update:** 09-12-2025

---

# 2. LEGACY PROJECT: COLOR-PALETTE-REFACTORING (Archived)

- **Status:** **COMPLETED ✅ (Archived)**.
- **Summary:** Extended the tldraw color palette from 13 to 28 colors, renamed all colors to a position-based system (`color1_R1C1` through `color28_R7C4`), and implemented file-system persistence for custom colors via an Express API.
- **Programmatic Details:**
  - **Color storage format:** `{ "colorX_RNCM": { "light": "#hex", "dark": "#hex" } }`
  - **HSL auto-generation:** Implemented in `ColorPickerModal.tsx` with automatic light/dark value calculation
  - **Express endpoints:** Port 3001 with routes `/api/colors/custom`, `/api/colors/default`, `/api/colors/reset`, `/api/colors/save-as-default`
  - **Frontend integration:** `useCustomColors.ts` hook provides `getColor()`, `updateColor()`, `resetColors()`, and `saveAsDefault()` methods
  - **File location:** `/templates/vite/config/custom-colors.json`
- **Key Files Modified/Created:** `packages/tldraw/src/lib/ui/context/actions.tsx`, `packages/tldraw/src/lib/ui/components/ColorPaletteMenu.tsx` (new file), `/templates/vite/config/custom-colors.json`.
- **Persistence Detail:** Color configs are currently stored in `/templates/vite/config/custom-colors.json`. The Sidebar Refactoring project supersedes this by requiring the palette to be **embedded in the `.tldr` board file metadata.**

---

# 3. ACTIVE PROJECT: SIDEBAR-REFACTORING

## 3.1 Architectural Foundation & Requirements

- **Goal:** Add a collapsible VS Code-style sidebar with file navigation.
- **Key Principle (Wrapper Architecture):** Sidebar and tldraw exist as **independent sibling components** within an `<AppContainer>`. The sidebar must persist its state (scroll, expanded folders) when the tldraw canvas re-renders.
- **Storage Location:** All user data is stored on the server file system in a separate directory structure starting at `/home/linuxrasta/projects/tldraw-full/userdata/`.
- **Auto-save:** Implemented via the `useAutoSave.ts` hook with a **2000ms debounce**.
- **Data Format:** Board files use the `.tldr` extension and embed the color palette within the board file's metadata (`metadata.colorPalette`).

## 3.2 Implemented Phases (Current Reality)

### **Phase 1: Foundation & Backend** (COMPLETED ✅)

**Summary:** Modular server structure was created, core TypeScript types defined, and all foundational API endpoints (Whiteboards, File tree, Views, File operations) were implemented.

**Programmatic Implementation:**

- **Modular server architecture:**
  - Entry point: `templates/vite/server/index.js` (Express app on port 3001)
  - Route modules: `server/routes/fileOperations.js` for file/folder operations
  - Utility modules: `server/utils/fileSystem.js` (buildFileTree, generateUniqueFilename, pinning welcome.tldr), `server/utils/validation.js` (isValidFilename, isValidWhiteboardId)
- **API pattern:** Query parameter routes (not path parameters) due to Express 5 wildcard limitation
  - Example: `/api/whiteboards/load?id=path/to/board.tldr`
  - Rationale: Path parameters (`/:id`) don't capture slashes in Express 5
- **Auto-save implementation:**
  - Hook: `useAutoSave.ts` with 2000ms debounce
  - Mechanism: `editor.store.listen()` callback triggers debounced save
  - Endpoint: `POST /api/whiteboards/save?id=...`
- **Board file format:**
  ```typescript
  {
    tldrawSnapshot: TLStoreSnapshot,
    metadata: {
      colorPalette: { /* 28 colors */ },
      createdAt: "ISO timestamp",
      lastModified: "ISO timestamp",
      boardName: "optional name",
      readOnly: true/false
    }
  }
  ```
- **Directory structure:**
  - `/home/linuxrasta/projects/tldraw-full/userdata/whiteboards/` - All board files
  - `/home/linuxrasta/projects/tldraw-full/userdata/config/views/` - View configurations

**Key Files/Components:** `/templates/vite/server/index.js`, `server/routes/fileOperations.js`, `server/utils/fileSystem.js`, `server/utils/validation.js`, `AppContainer.tsx`, `useAutoSave.ts`, `/userdata/whiteboards/welcome.tldr`.

### **Phase 2: Basic Sidebar Structure** (COMPLETED ✅)

**Summary:** Basic Sidebar, FileTree, and FileTreeNode components created and styled. Key fixes included adding **Vite proxy configuration** in `vite.config.ts` to resolve CORS issues and integrating tldraw's theme variables (`--tl-color-*`) with fallbacks.

**Programmatic Implementation:**

- **Vite proxy configuration:**
  - File: `vite.config.ts`
  - Config: `server: { proxy: { '/api': { target: 'http://localhost:3001', changeOrigin: true } } }`
  - Purpose: Enables Tailscale remote access (no hardcoded localhost URLs)
- **Theme integration mechanism:**
  - Component: `TldrawWrapper.tsx` wraps `<Tldraw>` component
  - Hook: `useIsDarkMode()` from tldraw monitors theme changes
  - Propagation: Calls `onThemeChange(isDarkMode)` to parent `AppContainer`
  - Application: `AppContainer` applies `.theme-dark` or `.theme-light` class to root div
- **CSS variable fallback pattern:**
  - Format: `var(--tl-color-panel, #f5f5f5)` for all theme colors
  - Variables used: `--tl-color-panel`, `--tl-color-text`, `--tl-color-muted-2`, `--tl-color-focus`, `--tl-radius-2`
  - Ensures sidebar works even outside tldraw's theme context
- **Component structure:**
  - `Sidebar.tsx`: Collapsible header with "Files" title and toggle button, scrollable content area
  - `FileTree.tsx`: Renders root node and manages file operations
  - `FileTreeNode.tsx`: Recursive rendering with indentation (`paddingLeft: ${depth * 16 + 8}px`)

**Key Files/Components:** `Sidebar.tsx`, `Sidebar.css`, `FileTree.tsx`, `FileTree.css`, `FileTreeNode.tsx`, `FileTreeNode.css`, `TldrawWrapper.tsx`, `vite.config.ts` (modified).

### **Phase 3: Core Navigation Features** (COMPLETED ✅)

**Summary:** Implemented folder expand/collapse, whiteboard loading (`useWhiteboardLoader.ts`), and the core keyboard shortcuts for usability (`Ctrl+B` for sidebar toggle, `Ctrl+Shift+E` for focus).

**Programmatic Implementation:**

- **Store management logic:**
  - Hook: `useWhiteboardLoader.ts`
  - Process:
    1. Fetch board data: `GET /api/whiteboards/load?id=...`
    2. Create new store: `createTLStore({})`
    3. Load snapshot: `loadSnapshot(newStore, boardData.tldrawSnapshot)`
    4. Dispose old store (automatic via React state replacement)
    5. Pass new store to `<Tldraw store={store} />`
  - Error handling: Falls back to `welcome.tldr` on any load error
- **Keyboard architecture:**
  - Hook: `useKeyboardShortcuts.ts`
  - Strategy: Uses **capture phase** (`window.addEventListener(..., true)`) to intercept events before tldraw
  - Global shortcuts: Ctrl+B (toggle sidebar), Ctrl+Shift+E (toggle focus)
  - Sidebar shortcuts: F2 (rename), Delete, Ctrl+C/V, Arrow keys, Enter, Escape
  - Blocking mechanism: `e.stopPropagation()` on all non-modifier keys when sidebar focused
- **Focus management:**
  - State: `sidebarActive` boolean in `AppContainer.tsx`
  - Visual indicator: Blue 3px border on sidebar right edge when active
  - Triggers: Click on sidebar/canvas, Ctrl+Shift+E keyboard shortcut
- **File tree sorting:**
  - Function: `buildFileTree()` in `server/utils/fileSystem.js`
  - Order: `welcome.tldr` pinned to top → folders (alphabetical) → files (alphabetical)
  - Implementation: Custom sort comparator checks for `welcome.tldr` first, then type, then name

**Critical Fix - API Route Pattern:**

> [!NOTE] See Decision Log #DEC-001 regarding API Route Pattern.

**Key Files/Components:** `useWhiteboardLoader.ts`, `useKeyboardShortcuts.ts`, `server/index.js` (modified for query routes), `AppContainer.tsx`, `FileTreeNode.tsx`.

### **Phase 4: File Operations** (**IN PROGRESS - Requires Testing & Fixes**)

**Summary:** The ContextMenu component was created. Core operations like **rename, delete, copy/paste, and drag-and-drop** (move by default, Ctrl to copy) were implemented. **Arrow key navigation** (Up/Down) was added. Root directory made visible and functional.

**Programmatic Implementation:**

- **Context menu system:**
  - Component: `ContextMenu.tsx`
  - Trigger: Right-click on `FileTreeNode` sets `contextMenu` state with `{ x, y }` coordinates
  - Positioning: Adjusts via `useEffect` to prevent off-screen rendering
  - Close behavior: Click outside (mousedown listener) or Escape key
- **Keyboard operation exposure pattern:**
  - Location: `FileTree.tsx` lines 45-142
  - Mechanism: Exposes operations via `window.__sidebarFileOps` object
  - Methods: `startRename()`, `deleteSelected()`, `copySelected()`, `pasteToSelected()`, `navigateUp()`, `navigateDown()`, `expandSelected()`, `collapseSelected()`, `openSelected()`
  - Consumption: `useKeyboardShortcuts.ts` calls these methods on key presses
  - Purpose: Avoids duplicate keyboard listeners (only one in capture phase)
- **Smart paste destination logic:**
  - Algorithm (FileTree.tsx lines 98-109):
    1. If nothing selected → paste to root (`destinationPath = ''`)
    2. If folder selected → paste into folder (`destinationPath = selectedNode.path`)
    3. If file selected → paste into file's parent directory
  - Path computation: Split by `/`, pop filename, join remainder
- **Drag-and-drop implementation:**
  - Draggable: All nodes except `welcome.tldr` and root (`draggable={!isWelcomeBoard && !isRootNode}`)
  - Operation detection: `e.ctrlKey` during drag determines copy vs move
  - Visual feedback: `isDragOver` state applies `.file-tree-node__item--drag-over` class (blue highlight)
  - API calls: `POST /api/files/copy` or `POST /api/files/move` with `{ sourcePath, destinationPath }`
- **Arrow key navigation:**
  - Tree flattening: `flattenTree()` function creates array of all visible paths (depth-first)
  - Navigation: `navigateUp/Down()` finds current index, moves to prev/next, calls `onSelectedFileChange()`
  - Open on Enter: `openSelected()` checks if path ends with `.tldr`, calls `onWhiteboardSelect()`
- **Root directory virtual node:**
  - Creation: `FileTree.tsx` lines 148-155
  - Properties: `id: '__root__'`, `name: 'whiteboards/'`, `type: 'folder'`, `path: ''`, `children: nodes`
  - Styling: Bold text, non-draggable, rename/delete disabled
  - Function: Provides visible root for drag-drop destination and paste target
- **Protection mechanisms:**
  - `welcome.tldr`:
    - Frontend: Context menu options disabled, `draggable={false}`, F2/Delete show alert before blocking
    - Backend: `DELETE /api/whiteboards/delete?id=welcome.tldr` returns 403 error
  - Root directory:
    - Frontend: Context menu rename/delete/copy disabled, `draggable={false}`
    - Selection: Allowed (for paste destination)

**Known Issue:** This phase is not yet stable and requires testing and bug fixes before being marked complete.

---

# 4. KNOWN ISSUES & TECHNICAL DEBT (Immediate Focus)

These are bugs and deferred polish items that prevent Phase 4 from being complete or are blocking Phase 5 work.

## **Failing Tests/Bugs in Phase 4:**

### **1. Arrow Left/Right Expand/Collapse NOT IMPLEMENTED** ✅ **FIXED**

- **Location:** `FileTree.tsx` lines 70-77
- **Issue:** `expandSelected()` and `collapseSelected()` only log to console, do not actually expand/collapse folders
- **Impact:** Keyboard navigation incomplete - users must use mouse to expand folders
- **Root Cause:** No mechanism to pass expand/collapse state management functions from `FileTreeNode` (which owns `isExpanded` state) back to the keyboard handler
- **Fix Applied:** Refactored to lift `isExpanded` state up to `FileTree` component using a `Set` of expanded paths. Updated `expandSelected()` and `collapseSelected()` to toggle the selected folder's expanded state.

### **2. Root Directory Drag-Drop Destination Path Bug** ⚠️ **MEDIUM**

- **Location:** `FileTreeNode.tsx` line 122
- **Issue:** When dropping into root node (`path === ''`), destination path becomes `/${fileName}` instead of just `fileName`
- **Impact:** Files dropped into root may get extra leading slash, causing file system errors
- **Fix Required:** Check if `node.path === ''` before building destination: `const destinationPath = node.path ? \`\${node.path}/\${fileName}\` : fileName`

### **3. Context Menu Position Flash on First Render** ⚠️ **LOW**

- **Location:** `ContextMenu.tsx` lines 48-68
- **Issue:** Position adjustment happens in `useEffect` after initial render, may briefly flash off-screen
- **Impact:** Minor visual glitch on right/bottom edge context menus
- **Severity:** Cosmetic only, does not affect functionality

### **4. No Visual Feedback for Copy Operation** ⚠️ **MEDIUM**

- **Location:** `FileTree.tsx` line 158 (clipboard console.log only)
- **Issue:** When user copies a file, there's no UI indication that clipboard has data
- **Impact:** User doesn't know if copy was successful, may paste without knowing what's in clipboard
- **Enhancement Needed:** Add subtle badge/icon to show clipboard state (e.g., clipboard icon in header)

### **5. Paste Smart Destination Root Path Edge Case** ⚠️ **LOW**

- **Location:** `FileTree.tsx` lines 111-112
- **Issue:** When computing `fullDestination`, root path (`''`) handling is untested
- **Impact:** May create malformed paths like `/filename` instead of `filename` (edge case)
- **Status:** Code looks correct but requires testing to confirm

## **Other Known Issues:**

- **Modal Components:** Uses browser `alert()` and `confirm()` instead of custom modals. This is planned for Phase 7.
- **Drag-Drop Indicator:** No blue insertion indicator line for drag-and-drop (deferred to Phase 7).

---

# 5. ACTIVE PROJECT: NEXT STEPS (The Priority Queue)

This section is the current to-do list for development.

### 🧪 Task 1: Execute Phase 4 Completion Test Suite

**Goal:** Achieve 100% test pass rate to mark Phase 4 as COMPLETE.
**First Step:** Restart the app (`yarn dev:full`).

**Keyboard Shortcuts Test:**

- **1. F2 Key (Rename):** Test select, F2, rename+Enter, and F2, Escape (Cancel).
- **2. Delete Key:** Test select, Delete, confirm, and test protection for `welcome.tldr`.
- **3. Ctrl+C / Ctrl+V (Copy/Paste):** Test copying a file, pasting into a folder, and pasting into the root `whiteboards/` folder.
- **4. Arrow Keys:** Test Arrow Down/Up for selection, and Enter to open. **NOTE: Arrow Left/Right to expand/collapse is currently a known issue (Section 4).**
- **5. Ctrl+B (Sidebar Toggle):** Confirm functionality.
- **6. Ctrl+Shift+E (Focus Toggle):** Confirm functionality and console output.
- **7. Sidebar Focus Block:** Confirm that when the sidebar is focused (blue border), pressing any key (a, v, t, r, numbers) does not affect the tldraw canvas.

**UI Interactions Test:**

- **8. Folder Click Behavior:** Test clicking the folder name (highlights, doesn't expand) versus clicking the chevron (expands/collapses, doesn't highlight). Check chevron hover effect.
- **9. Context Menu:** Test right-click on file and folder. Check "Delete" is RED. Check `welcome.tldr` protection (grayed out options). Test "Paste" button state (enabled/disabled).
- **10. Root Directory (`whiteboards/`):** Confirm visibility, selection (highlights), drag-drop into it, and that Rename/Delete options are disabled on the root folder.
- **11. Auto-Refresh:** Confirm file creation, deletion, renaming, and dragging all update the file tree instantly.

**Success Criteria:** When all tests pass and the code is confirmed, the agent should update Phase 4 in the document to:

```markdown
✨ Phase 4 - 100% COMPLETE!
All features working:

- ✅ Context menu with all operations
- ✅ Rename (F2 + context menu + inline editing)
- ✅ Delete (Delete key + context menu) with welcome.tldr protection
- ✅ Copy (Ctrl+C + context menu)
- ✅ Paste (Ctrl+V + context menu) with smart destination
- ✅ Drag-and-drop (move by default, Ctrl to copy)
- ✅ Create new files/folders (buttons in header)
- ✅ Folders selectable with separate expand control
- ✅ Root directory visible and functional
- ✅ Arrow key navigation
- ✅ All keyboard shortcuts working
- ✅ Auto-refresh after all operations
- ✅ welcome.tldr fully protected
```

### 📋 Task 2: Phase 5 - View System

- View configuration storage working (JSON files in `userdata/config/views/`).
- View selector UI functional (dropdown).
- Filtered file tree based on selected view.
- View creation/editing/deletion working.

### 📋 Task 3: Phase 6 - Search & Advanced Features

- Implement inline search pane (`Ctrl+F` shortcut).
- Real-time highlighting of matches in file tree.
- Navigation through matches (F3/Shift+F3).

### 📋 Task 4: Phase 7 - Performance & Polish

- Implement **Custom Modal Components** (replacing browser alerts).
- Implement drag-drop blue insertion indicator.
- Final performance audit and polish.

---

# 6. DECISION LOG

| ID      | Date (DD-MM-YYYY) | Context           | Verdict                                                                                                                                                                                                                                                                                                   |
| :------ | :---------------- | :---------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| DEC-001 | 09-12-2025        | API Route Pattern | Switched from `/:id` (path) routes to **query parameter routes** (`?id=...`) due to Express 5 wildcard issue. Path parameters don't capture slashes in nested file paths like `folder/board.tldr`. Query parameters solve this: `/api/whiteboards/load?id=folder/board.tldr` with `encodeURIComponent()`. |
| DEC-002 | [Date]            | [Context]         | [Verdict]                                                                                                                                                                                                                                                                                                 |

---

# 7. IDEA BACKLOG

This section is for new ideas that are not yet prioritized into the active plan.

- **Fix Retroactive Color Changes:** Store actual hex values in shapes to freeze colors at creation time, preventing retroactive color changes when the palette is customized. Integrate with whiteboard persistence.
- **Undo Support for File Ops:** Implement undo/redo for destructive file operations (low priority).
- **Wikipedia-style Hyperlinks:** Add a system of hyperlinks like Wikipedia, that can connect any whiteboard to any other one in a Wikipedia style.

---

# 8. ACTION LOG (Session History)

| Date (DD-MM-YYYY) | Agent | Action                                                                                                                                                                                                                                             | Status    |
| :---------------- | :---- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :-------- |
| 09-12-2025        | Agent | Consolidated four source files into Preliminary Master Document                                                                                                                                                                                    | Completed |
| 09-12-2025        | Agent | Performed comprehensive code audit: Read all Phase 1-4 implementation files, analyzed Phase 4 for bugs, enriched Sections 2 & 3.2 with programmatic details, identified 5 bugs in Phase 4, integrated full Phase 4 Test Plan into Section 5 Task 1 | Completed |
| 09-12-2025        | Agent | Finalized MASTER_REFACTORING_LOG.md: Updated "Known Issues" with 5 identified bugs, set Last Update date to 09-12-2025, created final file at project root                                                                                         | Completed |
| 09-12-2025        | Agent | Fixed Phase 4 bugs: Implemented expand/collapse via keyboard, added rename validation, clipboard timeout, fixed drag-drop destination path, improved paste destination logic. Added Wikipedia hyperlinks idea to backlog.                          | Completed |

---

**END OF MASTER_REFACTORING_LOG.md**

This document serves as the single source of truth for the tldraw sidebar refactoring project. All implementation decisions, architecture details, technical specifications, and project status are captured here. Update this document as the project progresses to maintain accuracy.
