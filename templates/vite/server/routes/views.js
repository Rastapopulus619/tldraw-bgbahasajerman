import express from 'express'
import fs from 'fs/promises'
import path from 'path'
import { VIEWS_DIR, fileExists, readJsonFile, writeJsonFile } from '../utils/fileSystem.js'
import { isValidViewConfig, isValidViewName } from '../utils/validation.js'

const router = express.Router()

/**
 * GET /api/views
 * List all available views
 */
router.get('/', async (_req, res) => {
	try {
		const files = await fs.readdir(VIEWS_DIR)
		const views = []

		for (const file of files) {
			if (file.endsWith('.json')) {
				const viewName = file.replace('.json', '')
				views.push({
					name: viewName,
					isDefault: viewName === 'default-view',
				})
			}
		}

		res.json({ success: true, data: { views } })
	} catch (error) {
		console.error('Error listing views:', error)
		res.status(500).json({ success: false, error: 'Failed to list views' })
	}
})

/**
 * GET /api/views/:name
 * Load specific view configuration
 */
router.get('/:name', async (req, res) => {
	try {
		const viewName = req.params.name

		if (!isValidViewName(viewName)) {
			return res.status(400).json({ success: false, error: 'Invalid view name' })
		}

		const filePath = path.join(VIEWS_DIR, `${viewName}.json`)

		if (!(await fileExists(filePath))) {
			return res.status(404).json({ success: false, error: 'View not found' })
		}

		const viewConfig = await readJsonFile(filePath)
		res.json({ success: true, data: viewConfig })
	} catch (error) {
		console.error('Error loading view:', error)
		res.status(500).json({ success: false, error: 'Failed to load view' })
	}
})

/**
 * POST /api/views/:name
 * Save/update view configuration
 */
router.post('/:name', async (req, res) => {
	try {
		const viewName = req.params.name
		const viewConfig = req.body

		if (!isValidViewName(viewName)) {
			return res.status(400).json({ success: false, error: 'Invalid view name' })
		}

		if (!isValidViewConfig(viewConfig)) {
			return res.status(400).json({ success: false, error: 'Invalid view configuration' })
		}

		// Update timestamps
		viewConfig.lastModified = new Date().toISOString()
		if (!viewConfig.createdAt) {
			viewConfig.createdAt = new Date().toISOString()
		}

		const filePath = path.join(VIEWS_DIR, `${viewName}.json`)
		await writeJsonFile(filePath, viewConfig)
		res.json({ success: true })
	} catch (error) {
		console.error('Error saving view:', error)
		res.status(500).json({ success: false, error: 'Failed to save view' })
	}
})

/**
 * DELETE /api/views/:name
 * Delete view configuration
 */
router.delete('/:name', async (req, res) => {
	try {
		const viewName = req.params.name

		// Prevent deleting default view
		if (viewName === 'default-view') {
			return res.status(400).json({ success: false, error: 'Cannot delete default view' })
		}

		if (!isValidViewName(viewName)) {
			return res.status(400).json({ success: false, error: 'Invalid view name' })
		}

		const filePath = path.join(VIEWS_DIR, `${viewName}.json`)

		if (!(await fileExists(filePath))) {
			return res.status(404).json({ success: false, error: 'View not found' })
		}

		await fs.unlink(filePath)
		res.json({ success: true })
	} catch (error) {
		console.error('Error deleting view:', error)
		res.status(500).json({ success: false, error: 'Failed to delete view' })
	}
})

export default router
