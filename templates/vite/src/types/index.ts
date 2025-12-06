import { TLStoreSnapshot } from 'tldraw'

// Color palette configuration
export interface ColorPaletteConfig {
	[colorKey: string]: {
		light: string // Hex color for light mode
		dark: string // Hex color for dark mode
	}
}

// Board metadata
export interface BoardMetadata {
	colorPalette: ColorPaletteConfig
	createdAt: string // ISO 8601 timestamp
	lastModified: string // ISO 8601 timestamp
	boardName?: string // Optional display name
	readOnly?: boolean // Optional read-only flag
}

// Complete board file format
export interface BoardFile {
	tldrawSnapshot: TLStoreSnapshot
	metadata: BoardMetadata
}

// File tree node
export interface FileTreeNode {
	id: string // Unique identifier (path)
	name: string // Display name (filename)
	type: 'file' | 'folder'
	path: string // Relative path from whiteboards root
	children?: FileTreeNode[] // Only for folders
}

// View configuration
export interface ViewConfig {
	name: string
	includedPaths: string[] // Glob patterns or explicit paths
	excludedPaths?: string[] // Optional exclusions
	createdAt: string
	lastModified: string
}

// API response types
export interface ApiResponse<T = any> {
	success: boolean
	data?: T
	error?: string
}

export interface FileTreeResponse {
	tree: FileTreeNode[]
}

export interface ViewsListResponse {
	views: Array<{
		name: string
		isDefault: boolean
	}>
}

// File operation request types
export interface RenameFileRequest {
	oldPath: string
	newName: string
}

export interface DeleteFileRequest {
	path: string
}

export interface CopyFileRequest {
	sourcePath: string
	destinationPath: string
}

export interface MoveFileRequest {
	sourcePath: string
	destinationPath: string
}

export interface CreateFolderRequest {
	path: string
}

export interface CreateWhiteboardRequest {
	name?: string // Optional, will auto-generate if not provided
	parentPath?: string // Optional, defaults to root
}
