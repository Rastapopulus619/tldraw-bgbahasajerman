# tldraw Sidebar Refactoring - Complete Implementation Plan

**Date Created:** 2025-01-06  
**Status:** Ready for Implementation  
**Base Template:** `templates/vite/`

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Architecture Decisions](#architecture-decisions)
3. [Confirmed Requirements](#confirmed-requirements)
4. [Directory Structure](#directory-structure)
5. [Technology Stack](#technology-stack)
6. [Implementation Phases](#implementation-phases)
7. [API Endpoints](#api-endpoints)
8. [Data Formats](#data-formats)
9. [Edge Cases & Conflict Resolution](#edge-cases--conflict-resolution)
10. [Performance Strategy](#performance-strategy)
11. [Testing Checklist](#testing-checklist)

---

## Project Overview

### Goal

Add a collapsible VS Code-style sidebar with file navigation to the self-hosted tldraw application (vite template). The sidebar must persist its state during whiteboard switching, with all data stored on the Ubuntu server's file system.

### Key Principle

**Wrapper Architecture:** Sidebar and tldraw are independent sibling components. When switching whiteboards, only the tldraw component re-renders - the sidebar remains mounted and preserves all state (scroll position, expanded folders, selection, etc.).

---

## Architecture Decisions

### ✅ Confirmed Decisions

| Decision                  | Choice                                            | Rationale                                             |
| ------------------------- | ------------------------------------------------- | ----------------------------------------------------- |
| **Base Template**         | Extend `templates/vite/`                          | Already has Express server, simplest starting point   |
| **Sync Method**           | REST API (not WebSocket)                          | Simpler for initial implementation, can upgrade later |
| **Directory Location**    | `/home/linuxrasta/projects/tldraw-full/userdata/` | Project root, separate from template code             |
| **View Config Location**  | `/userdata/config/views/`                         | Organized within userdata structure                   |
| **Color Palette Storage** | Embedded in board file (Option A)                 | Self-contained, single file per board                 |
| **File Extension**        | `.tldr`                                           | Short, recognizable tldraw format                     |
| **Auto-save Debounce**    | 2000ms (2 seconds)                                | Balanced between responsiveness and server load       |
| **Default Board**         | `welcome.tldr` (read-only template)               | Starting point with instructions                      |
| **New Board Naming**      | `untitled-[timestamp].tldr`                       | Auto-naming prevents overwrites                       |
| **View System Initial**   | Show all files (no filtering)                     | User can create custom views later                    |
| **File Protection**       | Detection + warnings (not locking)                | OS-agnostic, handles conflicts gracefully             |
| **Theme Integration**     | Use `--tl-*` CSS variables                        | Automatic theme sync with tldraw                      |

---

## Confirmed Requirements

### Core Features

#### 1. **Sidebar Functionality**

- ✅ Collapsible sidebar (toggle button + keyboard shortcut)
- ✅ File tree with expandable/collapsible folders
- ✅ Single-click: Select/highlight file
- ✅ Double-click: Open whiteboard in tldraw
- ✅ Visual indication of currently active whiteboard
- ✅ Persist state during whiteboard switches (scroll, expanded folders, selection)
- ✅ Vertical scrollbar for overflow
- ✅ Horizontal overflow: Text truncation with ellipsis + tooltip on hover
- ✅ Focus state management (sidebar active vs tldraw active)

#### 2. **File Operations (VS Code-style)**

- ✅ **Rename:** Right-click or F2, with duplicate name validation
- ✅ **Delete:** Right-click or Delete key, with optional confirmation
- ✅ **Create New File:** Context menu + top bar button
- ✅ **Create New Folder:** Context menu + top bar button
- ✅ **Cut:** Ctrl+X (prepare for move)
- ✅ **Copy:** Ctrl+C (prepare for copy)
- ✅ **Paste:** Ctrl+V (complete move/copy)
- ✅ **Drag and Drop:** Move by default, Ctrl+Drag to copy
- ✅ Visual feedback: Loading indicators, error messages, ghost images

#### 3. **View Management**

- ✅ Multiple user-defined views (e.g., "Teaching", "Projects")
- ✅ Each view filters which folders are visible
- ✅ Dropdown to switch between views
- ✅ Default "All Files" view shows everything
- ✅ Views stored as JSON config files

#### 4. **Search Functionality**

- ✅ Ctrl+F keyboard shortcut
- ✅ Inline search pane within sidebar
- ✅ Real-time highlighting of matches
- ✅ Navigate through matches (F3/Shift+F3)
- ✅ Close with Escape
- ✅ Match file/folder names (case-insensitive)

#### 5. **Auto-save System**

- ✅ Changes auto-save to disk without manual intervention
- ✅ 2000ms debounce on store changes
- ✅ Trigger on shape create/update/delete
- ✅ Visual indicator during save (optional)

#### 6. **Color Palette Per Board**

- ✅ Each board stores its own color palette configuration
- ✅ Embedded in board file as metadata
- ✅ Old boards maintain original colors
- ✅ New boards start with current palette
- ✅ Palette applied on board load

#### 7. **Theme Integration**

- ✅ Sidebar uses tldraw's CSS variables (`--tl-color-*`, `--tl-radius-*`, etc.)
- ✅ Automatic light/dark mode switching
- ✅ Scrollbar styling matches theme

---

## Directory Structure

### Project Root: `/home/linuxrasta/projects/tldraw-full/`

```
tldraw-full/
├── userdata/                          # All user data (NEW)
│   ├── config/                        # Configuration files (NEW)
│   │   └── views/                     # View definitions (NEW)
│   │       ├── default-view.json      # Shows all files
│   │       ├── teaching-view.json     # Example custom view
│   │       └── projects-view.json     # Example custom view
│   └── whiteboards/                   # All whiteboard files (NEW)
│       ├── welcome.tldr               # Default read-only template board
│       ├── untitled-1.tldr            # Auto-created editable board
│       ├── project-a/                 # User-created folder
│       │   ├── board-1.tldr
│       │   └── board-2.tldr
│       └── teaching/                  # User-created folder
│           └── lesson-1.tldr
│
├── templates/
│   └── vite/                          # Base template (MODIFY)
│       ├── src/
│       │   ├── components/            # NEW
│       │   │   ├── AppContainer.tsx   # Wrapper component
│       │   │   ├── Sidebar/           # Sidebar component & subcomponents
│       │   │   │   ├── Sidebar.tsx
│       │   │   │   ├── FileTree.tsx
│       │   │   │   ├── FileTreeNode.tsx
│       │   │   │   ├── ContextMenu.tsx
│       │   │   │   ├── SearchPane.tsx
│       │   │   │   └── ViewSelector.tsx
│       │   │   └── TldrawCanvas.tsx   # Wrapper for Tldraw component
│       │   ├── hooks/                 # NEW
│       │   │   ├── useFileTree.ts
│       │   │   ├── useAutoSave.ts
│       │   │   ├── useKeyboardShortcuts.ts
│       │   │   └── useFocusManager.ts
│       │   ├── api/                   # NEW
│       │   │   ├── whiteboards.ts     # API client for whiteboard endpoints
│       │   │   ├── fileTree.ts        # API client for file tree
│       │   │   └── views.ts           # API client for views
│       │   ├── types/                 # NEW
│       │   │   └── index.ts           # TypeScript types
│       │   ├── App.tsx                # MODIFY - now renders AppContainer
│       │   ├── main.tsx               # No changes
│       │   └── index.css              # MODIFY - add sidebar styles
│       ├── server/                    # NEW (was single server.js)
│       │   ├── index.ts               # Main server entry point
│       │   ├── routes/                # Route handlers
│       │   │   ├── whiteboards.ts
│       │   │   ├── fileTree.ts
│       │   │   ├── views.ts
│       │   │   └── colors.ts          # Existing color routes (keep for compatibility)
│       │   ├── utils/                 # Server utilities
│       │   │   ├── fileSystem.ts
│       │   │   └── validation.ts
│       │   └── types.ts               # Server-side types
│       ├── config/                    # Keep existing
│       │   ├── custom-colors.json     # Keep for backward compatibility
│       │   └── default-colors.json    # Keep for backward compatibility
│       ├── package.json               # MODIFY - add new dependencies
│       └── server.js                  # REPLACE with server/index.ts (or keep as entry point)
│
└── REFACTORING_PLAN.md                # This file
```

### Key Directory Notes

1. **`userdata/` at project root:** Keeps user data separate from template code
2. **`userdata/config/views/`:** View configurations (which folders are visible)
3. **`userdata/whiteboards/`:** All whiteboard files, supports nested folders
4. **`templates/vite/src/components/`:** All new React components
5. **`templates/vite/server/`:** Refactored Express server (was single `server.js`)

---

## Technology Stack

### Frontend

- **React 18** - Already in use
- **TypeScript** - Already in use
- **CSS Modules** - For scoped sidebar styles
- **react-window** - Virtual scrolling (if needed for large trees)
- **tldraw** - Core canvas component

### Backend

- **Node.js 20+** - Already required
- **Express.js 5** - Already in use
- **cors** - Already in use
- **fs/promises** - Built-in Node.js file operations

### Build Tools

- **Vite 7** - Already in use
- **TypeScript 5.8** - Already in use
- **concurrently** - Already in use (run frontend + backend)

### Optional Future Additions

- **chokidar** - File watching (if real-time updates needed)
- **react-virtualized** - Alternative to react-window

---

## Implementation Phases

### **Phase 1: Foundation & Backend** (Est: 2-3 days)

#### Objectives

- Set up directory structure
- Extend Express server with new API endpoints
- Create container component architecture
- Implement store management and auto-save

#### Tasks

**1.1 Directory Structure Setup**

- [ ] Create `/home/linuxrasta/projects/tldraw-full/userdata/` directory
- [ ] Create `userdata/config/views/` subdirectory
- [ ] Create `userdata/whiteboards/` subdirectory
- [ ] Create `welcome.tldr` (default empty board with instructions)
- [ ] Create `default-view.json` (shows all files)
- [ ] Add `.gitignore` entries for user data (optional: keep structure, ignore content)

**1.2 Backend Server Extension**

- [ ] Refactor `server.js` into `server/` directory structure
- [ ] Create `server/routes/whiteboards.ts` with endpoints:
  - `GET /api/whiteboards/:id` - Load whiteboard data
  - `POST /api/whiteboards/:id` - Save/update whiteboard
  - `POST /api/whiteboards` - Create new whiteboard
  - `DELETE /api/whiteboards/:id` - Delete whiteboard
- [ ] Create `server/routes/fileTree.ts` with endpoint:
  - `GET /api/file-tree` - Get directory structure
- [ ] Create `server/routes/views.ts` with endpoints:
  - `GET /api/views` - List all views
  - `GET /api/views/:name` - Load specific view
  - `POST /api/views/:name` - Save/update view
  - `DELETE /api/views/:name` - Delete view
- [ ] Create `server/routes/fileOperations.ts` with endpoints:
  - `POST /api/files/rename` - Rename file or folder
  - `DELETE /api/files` - Delete file or folder (body: {path})
  - `POST /api/files/copy` - Copy file or folder
  - `POST /api/files/move` - Move file or folder
  - `POST /api/folders` - Create new folder
- [ ] Implement validation and error handling
- [ ] Keep existing color routes for backward compatibility

**1.3 Board File Format**

- [ ] Define TypeScript interface for board file:
  ```typescript
  interface BoardFile {
  	tldrawSnapshot: TLStoreSnapshot
  	metadata: {
  		colorPalette: ColorPaletteConfig
  		createdAt: string
  		lastModified: string
  		boardName?: string
  	}
  }
  ```
- [ ] Implement save/load logic with embedded color palette
- [ ] Create migration for existing boards (if any)

**1.4 Container Component Structure**

- [ ] Create `src/components/AppContainer.tsx`:
  - State: `currentWhiteboardId`, `sidebarCollapsed`, `sidebarActive`, `currentView`
  - Props passing to Sidebar and TldrawCanvas
  - Keyboard shortcut handling for focus switching
- [ ] Modify `src/App.tsx` to render `<AppContainer />`
- [ ] Create `src/components/TldrawCanvas.tsx` (wrapper for `<Tldraw />`)

**1.5 Store Management & Auto-save**

- [ ] Create `src/hooks/useAutoSave.ts`:
  - Listen to `editor.store.listen()`
  - Debounce changes (2000ms)
  - POST to `/api/whiteboards/:id`
  - Handle save success/failure
- [ ] Implement store creation/disposal logic:
  - Create new store on whiteboard switch
  - Load snapshot into store
  - Apply color palette from metadata
  - Dispose old store properly
- [ ] Handle loading states during whiteboard switch

**Deliverables:**

- ✅ Working backend API with all endpoints
- ✅ Directory structure created
- ✅ Container component with state management
- ✅ Auto-save functionality working
- ✅ Board file format with embedded color palette

---

### **Phase 2: Basic Sidebar Structure** (Est: 2-3 days)

#### Objectives

- Create sidebar component with basic layout
- Display file tree
- Implement collapse/expand functionality
- Integrate theme styling

#### Tasks

**2.1 Sidebar Component Structure**

- [ ] Create `src/components/Sidebar/Sidebar.tsx`:
  - Fixed width (250px default, resizable later?)
  - Collapsible toggle button
  - Top bar with action buttons
  - Scrollable content area
  - Focus state visual indicators
- [ ] Create `src/components/Sidebar/Sidebar.module.css`:
  - Use `--tl-color-*` CSS variables
  - Light/dark theme support
  - Scrollbar styling

**2.2 File Tree Display**

- [ ] Create `src/components/Sidebar/FileTree.tsx`:
  - Fetch directory structure from `/api/file-tree`
  - Render nested folder structure
  - Handle loading states
  - Handle empty state (no boards)
- [ ] Create `src/components/Sidebar/FileTreeNode.tsx`:
  - Render individual file/folder
  - Icon differentiation (folder vs file)
  - Nesting indentation
  - Truncate long names with ellipsis + tooltip

**2.3 Scrollbar Implementation**

- [ ] Vertical scrollbar for content overflow
- [ ] Text truncation for long file names (no horizontal scroll)
- [ ] Hover tooltip showing full name
- [ ] Smooth scrolling behavior
- [ ] Style to match tldraw theme

**2.4 Theme Integration**

- [ ] Use `useIsDarkMode()` hook from `@tldraw/editor`
- [ ] Apply CSS variables from tldraw:
  - `--tl-color-text-1`, `--tl-color-text-3`
  - `--tl-color-muted-2` (backgrounds)
  - `--tl-color-focus` (focus states)
  - `--tl-radius-2` (border radius)
- [ ] Test theme switching (light ↔ dark)

**2.5 Integration with Container**

- [ ] Sidebar receives props from AppContainer:
  - `currentWhiteboardId`
  - `onWhiteboardSelect`
  - `isCollapsed`
  - `onToggleCollapse`
  - `isActive` (focus state)
- [ ] Verify sidebar state persists during whiteboard switches
- [ ] Test scroll position persistence

**Deliverables:**

- ✅ Basic sidebar UI rendered
- ✅ File tree displaying from API
- ✅ Scrollable content
- ✅ Theme-integrated styling
- ✅ State persistence working

---

### **Phase 3: Core Navigation Features** (Est: 2-3 days)

#### Objectives

- Implement folder expand/collapse
- Add file selection and activation
- Create collapsible sidebar
- Implement focus management

#### Tasks

**3.1 Folder Expand/Collapse**

- [ ] Track expanded state per folder (local state in FileTree)
- [ ] Click handler to toggle folder open/close
- [ ] Chevron icon animation (rotate on expand)
- [ ] Persist expanded state across whiteboard switches
- [ ] Smooth expand/collapse animation

**3.2 File Selection & Activation**

- [ ] Single-click on file:
  - Highlight selected file (background color change)
  - Only one file selected at a time
- [ ] Double-click on file:
  - Trigger whiteboard load
  - Call `onWhiteboardSelect(fileId)`
  - Show loading state during load
- [ ] Visual indication of currently active whiteboard:
  - Different highlight color
  - Icon or badge
  - Bold text

**3.3 Whiteboard Loading Logic**

- [ ] In AppContainer, handle whiteboard switch:
  - Dispose current editor store (if exists)
  - Fetch board data from `/api/whiteboards/:id`
  - Extract `tldrawSnapshot` and `metadata`
  - Create new store
  - Apply color palette from metadata
  - Load snapshot into store
  - Pass store to TldrawCanvas
- [ ] Handle loading states:
  - Show spinner/skeleton during load
  - Disable interactions during load
- [ ] Handle load errors:
  - Show error toast
  - Fall back to default board
  - Log error details

**3.4 Collapsible Sidebar**

- [ ] Toggle button (chevron icon in top-left or edge)
- [ ] Keyboard shortcut: Ctrl+B (toggle collapse)
- [ ] Animation: Slide in/out (CSS transition)
- [ ] Collapsed state: Show thin bar (20-30px) with expand button
- [ ] Persist collapsed state in localStorage or container state

**3.5 Focus Management**

- [ ] Create `src/hooks/useFocusManager.ts`:
  - Track which component is active (sidebar or tldraw)
  - Click on sidebar → set sidebar active
  - Click on tldraw → set tldraw active
  - Keyboard shortcut: Ctrl+Shift+B (toggle focus)
- [ ] Visual feedback for active component:
  - Sidebar: Subtle border or background change
  - Tldraw: No visual change (default)
- [ ] Route keyboard events:
  - When sidebar active: Ctrl+F, F2, Delete, Ctrl+C/X/V go to sidebar
  - When tldraw active: All shortcuts go to canvas
  - Arrow keys only work in sidebar when active

**Deliverables:**

- ✅ Interactive file tree (expand/collapse)
- ✅ File selection and double-click to open
- ✅ Working whiteboard switching
- ✅ Collapsible sidebar with animation
- ✅ Focus management system

---

### **Phase 4: File Operations** (Est: 3-4 days)

#### Objectives

- Implement context menu system
- Add all file operations (rename, delete, create, copy, cut, paste)
- Implement drag-and-drop
- Add operation validation and error handling

#### Tasks

**4.1 Context Menu System**

- [ ] Create `src/components/Sidebar/ContextMenu.tsx`:
  - Right-click handler on FileTreeNode
  - Position menu at cursor
  - Close on click outside or Escape
  - Different menu items for files vs folders
- [ ] Menu items:
  - **For files:** Rename, Delete, Copy, Cut
  - **For folders:** Rename, Delete, Copy, Cut, New File, New Folder
  - **For empty space:** New File, New Folder

**4.2 Rename Operation**

- [ ] F2 keyboard shortcut on selected file/folder
- [ ] Context menu "Rename" option
- [ ] Inline editing:
  - Replace name with input field
  - Pre-select text (without extension)
  - Accept: Enter key or blur
  - Cancel: Escape key
- [ ] Validation:
  - Check for duplicate names in same directory
  - Show error message if duplicate
  - Prevent empty names
- [ ] API call: `POST /api/files/rename`
- [ ] Update file tree on success
- [ ] Maintain selection on renamed item

**4.3 Delete Operation**

- [ ] Delete keyboard shortcut on selected file/folder
- [ ] Context menu "Delete" option
- [ ] Optional confirmation dialog:
  - "Are you sure you want to delete [name]?"
  - Checkbox: "Don't ask again" (save to localStorage)
- [ ] Special handling for currently open whiteboard:
  - Show warning: "This board is currently open"
  - Auto-switch to default board after delete
- [ ] API call: `DELETE /api/files`
- [ ] Update file tree on success
- [ ] Show error if delete fails

**4.4 Create New File/Folder**

- [ ] Top bar button: "New File" and "New Folder"
- [ ] Context menu options (on folders and empty space)
- [ ] Inline creation:
  - Add new item to tree with input field
  - Auto-focus input
  - Accept: Enter key, Cancel: Escape
- [ ] Auto-naming for new files:
  - Pattern: `untitled-[timestamp].tldr`
  - Example: `untitled-1704567890123.tldr`
- [ ] API calls:
  - `POST /api/whiteboards` (for new files)
  - `POST /api/folders` (for new folders)
- [ ] Auto-open newly created whiteboard

**4.5 Copy & Cut Operations**

- [ ] Ctrl+C keyboard shortcut (copy)
- [ ] Ctrl+X keyboard shortcut (cut)
- [ ] Context menu options
- [ ] Store clipboard data in component state:
  - `{operation: 'copy' | 'cut', sourcePath: string}`
- [ ] Visual feedback:
  - Cut items: Dimmed/greyed out until paste
  - Copied items: No visual change
- [ ] Clipboard state persists across selections

**4.6 Paste Operation**

- [ ] Ctrl+V keyboard shortcut
- [ ] Context menu "Paste" option (only show if clipboard has data)
- [ ] Determine target:
  - If folder selected: Paste into folder
  - If file selected: Paste into parent folder
  - If nothing selected: Paste into root
- [ ] Handle name conflicts:
  - Auto-rename: `filename-copy-1.tldr`, `filename-copy-2.tldr`
- [ ] API calls:
  - Copy: `POST /api/files/copy` (source + destination)
  - Move: `POST /api/files/move` (source + destination)
- [ ] Update file tree on success
- [ ] Clear clipboard after cut+paste (not after copy+paste)

**4.7 Drag-and-Drop**

- [ ] Make FileTreeNode draggable:
  - `draggable={true}`
  - `onDragStart`: Store dragged item data
  - Ghost image during drag
- [ ] Make folders drop targets:
  - `onDragOver`: Highlight drop target
  - `onDrop`: Handle drop
  - `onDragLeave`: Remove highlight
- [ ] Detect Ctrl key during drag:
  - No Ctrl: Move operation
  - With Ctrl: Copy operation
  - Update cursor icon to indicate operation
- [ ] Validation:
  - Cannot drop folder into itself
  - Cannot drop into descendants
- [ ] API calls: Same as copy/move
- [ ] Optimistic UI update, revert on error

**4.8 Operation Validation & Feedback**

- [ ] Loading indicators:
  - Spinner on file being operated on
  - Disable tree interactions during operation
- [ ] Error handling:
  - Network errors: Show toast, log to console
  - Permission errors: "Permission denied"
  - Not found errors: "File not found, refreshing tree"
  - Disk space errors: "Insufficient disk space"
- [ ] Success feedback:
  - Subtle toast (optional)
  - Immediate tree update
- [ ] Maintain selection on moved/copied items

**Deliverables:**

- ✅ Context menu system working
- ✅ All file operations (rename, delete, create, copy, cut, paste)
- ✅ Drag-and-drop functionality
- ✅ Validation and error handling
- ✅ Visual feedback for all operations

---

### **Phase 5: View System** (Est: 2-3 days)

#### Objectives

- Implement view configuration storage
- Create view selector UI
- Filter file tree based on active view
- Allow user to create/edit views

#### Tasks

**5.1 View Configuration Format**

- [ ] Define TypeScript interface:
  ```typescript
  interface ViewConfig {
  	name: string
  	includedPaths: string[] // Relative paths from whiteboards root
  	excludedPaths?: string[] // Optional exclusions
  	createdAt: string
  	lastModified: string
  }
  ```
- [ ] Create default view:
  ```json
  {
  	"name": "All Files",
  	"includedPaths": ["*"],
  	"createdAt": "...",
  	"lastModified": "..."
  }
  ```
- [ ] Backend: Store in `userdata/config/views/[name].json`

**5.2 View API Endpoints**

- [ ] Implement in `server/routes/views.ts`:
  - `GET /api/views` - List all views (read filenames from views directory)
  - `GET /api/views/:name` - Load specific view JSON
  - `POST /api/views/:name` - Save/update view JSON
  - `DELETE /api/views/:name` - Delete view JSON
- [ ] Validation:
  - View name must be valid filename (no special chars)
  - View must have at least one included path
  - Prevent deleting "All Files" default view

**5.3 View Selector UI**

- [ ] Create `src/components/Sidebar/ViewSelector.tsx`:
  - Dropdown in sidebar top bar
  - List all available views
  - Show currently active view
  - "Create New View" option
  - "Edit View" option (shows only for current view)
- [ ] Fetch views from `/api/views` on mount
- [ ] On view change:
  - Update container state: `setCurrentView(viewName)`
  - Re-fetch file tree with view filter
  - Persist last active view in localStorage

**5.4 Filtered File Tree**

- [ ] Modify `/api/file-tree` endpoint:
  - Accept query param: `?view=ViewName`
  - Load view config from disk
  - Filter directory tree based on `includedPaths`
  - Return filtered tree
- [ ] Frontend: Pass current view to file tree hook
- [ ] Handle view not found:
  - Fall back to "All Files" view
  - Show error toast

**5.5 View Editor UI**

- [ ] Create `src/components/Sidebar/ViewEditor.tsx` (modal or panel):
  - Text input: View name
  - Checkbox tree: Show all folders, allow checking/unchecking
  - Save button
  - Cancel button
- [ ] "Create New View" flow:
  - Open ViewEditor modal
  - Default: Start with current view's selections
  - On save: POST to `/api/views/:name`
  - Refresh view list
  - Switch to new view
- [ ] "Edit View" flow:
  - Open ViewEditor with current view data
  - On save: Update existing view
  - Refresh file tree

**5.6 View Management**

- [ ] Delete view:
  - Context menu on view dropdown (right-click view name)
  - Confirmation dialog
  - DELETE `/api/views/:name`
  - If deleted view was active, switch to "All Files"
- [ ] Rename view:
  - Option in ViewEditor
  - Create new view with new name, delete old
  - Update active view if renamed

**Deliverables:**

- ✅ View configuration storage working
- ✅ View selector UI functional
- ✅ Filtered file tree based on view
- ✅ View creation/editing/deletion working

---

### **Phase 6: Search & Advanced Features** (Est: 2-3 days)

#### Objectives

- Implement search functionality
- Add keyboard shortcut handling
- Polish UX with tooltips and loading states

#### Tasks

**6.1 Search Pane UI**

- [ ] Create `src/components/Sidebar/SearchPane.tsx`:
  - Search input field
  - Close button (X icon)
  - Results counter: "3 of 12 results"
  - Navigation buttons: Previous/Next
  - Appears below top bar when active
  - Slide-in animation
- [ ] Ctrl+F keyboard shortcut (only when sidebar active):
  - Open search pane
  - Auto-focus input
  - If already open, focus input and select all
- [ ] Escape key: Close search pane and clear search

**6.2 Search Functionality**

- [ ] Real-time search as user types:
  - Debounce input (300ms)
  - Case-insensitive matching
  - Match against file and folder names
  - Highlight matches in file tree
- [ ] Search highlighting:
  - Add CSS class to matching FileTreeNodes
  - Yellow background or similar
  - Bold text
- [ ] Auto-scroll to first match when search starts

**6.3 Search Navigation**

- [ ] F3 or Enter: Jump to next match
- [ ] Shift+F3 or Shift+Enter: Jump to previous match
- [ ] Cycle through matches (wrap around at end)
- [ ] Auto-scroll to show current match
- [ ] Update results counter on navigation
- [ ] Expand folders to reveal matches if collapsed

**6.4 Search Edge Cases**

- [ ] No matches: Show "No results found" message
- [ ] Empty search: Remove all highlights, show all items
- [ ] Search in filtered view: Only search visible items
- [ ] Clear search when switching views

**6.5 Keyboard Shortcuts System**

- [ ] Create `src/hooks/useKeyboardShortcuts.ts`:
  - Centralized keyboard event handling
  - Route shortcuts based on focus state
  - Prevent default for handled shortcuts
- [ ] Document all shortcuts:
  - Ctrl+F: Open search
  - F3 / Shift+F3: Navigate search results
  - Ctrl+B: Toggle sidebar collapse
  - Ctrl+Shift+B: Toggle focus (sidebar ↔ tldraw)
  - F2: Rename selected file
  - Delete: Delete selected file
  - Ctrl+C: Copy selected file
  - Ctrl+X: Cut selected file
  - Ctrl+V: Paste from clipboard
  - Escape: Close search/context menu/dialogs
  - Arrow keys: Navigate file tree (when sidebar active)
  - Enter: Open selected file (when sidebar active)

**6.6 Tooltips & Polish**

- [ ] Add tooltips to all buttons (top bar, context menu)
- [ ] Truncated file names: Show full name on hover
- [ ] Icon tooltips: Explain what file type/state
- [ ] Loading spinners: During file operations and board loads
- [ ] Error toasts: User-friendly error messages
- [ ] Success feedback: Subtle confirmation for operations

**6.7 Accessibility**

- [ ] All interactive elements keyboard accessible
- [ ] Tab order makes sense
- [ ] ARIA labels for icons and buttons
- [ ] Focus visible styles (use `--tl-color-focus`)
- [ ] Screen reader announcements for state changes (optional, lower priority)

**Deliverables:**

- ✅ Full search functionality with keyboard nav
- ✅ All keyboard shortcuts working
- ✅ Tooltips and loading states polished
- ✅ Error handling improved
- ✅ Accessibility basics implemented

---

### **Phase 7: Performance & Final Polish** (Est: 1-2 days)

#### Objectives

- Optimize for large file trees
- Finalize theme integration
- Comprehensive testing
- Create documentation

#### Tasks

**7.1 Performance Optimization**

- [ ] React.memo on FileTreeNode component:
  - Prevent re-renders of unchanged nodes
  - Custom comparison function for props
- [ ] Virtual scrolling (if needed):
  - Test with 500+ files
  - If lag detected (>200ms), implement react-window
  - Measure before/after performance
- [ ] Debounce search input (already in 6.2, verify)
- [ ] Lazy load folder contents (optional future enhancement):
  - Only load children when folder expanded
  - Reduces initial tree size
- [ ] Optimize auto-save:
  - Verify 2000ms debounce is working
  - Batch multiple rapid changes
  - Test with heavy drawing (many shapes)

**7.2 Theme Integration Testing**

- [ ] Test light mode:
  - All colors correct
  - Scrollbar styled properly
  - Focus states visible
- [ ] Test dark mode:
  - All colors correct
  - Proper contrast
  - Icons visible
- [ ] Test theme switching:
  - Sidebar updates immediately
  - No visual glitches
  - CSS transitions smooth
- [ ] Verify all CSS variables used:
  - No hardcoded colors (except transparent/white/black)
  - All `--tl-*` variables applied correctly

**7.3 Comprehensive Testing**

**File Operations Testing:**

- [ ] Create 50+ files and folders
- [ ] Test rename with duplicates
- [ ] Test delete currently open board
- [ ] Test copy/paste across folders
- [ ] Test drag-and-drop to deep nesting
- [ ] Test undo/redo (if implemented)

**View System Testing:**

- [ ] Create 3+ custom views
- [ ] Switch between views rapidly
- [ ] Edit view while files are being operated on
- [ ] Delete view while it's active

**Search Testing:**

- [ ] Search with 100+ files
- [ ] Search with special characters
- [ ] Search with Unicode characters
- [ ] Navigate through 50+ matches

**Focus Management Testing:**

- [ ] Toggle focus with keyboard shortcut
- [ ] Click between sidebar and canvas
- [ ] Verify shortcuts route correctly
- [ ] Test with sidebar collapsed

**Auto-save Testing:**

- [ ] Draw many shapes rapidly
- [ ] Verify only one save per 2000ms
- [ ] Switch boards before save completes
- [ ] Test network failure during save

**Performance Testing:**

- [ ] Measure initial sidebar load time (<500ms target)
- [ ] Measure folder expand time (<100ms target)
- [ ] Measure board switch time (<200ms target)
- [ ] Measure search with 500+ files (<200ms target)

**7.4 Edge Case Testing**

- [ ] Empty whiteboards directory (show welcome message)
- [ ] Deeply nested folders (10+ levels)
- [ ] Very long file names (100+ characters)
- [ ] Special characters in file names (émojis, etc.)
- [ ] Disk full error during save
- [ ] Network offline during API calls
- [ ] File deleted externally while open
- [ ] File modified externally while editing

**7.5 Documentation**

- [ ] Update README.md:
  - Setup instructions
  - How to run (dev and production)
  - Directory structure explanation
  - Configuration options
- [ ] Create KEYBOARD_SHORTCUTS.md:
  - List all shortcuts
  - Organized by category
- [ ] Create API.md:
  - Document all API endpoints
  - Request/response formats
  - Error codes
- [ ] Inline code comments:
  - Complex logic explained
  - TODOs for future enhancements
  - Performance considerations noted

**7.6 Final Polish**

- [ ] Consistent spacing and alignment
- [ ] Icon consistency (all icons from same set)
- [ ] Animation timing tuned (not too slow/fast)
- [ ] Loading states feel responsive
- [ ] Error messages are helpful and clear
- [ ] Empty states have helpful messages
- [ ] Success feedback is subtle but noticeable

**Deliverables:**

- ✅ Optimized performance (targets met)
- ✅ Perfect theme integration (light/dark)
- ✅ All tests passing
- ✅ Complete documentation
- ✅ Polished UX

---

## API Endpoints

### Base URL: `http://localhost:3001/api`

#### Whiteboard Endpoints

**GET `/whiteboards/:id`**

- Load whiteboard data
- Response:
  ```json
  {
  	"tldrawSnapshot": {
  		/* TLStoreSnapshot */
  	},
  	"metadata": {
  		"colorPalette": {
  			/* color config */
  		},
  		"createdAt": "2025-01-06T10:00:00Z",
  		"lastModified": "2025-01-06T12:00:00Z",
  		"boardName": "My Board"
  	}
  }
  ```
- Errors: `404` if not found, `500` on read error

**POST `/whiteboards/:id`**

- Save/update whiteboard
- Body: Full BoardFile object (tldrawSnapshot + metadata)
- Response: `{ "success": true }`
- Errors: `400` on validation error, `500` on write error

**POST `/whiteboards`**

- Create new whiteboard
- Body: `{ "name": "optional-name" }` (if not provided, auto-generates `untitled-[timestamp].tldr`)
- Response: `{ "id": "newBoardId", "path": "..." }`
- Errors: `409` if name already exists, `500` on write error

**DELETE `/whiteboards/:id`**

- Delete whiteboard
- Response: `{ "success": true }`
- Errors: `404` if not found, `500` on delete error

#### File Tree Endpoint

**GET `/file-tree`**

- Get directory structure (optionally filtered by view)
- Query params: `?view=ViewName` (optional)
- Response:
  ```json
  {
  	"tree": [
  		{
  			"id": "unique-id",
  			"name": "folder-name",
  			"type": "folder",
  			"path": "folder-name",
  			"children": [
  				{
  					"id": "board-id",
  					"name": "my-board.tldr",
  					"type": "file",
  					"path": "folder-name/my-board.tldr"
  				}
  			]
  		}
  	]
  }
  ```
- Errors: `500` on read error

#### File Operations Endpoints

**POST `/files/rename`**

- Rename file or folder
- Body: `{ "oldPath": "...", "newName": "..." }`
- Response: `{ "success": true, "newPath": "..." }`
- Errors: `400` if duplicate name, `404` if not found, `500` on error

**DELETE `/files`**

- Delete file or folder
- Body: `{ "path": "..." }`
- Response: `{ "success": true }`
- Errors: `404` if not found, `500` on error

**POST `/files/copy`**

- Copy file or folder
- Body: `{ "sourcePath": "...", "destinationPath": "..." }`
- Response: `{ "success": true, "newPath": "..." }`
- Errors: `404` if source not found, `409` if destination exists, `500` on error

**POST `/files/move`**

- Move file or folder
- Body: `{ "sourcePath": "...", "destinationPath": "..." }`
- Response: `{ "success": true, "newPath": "..." }`
- Errors: `404` if source not found, `409` if destination exists, `500` on error

**POST `/folders`**

- Create new folder
- Body: `{ "path": "parent/new-folder" }`
- Response: `{ "success": true, "path": "..." }`
- Errors: `409` if already exists, `500` on error

#### View Endpoints

**GET `/views`**

- List all available views
- Response:
  ```json
  {
  	"views": [
  		{ "name": "All Files", "isDefault": true },
  		{ "name": "Teaching", "isDefault": false },
  		{ "name": "Projects", "isDefault": false }
  	]
  }
  ```
- Errors: `500` on read error

**GET `/views/:name`**

- Load specific view configuration
- Response: ViewConfig object
- Errors: `404` if not found, `500` on read error

**POST `/views/:name`**

- Save/update view configuration
- Body: ViewConfig object
- Response: `{ "success": true }`
- Errors: `400` on validation error, `500` on write error

**DELETE `/views/:name`**

- Delete view configuration
- Response: `{ "success": true }`
- Errors: `400` if trying to delete default view, `404` if not found, `500` on error

#### Color Endpoints (Keep for backward compatibility)

**GET `/colors/custom`**

- Get custom colors (deprecated, but keep for now)

**GET `/colors/default`**

- Get default colors

**POST `/colors/custom`**

- Save custom colors

**POST `/colors/reset`**

- Reset colors to default

**POST `/colors/save-as-default`**

- Save current as default

---

## Data Formats

### BoardFile Format

```typescript
interface BoardFile {
  tldrawSnapshot: TLStoreSnapshot
  metadata: BoardMetadata
}

interface BoardMetadata {
  colorPalette: ColorPaletteConfig
  createdAt: string // ISO 8601 timestamp
  lastModified: string // ISO 8601 timestamp
  boardName?: string // Optional display name
}

interface ColorPaletteConfig {
  [colorKey: string]: {
    light: string // Hex color for light mode
    dark: string // Hex color for dark mode
  }
}

// Example:
{
  "tldrawSnapshot": {
    "store": { /* TLStore records */ },
    "schema": { /* Schema info */ }
  },
  "metadata": {
    "colorPalette": {
      "color1_R1C1": { "light": "#ff0000", "dark": "#cc0000" },
      "color2_R1C2": { "light": "#00ff00", "dark": "#00cc00" },
      // ... all 28 colors
    },
    "createdAt": "2025-01-06T10:00:00.000Z",
    "lastModified": "2025-01-06T12:30:00.000Z",
    "boardName": "Project Planning"
  }
}
```

### ViewConfig Format

```typescript
interface ViewConfig {
  name: string
  includedPaths: string[] // Glob patterns or explicit paths
  excludedPaths?: string[] // Optional exclusions
  createdAt: string
  lastModified: string
}

// Example:
{
  "name": "Teaching",
  "includedPaths": [
    "teaching/*",
    "lessons/*"
  ],
  "excludedPaths": [
    "teaching/archive/*"
  ],
  "createdAt": "2025-01-06T10:00:00.000Z",
  "lastModified": "2025-01-06T10:00:00.000Z"
}
```

### FileTreeNode Format

```typescript
interface FileTreeNode {
  id: string // Unique identifier (can be path)
  name: string // Display name (filename)
  type: 'file' | 'folder'
  path: string // Relative path from whiteboards root
  children?: FileTreeNode[] // Only for folders
}

// Example:
{
  "id": "project-a",
  "name": "Project A",
  "type": "folder",
  "path": "project-a",
  "children": [
    {
      "id": "project-a/board-1.tldr",
      "name": "board-1.tldr",
      "type": "file",
      "path": "project-a/board-1.tldr"
    }
  ]
}
```

---

## Edge Cases & Conflict Resolution

### File Operation Conflicts

#### 1. **User tries to rename file to existing name**

- **Detection:** Check if target name exists in same directory before rename
- **Behavior:**
  - Show error toast: "A file named '[name]' already exists"
  - Keep inline editor open
  - Do not execute rename
  - User can try different name or cancel

#### 2. **User tries to delete currently open whiteboard**

- **Detection:** Check if `fileToDelete.id === currentWhiteboardId` before delete
- **Behavior:**
  - Show warning dialog: "This board is currently open. It will be closed before deletion."
  - Options: "Delete and Close" or "Cancel"
  - If confirmed:
    1. Switch to default board (`welcome.tldr`)
    2. Execute delete operation
    3. Update file tree
    4. Show success toast: "Board deleted"

#### 3. **File is modified on disk while user is editing**

- **Detection:** (Since true file locking is not feasible)
  - Implement periodic file checksum or timestamp check (every 10 seconds)
  - Compare with last known state
  - Alternatively: Use `fs.watch()` on userdata directory
- **Behavior:**
  - **If modification detected:**
    - Show warning toast: "Board file '[name]' was modified externally"
    - Options in toast: "Reload from disk" or "Overwrite with current"
    - "Reload from disk": Discard current changes, load from file
    - "Overwrite with current": Save current state, ignore external changes
  - **If file deleted externally:**
    - Show error toast: "Board file '[name]' was deleted externally"
    - Auto-switch to default board
    - Remove from file tree

#### 4. **User creates file/folder with existing name**

- **Detection:** Check before creation
- **Behavior:**
  - Show error toast: "Name already exists"
  - Keep inline editor open
  - User can try different name

#### 5. **Drag-and-drop: Drop folder into its own descendant**

- **Detection:** Check if `targetPath.startsWith(sourcePath)`
- **Behavior:**
  - Do not allow drop
  - Show error toast: "Cannot move folder into itself"

#### 6. **Network failure during save**

- **Detection:** Catch fetch error in auto-save hook
- **Behavior:**
  - Show error toast: "Failed to save. Retrying..."
  - Retry with exponential backoff (3 attempts)
  - If all retries fail: Show persistent warning banner: "Changes not saved. Check connection."
  - When connection restored: Auto-retry save

#### 7. **Disk full error during save**

- **Detection:** Backend returns specific error (ENOSPC)
- **Behavior:**
  - Show error toast: "Disk is full. Cannot save changes."
  - Offer option to export board to downloads folder
  - Prevent further edits until space freed

### Default Board Behavior

#### **welcome.tldr (Default Template Board)**

- **Location:** `userdata/whiteboards/welcome.tldr`
- **Contents:**
  - Simple text shape: "Welcome to tldraw! Double-click a board to open it."
  - Instructions on how to create new boards
  - Link to documentation (if applicable)
- **Behavior:**
  - Read-only flag in metadata: `"readOnly": true`
  - On app start, if no other boards exist, also create `untitled-1.tldr`
  - If user tries to edit `welcome.tldr`:
    - Auto-create `untitled-[timestamp].tldr` copy
    - Switch to new board
    - Allow edits
  - Always available in sidebar (cannot be deleted)

#### **untitled-[timestamp].tldr (Auto-created boards)**

- **Naming Pattern:** `untitled-1704567890123.tldr` (timestamp in milliseconds)
- **Creation Triggers:**
  1. On app start, if only `welcome.tldr` exists
  2. When user tries to edit `welcome.tldr`
  3. When user creates new board without specifying name
- **Behavior:**
  - Fully editable
  - Can be renamed by user
  - Starts with empty canvas
  - Inherits current color palette

#### **Auto-open on App Start**

- **Logic:**
  1. Check localStorage for `lastOpenedBoardId`
  2. If exists and file exists: Open that board
  3. Else if `untitled-1.tldr` exists: Open it
  4. Else: Open `welcome.tldr`
  5. If nothing exists: Create `welcome.tldr` and open it

---

## Performance Strategy

### Optimization Priorities

Based on requirements, these are the most performance-intensive features:

#### **1. File Tree Rendering (Large Trees)**

- **Problem:** 500+ files = 500+ React components = slow initial render
- **Solution:**
  - **React.memo on FileTreeNode:** Prevent unnecessary re-renders
  - **Virtual scrolling (if needed):** Use `react-window` for 200+ files
  - **Lazy loading folders:** Only load children when folder expanded (future enhancement)
- **Target:** Initial render <500ms for 100 files, <1000ms for 500 files

#### **2. Auto-save Frequency**

- **Problem:** Saving on every shape change = too many network requests
- **Solution:**
  - **Debounce 2000ms:** Wait 2 seconds after last change before saving
  - **Batch changes:** Multiple rapid changes = one save
  - **Skip save if no changes:** Compare snapshot hash before saving
- **Target:** Max 1 save per 2 seconds, even with rapid drawing

#### **3. Search with Large Trees**

- **Problem:** Real-time search through 500+ filenames
- **Solution:**
  - **Debounce input 300ms:** Don't search on every keystroke
  - **Early exit:** Stop searching once all matches found
  - **Memoize results:** Cache search results for same query
- **Target:** Search results <200ms for 500 files

#### **4. File Tree Updates (Real-time)**

- **Problem:** Keeping sidebar in sync with disk changes
- **Solution:**
  - **Periodic shallow checks (10s interval):** Check file count/timestamps
  - **Optimistic UI updates:** Update tree immediately on user actions
  - **Server confirmation:** Revert if operation fails
  - **Avoid fs.watch() initially:** Too expensive, add later if needed
- **Target:** User operations feel instant (<50ms UI update)

#### **5. Drag-and-Drop Performance**

- **Problem:** Ghost image + drop target highlighting = layout thrashing
- **Solution:**
  - **Use CSS transforms:** Not layout properties (left/top)
  - **RequestAnimationFrame:** Update highlights on RAF
  - **Throttle drag events:** Only update every 16ms (60fps)
- **Target:** Smooth 60fps during drag

### Performance Monitoring

**Measure these during Phase 7:**

- Initial sidebar load time (target: <500ms)
- Folder expand time (target: <100ms)
- Board switch time (target: <200ms)
- Auto-save operation time (target: <300ms)
- Search results time (target: <200ms)
- File operation feedback (target: <50ms UI update)

**Tools:**

- `performance.now()` for timing critical paths
- React DevTools Profiler for component re-renders
- Chrome DevTools Performance tab for 60fps checks

---

## Testing Checklist

### Phase 1 Tests

- [ ] Backend API all endpoints responding
- [ ] Directory structure created correctly
- [ ] Board file saves with embedded color palette
- [ ] Board file loads and applies color palette
- [ ] Auto-save triggers after 2000ms of inactivity
- [ ] Auto-save debounces multiple rapid changes
- [ ] Container component renders Sidebar + TldrawCanvas
- [ ] Store disposal works when switching boards

### Phase 2 Tests

- [ ] Sidebar renders with correct styling
- [ ] File tree fetches and displays from API
- [ ] Vertical scrollbar appears when content overflows
- [ ] Long file names truncate with ellipsis
- [ ] Hover tooltip shows full file name
- [ ] Light/dark theme switches correctly
- [ ] Sidebar state persists during board switch
- [ ] Empty state shows helpful message

### Phase 3 Tests

- [ ] Folder expand/collapse works smoothly
- [ ] Expanded state persists during board switch
- [ ] Single-click selects file (highlighted)
- [ ] Double-click loads whiteboard
- [ ] Active whiteboard has visual indicator
- [ ] Sidebar collapse toggle works
- [ ] Ctrl+B keyboard shortcut toggles sidebar
- [ ] Focus management routes shortcuts correctly
- [ ] Clicking sidebar makes it active
- [ ] Clicking canvas makes canvas active

### Phase 4 Tests

- [ ] Right-click shows context menu
- [ ] F2 renames file inline
- [ ] Rename validation prevents duplicates
- [ ] Delete key deletes selected file
- [ ] Delete confirmation dialog works (if enabled)
- [ ] Deleting open board switches to default
- [ ] Create new file works (context menu + button)
- [ ] Create new folder works
- [ ] Auto-naming for new files works
- [ ] Ctrl+C copies file to clipboard
- [ ] Ctrl+X cuts file to clipboard
- [ ] Ctrl+V pastes from clipboard
- [ ] Cut items appear dimmed
- [ ] Paste handles name conflicts (auto-rename)
- [ ] Drag-and-drop moves file
- [ ] Ctrl+Drag copies file
- [ ] Drop target highlights during drag
- [ ] Cannot drop folder into itself
- [ ] File tree updates after all operations
- [ ] Error messages appear on operation failure

### Phase 5 Tests

- [ ] Default view shows all files
- [ ] View selector lists all available views
- [ ] Switching views filters file tree
- [ ] Create new view saves to disk
- [ ] Edit view updates configuration
- [ ] Delete view removes from disk
- [ ] Cannot delete default "All Files" view
- [ ] Last active view persists in localStorage
- [ ] View not found falls back to default

### Phase 6 Tests

- [ ] Ctrl+F opens search pane
- [ ] Search input auto-focuses
- [ ] Real-time search highlights matches
- [ ] Results counter updates correctly
- [ ] F3 navigates to next match
- [ ] Shift+F3 navigates to previous match
- [ ] Matches cycle (wrap around)
- [ ] Auto-scroll to show current match
- [ ] Folders expand to reveal matches
- [ ] Escape closes search
- [ ] All keyboard shortcuts work
- [ ] Shortcuts route based on focus state
- [ ] Tooltips appear on hover
- [ ] Loading spinners during operations
- [ ] Error toasts show helpful messages

### Phase 7 Tests

- [ ] Performance with 100+ files (<500ms load)
- [ ] Performance with 500+ files (<1000ms load)
- [ ] Folder expand <100ms
- [ ] Board switch <200ms
- [ ] Search <200ms with 500 files
- [ ] Auto-save <300ms
- [ ] Light theme: All colors correct
- [ ] Dark theme: All colors correct
- [ ] Theme switch: Immediate update
- [ ] Virtual scrolling (if implemented) smooth
- [ ] React.memo prevents unnecessary re-renders
- [ ] Edge case: Empty directory
- [ ] Edge case: Deeply nested (10+ levels)
- [ ] Edge case: Very long file names
- [ ] Edge case: Special characters in names
- [ ] Edge case: Disk full error handled
- [ ] Edge case: Network offline handled
- [ ] Edge case: File deleted externally
- [ ] Edge case: File modified externally
- [ ] All documentation complete

---

## Risk Assessment

### Low Risk ✅

- Theme integration (CSS variables exist and documented)
- Basic file tree display (standard React patterns)
- Sidebar collapse/expand (simple state management)
- Auto-save implementation (debounce + store.listen)

### Medium Risk ⚠️

- Store management during board switching (needs careful cleanup)
- Drag-and-drop implementation (browser API quirks)
- Performance with large trees (may need virtual scrolling)
- File conflict detection (polling vs watching trade-offs)

### High Risk 🔴

- None identified (requirements well-scoped, architecture proven)

### Mitigation Strategies

**Store Management:**

- Test disposal thoroughly
- Use React DevTools to check for memory leaks
- Implement cleanup in useEffect returns

**Drag-and-Drop:**

- Use existing library if native API too complex (react-dnd)
- Test across browsers (Firefox, Safari, Chrome)
- Fallback: Keyboard-based move if drag breaks

**Performance:**

- Benchmark early (Phase 2)
- Implement virtual scrolling only if needed
- Profile before optimizing

**File Conflicts:**

- Start with optimistic updates (Phase 4)
- Add polling/watching later if users request it (Phase 7)

---

## Timeline Estimate

| Phase                         | Duration | Cumulative |
| ----------------------------- | -------- | ---------- |
| Phase 1: Foundation & Backend | 2-3 days | 2-3 days   |
| Phase 2: Basic Sidebar        | 2-3 days | 4-6 days   |
| Phase 3: Core Navigation      | 2-3 days | 6-9 days   |
| Phase 4: File Operations      | 3-4 days | 9-13 days  |
| Phase 5: View System          | 2-3 days | 11-16 days |
| Phase 6: Search & Advanced    | 2-3 days | 13-19 days |
| Phase 7: Performance & Polish | 1-2 days | 14-21 days |

**Total:** 14-21 days (3-4 weeks)

**Contingency:** +20% for unexpected issues = 17-25 days

---

## Success Criteria

### Functional Requirements ✅

- [x] Sidebar displays file tree from server
- [x] Sidebar state persists during board switches
- [x] All file operations work (rename, delete, copy, paste, move, drag-drop)
- [x] View system filters file tree
- [x] Search finds and highlights matches
- [x] Auto-save works with 2000ms debounce
- [x] Color palette per board (embedded in file)
- [x] Theme integration (automatic light/dark)

### Performance Requirements ✅

- [x] Initial load <500ms (100 files)
- [x] Folder expand <100ms
- [x] Board switch <200ms
- [x] Search <200ms (500 files)
- [x] Auto-save <300ms

### UX Requirements ✅

- [x] Seamless board switching (no UI resets)
- [x] VS Code-like keyboard shortcuts
- [x] Helpful error messages
- [x] Loading states for all operations
- [x] Responsive to user actions (<50ms feedback)

### Code Quality Requirements ✅

- [x] TypeScript strict mode (no `any` types)
- [x] All components tested
- [x] API documented
- [x] Inline comments for complex logic
- [x] Consistent code style

---

## Future Enhancements (Out of Scope for V1)

These features may be added later but are not required for initial implementation:

1. **Undo/Redo for File Operations**
   - Complex to implement correctly
   - Low user demand expected

2. **Real-time File Watching**
   - Current solution: Periodic checks + conflict warnings
   - Upgrade: Use chokidar for true real-time updates

3. **Multiplayer/Collaboration**
   - Not in requirements
   - Would require @tldraw/sync-core integration

4. **Cloud Sync**
   - Currently local file system only
   - Future: Sync to cloud storage

5. **Version Control Integration**
   - Git-like history for boards
   - Diff/merge support

6. **Advanced Search**
   - Search within board contents (shapes, text)
   - Fuzzy matching

7. **Keyboard-only File Tree Navigation**
   - Arrow keys navigate tree
   - Space to expand/collapse
   - Enter to open

8. **Resizable Sidebar**
   - Drag edge to resize
   - Persist width in localStorage

9. **File Tree Icons**
   - Custom icons per file type
   - Folder color coding

10. **Batch Operations**
    - Multi-select files
    - Batch delete/move/copy

---

## Notes for Future Maintenance

### When Adding New Features

1. **Update This Document:** Keep REFACTORING_PLAN.md in sync with changes
2. **Update API.md:** Document new endpoints
3. **Update KEYBOARD_SHORTCUTS.md:** Document new shortcuts
4. **Test Backward Compatibility:** Don't break existing boards
5. **Migrate Old Data:** Provide migration scripts if format changes

### Common Pitfalls to Avoid

1. **Don't Hardcode Colors:** Always use CSS variables
2. **Don't Skip Error Handling:** Every API call needs try/catch
3. **Don't Forget Cleanup:** All useEffect hooks need return functions
4. **Don't Block UI Thread:** Use async/await for file operations
5. **Don't Trust User Input:** Validate all file names and paths

### Performance Monitoring

**Watch These Metrics:**

- Initial sidebar load time (should stay <500ms)
- Memory usage (check for leaks in DevTools)
- Network requests (should be minimal)
- Re-render count (use React DevTools Profiler)

**If Performance Degrades:**

1. Profile with Chrome DevTools
2. Check for missing React.memo
3. Verify debouncing still works
4. Look for unnecessary API calls

---

## Contact & Support

**Questions During Implementation?**

- Refer to this document first
- Check tldraw documentation: https://tldraw.dev
- Review CONTEXT.md files in packages
- Consult original requirements: `tldraw-sidebar-refactoring-requirements_1.txt`

**Stuck on a Phase?**

- Break it into smaller sub-tasks
- Test each sub-task independently
- Commit working code frequently
- Ask for help if blocked >2 hours

---

## Final Checklist Before Starting Implementation

- [x] Read entire REFACTORING_PLAN.md
- [x] Understand wrapper architecture (sidebar + tldraw as siblings)
- [x] Confirm directory structure (`/home/linuxrasta/projects/tldraw-full/userdata/`)
- [x] Confirm file format (embedded color palette)
- [x] Confirm API approach (REST, not WebSocket)
- [x] Confirm auto-save timing (2000ms)
- [x] Confirm file extension (`.tldr`)
- [x] Understand edge case handling (detection + warnings)
- [x] Ready to start Phase 1

---

## Status Tracking

**Current Phase:** Ready to begin Phase 1  
**Last Updated:** 2025-01-06  
**Completion:** 0% (0/7 phases)

### Phase Completion Tracking

- [ ] Phase 1: Foundation & Backend (0%)
- [ ] Phase 2: Basic Sidebar (0%)
- [ ] Phase 3: Core Navigation (0%)
- [ ] Phase 4: File Operations (0%)
- [ ] Phase 5: View System (0%)
- [ ] Phase 6: Search & Advanced (0%)
- [ ] Phase 7: Performance & Polish (0%)

---

**END OF REFACTORING PLAN**

This document serves as the single source of truth for the tldraw sidebar refactoring project. All implementation decisions, architecture details, and technical specifications are captured here. Update this document as the project progresses to maintain accuracy.

---

**Generated:** 2025-01-06  
**Version:** 1.0  
**Author:** AI Assistant (Phase 1 Analysis)  
**Project:** tldraw Sidebar Refactoring
