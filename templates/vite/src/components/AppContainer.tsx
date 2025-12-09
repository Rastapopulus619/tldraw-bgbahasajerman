import { useEffect, useState } from 'react'
import { Tldraw } from 'tldraw'
import { useAutoSave } from '../hooks/useAutoSave'
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts'
import { useWhiteboardLoader } from '../hooks/useWhiteboardLoader'
import './AppContainer.css'
import { Sidebar } from './Sidebar/Sidebar'
import { TldrawWrapper } from './TldrawWrapper'

/**
 * AppContainer - Main wrapper component
 *
 * Manages:
 * - Current whiteboard ID
 * - Sidebar collapsed state
 * - Sidebar active/focus state
 * - Current view
 * - Store lifecycle (loading/disposal)
 *
 * Sidebar and Tldraw are sibling components that persist independently.
 */
export function AppContainer() {
	const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false)
	const [sidebarActive, setSidebarActive] = useState<boolean>(true)
	const [currentView] = useState<string>('default-view')
	const [isDarkMode, setIsDarkMode] = useState<boolean>(false)
	const [editorInstance, setEditorInstance] = useState<any>(null)
	const [selectedFileId, setSelectedFileId] = useState<string | null>(null)

	// Use whiteboard loader hook
	const { store, isLoading, error, currentBoardId, loadWhiteboard } = useWhiteboardLoader()

	// Load welcome board on mount
	useEffect(() => {
		loadWhiteboard('welcome.tldr')
	}, [loadWhiteboard])

	// Auto-save hook
	useAutoSave(editorInstance, currentBoardId || 'welcome.tldr')

	// Log current view for Phase 5
	console.log('Current view:', currentView)

	const handleThemeChange = (isDark: boolean) => {
		setIsDarkMode(isDark)
	}

	const handleWhiteboardSelect = (id: string) => {
		console.log('Opening whiteboard:', id)
		loadWhiteboard(id)
	}

	const handleToggleSidebar = () => {
		setSidebarCollapsed(!sidebarCollapsed)
	}

	const handleToggleFocus = () => {
		setSidebarActive(!sidebarActive)
		console.log('Focus toggled:', !sidebarActive ? 'Sidebar' : 'Canvas')
	}

	// Keyboard shortcuts
	useKeyboardShortcuts({
		onToggleSidebar: handleToggleSidebar,
		onToggleFocus: handleToggleFocus,
		sidebarActive,
	})

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

	const handleMount = (editor: any) => {
		setEditorInstance(editor)
		console.log('Editor mounted')
	}

	return (
		<div className={`app-container ${isDarkMode ? 'theme-dark' : 'theme-light'}`}>
			<div className="app-container__sidebar" onClick={handleSidebarClick}>
				<Sidebar
					isCollapsed={sidebarCollapsed}
					isActive={sidebarActive}
					onToggleCollapse={handleToggleSidebar}
					currentWhiteboardId={currentBoardId || 'welcome.tldr'}
					onWhiteboardSelect={handleWhiteboardSelect}
					selectedFileId={selectedFileId}
					onSelectedFileChange={setSelectedFileId}
				/>
			</div>
			<div className="app-container__canvas" onClick={handleCanvasClick}>
				{isLoading && (
					<div className="app-container__loading">
						<div className="spinner"></div>
						<div>Loading whiteboard...</div>
					</div>
				)}
				{error && (
					<div className="app-container__error">
						<div>Error: {error}</div>
						<button onClick={() => loadWhiteboard('welcome.tldr')}>Return to Welcome Board</button>
					</div>
				)}
				{!isLoading && !error && store && (
					<Tldraw store={store} onMount={handleMount}>
						<TldrawWrapper onThemeChange={handleThemeChange} />
					</Tldraw>
				)}
			</div>
		</div>
	)
}
