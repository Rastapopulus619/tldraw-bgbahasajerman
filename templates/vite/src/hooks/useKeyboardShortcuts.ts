import { useEffect } from 'react'

interface KeyboardShortcutsOptions {
	onToggleSidebar: () => void
	onToggleFocus: () => void
	sidebarActive: boolean
	isRenamingMode: boolean
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
	isRenamingMode,
}: KeyboardShortcutsOptions) {
	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			console.log(
				'Key pressed:',
				e.key,
				'sidebarActive:',
				sidebarActive,
				'input focused:',
				document.activeElement instanceof HTMLInputElement
			)
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
				// During rename mode, allow natural text editing but block navigation shortcuts
				if (isRenamingMode) {
					// Allow all text editing keys (arrows, Ctrl+C/V/X/A, Home, End, Backspace, Delete, etc.)
					const isTextEditingKey =
						e.key.startsWith('Arrow') || // Arrow keys for cursor movement
						e.key === 'Home' ||
						e.key === 'End' ||
						e.key === 'Backspace' ||
						e.key === 'Delete' ||
						(ctrlOrCmd && ['c', 'v', 'x', 'a', 'z', 'y'].includes(e.key.toLowerCase())) || // Standard editing shortcuts
						e.key === 'Enter' ||
						e.key === 'Escape' ||
						e.key.length === 1 // Regular character input

					if (isTextEditingKey) {
						// Let these through to the input naturally
						return
					}

					// Block Tab/Shift+Tab during rename (for now - we'll implement this next)
					if (e.key === 'Tab') {
						e.preventDefault()
						e.stopPropagation()
						const fileOps = (window as any).__sidebarFileOps
						if (e.shiftKey) {
							fileOps?.renamePrevious?.()
						} else {
							fileOps?.renameNext?.()
						}
						return
					}

					// Block F2 and other navigation shortcuts during rename
					if (e.key === 'F2') {
						e.preventDefault()
						e.stopPropagation()
						return
					}

					// Block everything else
					e.preventDefault()
					e.stopPropagation()
					return
				}

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

				// Arrow key navigation (disabled during rename)
				if (
					e.key === 'ArrowUp' &&
					fileOps?.navigateUp &&
					!(document.activeElement instanceof HTMLInputElement)
				) {
					e.preventDefault()
					e.stopPropagation()
					fileOps.navigateUp()
					return
				}

				if (
					e.key === 'ArrowDown' &&
					fileOps?.navigateDown &&
					!(document.activeElement instanceof HTMLInputElement)
				) {
					e.preventDefault()
					e.stopPropagation()
					fileOps.navigateDown()
					return
				}

				if (
					e.key === 'ArrowRight' &&
					fileOps?.expandSelected &&
					!(document.activeElement instanceof HTMLInputElement)
				) {
					e.preventDefault()
					e.stopPropagation()
					fileOps.expandSelected()
					return
				}

				if (
					e.key === 'ArrowLeft' &&
					fileOps?.collapseSelected &&
					!(document.activeElement instanceof HTMLInputElement)
				) {
					e.preventDefault()
					e.stopPropagation()
					fileOps.collapseSelected()
					return
				}

				// Enter: Open selected file (disabled during rename)
				if (
					e.key === 'Enter' &&
					fileOps?.openSelected &&
					!(document.activeElement instanceof HTMLInputElement)
				) {
					e.preventDefault()
					e.stopPropagation()
					fileOps.openSelected()
					return
				}

				// Block ALL other keys from reaching tldraw when sidebar is focused
				// This prevents accidental tool selection, drawing, etc.
				// Exceptions: modifier keys alone (Ctrl, Shift, Alt) and when an input is focused
				if (
					!['Control', 'Shift', 'Alt', 'Meta'].includes(e.key) &&
					!(document.activeElement instanceof HTMLInputElement)
				) {
					e.stopPropagation()
				}
			}
		}

		// Use capture phase to intercept before tldraw gets the event
		window.addEventListener('keydown', handleKeyDown, true)
		return () => window.removeEventListener('keydown', handleKeyDown, true)
	}, [onToggleSidebar, onToggleFocus, sidebarActive, isRenamingMode])
}
