import cors from 'cors'
import express from 'express'
import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'
import {
	VIEWS_DIR,
	WHITEBOARDS_DIR,
	buildFileTree,
	ensureDirectory,
	fileExists,
	generateUniqueFilename,
	isPathSafe,
	readJsonFile,
	writeJsonFile,
} from './utils/fileSystem.js'
import {
	isValidBoardFile,
	isValidFilename,
	isValidViewConfig,
	isValidViewName,
	isValidWhiteboardId,
} from './utils/validation.js'

// Import file operations router
import fileOperationsRouter from './routes/fileOperations.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PORT = 3001

// Middleware
app.use(cors())
app.use(express.json({ limit: '50mb' }))

// ===== WHITEBOARD ROUTES =====
// Using query parameter for path to avoid Express 5 wildcard issues

// Create new whiteboard
app.post('/api/whiteboards', async (req, res) => {
	try {
		const { name, parentPath = '' } = req.body
		let filename
		if (name) {
			if (!isValidFilename(name)) {
				return res.status(400).json({ success: false, error: 'Invalid filename' })
			}
			filename = name.endsWith('.tldr') ? name : `${name}.tldr`
		} else {
			filename = generateUniqueFilename('untitled', '.tldr')
		}

		const relativePath = parentPath ? path.join(parentPath, filename) : filename

		if (!isPathSafe(relativePath)) {
			return res.status(400).json({ success: false, error: 'Invalid path' })
		}

		const filePath = path.join(WHITEBOARDS_DIR, relativePath)

		if (await fileExists(filePath)) {
			return res.status(409).json({ success: false, error: 'File already exists' })
		}

		const boardData = {
			tldrawSnapshot: {
				store: {
					'document:document': {
						gridSize: 10,
						name: '',
						meta: {},
						id: 'document:document',
						typeName: 'document',
					},
					'page:page': {
						meta: {},
						id: 'page:page',
						name: 'Page 1',
						index: 'a1',
						typeName: 'page',
					},
				},
				schema: {
					schemaVersion: 2,
					sequences: {},
				},
			},
			metadata: {
				colorPalette: {},
				createdAt: new Date().toISOString(),
				lastModified: new Date().toISOString(),
				boardName: name || 'Untitled',
			},
		}

		const parentDir = path.dirname(filePath)
		await ensureDirectory(parentDir)
		await writeJsonFile(filePath, boardData)
		res.json({ success: true, data: { id: relativePath, path: relativePath } })
	} catch (error) {
		console.error('Error creating whiteboard:', error)
		res.status(500).json({ success: false, error: 'Failed to create whiteboard' })
	}
})

// Get whiteboard - using query param for path
app.get('/api/whiteboards/:id', async (req, res) => {
	try {
		const whiteboardId = req.params.id

		if (!whiteboardId || !isValidWhiteboardId(whiteboardId)) {
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

// Save whiteboard
app.post('/api/whiteboards/:id', async (req, res) => {
	try {
		const whiteboardId = req.params.id
		const boardData = req.body

		if (!whiteboardId || !isValidWhiteboardId(whiteboardId)) {
			return res.status(400).json({ success: false, error: 'Invalid whiteboard ID' })
		}

		if (!isPathSafe(whiteboardId)) {
			return res.status(400).json({ success: false, error: 'Invalid path' })
		}

		if (!isValidBoardFile(boardData)) {
			return res.status(400).json({ success: false, error: 'Invalid board data' })
		}

		boardData.metadata.lastModified = new Date().toISOString()

		const filePath = path.join(WHITEBOARDS_DIR, whiteboardId)
		const parentDir = path.dirname(filePath)
		await ensureDirectory(parentDir)
		await writeJsonFile(filePath, boardData)
		res.json({ success: true })
	} catch (error) {
		console.error('Error saving whiteboard:', error)
		res.status(500).json({ success: false, error: 'Failed to save whiteboard' })
	}
})

// Delete whiteboard
app.delete('/api/whiteboards/:id', async (req, res) => {
	try {
		const whiteboardId = req.params.id

		if (!whiteboardId || !isValidWhiteboardId(whiteboardId)) {
			return res.status(400).json({ success: false, error: 'Invalid whiteboard ID' })
		}

		if (!isPathSafe(whiteboardId)) {
			return res.status(400).json({ success: false, error: 'Invalid path' })
		}

		const filePath = path.join(WHITEBOARDS_DIR, whiteboardId)

		if (!(await fileExists(filePath))) {
			return res.status(404).json({ success: false, error: 'Whiteboard not found' })
		}

		await fs.unlink(filePath)
		res.json({ success: true })
	} catch (error) {
		console.error('Error deleting whiteboard:', error)
		res.status(500).json({ success: false, error: 'Failed to delete whiteboard' })
	}
})

// ===== FILE TREE ROUTE =====

app.get('/api/file-tree', async (_req, res) => {
	try {
		const tree = await buildFileTree(WHITEBOARDS_DIR)
		res.json({ success: true, data: { tree } })
	} catch (error) {
		console.error('Error building file tree:', error)
		res.status(500).json({ success: false, error: 'Failed to build file tree' })
	}
})

// ===== VIEWS ROUTES =====

app.get('/api/views', async (_req, res) => {
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

app.get('/api/views/:name', async (req, res) => {
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

app.post('/api/views/:name', async (req, res) => {
	try {
		const viewName = req.params.name
		const viewConfig = req.body

		if (!isValidViewName(viewName)) {
			return res.status(400).json({ success: false, error: 'Invalid view name' })
		}

		if (!isValidViewConfig(viewConfig)) {
			return res.status(400).json({ success: false, error: 'Invalid view configuration' })
		}

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

app.delete('/api/views/:name', async (req, res) => {
	try {
		const viewName = req.params.name

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

// ===== FILE OPERATIONS ROUTES =====

app.use('/api/files', fileOperationsRouter)
app.use('/api/folders', fileOperationsRouter)

// ===== LEGACY COLOR ROUTES =====

const COLORS_DIR = path.join(__dirname, '../config')
const CUSTOM_COLORS_PATH = path.join(COLORS_DIR, 'custom-colors.json')
const DEFAULT_COLORS_PATH = path.join(COLORS_DIR, 'default-colors.json')

app.get('/api/colors/custom', async (_req, res) => {
	try {
		const data = await fs.readFile(CUSTOM_COLORS_PATH, 'utf-8')
		res.json(JSON.parse(data))
	} catch (error) {
		console.error('Error reading custom colors:', error)
		res.status(500).json({ error: 'Failed to read custom colors' })
	}
})

app.get('/api/colors/default', async (_req, res) => {
	try {
		const data = await fs.readFile(DEFAULT_COLORS_PATH, 'utf-8')
		res.json(JSON.parse(data))
	} catch (error) {
		console.error('Error reading default colors:', error)
		res.status(500).json({ error: 'Failed to read default colors' })
	}
})

app.post('/api/colors/custom', async (req, res) => {
	try {
		await fs.writeFile(CUSTOM_COLORS_PATH, JSON.stringify(req.body, null, 2), 'utf-8')
		res.json({ success: true })
	} catch (error) {
		console.error('Error writing custom colors:', error)
		res.status(500).json({ error: 'Failed to write custom colors' })
	}
})

app.post('/api/colors/reset', async (_req, res) => {
	try {
		const defaultData = await fs.readFile(DEFAULT_COLORS_PATH, 'utf-8')
		await fs.writeFile(CUSTOM_COLORS_PATH, defaultData, 'utf-8')
		res.json({ success: true })
	} catch (error) {
		console.error('Error resetting colors:', error)
		res.status(500).json({ error: 'Failed to reset colors' })
	}
})

app.post('/api/colors/save-as-default', async (_req, res) => {
	try {
		const customData = await fs.readFile(CUSTOM_COLORS_PATH, 'utf-8')
		await fs.writeFile(DEFAULT_COLORS_PATH, customData, 'utf-8')
		res.json({ success: true })
	} catch (error) {
		console.error('Error saving as default:', error)
		res.status(500).json({ error: 'Failed to save as default' })
	}
})

// ===== HEALTH CHECK =====

app.get('/api/health', (_req, res) => {
	res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// Start server
app.listen(PORT, () => {
	console.log(`✅ API server running on http://localhost:${PORT}`)
	console.log(`📍 Health check: http://localhost:${PORT}/api/health`)
	console.log(`📁 Whiteboards directory: ${WHITEBOARDS_DIR}`)
	console.log(`📋 Views directory: ${VIEWS_DIR}`)
})
