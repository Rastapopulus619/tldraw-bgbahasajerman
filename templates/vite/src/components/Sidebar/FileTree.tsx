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
}

export function FileTree({
	nodes,
	currentWhiteboardId,
	onWhiteboardSelect,
	onRefresh,
	selectedFileId,
	onSelectedFileChange,
}: FileTreeProps) {
	const { rename, deleteFile, copy, clipboard } = useFileOperations(onRefresh)
	const [renamingFileId, setRenamingFileId] = useState<string | null>(null)

	// Helper: Flatten tree to list for navigation
	const flattenTree = (nodesList: FileTreeNodeType[]): string[] => {
		const result: string[] = []
		const traverse = (nodes: FileTreeNodeType[]) => {
			for (const node of nodes) {
				result.push(node.path)
				if (node.children && node.children.length > 0) {
					traverse(node.children)
				}
			}
		}
		// Add root first
		result.push('')
		traverse(nodesList)
		return result
	}

	// Expose operations via window for keyboard shortcuts
	useEffect(() => {
		;(window as any).__sidebarFileOps = {
			startRename: () => {
				if (selectedFileId) setRenamingFileId(selectedFileId)
			},
			deleteSelected: () => {
				if (selectedFileId) deleteFile(selectedFileId)
			},
			copySelected: () => {
				if (selectedFileId) copy(selectedFileId)
			},
			navigateUp: () => {
				const flatList = flattenTree(nodes)
				const currentIndex = flatList.indexOf(selectedFileId || '')
				if (currentIndex > 0) {
					onSelectedFileChange(flatList[currentIndex - 1])
				}
			},
			navigateDown: () => {
				const flatList = flattenTree(nodes)
				const currentIndex = flatList.indexOf(selectedFileId || '')
				if (currentIndex < flatList.length - 1) {
					onSelectedFileChange(flatList[currentIndex + 1])
				}
			},
			expandSelected: () => {
				// Trigger expand via FileTreeNode - needs implementation
				console.log('Expand:', selectedFileId)
			},
			collapseSelected: () => {
				// Trigger collapse via FileTreeNode - needs implementation
				console.log('Collapse:', selectedFileId)
			},
			openSelected: () => {
				if (selectedFileId && selectedFileId.endsWith('.tldr')) {
					onWhiteboardSelect(selectedFileId)
				}
			},
			pasteToSelected: async () => {
				if (!clipboard || !selectedFileId) return

				// Smart destination logic
				const findNode = (nodesList: FileTreeNodeType[], path: string): FileTreeNodeType | null => {
					for (const node of nodesList) {
						if (node.path === path) return node
						if (node.children) {
							const found = findNode(node.children, path)
							if (found) return found
						}
					}
					return null
				}

				const selectedNode = findNode(nodes, selectedFileId)
				let destinationPath = ''

				if (selectedNode) {
					if (selectedNode.type === 'folder' || selectedNode.id === '__root__') {
						destinationPath = selectedNode.path
					} else {
						const parts = selectedNode.path.split('/')
						parts.pop()
						destinationPath = parts.join('/') || ''
					}
				}

				const fileName = clipboard.path.split('/').pop()
				const fullDestination = destinationPath ? `${destinationPath}/${fileName}` : fileName

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
						onRefresh()
					} else {
						alert(`Paste failed: ${result.error}`)
					}
				} catch (error) {
					console.error('Paste error:', error)
					alert('Failed to paste')
				}
			},
		}

		return () => {
			delete (window as any).__sidebarFileOps
		}
	}, [selectedFileId, deleteFile, copy, clipboard, nodes, onRefresh])

	const handleFileSelect = (id: string) => {
		onSelectedFileChange(id)
	}

	// Create virtual root node
	const rootNode: FileTreeNodeType = {
		id: '__root__',
		name: 'whiteboards/',
		type: 'folder',
		path: '',
		children: nodes,
	}

	// Log clipboard for debugging
	console.log('Clipboard:', clipboard)

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
				onCut={() => {}}
				onRefresh={onRefresh}
				renamingFileId={renamingFileId}
				onRenamingChange={setRenamingFileId}
				clipboard={clipboard}
				depth={-1}
			/>
		</div>
	)
}
