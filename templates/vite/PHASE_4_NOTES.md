# Phase 4 Implementation Notes

## welcome.tldr Delete Protection

**Backend Protection:** ✅ Already implemented in `server/index.js`

- Returns 403 error when attempting to delete `welcome.tldr`
- Error message: "Cannot delete welcome.tldr - this is the default fallback board"

**Frontend Protection:** TODO in Phase 4
When implementing the delete operation in Phase 4, add special handling for `welcome.tldr`:

### Two-Stage Confirmation Dialog:

**Stage 1 - Warning Dialog:**

```
Title: "Delete Default Board?"
Message: "You are about to delete 'welcome.tldr', which is the default fallback board.
         If you delete this, the application will not have a fallback when errors occur.
         Are you sure you want to continue?"
Buttons: [Cancel] [Continue to Confirmation]
```

**Stage 2 - Final Confirmation:**

```
Title: "Final Confirmation Required"
Message: "This action cannot be undone."
Checkbox: [ ] I understand this is the fallback board and accept the risk
Button: [Delete Anyway] (disabled until checkbox checked)
```

**Implementation Location:**

- File: `src/components/Sidebar/DeleteConfirmationDialog.tsx` (to be created)
- Called from: Delete operation handler in file tree context menu
- Special case check: `if (fileToDelete === 'welcome.tldr') { /* show two-stage dialog */ }`

### Alternative: Prevent Deletion Entirely

If two-stage confirmation seems too complex, simply:

- Don't show "Delete" option in context menu for `welcome.tldr`
- Show "Delete" as disabled/grayed out with tooltip: "Cannot delete default board"
- Backend will reject anyway if user bypasses UI

**Recommendation:** Simpler approach (disable delete option) for better UX.

---

## Keyboard Blocking Extension

**Phase 6 (Search) TODO:**
When search input is focused, block ALL keys from reaching tldraw:

- Add `isSearchInputFocused` state
- In `useKeyboardShortcuts.ts`, add full blocking when search is active
- See notes in `tldraw-sidebar-refactoring-requirements_1.txt` for implementation details

---

**This file can be deleted after Phase 4 implementation.**
