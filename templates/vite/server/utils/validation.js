/**
 * Validate whiteboard ID
 * @param {string} id - Whiteboard ID (file path)
 * @returns {boolean}
 */
export function isValidWhiteboardId(id) {
	if (!id || typeof id !== 'string') return false
	// Must end with .tldr
	if (!id.endsWith('.tldr')) return false
	// Must not contain dangerous characters
	return !id.includes('..') && !id.includes('\\')
}

/**
 * Validate filename
 * @param {string} name - Filename
 * @returns {boolean}
 */
export function isValidFilename(name) {
	if (!name || typeof name !== 'string') return false
	// Must not contain path separators or dangerous characters
	const invalid = /[<>:"/\\|?*\x00-\x1F]/g
	return !invalid.test(name) && name !== '.' && name !== '..'
}

/**
 * Validate view name
 * @param {string} name - View name
 * @returns {boolean}
 */
export function isValidViewName(name) {
	if (!name || typeof name !== 'string') return false
	// Must be a valid filename (views are stored as files)
	return isValidFilename(name) && !name.includes('/')
}

/**
 * Validate board file structure
 * @param {Object} boardFile - Board file object
 * @returns {boolean}
 */
export function isValidBoardFile(boardFile) {
	if (!boardFile || typeof boardFile !== 'object') return false

	// Must have tldrawSnapshot
	if (!boardFile.tldrawSnapshot || typeof boardFile.tldrawSnapshot !== 'object') {
		return false
	}

	// Must have metadata
	if (!boardFile.metadata || typeof boardFile.metadata !== 'object') {
		return false
	}

	// Metadata must have required fields
	const { colorPalette, createdAt, lastModified } = boardFile.metadata
	if (!colorPalette || !createdAt || !lastModified) {
		return false
	}

	return true
}

/**
 * Validate view config structure
 * @param {Object} viewConfig - View config object
 * @returns {boolean}
 */
export function isValidViewConfig(viewConfig) {
	if (!viewConfig || typeof viewConfig !== 'object') return false

	const { name, includedPaths, createdAt, lastModified } = viewConfig

	if (!name || typeof name !== 'string') return false
	if (!Array.isArray(includedPaths) || includedPaths.length === 0) return false
	if (!createdAt || !lastModified) return false

	return true
}
