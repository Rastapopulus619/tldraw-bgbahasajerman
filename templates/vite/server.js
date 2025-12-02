import cors from 'cors'
import express from 'express'
import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PORT = 3001

app.use(cors())
app.use(express.json())

const COLORS_DIR = path.join(__dirname, 'config')
const CUSTOM_COLORS_PATH = path.join(COLORS_DIR, 'custom-colors.json')
const DEFAULT_COLORS_PATH = path.join(COLORS_DIR, 'default-colors.json')

// Get custom colors
app.get('/api/colors/custom', async (req, res) => {
	try {
		const data = await fs.readFile(CUSTOM_COLORS_PATH, 'utf-8')
		res.json(JSON.parse(data))
	} catch (error) {
		console.error('Error reading custom colors:', error)
		res.status(500).json({ error: 'Failed to read custom colors' })
	}
})

// Get default colors
app.get('/api/colors/default', async (req, res) => {
	try {
		const data = await fs.readFile(DEFAULT_COLORS_PATH, 'utf-8')
		res.json(JSON.parse(data))
	} catch (error) {
		console.error('Error reading default colors:', error)
		res.status(500).json({ error: 'Failed to read default colors' })
	}
})

// Save custom colors
app.post('/api/colors/custom', async (req, res) => {
	try {
		await fs.writeFile(CUSTOM_COLORS_PATH, JSON.stringify(req.body, null, 2), 'utf-8')
		res.json({ success: true })
	} catch (error) {
		console.error('Error writing custom colors:', error)
		res.status(500).json({ error: 'Failed to write custom colors' })
	}
})

// Reset to defaults (copy default-colors.json to custom-colors.json)
app.post('/api/colors/reset', async (req, res) => {
	try {
		const defaultData = await fs.readFile(DEFAULT_COLORS_PATH, 'utf-8')
		await fs.writeFile(CUSTOM_COLORS_PATH, defaultData, 'utf-8')
		res.json({ success: true })
	} catch (error) {
		console.error('Error resetting colors:', error)
		res.status(500).json({ error: 'Failed to reset colors' })
	}
})

// Save current as default
app.post('/api/colors/save-as-default', async (req, res) => {
	try {
		const customData = await fs.readFile(CUSTOM_COLORS_PATH, 'utf-8')
		await fs.writeFile(DEFAULT_COLORS_PATH, customData, 'utf-8')
		res.json({ success: true })
	} catch (error) {
		console.error('Error saving as default:', error)
		res.status(500).json({ error: 'Failed to save as default' })
	}
})

app.listen(PORT, () => {
	console.log(`Color API server running on http://localhost:${PORT}`)
})
