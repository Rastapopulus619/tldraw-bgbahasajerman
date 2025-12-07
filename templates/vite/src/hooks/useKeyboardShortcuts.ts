import { useEffect } from 'react'

interface KeyboardShortcutsOptions {
	onToggleSidebar: () => void
	onToggleFocus: () => void
	sidebarActive: boolean
}

/**
 * useKeyboardShortcuts hook
 *
 * Manages keyboard shortcuts for the application.
 *
 * Shortcuts:
 * - Ctrl+B (or Cmd+B on Mac): Toggle sidebar collapse/expand
 * - Ctrl+Shift+E (or Cmd+Shift+E on Mac): Toggle focus between sidebar and canvas
 *
 * Note: Avoiding Ctrl+Shift+B as it conflicts with browser bookmarks
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

			// Ctrl+B / Cmd+B: Toggle sidebar
			if (ctrlOrCmd && e.key === 'b' && !e.shiftKey && !e.altKey) {
				e.preventDefault()
				e.stopPropagation()
				onToggleSidebar()
				return
			}

			// Ctrl+Shift+E / Cmd+Shift+E: Toggle focus
			// Using E for "Explorer" (like VS Code)
			if (ctrlOrCmd && e.shiftKey && e.key === 'E') {
				e.preventDefault()
				e.stopPropagation()
				onToggleFocus()
				return
			}

			// When sidebar is active, prevent tldraw from receiving most keyboard events
			if (sidebarActive) {
				// Allow these shortcuts to work in sidebar but not reach tldraw
				const isNavigationKey = [
					'ArrowUp',
					'ArrowDown',
					'ArrowLeft',
					'ArrowRight',
					'Enter',
					'Escape',
				].includes(e.key)
				const isEditingKey = e.key === 'F2' || e.key === 'Delete'
				const isClipboardKey = ctrlOrCmd && ['c', 'x', 'v'].includes(e.key.toLowerCase())

				if (isNavigationKey || isEditingKey || isClipboardKey) {
					// Let sidebar handle these, stop tldraw from getting them
					e.stopPropagation()
				}
			}
		}

		// Use capture phase to intercept before tldraw gets the event
		window.addEventListener('keydown', handleKeyDown, true)
		return () => window.removeEventListener('keydown', handleKeyDown, true)
	}, [onToggleSidebar, onToggleFocus, sidebarActive])
}
