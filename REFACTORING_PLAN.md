# TLDRAW WHITEBOARD - HIERARCHICAL FILE SYSTEM REFACTORING PLAN

**Project Goal:** Transform the tldraw whiteboard application to have a VS Code Explorer-style hierarchical file browser with persistent folder tree, user preferences, and complete file management operations.

**Critical Instruction for AI Agent:** Work through this plan **sequentially, phase by phase**. After completing each phase, **STOP and wait for user confirmation** that the feature works correctly before proceeding to the next phase.

---

## CURRENT ISSUES TO FIX

Before starting new features, address these critical bugs:

### Bug 1: Folder Tree Display Glitch
**Problem:** Clicking a folder replaces the entire view instead of expanding/collapsing in place (like Windows Explorer, not VS Code style).

**Expected Behavior:** Folders should expand/collapse inline, maintaining the full tree structure visible at all times (VS Code Explorer style).

### Bug 2: JSON Parse Error
**Problem:** `JSON.parse: unexpected end of data at line 1 column 1`

**Likely Cause:** API endpoint returning empty response or HTML error page instead of JSON.

### Bug 3: Files Disappearing
**Problem:** Created boards/folders not displaying or persisting.

**Likely Related:** Bug 2 - if API is failing, tree can't load properly.

---

## PHASE 0: CRITICAL BUG FIXES (DO THIS FIRST)

**Goal:** Fix existing bugs before adding new features.

### Task 0.1: Fix JSON Parse Error
**Location:** `FileExplorer.tsx` - `fetchFiles()` function

**Changes Needed:**
1. Add response validation before parsing JSON
2. Check if response is OK (status 200)
3. Add error handling for empty responses
4. Log actual response text on error for debugging

**Code Change:**
```typescript
const fetchFiles = useCallback(async (path: string = '') => {
  try {
    const res = await fetch(`/api/fs/list?path=${encodeURIComponent(path)}`);
    
    // Check if response is OK
    if (!res.ok) {
      console.error('API error:', res.status, res.statusText);
      return [];
    }
    
    // Get text first to check if it's valid JSON
    const text = await res.text();
    if (!text || text.trim() === '') {
      console.error('Empty response from API');
      return [];
    }
    
    // Parse JSON
    const data = JSON.parse(text);
    return data.contents || [];
  } catch (error) {
    console.error('Error fetching files:', error);
    return [];
  }
}, []);
```

**Testing Checkpoint:**
- [ ] Open browser console - JSON parse error should be gone
- [ ] Verify API endpoint works: Open `http://localhost:5173/api/fs/list` in browser - should return JSON
- [ ] Confirm files/folders load in FileExplorer

---

### Task 0.2: Fix Folder Tree Display (VS Code Style)

**Problem:** Current implementation loads children dynamically and replaces view.

**Solution:** Keep tree expanded state persistent, always show full tree structure.

**Location:** `FileExplorer.tsx` - `renderTree()` function

**Current Bug:** Folders collapse/hide siblings when clicked.

**Fix Required:** Ensure `renderTree()` always renders all items at each level, only hiding/showing children based on `expandedFolders` set.

**Code Review Needed:**
```typescript
// CURRENT (potentially buggy):
{item.type === 'directory' && expandedFolders.has(item.path) && item.children && (
  <div>
    {renderTree(item.children, level + 1)}
  </div>
)}

// Should be correct, but verify children are actually loaded
```

**Root Cause Investigation:**
1. Check if `loadAllFiles()` properly loads children for expanded folders
2. Verify `expandedFolders` Set is maintained correctly
3. Ensure clicking folder doesn't trigger file selection logic

**Testing Checkpoint:**
- [ ] Create folder structure: `Root/Folder A`, `Root/Folder B`
- [ ] Expand Folder A - Folder B should still be visible
- [ ] Expand Folder B - both should be visible simultaneously
- [ ] Collapse Folder A - tree structure remains, only children hide
- [ ] Verify this matches VS Code Explorer behavior exactly

---

### Task 0.3: Verify Backend API

**Test Backend Endpoints:**
```bash
# Test from terminal or browser
curl http://localhost:3000/api/fs/list
curl http://localhost:3000/api/fs/list?path=asd
```

**Expected Response:**
```json
{
  "contents": [
    {"name": "test", "type": "directory", "path": "test"},
    {"name": "file.json", "type": "file", "path": "file.json"}
  ]
}
```

**If API returns error:** Check that `server/index.js` is running (`npm run api`).

**Testing Checkpoint:**
- [ ] API returns valid JSON (not HTML error page)
- [ ] API returns correct file/folder structure
- [ ] Creating new files/folders via API works

---

## ✋ STOP CHECKPOINT: Phase 0 Complete

**Before proceeding to Phase 1:**
1. User must confirm: "All bugs fixed, tree displays correctly"
2. User must confirm: "Can create files/folders and they appear immediately"
3. User must confirm: "No console errors"

---

## PHASE 1: USER PREFERENCES SYSTEM

**Goal:** Implement persistent user preferences (last opened board, default board) so app auto-loads on startup.

### Task 1.1: Create User Preferences Hook

**New File:** `src/hooks/useUserPreferences.ts`

**Code:**
```typescript
import { useState, useEffect } from 'react';

interface UserPreferences {
  lastOpenedWhiteboard: string | null;
  defaultWhiteboard: string | null;
}

const STORAGE_KEY = 'tldraw-user-preferences';

export function useUserPreferences() {
  const [preferences, setPreferences] = useState<UserPreferences>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : { 
        lastOpenedWhiteboard: null, 
        defaultWhiteboard: null 
      };
    } catch (error) {
      console.error('Failed to load preferences:', error);
      return { lastOpenedWhiteboard: null, defaultWhiteboard: null };
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
    } catch (error) {
      console.error('Failed to save preferences:', error);
    }
  }, [preferences]);

  const setLastOpened = (path: string) => {
    setPreferences(prev => ({ ...prev, lastOpenedWhiteboard: path }));
  };

  const setDefaultBoard = (path: string | null) => {
    setPreferences(prev => ({ ...prev, defaultWhiteboard: path }));
  };

  const getStartupBoard = (): string | null => {
    return preferences.defaultWhiteboard || preferences.lastOpenedWhiteboard;
  };

  return {
    preferences,
    setLastOpened,
    setDefaultBoard,
    getStartupBoard,
  };
}
```

**Testing Checkpoint:**
- [ ] File created successfully
- [ ] No TypeScript errors
- [ ] Hook compiles without issues

---

### Task 1.2: Integrate Preferences into App.tsx

**Location:** `src/App.tsx`

**Changes:**
1. Import `useUserPreferences` hook
2. Auto-load startup board on mount
3. Track last opened board when user switches

**Code Changes:**
```typescript
// Add import at top
import { useUserPreferences } from './hooks/useUserPreferences';

export default function App() {
  const { preferences, setLastOpened, setDefaultBoard, getStartupBoard } = useUserPreferences();
  const [activeWhiteboardPath, setActiveWhiteboardPath] = useState<string | null>(null);

  // Auto-load startup board on mount
  useEffect(() => {
    const startupBoard = getStartupBoard();
    if (startupBoard) {
      setActiveWhiteboardPath(startupBoard);
    }
  }, []); // Empty deps - only run once on mount

  // Track last opened board when user switches
  useEffect(() => {
    if (activeWhiteboardPath) {
      setLastOpened(activeWhiteboardPath);
    }
  }, [activeWhiteboardPath, setLastOpened]);

  // Pass setDefaultBoard to FileExplorer (will be used in Phase 1.3)
  return (
    <div style={{ position: 'fixed', inset: 0, display: 'flex' }}>
      <FileExplorer
        currentPath={activeWhiteboardPath || ''}
        onSelectFile={setActiveWhiteboardPath}
        onSetDefaultBoard={setDefaultBoard}
        defaultBoard={preferences.defaultWhiteboard}
      />
      {/* ... rest of component */}
    </div>
  );
}
```

**Testing Checkpoint:**
- [ ] App compiles without errors
- [ ] Open app, select a whiteboard, close browser
- [ ] Reopen browser - should auto-load last whiteboard (no "Select a whiteboard" prompt)
- [ ] Check browser console for localStorage: `localStorage.getItem('tldraw-user-preferences')`

---

### Task 1.3: Add "Set as Default" to Context Menu

**Location:** `src/components/FileExplorer.tsx`

**Changes:**
1. Accept `onSetDefaultBoard` and `defaultBoard` props
2. Add "Set as Default" option to context menu for files
3. Show star icon for default board

**Update Props Interface:**
```typescript
interface FileExplorerProps {
  onSelectFile: (path: string) => void;
  currentPath: string;
  onSetDefaultBoard?: (path: string | null) => void;
  defaultBoard?: string | null;
}
```

**Add to Context Menu (after delete option):**
```typescript
{contextMenu.item?.type === 'file' && (
  <>
    <hr style={{ margin: '5px 0', border: 'none', borderTop: '1px solid #eee' }} />
    <div 
      className="context-menu-item"
      onClick={() => {
        if (contextMenu.item) {
          const isCurrentDefault = defaultBoard === contextMenu.item.path;
          onSetDefaultBoard?.(isCurrentDefault ? null : contextMenu.item.path);
        }
        setContextMenu(null);
      }}
    >
      {defaultBoard === contextMenu.item.path ? '⭐ Unset Default' : 'Set as Default'}
    </div>
  </>
)}
```

**Show Star Icon in Tree:**
```typescript
// In renderTree(), add star indicator for default board
<span style={{ marginRight: '5px' }}>
  {item.type === 'directory' 
    ? (expandedFolders.has(item.path) ? '📂' : '📁') 
    : (defaultBoard === item.path ? '⭐' : '📄')}
</span>
```

**Testing Checkpoint:**
- [ ] Right-click on whiteboard file
- [ ] Click "Set as Default" - star appears
- [ ] Close and reopen app - should load default board
- [ ] Right-click again - shows "Unset Default"
- [ ] Unset default - star disappears
- [ ] Close and reopen - loads last opened board instead

---

## ✋ STOP CHECKPOINT: Phase 1 Complete

**User must confirm:**
1. App auto-loads last opened whiteboard on startup ✅
2. Can set/unset default board ✅
3. Default board takes precedence over last opened ✅
4. Preferences persist across browser sessions ✅

---

## PHASE 2: RENAME FUNCTIONALITY

**Goal:** Add rename capability to complete CRUD operations.

### Task 2.1: Add Rename State Management

**Location:** `src/components/FileExplorer.tsx`

**Add State:**
```typescript
const [renamingItem, setRenamingItem] = useState<{ path: string; name: string } | null>(null);
```

**Add Handler Function:**
```typescript
const handleRename = async (oldPath: string, newName: string) => {
  if (!newName || newName === renamingItem?.name) {
    setRenamingItem(null);
    return;
  }

  try {
    const pathParts = oldPath.split('/');
    pathParts[pathParts.length - 1] = newName;
    const newPath = pathParts.join('/');

    await fetch('/api/fs/rename', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ oldPath, newPath }),
    });

    setRenamingItem(null);
    loadAllFiles();

    // If renaming current file, update selection
    if (currentPath === oldPath) {
      onSelectFile(newPath);
    }
  } catch (error) {
    console.error('Error renaming item:', error);
    alert('Failed to rename item');
  }
};
```

**Testing Checkpoint:**
- [ ] Code compiles without errors
- [ ] Handler function is defined

---

### Task 2.2: Add Rename to Context Menu

**Location:** `src/components/FileExplorer.tsx` - context menu section

**Add Before Delete Option:**
```typescript
<div 
  className="context-menu-item"
  onClick={() => {
    if (contextMenu.item) {
      setRenamingItem({ path: contextMenu.item.path, name: contextMenu.item.name });
    }
    setContextMenu(null);
  }}
>
  Rename
</div>
<hr style={{ margin: '5px 0', border: 'none', borderTop: '1px solid #eee' }} />
```

**Testing Checkpoint:**
- [ ] Right-click shows "Rename" option
- [ ] Clicking "Rename" closes context menu

---

### Task 2.3: Add Inline Rename Input

**Location:** `src/components/FileExplorer.tsx` - inside `renderTree()`

**Replace the item name display with conditional rendering:**
```typescript
// Inside the file-item div, replace name display:
{renamingItem?.path === item.path ? (
  <input
    type="text"
    value={renamingItem.name}
    onChange={(e) => setRenamingItem({ ...renamingItem, name: e.target.value })}
    onKeyDown={(e) => {
      if (e.key === 'Enter') handleRename(renamingItem.path, renamingItem.name);
      if (e.key === 'Escape') setRenamingItem(null);
    }}
    onBlur={() => handleRename(renamingItem.path, renamingItem.name)}
    autoFocus
    style={{
      flex: 1,
      border: '1px solid #007bff',
      padding: '2px 4px',
      fontSize: '13px',
    }}
    onClick={(e) => e.stopPropagation()}
  />
) : (
  item.name
)}
```

**Testing Checkpoint:**
- [ ] Right-click item → Rename
- [ ] Input appears with current name selected
- [ ] Type new name, press Enter → item renamed
- [ ] Verify file renamed on disk (`ls tldraw-data/`)
- [ ] Press Escape → cancels rename
- [ ] Click outside input → saves rename

---

## ✋ STOP CHECKPOINT: Phase 2 Complete

**User must confirm:**
1. Can rename files ✅
2. Can rename folders ✅
3. Rename updates on disk ✅
4. If current whiteboard renamed, selection updates ✅
5. Keyboard shortcuts work (Enter/Escape) ✅

---

## PHASE 3: KEYBOARD NAVIGATION

**Goal:** Add arrow key navigation through file tree (VS Code style).

### Task 3.1: Add Keyboard Navigation State

**Location:** `src/components/FileExplorer.tsx`

**Add State:**
```typescript
const [focusedIndex, setFocusedIndex] = useState<number>(0);
```

**Add Helper Function to Flatten Tree:**
```typescript
const flattenTree = (items: FileSystemItem[], result: FileSystemItem[] = []): FileSystemItem[] => {
  items.forEach(item => {
    result.push(item);
    if (item.type === 'directory' && expandedFolders.has(item.path) && item.children) {
      flattenTree(item.children, result);
    }
  });
  return result;
};
```

**Add Keyboard Handler:**
```typescript
useEffect(() => {
  const handleKeyDown = (e: KeyboardEvent) => {
    const flatList = flattenTree(files);
    if (flatList.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setFocusedIndex(prev => Math.min(prev + 1, flatList.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setFocusedIndex(prev => Math.max(prev - 1, 0));
    } else if (e.key === 'Enter') {
      const item = flatList[focusedIndex];
      if (item.type === 'file') {
        onSelectFile(item.path);
      } else {
        toggleFolder(item.path);
      }
    } else if (e.key === 'ArrowRight') {
      const item = flatList[focusedIndex];
      if (item.type === 'directory' && !expandedFolders.has(item.path)) {
        toggleFolder(item.path);
      }
    } else if (e.key === 'ArrowLeft') {
      const item = flatList[focusedIndex];
      if (item.type === 'directory' && expandedFolders.has(item.path)) {
        toggleFolder(item.path);
      }
    }
  };

  window.addEventListener('keydown', handleKeyDown);
  return () => window.removeEventListener('keydown', handleKeyDown);
}, [files, expandedFolders, focusedIndex, onSelectFile]);
```

**Testing Checkpoint:**
- [ ] Arrow Down moves focus down tree
- [ ] Arrow Up moves focus up tree
- [ ] Enter opens file or toggles folder
- [ ] Arrow Right expands folder
- [ ] Arrow Left collapses folder

---

### Task 3.2: Add Visual Focus Indicator

**Location:** `src/components/FileExplorer.tsx` - `renderTree()`

**Add Focus Styling:**
```typescript
// Calculate index in flat list for this item
const flatList = flattenTree(files);
const itemIndex = flatList.findIndex(f => f.path === item.path);
const isFocused = itemIndex === focusedIndex;

// Update style
style={{ 
  display: 'flex', 
  alignItems: 'center', 
  padding: '4px', 
  cursor: 'pointer',
  backgroundColor: currentPath === item.path 
    ? '#e0e0e0' 
    : isFocused 
      ? '#f0f0f0' 
      : 'transparent',
  outline: isFocused ? '2px solid #007bff' : 'none',
}}
```

**Testing Checkpoint:**
- [ ] Blue outline shows focused item
- [ ] Focus moves with arrow keys
- [ ] Selected (active) file has different color than focused
- [ ] Can navigate entire tree with keyboard

---

## ✋ STOP CHECKPOINT: Phase 3 Complete

**User must confirm:**
1. Arrow keys navigate tree ✅
2. Enter opens files/toggles folders ✅
3. Arrow Left/Right collapse/expand folders ✅
4. Visual focus indicator clear ✅

---

## PHASE 4: UI POLISH & ICONS

**Goal:** Replace emoji icons with professional icons, improve visual design.

### Task 4.1: Install Icon Library

**Command:**
```bash
npm install lucide-react
```

**Testing Checkpoint:**
- [ ] Package installed successfully
- [ ] No dependency conflicts

---

### Task 4.2: Replace Emoji Icons

**Location:** `src/components/FileExplorer.tsx`

**Add Imports:**
```typescript
import { 
  ChevronRight, 
  ChevronDown, 
  Folder, 
  FolderOpen, 
  File, 
  FilePlus, 
  FolderPlus, 
  RotateCw,
  Star,
  Trash2,
  Edit3
} from 'lucide-react';
```

**Replace Icons in Tree:**
```typescript
// Folder/file icons
<span style={{ marginRight: '5px', display: 'flex', alignItems: 'center' }}>
  {item.type === 'directory' ? (
    expandedFolders.has(item.path) ? <FolderOpen size={16} /> : <Folder size={16} />
  ) : (
    defaultBoard === item.path ? <Star size={16} color="#ffc107" /> : <File size={16} />
  )}
</span>
```

**Replace Toolbar Buttons:**
```typescript
<button onClick={() => { setCreatingType('file'); setCreatingInPath(''); }} title="New File">
  <FilePlus size={16} />
</button>
<button onClick={() => { setCreatingType('directory'); setCreatingInPath(''); }} title="New Folder">
  <FolderPlus size={16} />
</button>
<button onClick={() => loadAllFiles()} title="Refresh">
  <RotateCw size={16} />
</button>
```

**Replace Context Menu Icons:** (Add icons before text)

**Testing Checkpoint:**
- [ ] Icons display correctly
- [ ] No emoji visible
- [ ] Icons scale properly
- [ ] Toolbar buttons show icons

---

### Task 4.3: Improve Visual Design

**Location:** `src/components/FileExplorer.tsx`

**Update Styles:**
```typescript
// File Explorer container
style={{ 
  width: '250px', 
  height: '100%', 
  borderRight: '1px solid #e0e0e0', 
  display: 'flex', 
  flexDirection: 'column',
  backgroundColor: '#fafafa',
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  fontSize: '13px',
}}

// Toolbar
style={{ 
  padding: '10px', 
  borderBottom: '1px solid #e0e0e0', 
  display: 'flex', 
  justifyContent: 'space-between', 
  alignItems: 'center',
  backgroundColor: '#fff',
}}

// Buttons
style={{
  padding: '4px 8px',
  border: '1px solid #d0d0d0',
  borderRadius: '3px',
  background: '#fff',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  gap: '4px',
}}
```

**Testing Checkpoint:**
- [ ] Explorer looks professional
- [ ] Colors match VS Code aesthetic
- [ ] Buttons have subtle borders
- [ ] Hover states work

---

## ✋ STOP CHECKPOINT: Phase 4 Complete

**User must confirm:**
1. Professional icons throughout ✅
2. Clean, modern visual design ✅
3. Matches VS Code aesthetic ✅

---

## PHASE 5: ERROR HANDLING & LOADING STATES

**Goal:** Add proper error messages and loading indicators.

### Task 5.1: Add Loading State

**Location:** `src/components/FileExplorer.tsx`

**Add State:**
```typescript
const [isLoading, setIsLoading] = useState(false);
```

**Update loadAllFiles:**
```typescript
const loadAllFiles = useCallback(async () => {
  setIsLoading(true);
  try {
    // ... existing code ...
  } finally {
    setIsLoading(false);
  }
}, [fetchFiles, expandedFolders]);
```

**Show Loading Indicator:**
```typescript
{isLoading ? (
  <div style={{ 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    padding: '20px',
    color: '#999',
  }}>
    <RotateCw size={20} className="spinning" />
    <span style={{ marginLeft: '8px' }}>Loading...</span>
  </div>
) : (
  renderTree(files)
)}
```

**Add Spinning Animation (in style tag):**
```css
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
.spinning {
  animation: spin 1s linear infinite;
}
```

**Testing Checkpoint:**
- [ ] Loading spinner shows when fetching
- [ ] Spinner stops when loaded
- [ ] No flicker for fast loads

---

### Task 5.2: Add Error Toast

**Add State:**
```typescript
const [error, setError] = useState<string | null>(null);
```

**Show Error Toast:**
```typescript
{error && (
  <div style={{
    position: 'fixed',
    bottom: '20px',
    right: '20px',
    background: '#f44336',
    color: 'white',
    padding: '12px 20px',
    borderRadius: '4px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
    zIndex: 10000,
  }}>
    {error}
    <button 
      onClick={() => setError(null)}
      style={{
        marginLeft: '12px',
        background: 'transparent',
        border: 'none',
        color: 'white',
        cursor: 'pointer',
        fontSize: '16px',
      }}
    >
      ✕
    </button>
  </div>
)}
```

**Update Error Handlers:**
```typescript
// In catch blocks, replace console.error with:
setError('Failed to load files. Please try again.');
// Auto-dismiss after 5 seconds
setTimeout(() => setError(null), 5000);
```

**Testing Checkpoint:**
- [ ] Error toast appears on failure
- [ ] Can dismiss toast manually
- [ ] Auto-dismisses after 5 seconds
- [ ] Multiple errors don't stack

---

## ✋ STOP CHECKPOINT: Phase 5 Complete

**User must confirm:**
1. Loading states show appropriately ✅
2. Error messages are helpful ✅
3. Errors auto-dismiss ✅

---

## PHASE 6: HYPERLINK SYSTEM (CROSS-WHITEBOARD NAVIGATION)

**Goal:** Add ability to create hyperlinks on whiteboards that jump to other whiteboards.

### Task 6.1: Design Link Format

**Decision:** How should links be represented on canvas?

**Option A:** Special shape type with custom rendering
**Option B:** Use tldraw's built-in arrow shapes with metadata
**Option C:** Text boxes with special syntax (e.g., `[[filename.json]]`)

**Recommendation:** Option C (text-based) - simplest to implement.

**Link Syntax:**
```
[[path/to/whiteboard.json]]
[[Student A/Math/lesson1.json]]
```

**Testing Checkpoint:**
- [ ] User confirms preferred link format
- [ ] Syntax is clear and intuitive

---

### Task 6.2: Detect Links on Canvas

**Location:** Create new `src/hooks/useLinkDetection.ts`

**Implementation:**
```typescript
import { useEditor } from 'tldraw';
import { useEffect } from 'react';

export function useLinkDetection(onLinkClick: (path: string) => void) {
  const editor = useEditor();

  useEffect(() => {
    const handleClick = (e: PointerEvent) => {
      const shape = editor.getShapeAtPoint({ x: e.clientX, y: e.clientY });
      if (!shape || shape.type !== 'text') return;

      const text = (shape.props as any).text || '';
      const linkMatch = text.match(/\[\[(.+?)\]\]/);
      
      if (linkMatch) {
        e.preventDefault();
        onLinkClick(linkMatch[1]);
      }
    };

    const container = editor.getContainer();
    container.addEventListener('click', handleClick);
    return () => container.removeEventListener('click', handleClick);
  }, [editor, onLinkClick]);
}
```

**Testing Checkpoint:**
- [ ] Hook detects [[links]] in text
- [ ] Click on link triggers callback
- [ ] Normal text clicks work normally

---

### Task 6.3: Integrate Link Navigation

**Location:** `src/App.tsx`

**Add Hook:**
```typescript
import { useLinkDetection } from './hooks/useLinkDetection';

// Inside Tldraw component
<Tldraw components={components} key={activeWhiteboardPath}>
  <PersistenceManager whiteboardPath={activeWhiteboardPath} />
  <SwappedZoomPanHandler />
  <RightClickPanHandler />
  <CustomShapeRenderer />
  <LinkNavigationHandler onNavigate={setActiveWhiteboardPath} />
</Tldraw>

// New component
function LinkNavigationHandler({ onNavigate }: { onNavigate: (path: string) => void }) {
  useLinkDetection(onNavigate);
  return null;
}
```

**Testing Checkpoint:**
- [ ] Create text box: `[[test/file.json]]`
- [ ] Click link → navigates to that whiteboard
- [ ] Non-existent files show error
- [ ] Back navigation works (browser back button)

---

## ✋ STOP CHECKPOINT: Phase 6 Complete

**User must confirm:**
1. Can create links with [[syntax]] ✅
2. Clicking links navigates to whiteboards ✅
3. Error handling for invalid links ✅

---

## PHASE 7: FINAL POLISH & OPTIMIZATION

**Goal:** Performance optimization and final UX improvements.

### Task 7.1: Optimize Tree Rendering

**Location:** `src/components/FileExplorer.tsx`

**Add Memoization:**
```typescript
import React, { useState, useEffect, useCallback, memo } from 'react';

const TreeNode = memo(({ 
  item, 
  level, 
  isActive, 
  isFocused,
  isExpanded,
  onToggle,
  onSelect,
  onContextMenu,
}: any) => {
  // Move rendering logic here
  return (/* tree node JSX */);
});
```

**Testing Checkpoint:**
- [ ] Tree renders smoothly
- [ ] No lag with 50+ files
- [ ] Expand/collapse is instant

---

### Task 7.2: Add Drag-and-Drop (Optional)

**Decision:** Do you want drag-and-drop file moving?

**If YES:** Use `react-dnd` or HTML5 drag API
**If NO:** Skip this task

**Testing Checkpoint:**
- [ ] User decides: implement drag-and-drop? (Y/N)

---

### Task 7.3: Add Search/Filter

**Add Search Input:**
```typescript
const [searchQuery, setSearchQuery] = useState('');

// Add to toolbar
<input
  type="text"
  placeholder="Search..."
  value={searchQuery}
  onChange={(e) => setSearchQuery(e.target.value)}
  style={{ flex: 1, padding: '4px 8px', border: '1px solid #ddd', borderRadius: '3px' }}
/>

// Filter tree
const filterTree = (items: FileSystemItem[]): FileSystemItem[] => {
  if (!searchQuery) return items;
  return items.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
};
```

**Testing Checkpoint:**
- [ ] Can search for files by name
- [ ] Search is case-insensitive
- [ ] Clears search shows all files

---

## ✋ FINAL CHECKPOINT: Phase 7 Complete

**User must confirm:**
1. All features working smoothly ✅
2. No performance issues ✅
3. Optional features implemented as desired ✅

---

## PROJECT COMPLETION CHECKLIST

**Critical Features:**
- [x] Phase 0: Bug fixes (tree display, JSON parsing)
- [x] Phase 1: User preferences (last opened, default board)
- [x] Phase 2: Rename functionality
- [x] Phase 3: Keyboard navigation
- [x] Phase 4: Professional UI with icons
- [x] Phase 5: Error handling & loading states
- [x] Phase 6: Hyperlink navigation system
- [x] Phase 7: Final polish & optimization

**Testing Completed:**
- [ ] All intermittent checkpoints passed
- [ ] No console errors
- [ ] All CRUD operations work (Create, Read, Update, Delete)
- [ ] File system persists correctly
- [ ] User preferences persist across sessions
- [ ] Keyboard shortcuts work
- [ ] Hyperlinks navigate correctly

**Documentation:**
- [ ] Update README.md with new features
- [ ] Document keyboard shortcuts
- [ ] Document link syntax
- [ ] Add user guide for default board setting

---

## NOTES FOR AI CODING AGENT

**Critical Instructions:**
1. **Work sequentially** - Complete Phase 0 before Phase 1, etc.
2. **Wait for user confirmation** after each phase before proceeding
3. **Never skip testing checkpoints** - These catch issues early
4. **Preserve existing functionality** - Don't break working features
5. **Ask before making architectural changes** - Confirm with user first

**Common Pitfalls to Avoid:**
- Don't over-engineer - Keep solutions simple
- Don't modify server code unless necessary - Backend is solid
- Don't change file formats - Maintain compatibility
- Don't skip error handling - Always validate API responses

**When Stuck:**
1. Review the current phase objectives
2. Check if previous checkpoints were truly completed
3. Ask user to verify current state
4. Read error messages carefully - they usually indicate the issue

---

## POST-COMPLETION ENHANCEMENTS (Future)

**These are NOT required for refactoring completion but nice to have:**
- Drag-and-drop file moving
- Multi-select for batch operations
- File/folder templates
- Export/import whiteboard collections
- Search with regex support
- Tags/labels for whiteboards
- Recent files quick access
- Breadcrumb navigation
- Split-screen view (two whiteboards side-by-side)

---

**END OF REFACTORING PLAN**

Good luck! Remember: Phase by phase, checkpoint by checkpoint. Don't rush! 🚀