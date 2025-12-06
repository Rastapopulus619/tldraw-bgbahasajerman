import { useState } from 'react'
import { Tldraw } from 'tldraw'

/**
 * AppContainer - Main wrapper component
 *
 * This component will manage:
 * - Current whiteboard ID
 * - Sidebar collapsed state
 * - Sidebar active/focus state
 * - Current view
 *
 * In Phase 1, we're just creating the structure.
 * The sidebar will be added in Phase 2.
 */
export function AppContainer() {
	// State management (will be used in later phases)
	const [currentWhiteboardId] = useState<string>('welcome.tldr')
	const [sidebarCollapsed] = useState<boolean>(false)
	const [sidebarActive] = useState<boolean>(false)
	const [currentView] = useState<string>('default-view')

	// Log state for debugging (temporary)
	console.log('AppContainer state:', {
		currentWhiteboardId,
		sidebarCollapsed,
		sidebarActive,
		currentView,
	})

	// For Phase 1, just render tldraw directly
	// In Phase 2, we'll add the sidebar as a sibling
	return (
		<div style={{ position: 'fixed', inset: 0 }}>
			<Tldraw />
		</div>
	)
}
