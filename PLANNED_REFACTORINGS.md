# Planned refactorings

## Phase 1-5: Extended color palette & custom color system (COMPLETED ✅)

1. Extended tldraw color palette from 13 to 28 colors
2. Added 15 new colors with light/dark mode support
3. Fixed black/white to not invert in dark mode
4. Created double-click color picker modal with HSL auto-generation
5. Implemented filesystem-based persistence (replaced localStorage)
   - Created Express API server on port 3001
   - Color configs stored in `/templates/vite/config/custom-colors.json`
   - Backend handles load/save/reset operations

## Phase 5.5: Color naming & UI fixes (COMPLETED ✅)

1. **Renamed all colors to position-based system:**
   - Old: `'black'`, `'red'`, `'purple'`, etc.
   - New: `'color1_R1C1'` through `'color28_R7C4'` (Row×Column grid)
   - Updated 1000+ references across entire codebase
   - Updated custom-colors.json and default-colors.json

2. **Fixed color picker pre-population:**
   - Now shows current custom colors instead of defaults
   - Retrieves from `colorManager.getColor()` for both light/dark modes

3. **Simplified tooltips:**
   - Removed color names from tooltips (e.g., "Color — black" → "Color")
   - Users identify colors by position only

4. **Fixed Excalidraw import issue:**
   - Corrected color mapping in `putExcalidrawContent.ts`
   - Used proper Excalidraw color names instead of position-based names

### Files modified:

- Core: `packages/tlschema/src/styles/TLColorStyle.ts`
- UI: `packages/tldraw/src/lib/ui/components/StylePanel/StylePanelButtonPicker.tsx`
- Modal: `packages/tldraw/src/lib/ui/components/ColorPickerModal.tsx`
- Theme: `packages/tldraw/src/lib/shapes/shared/useDefaultColorTheme.ts`
- Hooks: `packages/tldraw/src/lib/ui/hooks/useCustomColors.ts`
- API: `templates/vite/server.js`
- Config: `templates/vite/config/custom-colors.json`, `default-colors.json`
- Utils: `packages/tldraw/src/lib/utils/excalidraw/putExcalidrawContent.ts`

### Current state:

- ✅ 28 colors working with position-based naming
- ✅ Color picker pre-populates correctly
- ✅ Tooltips simplified
- ✅ File-based persistence working
- ✅ Servers running: API (port 3001), Vite (port 5424)
- ✅ Save/Reset palette buttons in hamburger menu
- ⚠️ **KNOWN ISSUE:** Colors change retroactively when palette changes (deferred for later fix)

---

## Phase 6: Hamburger menu save/reset buttons (COMPLETED ✅)

1. **Added two palette management actions:**
   - `save-palette-as-default` - Saves current palette as new default
   - `reset-palette-to-default` - Resets palette to defaults

2. **Created ColorPaletteMenu component:**
   - New submenu under Preferences in hamburger menu
   - Two buttons: "Save palette as default" and "Reset palette to default"
   - Integrated alongside ColorScheme and Accessibility menus

3. **Wired to existing backend APIs:**
   - Calls `POST /api/colors/save-as-default`
   - Calls `POST /api/colors/reset`
   - Page reloads after operation to apply changes

### Files modified:

- Actions: `packages/tldraw/src/lib/ui/context/actions.tsx`
- Menu: `packages/tldraw/src/lib/ui/components/MainMenu/DefaultMainMenuContent.tsx`
- Component: `packages/tldraw/src/lib/ui/components/ColorPaletteMenu.tsx` (new file)

---

## Future work (NOT STARTED)

### Next topic: Persisting whiteboards

- Implement whiteboard save/load functionality
- File-based or database persistence

### Future topic: Fix retroactive color changes

- **Problem:** When customizing a color, all existing shapes using that color slot change retroactively
- **Current behavior:** Shapes store color IDs (`'color1_R1C1'`) not actual hex values
- **Proposed solution:** Store actual hex values in shapes to freeze colors at creation time
- **Integration:** Combine with whiteboard persistence to ensure saved boards maintain original colors
