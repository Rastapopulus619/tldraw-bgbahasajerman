import { useCallback, useEffect, useState } from 'react'
import { FileTreeNode } from '../../types'
import { FileTree } from './FileTree'
import './Sidebar.css'

interface SidebarProps {
	isCollapsed: boolean
	isActive: boolean
	onToggleCollapse: () => void
	currentWhiteboardId: string
	onWhiteboardSelect: (id: string) => void
	selectedFileId: string | null
	onSelectedFileChange: (id: string | null) => void
}

export function Sidebar({
	isCollapsed,
	isActive,
	onToggleCollapse,
	currentWhiteboardId,
	onWhiteboardSelect,
	selectedFileId,
	onSelectedFileChange,
}: SidebarProps) {
	const [fileTree, setFileTree] = useState<FileTreeNode[]>([])
	const [isLoading, setIsLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)

	// Fetch file tree
	const fetchFileTree = useCallback(async () => {
		try {
			setIsLoading(true)
			const response = await fetch('/api/file-tree')
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
	}, [])

	// Fetch on mount
	useEffect(() => {
		fetchFileTree()
	}, [fetchFileTree])

	if (isCollapsed) {
		return (
			<div className="sidebar sidebar--collapsed">
				<button className="sidebar__toggle" onClick={onToggleCollapse} title="Expand sidebar">
					▶
				</button>
			</div>
		)
	}

	const handleCreateFile = async () => {
		try {
			const response = await fetch('/api/whiteboards/create', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ name: null }), // Auto-generate name
			})

			const result = await response.json()

			if (result.success) {
				await fetchFileTree()
				onWhiteboardSelect(result.data.id)
			} else {
				alert(`Failed to create file: ${result.error}`)
			}
		} catch (error) {
			console.error('Create file error:', error)
			alert('Failed to create file')
		}
	}

	const handleCreateFolder = async () => {
		const folderName = prompt('Enter folder name:')
		if (!folderName) return

		try {
			const response = await fetch('/api/folders', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ path: folderName }),
			})

			const result = await response.json()

			if (result.success) {
				await fetchFileTree()
			} else {
				alert(`Failed to create folder: ${result.error}`)
			}
		} catch (error) {
			console.error('Create folder error:', error)
			alert('Failed to create folder')
		}
	}

	return (
		<div className={`sidebar ${isActive ? 'sidebar--active' : ''}`}>
			<div className="sidebar__header">
				<h2 className="sidebar__title">Files</h2>
				<div className="sidebar__actions">
					<button className="sidebar__action-btn" onClick={handleCreateFile} title="New file">
						📄+
					</button>
					<button className="sidebar__action-btn" onClick={handleCreateFolder} title="New folder">
						📁+
					</button>
					<button className="sidebar__toggle" onClick={onToggleCollapse} title="Collapse sidebar">
						◀
					</button>
				</div>
			</div>

			<div className="sidebar__content">
				{isLoading && <div className="sidebar__loading">Loading files...</div>}

				{error && <div className="sidebar__error">{error}</div>}

				{!isLoading && !error && (
					<FileTree
						nodes={fileTree}
						currentWhiteboardId={currentWhiteboardId}
						onWhiteboardSelect={onWhiteboardSelect}
						onRefresh={fetchFileTree}
						selectedFileId={selectedFileId}
						onSelectedFileChange={onSelectedFileChange}
					/>
				)}

				{!isLoading && !error && fileTree.length === 0 && (
					<div className="sidebar__empty">No whiteboards found. Create one to get started!</div>
				)}
			</div>
		</div>
	)
}
