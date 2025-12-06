import express from 'express'
import path from 'path'
import { WHITEBOARDS_DIR, fileExists, isPathSafe, readJsonFile } from '../utils/fileSystem.js'
import { isValidWhiteboardId } from '../utils/validation.js'

const router = express.Router()

/**
 * Helper to extract path from URL
 */
function extractWhiteboardPath(req) {
	// Get the part of the URL after /api/whiteboards/
	const fullPath = req.path
	return fullPath.startsWith('/') ? fullPath.slice(1) : fullPath
}

/**
 * GET /api/whiteboards (with path as query or in URL)
 * Load whiteboard data
 */
router.get('*', async (req, res) => {
	try {
		const whiteboardId = extractWhiteboardPath(req)

		if (!whiteboardId) {
			return res.status(400).json({ success: false, error: 'Missing whiteboard ID' })
		}

		if (!isValidWhiteboardId(whiteboardId)) {
			return res.status(400).json({ success: false, error: 'Invalid whiteboard ID' })
		}

		if (!isPathSafe(whiteboardId)) {
			return res.status(400).json({ success: false, error: 'Invalid path' })
		}

		const filePath = path.join(WHITEBOARDS_DIR, whiteboardId)

		if (!(await fileExists(filePath))) {
			return res.status(404).json({ success: false, error: 'Whiteboard not found' })
		}

		const boardData = await readJsonFile(filePath)
		res.json({ success: true, data: boardData })
	} catch (error) {
		console.error('Error loading whiteboard:', error)
		res.status(500).json({ success: false, error: 'Failed to load whiteboard' })
	}
})

export default router
