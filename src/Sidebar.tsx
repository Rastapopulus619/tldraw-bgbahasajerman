import { useState, useEffect } from 'react'

interface Whiteboard {
  id: string
  name: string
  createdAt: string
  updatedAt: string
}

interface SidebarProps {
  activeWhiteboardId: string | null
  onSelectWhiteboard: (id: string) => void
  onCreateWhiteboard: (name: string) => void
  onDeleteWhiteboard: (id: string) => void
}

export function Sidebar({ 
  activeWhiteboardId, 
  onSelectWhiteboard,
  onCreateWhiteboard,
  onDeleteWhiteboard
}: SidebarProps) {
  const [whiteboards, setWhiteboards] = useState<Whiteboard[]>([])
  const [isCreating, setIsCreating] = useState(false)
  const [newName, setNewName] = useState('')

  // Load whiteboards list
  useEffect(() => {
    loadWhiteboards()
  }, [])

  async function loadWhiteboards() {
    try {
      const response = await fetch('/api/whiteboards')
      const data = await response.json()
      setWhiteboards(data.whiteboards || [])
    } catch (error) {
      console.error('Failed to load whiteboards:', error)
    }
  }

  async function handleCreate() {
    if (!newName.trim()) return
    
    try {
      const response = await fetch('/api/whiteboards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newName })
      })
      const result = await response.json()
      
      if (result.success) {
        await loadWhiteboards()
        onSelectWhiteboard(result.id)
        setNewName('')
        setIsCreating(false)
      }
    } catch (error) {
      console.error('Failed to create whiteboard:', error)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this whiteboard?')) return
    
    try {
      await fetch(`/api/whiteboards/${id}`, { method: 'DELETE' })
      await loadWhiteboards()
      
      if (activeWhiteboardId === id && whiteboards.length > 1) {
        const nextWhiteboard = whiteboards.find(wb => wb.id !== id)
        if (nextWhiteboard) {
          onSelectWhiteboard(nextWhiteboard.id)
        }
      }
    } catch (error) {
      console.error('Failed to delete whiteboard:', error)
    }
  }

  return (
    <div style={{
      width: '250px',
      height: '100%',
      background: '#f8f9fa',
      borderRight: '1px solid #ddd',
      padding: '16px',
      display: 'flex',
      flexDirection: 'column',
      gap: '12px'
    }}>
      <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 600 }}>Whiteboards</h3>
      
      <button
        onClick={() => setIsCreating(true)}
        style={{
          padding: '8px 12px',
          background: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '14px'
        }}
      >
        + New Whiteboard
      </button>

      {isCreating && (
        <div style={{ display: 'flex', gap: '4px' }}>
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleCreate()}
            placeholder="Whiteboard name"
            autoFocus
            style={{
              flex: 1,
              padding: '6px 8px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              fontSize: '14px'
            }}
          />
          <button
            onClick={handleCreate}
            style={{
              padding: '6px 12px',
              background: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            ✓
          </button>
          <button
            onClick={() => { setIsCreating(false); setNewName('') }}
            style={{
              padding: '6px 12px',
              background: '#dc3545',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            ✗
          </button>
        </div>
      )}

      <div style={{ 
        flex: 1, 
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '4px'
      }}>
        {whiteboards.map(wb => (
          <div
            key={wb.id}
            style={{
              padding: '10px',
              background: activeWhiteboardId === wb.id ? '#007bff' : 'white',
              color: activeWhiteboardId === wb.id ? 'white' : 'black',
              border: '1px solid #ddd',
              borderRadius: '4px',
              cursor: 'pointer',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontSize: '14px'
            }}
            onClick={() => onSelectWhiteboard(wb.id)}
          >
            <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {wb.name}
            </span>
            <button
              onClick={(e) => { e.stopPropagation(); handleDelete(wb.id) }}
              style={{
                padding: '2px 8px',
                background: activeWhiteboardId === wb.id ? 'rgba(255,255,255,0.2)' : '#f0f0f0',
                color: activeWhiteboardId === wb.id ? 'white' : '#666',
                border: 'none',
                borderRadius: '3px',
                cursor: 'pointer',
                fontSize: '12px'
              }}
            >
              🗑
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
