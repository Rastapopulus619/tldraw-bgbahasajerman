import { useState } from 'react'
import { FileTreeNode as FileTreeNodeType } from '../../types'
import './FileTree.css'
import { FileTreeNode } from './FileTreeNode'

interface FileTreeProps {
	nodes: FileTreeNodeType[]
	currentWhiteboardId: string
	onWhiteboardSelect: (id: string) => void
}

export function FileTree({ nodes, currentWhiteboardId, onWhiteboardSelect }: FileTreeProps) {
	const [selectedFileId, setSelectedFileId] = useState<string | null>(null)

	if (nodes.length === 0) {
		return null
	}

	const handleFileSelect = (id: string) => {
		setSelectedFileId(id)
	}

	return (
		<div className="file-tree">
			{nodes.map((node) => (
				<FileTreeNode
					key={node.id}
					node={node}
					currentWhiteboardId={currentWhiteboardId}
					onWhiteboardSelect={onWhiteboardSelect}
					selectedFileId={selectedFileId}
					onFileSelect={handleFileSelect}
					depth={0}
				/>
			))}
		</div>
	)
}
