import fs from 'fs/promises';
import path from 'path';

const STORAGE_DIR = path.join(process.cwd(), 'tldraw-data');

// Ensure storage directory exists
async function ensureStorageDir() {
  try {
    await fs.mkdir(STORAGE_DIR, { recursive: true });
  } catch (error) {
    console.error('Failed to create storage directory:', error);
  }
}

// Helper to get safe path
function getSafePath(relativePath) {
  // Prevent directory traversal
  const safePath = path.normalize(relativePath).replace(/^(\.\.[\/\\])+/, '');
  return path.join(STORAGE_DIR, safePath);
}

// List contents of a directory
export async function listContents(relativePath = '') {
  await ensureStorageDir();
  const dirPath = getSafePath(relativePath);
  
  try {
    const entries = await fs.readdir(dirPath, { withFileTypes: true });
    
    const contents = await Promise.all(entries.map(async (entry) => {
      const isDirectory = entry.isDirectory();
      const name = entry.name;
      // Skip hidden files and internal files like color-palette.json if at root
      if (name.startsWith('.') || (relativePath === '' && name === 'color-palette.json') || (relativePath === '' && name === 'index.json')) {
        return null;
      }

      return {
        name,
        type: isDirectory ? 'directory' : 'file',
        path: path.join(relativePath, name).replace(/\\/g, '/'), // Use forward slashes
      };
    }));

    return contents.filter(Boolean).sort((a, b) => {
      if (a.type === b.type) return a.name.localeCompare(b.name);
      return a.type === 'directory' ? -1 : 1;
    });
  } catch (error) {
    console.error('Error listing contents:', error);
    return [];
  }
}

// Create directory
export async function createDirectory(relativePath) {
  await ensureStorageDir();
  const dirPath = getSafePath(relativePath);
  try {
    await fs.mkdir(dirPath, { recursive: true });
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// Create whiteboard file
export async function createWhiteboard(relativePath, name) {
  await ensureStorageDir();
  // Ensure name ends with .json
  const fileName = name.endsWith('.json') ? name : `${name}.json`;
  const filePath = getSafePath(path.join(relativePath, fileName));
  
  try {
    // Check if exists
    try {
      await fs.access(filePath);
      return { success: false, error: 'File already exists' };
    } catch {
      // Doesn't exist, proceed
    }

    const initialData = {}; // Empty whiteboard
    await fs.writeFile(filePath, JSON.stringify(initialData, null, 2), 'utf-8');
    return { success: true, path: path.join(relativePath, fileName).replace(/\\/g, '/') };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// Delete item (file or directory)
export async function deleteItem(relativePath) {
  await ensureStorageDir();
  const itemPath = getSafePath(relativePath);
  
  try {
    const stat = await fs.stat(itemPath);
    if (stat.isDirectory()) {
      await fs.rm(itemPath, { recursive: true, force: true });
    } else {
      await fs.unlink(itemPath);
    }
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// Rename/Move item
export async function renameItem(oldPath, newPath) {
  await ensureStorageDir();
  const src = getSafePath(oldPath);
  const dest = getSafePath(newPath);
  
  try {
    await fs.rename(src, dest);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// Load whiteboard
export async function loadWhiteboard(relativePath) {
  await ensureStorageDir();
  const filePath = getSafePath(relativePath);
  
  try {
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    return null;
  }
}

// Save whiteboard
export async function saveWhiteboard(relativePath, data) {
  await ensureStorageDir();
  const filePath = getSafePath(relativePath);
  
  try {
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// Load color palette (legacy support, keep at root)
export async function loadColorPalette() {
  await ensureStorageDir();
  const filePath = path.join(STORAGE_DIR, 'color-palette.json');
  
  try {
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
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
    return { success: false, error: error.message };
  }
}
