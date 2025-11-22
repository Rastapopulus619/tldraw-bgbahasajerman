import fs from 'fs/promises';
import path from 'path';

const STORAGE_DIR = path.join(process.cwd(), 'tldraw-data');
const INDEX_FILE = path.join(STORAGE_DIR, 'index.json');

// Ensure storage directory exists
async function ensureStorageDir() {
  try {
    await fs.mkdir(STORAGE_DIR, { recursive: true });
    
    // Create index file if it doesn't exist
    try {
      await fs.access(INDEX_FILE);
    } catch {
      await fs.writeFile(INDEX_FILE, JSON.stringify({ whiteboards: [] }, null, 2));
    }
  } catch (error) {
    console.error('Failed to create storage directory:', error);
  }
}

// Get list of all whiteboards
export async function listWhiteboards() {
  await ensureStorageDir();
  try {
    const data = await fs.readFile(INDEX_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    return { whiteboards: [] };
  }
}

// Load specific whiteboard
export async function loadWhiteboard(id) {
  await ensureStorageDir();
  const filePath = path.join(STORAGE_DIR, `${id}.json`);
  
  try {
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    return null;
  }
}

// Save whiteboard data
export async function saveWhiteboard(id, data) {
  await ensureStorageDir();
  const filePath = path.join(STORAGE_DIR, `${id}.json`);
  
  try {
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
    return { success: true };
  } catch (error) {
    console.error('Failed to save whiteboard:', error);
    return { success: false, error: error.message };
  }
}

// Create new whiteboard
export async function createWhiteboard(name) {
  await ensureStorageDir();
  
  const index = await listWhiteboards();
  const id = `wb-${Date.now()}`;
  
  index.whiteboards.push({
    id,
    name,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });
  
  await fs.writeFile(INDEX_FILE, JSON.stringify(index, null, 2));
  await saveWhiteboard(id, {});
  
  return { success: true, id };
}

// Delete whiteboard
export async function deleteWhiteboard(id) {
  await ensureStorageDir();
  
  const index = await listWhiteboards();
  index.whiteboards = index.whiteboards.filter(wb => wb.id !== id);
  
  await fs.writeFile(INDEX_FILE, JSON.stringify(index, null, 2));
  
  const filePath = path.join(STORAGE_DIR, `${id}.json`);
  try {
    await fs.unlink(filePath);
  } catch (error) {
    // File might not exist, that's okay
  }
  
  return { success: true };
}

// Rename whiteboard
export async function renameWhiteboard(id, newName) {
  await ensureStorageDir();
  
  const index = await listWhiteboards();
  const wb = index.whiteboards.find(w => w.id === id);
  
  if (wb) {
    wb.name = newName;
    wb.updatedAt = new Date().toISOString();
    await fs.writeFile(INDEX_FILE, JSON.stringify(index, null, 2));
    return { success: true };
  }
  
  return { success: false, error: 'Whiteboard not found' };
}

// Load color palette
export async function loadColorPalette() {
  await ensureStorageDir();
  const filePath = path.join(STORAGE_DIR, 'color-palette.json');
  
  try {
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    // Return default colors if file doesn't exist
    return {
      colors: [
        "#000000", "#1a1a1a", "#333333", "#4d4d4d", "#666666", "#808080", "#999999",
        "#0d47a1", "#1976d2", "#2196f3", "#42a5f5", "#64b5f6", "#90caf9", "#bbdefb",
        "#1b5e20", "#388e3c", "#4caf50", "#66bb6a", "#81c784", "#a5d6a7", "#c8e6c9",
        "#e65100", "#f57c00", "#ff9800", "#ffa726", "#ffb74d", "#ffcc80", "#ffe0b2"
      ]
    };
  }
}

// Save color palette
export async function saveColorPalette(colors) {
  await ensureStorageDir();
  const filePath = path.join(STORAGE_DIR, 'color-palette.json');
  
  try {
    await fs.writeFile(filePath, JSON.stringify({ colors }, null, 2), 'utf-8');
    return { success: true };
  } catch (error) {
    console.error('Failed to save color palette:', error);
    return { success: false, error: error.message };
  }
}
