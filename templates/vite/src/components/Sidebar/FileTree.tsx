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
	clipboard: { path: string; operation: 'copy' | 'cut' } | null
	onClipboardChange: (clipboard: { path: string; operation: 'copy' | 'cut' } | null) => void
	expandedPaths: Set<string>
	onToggleExpanded: (path: string) => void
}

export function FileTree({
	nodes,
	currentWhiteboardId,
	onWhiteboardSelect,
	onRefresh,
	selectedFileId,
	onSelectedFileChange,
	clipboard,
	onClipboardChange,
	expandedPaths,
	onToggleExpanded,
}: FileTreeProps) {
	const { rename, deleteFile } = useFileOperations(onRefresh)

	const copy = (path: string) => {
		console.log('Copy function called with:', path)
		onClipboardChange({ path, operation: 'copy' })
		console.log('Clipboard set to:', { path, operation: 'copy' })
	}
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

	// Helper: Find node by path
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
				console.log('expandSelected called for:', selectedFileId)
				console.log('Current expandedPaths before:', Array.from(expandedPaths))
				if (selectedFileId) {
					const node = findNode(nodes, selectedFileId)
					console.log('Node found:', node)
					if (node && node.type === 'folder') {
						console.log('Expanding folder:', selectedFileId)
						if (!expandedPaths.has(selectedFileId)) {
							onToggleExpanded(selectedFileId)
						}
					} else {
						console.log('Not a folder or not found')
					}
				}
			},
			collapseSelected: () => {
				console.log('collapseSelected called for:', selectedFileId)
				console.log('Current expandedPaths before:', Array.from(expandedPaths))
				if (selectedFileId && expandedPaths.has(selectedFileId)) {
					onToggleExpanded(selectedFileId)
				}
			},
			openSelected: () => {
				if (selectedFileId && selectedFileId.endsWith('.tldr')) {
					onWhiteboardSelect(selectedFileId)
				}
			},
			pasteToSelected: async () => {
				if (!clipboard) return

				// Smart destination logic
				let destinationPath = ''

				if (!selectedFileId || selectedFileId === '') {
					// Paste to root
					destinationPath = ''
				} else {
					const selectedNode = findNode(nodes, selectedFileId)
					if (selectedNode) {
						if (selectedNode.type === 'folder') {
							destinationPath = selectedNode.path
						} else {
							const parts = selectedNode.path.split('/')
							parts.pop()
							destinationPath = parts.join('/') || ''
						}
					}
				}

				const fileName = clipboard.path.split('/').pop() || ''
				let fullDestination = destinationPath ? `${destinationPath}/${fileName}` : fileName

				// Check for naming conflicts
				if (clipboard.operation === 'copy') {
					if (findNode(nodes, fullDestination)) {
						console.log('Conflict detected, auto-renaming...')
						const parts = fileName.split('.')
						const name = parts.slice(0, -1).join('.') || fileName
						const ext = parts.length > 1 ? '.' + parts[parts.length - 1] : ''
						let counter = 1
						let newName = fileName
						let newFull = destinationPath ? `${destinationPath}/${newName}` : newName
						while (findNode(nodes, newFull)) {
							newName = `${name} (${counter})${ext}`
							newFull = destinationPath ? `${destinationPath}/${newName}` : newName
							counter++
							console.log('Trying name:', newName, 'path:', newFull)
							if (counter > 100) {
								alert('Too many duplicates, stopping')
								return
							}
						}
						fullDestination = newFull
						console.log('Final destination after conflict resolution:', fullDestination)
					}
				} else if (clipboard.operation === 'cut') {
					if (findNode(nodes, fullDestination)) {
						alert('Destination already exists')
						return
					}
				}

				const endpoint = clipboard.operation === 'copy' ? '/api/files/copy' : '/api/files/move'
				console.log('About to paste:', {
					endpoint,
					sourcePath: clipboard.path,
					destinationPath: fullDestination,
				})
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
					console.log('Paste API result:', result)

					if (result.success) {
						console.log('Paste succeeded, refreshing...')
						onRefresh()
					} else {
						console.error('Paste failed:', result.error)
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
				isNodeExpanded={(path) => expandedPaths.has(path)}
				onToggleNodeExpand={onToggleExpanded}
				isPathExists={(path) => findNode(nodes, path) !== null}
			/>
		</div>
	)
}
