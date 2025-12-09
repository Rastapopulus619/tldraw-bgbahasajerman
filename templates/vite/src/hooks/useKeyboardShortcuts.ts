import { useEffect } from 'react'

interface KeyboardShortcutsOptions {
	onToggleSidebar: () => void
	onToggleFocus: () => void
	sidebarActive: boolean
}

/**
 * useKeyboardShortcuts hook
 *
 * Centralized keyboard shortcut management for the entire application.
 * Uses capture phase to intercept events before tldraw.
 *
 * Shortcuts:
 * - Ctrl+B: Toggle sidebar collapse/expand
 * - Ctrl+Shift+E: Toggle focus between sidebar and canvas
 *
 * When sidebar is focused:
 * - F2: Rename selected file
 * - Delete: Delete selected file
 * - Ctrl+C: Copy selected file
 * - Ctrl+V: Paste to smart destination
 * - Escape: Close context menu or cancel rename
 * - Enter: Confirm rename or open file
 * - Arrow keys: Navigate file tree
 */
export function useKeyboardShortcuts({
	onToggleSidebar,
	onToggleFocus,
	sidebarActive,
}: KeyboardShortcutsOptions) {
	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0
			const ctrlOrCmd = isMac ? e.metaKey : e.ctrlKey

			// Global shortcuts (work regardless of focus)

			// Ctrl+B / Cmd+B: Toggle sidebar
			if (ctrlOrCmd && e.key === 'b' && !e.shiftKey && !e.altKey) {
				e.preventDefault()
				e.stopPropagation()
				onToggleSidebar()
				return
			}

			// Ctrl+Shift+E / Cmd+Shift+E: Toggle focus
			if (ctrlOrCmd && e.shiftKey && e.key === 'E') {
				e.preventDefault()
				e.stopPropagation()
				onToggleFocus()
				return
			}

			// Sidebar-specific shortcuts (only when sidebar is focused)
			if (sidebarActive) {
				const fileOps = (window as any).__sidebarFileOps

				// F2: Rename
				if (e.key === 'F2' && fileOps?.startRename) {
					e.preventDefault()
					e.stopPropagation()
					fileOps.startRename()
					return
				}

				// Delete: Delete file
				if (e.key === 'Delete' && fileOps?.deleteSelected) {
					e.preventDefault()
					e.stopPropagation()
					fileOps.deleteSelected()
					return
				}

				// Ctrl+C: Copy
				if (ctrlOrCmd && e.key === 'c' && !e.shiftKey && fileOps?.copySelected) {
					e.preventDefault()
					e.stopPropagation()
					fileOps.copySelected()
					return
				}

				// Ctrl+V: Paste
				if (ctrlOrCmd && e.key === 'v' && !e.shiftKey && fileOps?.pasteToSelected) {
					e.preventDefault()
					e.stopPropagation()
					fileOps.pasteToSelected()
					return
				}

				// Arrow key navigation
				if (e.key === 'ArrowUp' && fileOps?.navigateUp) {
					e.preventDefault()
					e.stopPropagation()
					fileOps.navigateUp()
					return
				}

				if (e.key === 'ArrowDown' && fileOps?.navigateDown) {
					e.preventDefault()
					e.stopPropagation()
					fileOps.navigateDown()
					return
				}

				if (e.key === 'ArrowRight' && fileOps?.expandSelected) {
					e.preventDefault()
					e.stopPropagation()
					fileOps.expandSelected()
					return
				}

				if (e.key === 'ArrowLeft' && fileOps?.collapseSelected) {
					e.preventDefault()
					e.stopPropagation()
					fileOps.collapseSelected()
					return
				}

				// Enter: Open selected file
				if (e.key === 'Enter' && fileOps?.openSelected) {
					e.preventDefault()
					e.stopPropagation()
					fileOps.openSelected()
					return
				}

				// Block ALL other keys from reaching tldraw when sidebar is focused
				// This prevents accidental tool selection, drawing, etc.
				// Only exception: modifier keys alone (Ctrl, Shift, Alt)
				if (!['Control', 'Shift', 'Alt', 'Meta'].includes(e.key)) {
					e.stopPropagation()
				}
			}
		}

		// Use capture phase to intercept before tldraw gets the event
		window.addEventListener('keydown', handleKeyDown, true)
		return () => window.removeEventListener('keydown', handleKeyDown, true)
	}, [onToggleSidebar, onToggleFocus, sidebarActive])
}
