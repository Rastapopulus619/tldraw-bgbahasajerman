import { useState } from 'react'
import { Tldraw } from 'tldraw'
import './AppContainer.css'
import { Sidebar } from './Sidebar/Sidebar'

/**
 * AppContainer - Main wrapper component
 *
 * Manages:
 * - Current whiteboard ID
 * - Sidebar collapsed state
 * - Sidebar active/focus state
 * - Current view
 *
 * Sidebar and Tldraw are sibling components that persist independently.
 */
export function AppContainer() {
	const [currentWhiteboardId, setCurrentWhiteboardId] = useState<string>('welcome.tldr')
	const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false)
	const [sidebarActive, setSidebarActive] = useState<boolean>(true)
	const [currentView] = useState<string>('default-view')

	// Log current view for Phase 5
	console.log('Current view:', currentView)

	const handleWhiteboardSelect = (id: string) => {
		console.log('Switching to whiteboard:', id)
		setCurrentWhiteboardId(id)
		// TODO Phase 3: Load whiteboard data and create new store
	}

	const handleToggleSidebar = () => {
		setSidebarCollapsed(!sidebarCollapsed)
	}

	const handleSidebarClick = () => {
		if (!sidebarActive) {
			setSidebarActive(true)
		}
	}

	const handleCanvasClick = () => {
		if (sidebarActive) {
			setSidebarActive(false)
		}
	}

	return (
		<div className="app-container">
			<div className="app-container__sidebar" onClick={handleSidebarClick}>
				<Sidebar
					isCollapsed={sidebarCollapsed}
					isActive={sidebarActive}
					onToggleCollapse={handleToggleSidebar}
					currentWhiteboardId={currentWhiteboardId}
					onWhiteboardSelect={handleWhiteboardSelect}
				/>
			</div>
			<div className="app-container__canvas" onClick={handleCanvasClick}>
				<Tldraw />
			</div>
		</div>
	)
}
