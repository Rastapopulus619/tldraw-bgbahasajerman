import { useState } from 'react'
import { FileTreeNode as FileTreeNodeType } from '../../types'
import './FileTreeNode.css'

interface FileTreeNodeProps {
	node: FileTreeNodeType
	currentWhiteboardId: string
	onWhiteboardSelect: (id: string) => void
	depth: number
}

export function FileTreeNode({
	node,
	currentWhiteboardId,
	onWhiteboardSelect,
	depth,
}: FileTreeNodeProps) {
	const [isExpanded, setIsExpanded] = useState(true)
	const isFolder = node.type === 'folder'
	const isActive = node.path === currentWhiteboardId
	const hasChildren = isFolder && node.children && node.children.length > 0

	const handleClick = () => {
		if (isFolder) {
			setIsExpanded(!isExpanded)
		} else {
			// Single click just selects, double click will open (Phase 3)
			// For now, single click opens
			onWhiteboardSelect(node.path)
		}
	}

	const handleDoubleClick = () => {
		if (!isFolder) {
			onWhiteboardSelect(node.path)
		}
	}

	return (
		<div className="file-tree-node">
			<div
				className={`file-tree-node__item ${isActive ? 'file-tree-node__item--active' : ''} ${
					isFolder ? 'file-tree-node__item--folder' : 'file-tree-node__item--file'
				}`}
				style={{ paddingLeft: `${depth * 16 + 8}px` }}
				onClick={handleClick}
				onDoubleClick={handleDoubleClick}
				title={node.name}
			>
				{isFolder && <span className="file-tree-node__icon">{isExpanded ? '▼' : '▶'}</span>}
				{!isFolder && <span className="file-tree-node__icon">📄</span>}
				<span className="file-tree-node__name">{node.name}</span>
			</div>

			{isFolder && isExpanded && hasChildren && (
				<div className="file-tree-node__children">
					{node.children!.map((child) => (
						<FileTreeNode
							key={child.id}
							node={child}
							currentWhiteboardId={currentWhiteboardId}
							onWhiteboardSelect={onWhiteboardSelect}
							depth={depth + 1}
						/>
					))}
				</div>
			)}
		</div>
	)
}
