import express from 'express';
import {
  listWhiteboards,
  loadWhiteboard,
  saveWhiteboard,
  createWhiteboard,
  deleteWhiteboard,
  renameWhiteboard,
  loadColorPalette,
  saveColorPalette
} from './storage.js';

const app = express();
app.use(express.json({ limit: '50mb' }));

// List all whiteboards
app.get('/api/whiteboards', async (req, res) => {
  try {
    const data = await listWhiteboards();
    res.json(data);
  } catch (error) {
    console.error('Error listing whiteboards:', error);
    res.status(500).json({ error: 'Failed to list whiteboards' });
  }
});

// Load a specific whiteboard
app.get('/api/whiteboards/:id', async (req, res) => {
  try {
    const data = await loadWhiteboard(req.params.id);
    res.json(data || {});
  } catch (error) {
    console.error('Error loading whiteboard:', error);
    res.status(500).json({ error: 'Failed to load whiteboard' });
  }
});

// Create a new whiteboard
app.post('/api/whiteboards', async (req, res) => {
  try {
    const { name } = req.body;
    const result = await createWhiteboard(name);
    res.json(result);
  } catch (error) {
    console.error('Error creating whiteboard:', error);
    res.status(500).json({ error: 'Failed to create whiteboard' });
  }
});

// Save whiteboard data
app.post('/api/whiteboards/:id', async (req, res) => {
  try {
    const result = await saveWhiteboard(req.params.id, req.body);
    res.json(result);
  } catch (error) {
    console.error('Error saving whiteboard:', error);
    res.status(500).json({ error: 'Failed to save whiteboard' });
  }
});

// Get color palette
app.get('/api/colors', async (req, res) => {
  try {
    const data = await loadColorPalette();
    res.json(data);
  } catch (error) {
    console.error('Error loading color palette:', error);
    res.status(500).json({ error: 'Failed to load color palette' });
  }
});

// Save color palette
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

// Delete a whiteboard
app.delete('/api/whiteboards/:id', async (req, res) => {
  try {
    const result = await deleteWhiteboard(req.params.id);
    res.json(result);
  } catch (error) {
    console.error('Error deleting whiteboard:', error);
    res.status(500).json({ error: 'Failed to delete whiteboard' });
  }
});

// Rename a whiteboard
app.patch('/api/whiteboards/:id', async (req, res) => {
  try {
    const { name } = req.body;
    const result = await renameWhiteboard(req.params.id, name);
    res.json(result);
  } catch (error) {
    console.error('Error renaming whiteboard:', error);
    res.status(500).json({ error: 'Failed to rename whiteboard' });
  }
});

// Legacy endpoints for backward compatibility
app.get('/api/load', async (req, res) => {
  const data = await listWhiteboards();
  if (data.whiteboards.length > 0) {
    const firstId = data.whiteboards[0].id;
    const whiteboardData = await loadWhiteboard(firstId);
    res.json(whiteboardData || {});
  } else {
    res.json({});
  }
});

app.post('/api/save', async (req, res) => {
  const data = await listWhiteboards();
  if (data.whiteboards.length > 0) {
    const firstId = data.whiteboards[0].id;
    const result = await saveWhiteboard(firstId, req.body);
    res.json(result);
  } else {
    res.json({ success: false, error: 'No whiteboard exists' });
  }
});

export default app;
