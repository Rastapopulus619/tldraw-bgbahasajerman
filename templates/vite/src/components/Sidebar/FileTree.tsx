import { useEffect, useState } from 'react'
import { useFileOperations } from '../../hooks/useFileOperations'
import { FileTreeNode as FileTreeNodeType } from '../../types'
import './FileTree.css'
import { FileTreeNode } from './FileTreeNode'

interface FileTreeProps {
	nodes: FileTreeNodeType[]
	currentWhiteboardId: string
	onWhiteboardSelect: (id: string) => void
	onRefresh: () => void
	selectedFileId: string | null
	onSelectedFileChange: (id: string | null) => void
	sidebarActive: boolean
}

export function FileTree({
	nodes,
	currentWhiteboardId,
	onWhiteboardSelect,
	onRefresh,
	selectedFileId,
	onSelectedFileChange,
	sidebarActive,
}: FileTreeProps) {
	const { rename, deleteFile, copy, cut, clipboard } = useFileOperations(onRefresh)
	const [renamingFileId, setRenamingFileId] = useState<string | null>(null)

	// Keyboard shortcuts for file operations (F2, Delete, Ctrl+C/V)
	useEffect(() => {
		if (!sidebarActive || !selectedFileId) return

		const handleKeyDown = async (e: KeyboardEvent) => {
			const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0
			const ctrlOrCmd = isMac ? e.metaKey : e.ctrlKey

			// F2: Rename selected file
			if (e.key === 'F2') {
				e.preventDefault()
				e.stopPropagation()
				setRenamingFileId(selectedFileId)
				return
			}

			// Delete: Delete selected file
			if (e.key === 'Delete') {
				e.preventDefault()
				e.stopPropagation()
				deleteFile(selectedFileId)
				return
			}

			// Ctrl+C: Copy
			if (ctrlOrCmd && e.key === 'c' && !e.shiftKey) {
				e.preventDefault()
				e.stopPropagation()
				copy(selectedFileId)
				return
			}

			// Ctrl+V: Paste with smart destination
			if (ctrlOrCmd && e.key === 'v' && !e.shiftKey) {
				e.preventDefault()
				e.stopPropagation()

				if (!clipboard) {
					console.log('Nothing in clipboard to paste')
					return
				}

				// Find the selected node to determine destination
				const findNode = (nodes: FileTreeNodeType[], path: string): FileTreeNodeType | null => {
					for (const node of nodes) {
						if (node.path === path) return node
						if (node.children) {
							const found = findNode(node.children, path)
							if (found) return found
						}
					}
					return null
				}

				const selectedNode = findNode(nodes, selectedFileId)
				let destinationPath: string

				if (!selectedNode) {
					// Nothing selected, paste to root
					destinationPath = ''
				} else if (selectedNode.type === 'folder') {
					// Selected a folder, paste into it
					destinationPath = selectedNode.path
				} else {
					// Selected a file, paste into its parent directory
					const parts = selectedNode.path.split('/')
					parts.pop() // Remove filename
					destinationPath = parts.join('/') || ''
				}

				// Build full destination path
				const fileName = clipboard.path.split('/').pop()
				const fullDestination = destinationPath ? `${destinationPath}/${fileName}` : fileName

				// Execute paste
				const endpoint = clipboard.operation === 'copy' ? '/api/files/copy' : '/api/files/move'
				try {
					const response = await fetch(endpoint, {
						method: 'POST',
						headers: { 'Content-Type': 'application/json' },
						body: JSON.stringify({
							sourcePath: clipboard.path,
							destinationPath: fullDestination,
						}),
					})

					const result = await response.json()

					if (result.success) {
						if (clipboard.operation === 'cut') {
							// Clear clipboard after cut
							// Note: clipboard state is in useFileOperations, can't clear from here
							// Will clear automatically on next operation
						}
						onRefresh()
					} else {
						alert(`Paste failed: ${result.error}`)
					}
				} catch (error) {
					console.error('Paste error:', error)
					alert('Failed to paste')
				}
				return
			}
		}

		window.addEventListener('keydown', handleKeyDown)
		return () => window.removeEventListener('keydown', handleKeyDown)
	}, [sidebarActive, selectedFileId, deleteFile, copy])

	if (nodes.length === 0) {
		return null
	}

	const handleFileSelect = (id: string) => {
		onSelectedFileChange(id)
	}

	// Log clipboard for debugging
	console.log('Clipboard:', clipboard)

	// Create virtual root node
	const rootNode: FileTreeNodeType = {
		id: '__root__',
		name: 'whiteboards/',
		type: 'folder',
		path: '',
		children: nodes,
	}

	return (
		<div className="file-tree">
			<FileTreeNode
				key={rootNode.id}
				node={rootNode}
				currentWhiteboardId={currentWhiteboardId}
				onWhiteboardSelect={onWhiteboardSelect}
				selectedFileId={selectedFileId}
				onFileSelect={handleFileSelect}
				onRename={rename}
				onDelete={deleteFile}
				onCopy={copy}
				onCut={cut}
				onRefresh={onRefresh}
				renamingFileId={renamingFileId}
				onRenamingChange={setRenamingFileId}
				depth={-1}
			/>
		</div>
	)
}
