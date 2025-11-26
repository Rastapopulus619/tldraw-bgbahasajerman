import express from 'express';
import {
  listContents,
  createDirectory,
  createWhiteboard,
  deleteItem,
  renameItem,
  loadWhiteboard,
  saveWhiteboard,
  loadColorPalette,
  saveColorPalette
} from './storage.js';

const app = express();
app.use(express.json({ limit: '50mb' }));

// --- File System API ---

// List contents
app.get('/api/fs/list', async (req, res) => {
  try {
    const path = req.query.path || '';
    const contents = await listContents(path);
    res.json({ contents });
  } catch (error) {
    console.error('Error listing contents:', error);
    res.status(500).json({ error: 'Failed to list contents' });
  }
});

// Create directory
app.post('/api/fs/directory', async (req, res) => {
  try {
    const { path } = req.body;
    const result = await createDirectory(path);
    res.json(result);
  } catch (error) {
    console.error('Error creating directory:', error);
    res.status(500).json({ error: 'Failed to create directory' });
  }
});

// Create whiteboard file
app.post('/api/fs/file', async (req, res) => {
  try {
    const { path, name } = req.body;
    const result = await createWhiteboard(path, name);
    res.json(result);
  } catch (error) {
    console.error('Error creating file:', error);
    res.status(500).json({ error: 'Failed to create file' });
  }
});

// Delete item
app.delete('/api/fs/item', async (req, res) => {
  try {
    const path = req.query.path;
    const result = await deleteItem(path);
    res.json(result);
  } catch (error) {
    console.error('Error deleting item:', error);
    res.status(500).json({ error: 'Failed to delete item' });
  }
});

// Rename/Move item
app.patch('/api/fs/rename', async (req, res) => {
  try {
    const { oldPath, newPath } = req.body;
    const result = await renameItem(oldPath, newPath);
    res.json(result);
  } catch (error) {
    console.error('Error renaming item:', error);
    res.status(500).json({ error: 'Failed to rename item' });
  }
});

// --- Whiteboard Data API ---

// Load whiteboard data (supports paths)
// Using regex to match everything after /api/whiteboards/
app.get(/\/api\/whiteboards\/(.*)/, async (req, res) => {
  try {
    const path = req.params[0]; // Captures the wildcard part
    const data = await loadWhiteboard(path);
    res.json(data || {});
  } catch (error) {
    console.error('Error loading whiteboard:', error);
    res.status(500).json({ error: 'Failed to load whiteboard' });
  }
});

// Save whiteboard data
app.post(/\/api\/whiteboards\/(.*)/, async (req, res) => {
  try {
    const path = req.params[0];
    const result = await saveWhiteboard(path, req.body);
    res.json(result);
  } catch (error) {
    console.error('Error saving whiteboard:', error);
    res.status(500).json({ error: 'Failed to save whiteboard' });
  }
});

// --- Color Palette API ---

app.get('/api/colors', async (req, res) => {
  try {
    const data = await loadColorPalette();
    res.json(data);
  } catch (error) {
    console.error('Error loading color palette:', error);
    res.status(500).json({ error: 'Failed to load color palette' });
  }
});

app.post('/api/colors', async (req, res) => {
  try {
    const { colors } = req.body;
    const result = await saveColorPalette(colors);
    res.json(result);
  } catch (error) {
    console.error('Error saving color palette:', error);
    res.status(500).json({ error: 'Failed to save color palette' });
  }
});

export default app;
