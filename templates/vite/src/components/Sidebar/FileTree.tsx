import { FileTreeNode as FileTreeNodeType } from '../../types'
import './FileTree.css'
import { FileTreeNode } from './FileTreeNode'

interface FileTreeProps {
	nodes: FileTreeNodeType[]
	currentWhiteboardId: string
	onWhiteboardSelect: (id: string) => void
}

export function FileTree({ nodes, currentWhiteboardId, onWhiteboardSelect }: FileTreeProps) {
	if (nodes.length === 0) {
		return null
	}

	return (
		<div className="file-tree">
			{nodes.map((node) => (
				<FileTreeNode
					key={node.id}
					node={node}
					currentWhiteboardId={currentWhiteboardId}
					onWhiteboardSelect={onWhiteboardSelect}
					depth={0}
				/>
			))}
		</div>
	)
}
