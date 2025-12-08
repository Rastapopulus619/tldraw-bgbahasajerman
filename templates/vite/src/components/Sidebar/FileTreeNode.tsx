import { useEffect, useRef, useState } from 'react'
import { FileTreeNode as FileTreeNodeType } from '../../types'
import { ContextMenu, ContextMenuItem } from './ContextMenu'
import './FileTreeNode.css'

interface FileTreeNodeProps {
	node: FileTreeNodeType
	currentWhiteboardId: string
	onWhiteboardSelect: (id: string) => void
	selectedFileId: string | null
	onFileSelect: (id: string) => void
	onRename: (oldPath: string, newName: string) => Promise<void>
	onDelete: (path: string) => Promise<void>
	onCopy: (path: string) => void
	onCut: (path: string) => void
	onRefresh: () => void
	renamingFileId: string | null
	onRenamingChange: (id: string | null) => void
	depth: number
}

export function FileTreeNode({
	node,
	currentWhiteboardId,
	onWhiteboardSelect,
	selectedFileId,
	onFileSelect,
	onRename,
	onDelete,
	onCopy,
	onCut,
	onRefresh,
	renamingFileId,
	onRenamingChange,
	depth,
}: FileTreeNodeProps) {
	const [isExpanded, setIsExpanded] = useState(true)
	const [newName, setNewName] = useState(node.name)
	const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null)
	const [isDragOver, setIsDragOver] = useState(false)
	const inputRef = useRef<HTMLInputElement>(null)

	const isFolder = node.type === 'folder'
	const isActive = node.path === currentWhiteboardId
	const isSelected = node.path === selectedFileId
	const hasChildren = isFolder && node.children && node.children.length > 0
	const isWelcomeBoard = node.name === 'welcome.tldr' && !isFolder
	const isRootNode = node.id === '__root__'
	const isRenaming = renamingFileId === node.path

	// Focus input when renaming starts
	useEffect(() => {
		if (isRenaming && inputRef.current) {
			inputRef.current.focus()
			// Select filename without extension
			const nameWithoutExt = node.name.replace(/\.tldr$/, '')
			inputRef.current.setSelectionRange(0, nameWithoutExt.length)
		}
	}, [isRenaming, node.name])

	const handleClick = () => {
		// Always select (both files and folders)
		onFileSelect(node.path)

		// Also toggle folder if it's a folder
		if (isFolder) {
			setIsExpanded(!isExpanded)
		}
	}

	const handleDoubleClick = () => {
		if (!isFolder) {
			onWhiteboardSelect(node.path)
		}
	}

	const handleContextMenu = (e: React.MouseEvent) => {
		e.preventDefault()
		e.stopPropagation()
		setContextMenu({ x: e.clientX, y: e.clientY })
		onFileSelect(node.path)
	}

	// Drag and drop handlers
	const handleDragStart = (e: React.DragEvent) => {
		if (isWelcomeBoard || isRootNode) {
			e.preventDefault()
			return
		}
		e.dataTransfer.effectAllowed = 'copyMove'
		e.dataTransfer.setData('text/plain', node.path)
		console.log('Drag started:', node.path)
	}

	const handleDragOver = (e: React.DragEvent) => {
		if (!isFolder) return
		e.preventDefault()
		e.stopPropagation()
		setIsDragOver(true)
		e.dataTransfer.dropEffect = e.ctrlKey ? 'copy' : 'move'
	}

	const handleDragLeave = (e: React.DragEvent) => {
		e.stopPropagation()
		setIsDragOver(false)
	}

	const handleDrop = async (e: React.DragEvent) => {
		e.preventDefault()
		e.stopPropagation()
		setIsDragOver(false)

		if (!isFolder) return

		const sourcePath = e.dataTransfer.getData('text/plain')
		if (!sourcePath) return

		// Build destination path
		const fileName = sourcePath.split('/').pop()
		const destinationPath = `${node.path}/${fileName}`

		// Prevent dropping into itself
		if (sourcePath === node.path || destinationPath.startsWith(sourcePath + '/')) {
			alert('Cannot move folder into itself')
			return
		}

		try {
			const endpoint = e.ctrlKey ? '/api/files/copy' : '/api/files/move'
			const response = await fetch(endpoint, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ sourcePath, destinationPath }),
			})

			const result = await response.json()

			if (!result.success) {
				alert(`${e.ctrlKey ? 'Copy' : 'Move'} failed: ${result.error}`)
				return
			}

			onFileSelect(result.data.newPath)
			// Trigger refresh
			onRefresh()
		} catch (error) {
			console.error('Drop error:', error)
			alert('Failed to complete operation')
		}
	}

	const handleRenameClick = () => {
		onRenamingChange(node.path)
		setNewName(node.name)
	}

	const handleRenameSubmit = async () => {
		if (newName && newName !== node.name) {
			try {
				await onRename(node.path, newName)
			} catch (error) {
				console.error('Rename failed:', error)
			}
		}
		onRenamingChange(null)
	}

	const handleRenameCancel = () => {
		onRenamingChange(null)
		setNewName(node.name)
	}

	const handleRenameKeyDown = (e: React.KeyboardEvent) => {
		e.stopPropagation() // Prevent global keyboard handler from interfering
		if (e.key === 'Enter') {
			e.preventDefault()
			handleRenameSubmit()
		} else if (e.key === 'Escape') {
			e.preventDefault()
			handleRenameCancel()
		}
	}

	const getContextMenuItems = (): ContextMenuItem[] => {
		const items: ContextMenuItem[] = []

		// Rename (disabled for root and welcome.tldr)
		items.push({
			label: 'Rename',
			action: handleRenameClick,
			disabled: isWelcomeBoard || isRootNode,
		})

		// Delete (disabled for root and welcome.tldr)
		items.push({
			label: 'Delete',
			action: () => onDelete(node.path),
			dangerous: true,
			disabled: isWelcomeBoard || isRootNode,
		})

		items.push({ label: '', action: () => {}, separator: true })

		// Copy (disabled for root, allowed for welcome.tldr)
		items.push({
			label: 'Copy',
			action: () => onCopy(node.path),
			disabled: isRootNode,
		})

		// Cut removed per user request - using drag-drop for move operations

		return items
	}

	return (
		<div className="file-tree-node">
			<div
				className={`file-tree-node__item ${isActive ? 'file-tree-node__item--active' : ''} ${
					isSelected && !isActive ? 'file-tree-node__item--selected' : ''
				} ${isFolder ? 'file-tree-node__item--folder' : 'file-tree-node__item--file'} ${
					isDragOver ? 'file-tree-node__item--drag-over' : ''
				} ${isRootNode ? 'file-tree-node__item--root' : ''}`}
				style={{ paddingLeft: `${depth * 16 + 8}px` }}
				draggable={!isWelcomeBoard && !isRootNode}
				onClick={handleClick}
				onDoubleClick={handleDoubleClick}
				onContextMenu={handleContextMenu}
				onDragStart={handleDragStart}
				onDragOver={handleDragOver}
				onDragLeave={handleDragLeave}
				onDrop={handleDrop}
				title={node.name}
			>
				{isFolder && (
					<span className={`file-tree-node__icon ${isExpanded ? 'expanded' : ''}`}>▶</span>
				)}
				{!isFolder && <span className="file-tree-node__icon">📄</span>}

				{isRenaming ? (
					<input
						ref={inputRef}
						type="text"
						className="file-tree-node__input"
						value={newName}
						onChange={(e) => setNewName(e.target.value)}
						onBlur={handleRenameSubmit}
						onKeyDown={handleRenameKeyDown}
					/>
				) : (
					<span className="file-tree-node__name">{node.name}</span>
				)}
			</div>

			{contextMenu && (
				<ContextMenu
					x={contextMenu.x}
					y={contextMenu.y}
					items={getContextMenuItems()}
					onClose={() => setContextMenu(null)}
				/>
			)}

			{isFolder && isExpanded && hasChildren && (
				<div className="file-tree-node__children">
					{node.children!.map((child) => (
						<FileTreeNode
							key={child.id}
							node={child}
							currentWhiteboardId={currentWhiteboardId}
							onWhiteboardSelect={onWhiteboardSelect}
							selectedFileId={selectedFileId}
							onFileSelect={onFileSelect}
							onRename={onRename}
							onDelete={onDelete}
							onCopy={onCopy}
							onCut={onCut}
							onRefresh={onRefresh}
							renamingFileId={renamingFileId}
							onRenamingChange={onRenamingChange}
							depth={depth + 1}
						/>
					))}
				</div>
			)}
		</div>
	)
}
