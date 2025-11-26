import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';

// Types
interface FileSystemItem {
  name: string;
  path: string;
  type: 'file' | 'directory';
  children?: FileSystemItem[];
}

interface FileExplorerProps {
  onSelectFile: (path: string) => void;
  currentPath: string;
  onSetDefaultBoard?: (path: string | null) => void;
  defaultBoard?: string | null;
}

const FileExplorer: React.FC<FileExplorerProps> = ({ onSelectFile, currentPath, onSetDefaultBoard, defaultBoard }) => {
  const [files, setFiles] = useState<FileSystemItem[]>([]);
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());
  const [newItemName, setNewItemName] = useState('');
  const [creatingType, setCreatingType] = useState<'file' | 'directory' | null>(null);
  const [creatingInPath, setCreatingInPath] = useState<string | null>(null);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; item: FileSystemItem | null } | null>(null);
  const [renamingItem, setRenamingItem] = useState<{ path: string; name: string } | null>(null);
  const [focusedIndex, setFocusedIndex] = useState<number>(0);
  const explorerRef = useRef<HTMLDivElement>(null);

  const fetchFiles = useCallback(async (path: string = '') => {
    try {
      const res = await fetch(`/api/fs/list?path=${encodeURIComponent(path)}`);
      
      if (!res.ok) {
        console.error('API error:', res.status, res.statusText);
        return [];
      }
      
      const text = await res.text();
      if (!text || text.trim() === '') {
        console.error('Empty response from API');
        return [];
      }
      
      const data = JSON.parse(text);
      return data.contents || [];
    } catch (error) {
      console.error('Error fetching files:', error);
      return [];
    }
  }, []);

  const loadAllFiles = useCallback(async () => {
    const rootFiles = await fetchFiles('');
    
    const loadRecursive = async (items: FileSystemItem[]): Promise<FileSystemItem[]> => {
      return Promise.all(items.map(async (item) => {
        if (item.type === 'directory' && expandedFolders.has(item.path)) {
          const children = await fetchFiles(item.path);
          const processedChildren = await loadRecursive(children);
          return { ...item, children: processedChildren };
        }
        return item;
      }));
    };

    const processedRoot = await loadRecursive(rootFiles);
    setFiles(processedRoot);
  }, [fetchFiles, expandedFolders]);

  useEffect(() => {
    loadAllFiles();
  }, [loadAllFiles]);

  const flattenedTree = useMemo(() => {
    const flatten = (items: FileSystemItem[], result: FileSystemItem[] = []): FileSystemItem[] => {
      items.forEach(item => {
        result.push(item);
        if (item.type === 'directory' && expandedFolders.has(item.path) && item.children) {
          flatten(item.children, result);
        }
      });
      return result;
    };
    return flatten(files);
  }, [files, expandedFolders]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (renamingItem || creatingType) return;
      if (!explorerRef.current?.contains(document.activeElement)) return;

      const flatList = flattenedTree;
      if (flatList.length === 0) return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setFocusedIndex(prev => Math.min(prev + 1, flatList.length - 1));
          break;
        case 'ArrowUp':
          e.preventDefault();
          setFocusedIndex(prev => Math.max(prev - 1, 0));
          break;
        case 'ArrowRight': {
          e.preventDefault();
          const item = flatList[focusedIndex];
          if (item?.type === 'directory' && !expandedFolders.has(item.path)) {
            toggleFolder(item.path);
          }
          break;
        }
        case 'ArrowLeft': {
          e.preventDefault();
          const item = flatList[focusedIndex];
          if (item?.type === 'directory' && expandedFolders.has(item.path)) {
            toggleFolder(item.path);
          }
          break;
        }
        case 'Enter': {
          e.preventDefault();
          const item = flatList[focusedIndex];
          if (item) {
            if (item.type === 'file') {
              onSelectFile(item.path);
            } else {
              toggleFolder(item.path);
            }
          }
          break;
        }
        case 'Delete': {
          e.preventDefault();
          const item = flatList[focusedIndex];
          if (item) {
            handleDelete(item.path);
          }
          break;
        }
        case 'F2': {
          e.preventDefault();
          const item = flatList[focusedIndex];
          if (item) {
            setRenamingItem({ path: item.path, name: item.name });
          }
          break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [flattenedTree, focusedIndex, expandedFolders, renamingItem, creatingType, onSelectFile]);

  useEffect(() => {
    const focusedElement = document.querySelector(`[data-item-index="${focusedIndex}"]`);
    if (focusedElement) {
      focusedElement.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
  }, [focusedIndex]);

  const toggleFolder = useCallback((path: string) => {
    setExpandedFolders(prev => {
      const newExpanded = new Set(prev);
      if (newExpanded.has(path)) {
        newExpanded.delete(path);
      } else {
        newExpanded.add(path);
      }
      return newExpanded;
    });
  }, []);

  const handleCreate = useCallback(async () => {
    if (!newItemName || !creatingType) return;
    
    const basePath = creatingInPath ? creatingInPath : '';
    
    try {
      if (creatingType === 'directory') {
        const fullPath = basePath ? `${basePath}/${newItemName}` : newItemName;
        await fetch('/api/fs/directory', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ path: fullPath }),
        });
      } else {
        await fetch('/api/fs/file', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ path: basePath, name: newItemName }),
        });
      }
      
      setCreatingType(null);
      setNewItemName('');
      setCreatingInPath(null);
      loadAllFiles();
    } catch (error) {
      console.error('Error creating item:', error);
    }
  }, [newItemName, creatingType, creatingInPath, loadAllFiles]);

  const handleDelete = useCallback(async (path: string) => {
    if (!confirm(`Are you sure you want to delete ${path}?`)) return;
    try {
      await fetch(`/api/fs/item?path=${encodeURIComponent(path)}`, {
        method: 'DELETE',
      });
      loadAllFiles();
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  }, [loadAllFiles]);

  const handleRename = useCallback(async (oldPath: string, newName: string) => {
    if (!newName || newName === renamingItem?.name) {
      setRenamingItem(null);
      return;
    }

    try {
      const pathParts = oldPath.split('/');
      pathParts[pathParts.length - 1] = newName;
      const newPath = pathParts.join('/');

      await fetch('/api/fs/rename', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ oldPath, newPath }),
      });

      setRenamingItem(null);
      loadAllFiles();

      if (currentPath === oldPath) {
        onSelectFile(newPath);
      }
    } catch (error) {
      console.error('Error renaming item:', error);
    }
  }, [renamingItem, loadAllFiles, currentPath, onSelectFile]);

  const renderTree = useCallback((items: FileSystemItem[], level = 0): React.ReactNode => {
    return items.map((item) => {
      const flatList = flattenedTree;
      const itemIndex = flatList.findIndex(f => f.path === item.path);
      const isFocused = itemIndex === focusedIndex;

      return (
        <div key={item.path} style={{ paddingLeft: `${level * 12}px` }}>
          <div 
            data-item-index={itemIndex}
            className={`file-item ${currentPath === item.path ? 'active' : ''} ${isFocused ? 'focused' : ''}`}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              padding: '4px', 
              cursor: 'pointer',
              backgroundColor: currentPath === item.path ? '#e0e0e0' : 'transparent',
              outline: isFocused ? '2px solid #007acc' : 'none',
              outlineOffset: '-2px'
            }}
            onClick={() => {
              setFocusedIndex(itemIndex);
              if (item.type === 'directory') {
                toggleFolder(item.path);
              } else {
                onSelectFile(item.path);
              }
            }}
            onContextMenu={(e) => {
              e.preventDefault();
              setFocusedIndex(itemIndex);
              setContextMenu({ x: e.clientX, y: e.clientY, item });
            }}
            tabIndex={0}
          >
            <span style={{ marginRight: '5px' }}>
              {item.type === 'directory' 
                ? (expandedFolders.has(item.path) ? '📂' : '📁') 
                : (defaultBoard === item.path ? '⭐' : '📄')}
            </span>
            {renamingItem?.path === item.path ? (
              <input
                type="text"
                value={renamingItem.name}
                onChange={(e) => setRenamingItem({ ...renamingItem, name: e.target.value })}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleRename(renamingItem.path, renamingItem.name);
                  if (e.key === 'Escape') setRenamingItem(null);
                }}
                onBlur={() => handleRename(renamingItem.path, renamingItem.name)}
                autoFocus
                style={{
                  flex: 1,
                  border: '1px solid #007bff',
                  padding: '2px 4px',
                  fontSize: '13px',
                }}
                onClick={(e) => e.stopPropagation()}
              />
            ) : (
              item.name
            )}
          </div>
          
          {item.type === 'directory' && expandedFolders.has(item.path) && item.children && (
            <div>
              {renderTree(item.children, level + 1)}
            </div>
          )}
        </div>
      );
    });
  }, [currentPath, expandedFolders, defaultBoard, renamingItem, focusedIndex, flattenedTree, toggleFolder, onSelectFile, handleRename]);

  return (
    <div 
      ref={explorerRef}
      className="file-explorer" 
      style={{ 
        width: '250px', 
        height: '100%', 
        borderRight: '1px solid #ccc', 
        display: 'flex', 
        flexDirection: 'column',
        backgroundColor: '#f5f5f5'
      }}
      tabIndex={-1}
    >
      <div style={{ padding: '10px', borderBottom: '1px solid #ddd', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <strong>Explorer</strong>
        <div>
          <button onClick={() => { setCreatingType('file'); setCreatingInPath(''); }} title="New File">📄+</button>
          <button onClick={() => { setCreatingType('directory'); setCreatingInPath(''); }} title="New Folder">📁+</button>
          <button onClick={() => loadAllFiles()} title="Refresh">🔄</button>
        </div>
      </div>

      {creatingType && (
        <div style={{ padding: '10px', borderBottom: '1px solid #ddd', backgroundColor: '#fff' }}>
          <div style={{ fontSize: '12px', marginBottom: '5px' }}>
            New {creatingType} in {creatingInPath || 'root'}:
          </div>
          <input 
            type="text" 
            value={newItemName} 
            onChange={(e) => setNewItemName(e.target.value)}
            placeholder="Name..."
            style={{ width: '100%', marginBottom: '5px' }}
            autoFocus
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleCreate();
              if (e.key === 'Escape') setCreatingType(null);
            }}
          />
          <div style={{ display: 'flex', gap: '5px' }}>
            <button onClick={handleCreate} style={{ flex: 1 }}>Create</button>
            <button onClick={() => setCreatingType(null)} style={{ flex: 1 }}>Cancel</button>
          </div>
        </div>
      )}

      <div style={{ flex: 1, overflowY: 'auto', padding: '5px' }}>
        {renderTree(files)}
      </div>

      {contextMenu && (
        <div 
          style={{ 
            position: 'fixed', 
            top: contextMenu.y, 
            left: contextMenu.x, 
            backgroundColor: 'white', 
            border: '1px solid #ccc', 
            boxShadow: '2px 2px 5px rgba(0,0,0,0.2)',
            zIndex: 1000,
            padding: '5px 0',
            minWidth: '120px'
          }}
          onMouseLeave={() => setContextMenu(null)}
        >
          {contextMenu.item?.type === 'directory' && (
            <>
              <div 
                className="context-menu-item"
                onClick={() => {
                  setCreatingType('file');
                  setCreatingInPath(contextMenu.item!.path);
                  setContextMenu(null);
                  if (!expandedFolders.has(contextMenu.item!.path)) {
                    toggleFolder(contextMenu.item!.path);
                  }
                }}
              >
                New File
              </div>
              <div 
                className="context-menu-item"
                onClick={() => {
                  setCreatingType('directory');
                  setCreatingInPath(contextMenu.item!.path);
                  setContextMenu(null);
                  if (!expandedFolders.has(contextMenu.item!.path)) {
                    toggleFolder(contextMenu.item!.path);
                  }
                }}
              >
                New Folder
              </div>
              <hr style={{ margin: '5px 0', border: 'none', borderTop: '1px solid #eee' }} />
            </>
          )}
          {contextMenu.item?.type === 'file' && (
            <>
              <div 
                className="context-menu-item"
                onClick={() => {
                  if (contextMenu.item) {
                    const isCurrentDefault = defaultBoard === contextMenu.item.path;
                    onSetDefaultBoard?.(isCurrentDefault ? null : contextMenu.item.path);
                  }
                  setContextMenu(null);
                }}
              >
                {defaultBoard === contextMenu.item.path ? '⭐ Unset Default' : 'Set as Default'}
              </div>
              <hr style={{ margin: '5px 0', border: 'none', borderTop: '1px solid #eee' }} />
            </>
          )}
          <div 
            className="context-menu-item"
            onClick={() => {
              if (contextMenu.item) {
                setRenamingItem({ path: contextMenu.item.path, name: contextMenu.item.name });
              }
              setContextMenu(null);
            }}
          >
            Rename (F2)
          </div>
          <hr style={{ margin: '5px 0', border: 'none', borderTop: '1px solid #eee' }} />
          <div 
            className="context-menu-item"
            onClick={() => {
              if (contextMenu.item) handleDelete(contextMenu.item.path);
              setContextMenu(null);
            }}
            style={{ color: 'red' }}
          >
            Delete
          </div>
        </div>
      )}
      <style>{`
        .context-menu-item {
          padding: 5px 15px;
          cursor: pointer;
        }
        .context-menu-item:hover {
          background-color: #f0f0f0;
        }
        .file-item.focused {
          position: relative;
        }
      `}</style>
    </div>
  );
};

export default React.memo(FileExplorer);
