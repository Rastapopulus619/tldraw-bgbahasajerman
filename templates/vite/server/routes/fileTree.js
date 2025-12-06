import express from 'express'
import { WHITEBOARDS_DIR, buildFileTree } from '../utils/fileSystem.js'

const router = express.Router()

/**
 * GET /api/file-tree
 * Get directory structure (optionally filtered by view)
 * Query params: ?view=ViewName (optional)
 */
router.get('/', async (_req, res) => {
	try {
		// TODO: Implement view filtering in Phase 5
		// For now, just return full tree
		const tree = await buildFileTree(WHITEBOARDS_DIR)
		res.json({ success: true, data: { tree } })
	} catch (error) {
		console.error('Error building file tree:', error)
		res.status(500).json({ success: false, error: 'Failed to build file tree' })
	}
})

export default router
