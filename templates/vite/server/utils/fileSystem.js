import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Base paths
export const USERDATA_ROOT = path.join(__dirname, '../../../../userdata')
export const WHITEBOARDS_DIR = path.join(USERDATA_ROOT, 'whiteboards')
export const VIEWS_DIR = path.join(USERDATA_ROOT, 'config/views')

/**
 * Read directory recursively and build file tree
 * @param {string} dirPath - Directory path to read
 * @param {string} relativePath - Relative path from whiteboards root
 * @returns {Promise<Array>} File tree nodes
 */
export async function buildFileTree(dirPath, relativePath = '') {
	try {
		const entries = await fs.readdir(dirPath, { withFileTypes: true })
		const nodes = []

		for (const entry of entries) {
			const fullPath = path.join(dirPath, entry.name)
			const relPath = relativePath ? path.join(relativePath, entry.name) : entry.name

			if (entry.isDirectory()) {
				const children = await buildFileTree(fullPath, relPath)
				nodes.push({
					id: relPath,
					name: entry.name,
					type: 'folder',
					path: relPath,
					children,
				})
			} else if (entry.isFile() && entry.name.endsWith('.tldr')) {
				nodes.push({
					id: relPath,
					name: entry.name,
					type: 'file',
					path: relPath,
				})
			}
		}

		// Sort: folders first, then files, alphabetically
		return nodes.sort((a, b) => {
			if (a.type !== b.type) {
				return a.type === 'folder' ? -1 : 1
			}
			return a.name.localeCompare(b.name)
		})
	} catch (error) {
		console.error('Error building file tree:', error)
		return []
	}
}

/**
 * Check if a file exists
 * @param {string} filePath - File path to check
 * @returns {Promise<boolean>}
 */
export async function fileExists(filePath) {
	try {
		await fs.access(filePath)
		return true
	} catch {
		return false
	}
}

/**
 * Read JSON file
 * @param {string} filePath - File path
 * @returns {Promise<Object>}
 */
export async function readJsonFile(filePath) {
	const data = await fs.readFile(filePath, 'utf-8')
	return JSON.parse(data)
}

/**
 * Write JSON file
 * @param {string} filePath - File path
 * @param {Object} data - Data to write
 * @returns {Promise<void>}
 */
export async function writeJsonFile(filePath, data) {
	await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8')
}

/**
 * Generate unique filename with timestamp
 * @param {string} baseName - Base name (e.g., 'untitled')
 * @param {string} extension - File extension (e.g., '.tldr')
 * @returns {string} Unique filename
 */
export function generateUniqueFilename(baseName, extension) {
	const timestamp = Date.now()
	return `${baseName}-${timestamp}${extension}`
}

/**
 * Ensure directory exists (create if not)
 * @param {string} dirPath - Directory path
 * @returns {Promise<void>}
 */
export async function ensureDirectory(dirPath) {
	await fs.mkdir(dirPath, { recursive: true })
}

/**
 * Check if path is within whiteboards directory (security check)
 * @param {string} relativePath - Relative path to check
 * @returns {boolean}
 */
export function isPathSafe(relativePath) {
	// Prevent directory traversal attacks
	const normalized = path.normalize(relativePath)
	return !normalized.startsWith('..') && !path.isAbsolute(normalized)
}
