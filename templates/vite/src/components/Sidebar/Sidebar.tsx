import { useEffect, useState } from 'react'
import { FileTreeNode } from '../../types'
import { FileTree } from './FileTree'
import './Sidebar.css'

interface SidebarProps {
	isCollapsed: boolean
	isActive: boolean
	onToggleCollapse: () => void
	currentWhiteboardId: string
	onWhiteboardSelect: (id: string) => void
}

export function Sidebar({
	isCollapsed,
	isActive,
	onToggleCollapse,
	currentWhiteboardId,
	onWhiteboardSelect,
}: SidebarProps) {
	const [fileTree, setFileTree] = useState<FileTreeNode[]>([])
	const [isLoading, setIsLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)

	// Fetch file tree on mount
	useEffect(() => {
		async function fetchFileTree() {
			try {
				setIsLoading(true)
				const response = await fetch('http://localhost:3001/api/file-tree')
				const data = await response.json()

				if (data.success) {
					setFileTree(data.data.tree)
					setError(null)
				} else {
					setError('Failed to load file tree')
				}
			} catch (err) {
				console.error('Error fetching file tree:', err)
				setError('Failed to connect to server')
			} finally {
				setIsLoading(false)
			}
		}

		fetchFileTree()
	}, [])

	if (isCollapsed) {
		return (
			<div className="sidebar sidebar--collapsed">
				<button className="sidebar__toggle" onClick={onToggleCollapse} title="Expand sidebar">
					▶
				</button>
			</div>
		)
	}

	return (
		<div className={`sidebar ${isActive ? 'sidebar--active' : ''}`}>
			<div className="sidebar__header">
				<h2 className="sidebar__title">Files</h2>
				<button className="sidebar__toggle" onClick={onToggleCollapse} title="Collapse sidebar">
					◀
				</button>
			</div>

			<div className="sidebar__content">
				{isLoading && <div className="sidebar__loading">Loading files...</div>}

				{error && <div className="sidebar__error">{error}</div>}

				{!isLoading && !error && (
					<FileTree
						nodes={fileTree}
						currentWhiteboardId={currentWhiteboardId}
						onWhiteboardSelect={onWhiteboardSelect}
					/>
				)}

				{!isLoading && !error && fileTree.length === 0 && (
					<div className="sidebar__empty">No whiteboards found. Create one to get started!</div>
				)}
			</div>
		</div>
	)
}
