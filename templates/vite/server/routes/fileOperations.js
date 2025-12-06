import express from 'express'
import fs from 'fs/promises'
import path from 'path'
import { WHITEBOARDS_DIR, ensureDirectory, fileExists, isPathSafe } from '../utils/fileSystem.js'
import { isValidFilename } from '../utils/validation.js'

const router = express.Router()

/**
 * POST /api/files/rename
 * Rename file or folder
 */
router.post('/rename', async (req, res) => {
	try {
		const { oldPath, newName } = req.body

		if (!oldPath || !newName) {
			return res.status(400).json({ success: false, error: 'Missing required fields' })
		}

		if (!isPathSafe(oldPath)) {
			return res.status(400).json({ success: false, error: 'Invalid path' })
		}

		if (!isValidFilename(newName)) {
			return res.status(400).json({ success: false, error: 'Invalid filename' })
		}

		const oldFullPath = path.join(WHITEBOARDS_DIR, oldPath)
		const parentDir = path.dirname(oldFullPath)
		const newFullPath = path.join(parentDir, newName)

		// Check if old path exists
		if (!(await fileExists(oldFullPath))) {
			return res.status(404).json({ success: false, error: 'File not found' })
		}

		// Check if new name already exists
		if (await fileExists(newFullPath)) {
			return res.status(409).json({ success: false, error: 'File with that name already exists' })
		}

		await fs.rename(oldFullPath, newFullPath)

		const newRelativePath = path.relative(WHITEBOARDS_DIR, newFullPath)
		res.json({ success: true, data: { newPath: newRelativePath } })
	} catch (error) {
		console.error('Error renaming file:', error)
		res.status(500).json({ success: false, error: 'Failed to rename file' })
	}
})

/**
 * DELETE /api/files
 * Delete file or folder
 */
router.delete('/', async (req, res) => {
	try {
		const { path: filePath } = req.body

		if (!filePath) {
			return res.status(400).json({ success: false, error: 'Missing path' })
		}

		if (!isPathSafe(filePath)) {
			return res.status(400).json({ success: false, error: 'Invalid path' })
		}

		const fullPath = path.join(WHITEBOARDS_DIR, filePath)

		if (!(await fileExists(fullPath))) {
			return res.status(404).json({ success: false, error: 'File not found' })
		}

		const stats = await fs.stat(fullPath)
		if (stats.isDirectory()) {
			await fs.rm(fullPath, { recursive: true, force: true })
		} else {
			await fs.unlink(fullPath)
		}

		res.json({ success: true })
	} catch (error) {
		console.error('Error deleting file:', error)
		res.status(500).json({ success: false, error: 'Failed to delete file' })
	}
})

/**
 * POST /api/files/copy
 * Copy file or folder
 */
router.post('/copy', async (req, res) => {
	try {
		const { sourcePath, destinationPath } = req.body

		if (!sourcePath || !destinationPath) {
			return res.status(400).json({ success: false, error: 'Missing required fields' })
		}

		if (!isPathSafe(sourcePath) || !isPathSafe(destinationPath)) {
			return res.status(400).json({ success: false, error: 'Invalid path' })
		}

		const sourceFullPath = path.join(WHITEBOARDS_DIR, sourcePath)
		const destFullPath = path.join(WHITEBOARDS_DIR, destinationPath)

		if (!(await fileExists(sourceFullPath))) {
			return res.status(404).json({ success: false, error: 'Source file not found' })
		}

		if (await fileExists(destFullPath)) {
			return res.status(409).json({ success: false, error: 'Destination already exists' })
		}

		// Ensure destination directory exists
		const destDir = path.dirname(destFullPath)
		await ensureDirectory(destDir)

		await fs.cp(sourceFullPath, destFullPath, { recursive: true })

		res.json({ success: true, data: { newPath: destinationPath } })
	} catch (error) {
		console.error('Error copying file:', error)
		res.status(500).json({ success: false, error: 'Failed to copy file' })
	}
})

/**
 * POST /api/files/move
 * Move file or folder
 */
router.post('/move', async (req, res) => {
	try {
		const { sourcePath, destinationPath } = req.body

		if (!sourcePath || !destinationPath) {
			return res.status(400).json({ success: false, error: 'Missing required fields' })
		}

		if (!isPathSafe(sourcePath) || !isPathSafe(destinationPath)) {
			return res.status(400).json({ success: false, error: 'Invalid path' })
		}

		const sourceFullPath = path.join(WHITEBOARDS_DIR, sourcePath)
		const destFullPath = path.join(WHITEBOARDS_DIR, destinationPath)

		if (!(await fileExists(sourceFullPath))) {
			return res.status(404).json({ success: false, error: 'Source file not found' })
		}

		if (await fileExists(destFullPath)) {
			return res.status(409).json({ success: false, error: 'Destination already exists' })
		}

		// Ensure destination directory exists
		const destDir = path.dirname(destFullPath)
		await ensureDirectory(destDir)

		await fs.rename(sourceFullPath, destFullPath)

		res.json({ success: true, data: { newPath: destinationPath } })
	} catch (error) {
		console.error('Error moving file:', error)
		res.status(500).json({ success: false, error: 'Failed to move file' })
	}
})

/**
 * POST /api/folders
 * Create new folder
 */
router.post('/', async (req, res) => {
	try {
		const { path: folderPath } = req.body

		if (!folderPath) {
			return res.status(400).json({ success: false, error: 'Missing path' })
		}

		if (!isPathSafe(folderPath)) {
			return res.status(400).json({ success: false, error: 'Invalid path' })
		}

		const fullPath = path.join(WHITEBOARDS_DIR, folderPath)

		if (await fileExists(fullPath)) {
			return res.status(409).json({ success: false, error: 'Folder already exists' })
		}

		await ensureDirectory(fullPath)
		res.json({ success: true, data: { path: folderPath } })
	} catch (error) {
		console.error('Error creating folder:', error)
		res.status(500).json({ success: false, error: 'Failed to create folder' })
	}
})

export default router
