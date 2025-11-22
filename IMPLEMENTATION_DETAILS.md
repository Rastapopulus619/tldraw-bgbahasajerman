# Custom Color System Implementation

## Project Overview
This is a modified Tldraw whiteboard application with a custom 28-color hex palette system.
The project replaces Tldraw's standard 12-color enum-based palette with user-customizable hex colors.

**Base:** Tldraw v4.1.2  
**Approach:** CSS Injection + Metadata Storage (Option B)

---

## Key Features Implemented

### 1. Custom 28-Color Palette
- **Location:** Top of the style panel (4 rows × 7 columns)
- **Persistence:** Colors saved to `/tldraw-data/color-palette.json` via Express API
- **Customization:** Right-click any color to open a hex color picker (react-colorful)
- **Visual Feedback:** Selected color shows white border + glow effect
- **Keyboard Shortcuts:** Backtick + row number + column number (e.g., `` `23 `` for row 2, column 3)

### 2. Zoom-to-Cursor Enhancement
- **Mouse Wheel (no modifier):** Zoom centered on cursor position
- **Ctrl + Mouse Wheel:** Vertical pan
- **Shift + Mouse Wheel:** Horizontal pan
- **Implementation:** Custom event handler in `SwappedZoomPanHandler` component

### 3. Auto-Save System
- **Mechanism:** PersistenceManager component saves whiteboard state every 1 second after changes
- **Backend:** Express API on port 3001
- **Storage:** JSON files in `/tldraw-data/` directory

---

## Architecture

### Core Components

#### 1. CustomColorPicker (`src/components/CustomColorPicker.tsx`)
**Purpose:** Renders the 28-color grid and handles color selection/customization.

**Key Functions:**
- `selectColor(hexColor, index)`: Applies color to selected shapes and sets it for next shapes
  - Updates `shape.meta.customColor` with hex value
  - Sets dummy tldraw color to 'black' (required for shape to render)
  - Stores color in `editor._customHexColor` for new shape creation
- `updateColor(index, newColor)`: Saves edited color to backend API
- `handleCloseColorPicker()`: Auto-applies edited color when picker closes

**State Management:**
- `colors`: Array of 28 hex strings loaded from backend
- `selectedIndex`: Currently active color (for visual feedback)
- `editingIndex`: Which color slot is being customized (opens hex picker)

#### 2. CustomShapeRenderer (`src/components/CustomShapeRenderer.tsx`)
**Purpose:** Applies custom colors to shapes via dynamic CSS injection.

**Mechanism:**
1. Creates a `<style id="custom-shape-colors">` element in document head
2. Listens to editor shape changes
3. For each shape with `meta.customColor`, generates CSS rules targeting that shape's ID
4. Injects CSS with `!important` to override Tldraw's default styles

**Critical Logic - The "Draw Tool Fix":**
```typescript
if (shape.type === 'draw' && shape.props.dash === 'draw') {
  // Apply BOTH stroke AND fill (solid draw style needs filled paths)
  cssRules.push(`
    .tl-shape[data-shape-id="${shape.id}"] > svg > path {
      stroke: ${customColor} !important;
      fill: ${customColor} !important;
    }
  `)
} else {
  // All other shapes/styles: stroke only
  cssRules.push(`
    .tl-shape[data-shape-id="${shape.id}"] > svg > path {
      stroke: ${customColor} !important;
    }
  `)
}
```

**Why This Matters:**
- `type: "draw"` + `dash: "draw"` = Solid freehand drawing (requires fill)
- `type: "draw"` + `dash: "dashed"/"dotted"/"solid"` = Stroke-only styles
- `type: "geo"` (rectangles/circles) = Stroke-only for paths

#### 3. App.tsx Modifications
**CustomStylePanel Component:**
- Renders `<CustomColorPicker />` at the top
- Includes `<DefaultStylePanelContent />` for native Fill/Dash/Size controls
- Registered via `components={{ StylePanel: CustomStylePanel }}`

**SwappedZoomPanHandler:**
- Intercepts wheel events to swap zoom/pan behavior
- Uses `editor.setCamera()` for smooth zoom transitions

**PersistenceManager:**
- Debounced auto-save (1 second delay after last change)
- Saves to `/api/whiteboards/:id` endpoint

### 4. Backend API (`server/api.js`, `server/storage.js`)
**Endpoints:**
- `GET /api/colors` - Load 28-color palette
- `POST /api/colors` - Save updated palette
- `GET /api/whiteboards` - List all whiteboards
- `GET /api/whiteboards/:id` - Load specific whiteboard
- `POST /api/whiteboards/:id` - Save whiteboard state

**Storage:**
- `tldraw-data/color-palette.json` - The 28 hex colors
- `tldraw-data/wb-*.json` - Individual whiteboard states

### 5. UI Customization (`src/index.css`)
**Hides Default Color Palette:**
```css
.tlui-toolbar[aria-label="Color"] {
  display: none !important;
}
```
This CSS rule targets the default 12-color toolbar and hides it while keeping Fill/Dash/Size controls visible.

---

## Data Flow

### New Shape Creation:
1. User clicks a color in `CustomColorPicker`
2. `selectColor()` stores hex in `editor._customHexColor`
3. User draws a shape
4. `CustomShapeRenderer` detects the new shape
5. Updates `shape.meta.customColor = editor._customHexColor`
6. CSS rules immediately apply the color

### Existing Shape Recoloring:
1. User selects shape(s)
2. User clicks a color
3. `selectColor()` calls `editor.updateShapes()` to set `meta.customColor`
4. `CustomShapeRenderer` detects the change
5. Regenerates CSS rules for that shape ID
6. Browser re-renders with new color

---

## Critical Implementation Details (DO NOT BREAK)

### CSS Selector Fragility ⚠️
The entire color system depends on these DOM selectors remaining valid:
- `.tl-shape[data-shape-id="..."]` - Shape wrapper element
- `> svg > path` - Direct child path elements
- `[data-shape-type="geo"]` - Geometric shapes

**If Tldraw changes their HTML structure, colors will stop appearing.**

### The "!important" Necessity
Tldraw shapes render with inline SVG attributes like `stroke="var(--color-black)"`.
CSS cannot override inline attributes without `!important`.

### Shape Type Detection
We rely on:
- `shape.type` being "draw", "geo", "arrow", "text", etc.
- `shape.props.dash` being "draw", "dashed", "dotted", "solid"

These are internal Tldraw properties, not guaranteed stable across major versions.

---

## Known Issues & Limitations

### 1. CSS Override Limitations
- Some complex shapes (e.g., patterns, gradients) may not color correctly
- The default 12-color palette is hidden via CSS, but still exists in the DOM
- If users manually inspect and click those hidden buttons, they will override custom colors

### 2. Update Fragility
**High Risk on Tldraw Updates:**
- Major version bumps (5.x, 6.x) could change shape rendering entirely
- Minor updates could change CSS class names or SVG structure
- The color system will likely need maintenance after any Tldraw update

**Medium Risk:**
- Keyboard shortcut conflicts (backtick is used for color selection)
- Performance degradation with 100+ shapes (CSS injection scales linearly)

### 3. No Native API Usage
This implementation does NOT use:
- Tldraw's `StyleProp` system (would require forking all shape definitions)
- Tldraw's theming system (colors are not theme-aware)
- Tldraw's official extension API (doesn't support custom hex colors)

---

## Debugging Guide

### Colors Not Appearing?
1. Check browser console for errors in `CustomShapeRenderer`
2. Inspect the shape element - does it have `data-shape-id` attribute?
3. Check if `<style id="custom-shape-colors">` exists in `<head>`
4. Look for CSS rules targeting your shape ID
5. Verify `shape.meta.customColor` is set (check with `editor.getShape(id)`)

### Draw Tool White Fill Issue?
1. Open console and look for "Shape debug:" logs
2. Check if `type === "draw"` and `dash === "draw"`
3. If `type === "geo"`, it's not a draw shape - it's a rectangle/line with draw styling
4. Verify the "✓ Applying FILL" log appears for actual draw shapes

### Default Colors Reappearing?
1. Check if `.tlui-toolbar[aria-label="Color"]` selector in `index.css` is still valid
2. Inspect the element - has the `aria-label` changed?
3. Update the CSS selector to match the new structure

---

## Changes Made to Original Tldraw

### Modified Files:
1. **`src/App.tsx`**
   - Added `CustomStylePanel` component override
   - Added `SwappedZoomPanHandler` for zoom-to-cursor
   - Added `PersistenceManager` for auto-save
   - Integrated backend API calls

2. **`src/index.css`**
   - Added CSS rule to hide default color toolbar

### New Files Created:
1. **`src/components/CustomColorPicker.tsx`** (267 lines)
   - Full custom color palette UI and logic
   
2. **`src/components/CustomShapeRenderer.tsx`** (130 lines)
   - CSS injection renderer for custom colors

3. **`server/api.js`**
   - Express routes for colors and whiteboards

4. **`server/storage.js`**
   - File-based persistence helpers

5. **`server/index.js`**
   - API server entry point

6. **`tldraw-data/*.json`**
   - Persistent storage files

### Package Dependencies Added:
- `react-colorful` - Hex color picker UI
- `express` - Backend API server
- `cors` - CORS middleware for API

---

## Maintenance Checklist (Before Updating Tldraw)

Before running `npm update tldraw`, do this:

1. **Backup Your Data:**
   ```bash
   cp -r tldraw-data tldraw-data.backup
   ```

2. **Test in a Branch:**
   ```bash
   git checkout -b test-tldraw-update
   npm update tldraw
   npm run dev
   ```

3. **Verify These Features:**
   - [ ] Custom colors appear on new shapes
   - [ ] Existing shapes keep their colors after reload
   - [ ] Right-click color customization works
   - [ ] Default 12-color palette is hidden
   - [ ] Fill/Dash/Size buttons are visible and functional
   - [ ] Draw tool with "draw" style has solid fill (no white center)

4. **If Broken, Fix These Files (in order):**
   - `src/index.css` - Update `.tlui-toolbar` selector
   - `src/components/CustomShapeRenderer.tsx` - Update `.tl-shape` selectors
   - `src/App.tsx` - Check if `DefaultStylePanelContent` still exists

5. **Rollback if Unfixable:**
   ```bash
   git checkout main
   npm install  # Restores package-lock.json versions
   ```

---

## Future Enhancement Ideas

### Easy Wins:
- Add color palette presets (Material Design, Tailwind, etc.)
- Export/import color palettes as JSON
- Add color name labels (hover tooltips)

### Medium Effort:
- Migrate to LocalStorage instead of Express API (eliminate server dependency)
- Add color history/recent colors row
- Implement color picker with alpha channel support

### Hard (Requires Rewrite):
- Migrate to Custom Shape approach (Option A) for future-proof stability
- Contribute a PR to Tldraw for official hex color support
- Build a Tldraw plugin system wrapper

---

## Support & Troubleshooting

When asking for help in a new chat session, provide:
1. This file: "Read `IMPLEMENTATION_DETAILS.md` first"
2. The specific error message or unexpected behavior
3. The Tldraw version: Check `package.json` for `"tldraw": "x.x.x"`
4. Browser console logs (especially from `CustomShapeRenderer`)

**Quick Diagnostic Command:**
```bash
# Check current versions
cat package.json | grep tldraw
cat package.json | grep react-colorful

# Verify files exist
ls -la src/components/Custom*.tsx
ls -la tldraw-data/
```

---

**Last Updated:** November 22, 2025  
**Tldraw Version:** 4.1.2  
**Implementation Approach:** Option B (CSS Injection + Metadata)
