import { useEditor, DefaultColorStyle } from 'tldraw'
import { useState, useEffect } from 'react'
import { HexColorPicker } from 'react-colorful'

const DEFAULT_COLORS = [
  "#000000", "#1a1a1a", "#4d4d4d", "#808080", "#b3b3b3", "#cccccc", "#ffffff",
  "#0d47a1", "#1976d2", "#2196f3", "#42a5f5", "#64b5f6", "#90caf9", "#bbdefb",
  "#1b5e20", "#388e3c", "#4caf50", "#66bb6a", "#81c784", "#a5d6a7", "#c8e6c9",
  "#e65100", "#f57c00", "#ff9800", "#ffa726", "#ffb74d", "#ffcc80", "#ffe0b2"
]

export function CustomColorPicker() {
  const editor = useEditor()
  const [colors, setColors] = useState<string[]>(DEFAULT_COLORS)
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [selectedIndex, setSelectedIndex] = useState<number>(0)
  const [keySequence, setKeySequence] = useState<string>('')
  const [isBacktickPressed, setIsBacktickPressed] = useState(false)

  useEffect(() => {
    async function loadColors() {
      try {
        const response = await fetch('/api/colors')
        const data = await response.json()
        if (data.colors) {
          setColors(data.colors)
        }
      } catch (error) {
        console.error('Failed to load colors:', error)
      }
    }
    loadColors()
  }, [])

  const saveColors = async (newColors: string[]) => {
    try {
      await fetch('/api/colors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ colors: newColors })
      })
    } catch (error) {
      console.error('Failed to save colors:', error)
    }
  }

  const selectColor = (hexColor: string, index: number) => {
    setSelectedIndex(index)
    
    // Set placeholder tldraw color
    editor.setStyleForNextShapes(DefaultColorStyle, 'black')
    
    // Store custom color in metadata for selected shapes
    const selectedShapes = editor.getSelectedShapes()
    if (selectedShapes.length > 0) {
      editor.updateShapes(
        selectedShapes.map((shape) => ({
          id: shape.id,
          type: shape.type,
          meta: {
            ...shape.meta,
            customColor: hexColor
          }
        }))
      )
    }
    
    // Store for next shapes by patching editor instance
    ;(editor as any)._customHexColor = hexColor
  }

  const updateColor = (index: number, newColor: string) => {
    const newColors = [...colors]
    newColors[index] = newColor
    setColors(newColors)
    saveColors(newColors)
  }

  const handleCloseColorPicker = () => {
    if (editingIndex !== null) {
      // Auto-apply the edited color
      selectColor(colors[editingIndex], editingIndex)
    }
    setEditingIndex(null)
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '`') {
        e.preventDefault()
        setIsBacktickPressed(true)
        setKeySequence('')
      } else if (isBacktickPressed && /^[1-4]$/.test(e.key)) {
        e.preventDefault()
        setKeySequence(prev => {
          if (prev.length === 0) return e.key
          if (prev.length === 1) {
            const row = parseInt(prev)
            const col = parseInt(e.key)
            if (row >= 1 && row <= 4 && col >= 1 && col <= 7) {
              const index = (row - 1) * 7 + (col - 1)
              if (index < colors.length) {
                selectColor(colors[index], index)
              }
            }
            return ''
          }
          return prev
        })
      }
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === '`') {
        setIsBacktickPressed(false)
        setKeySequence('')
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [isBacktickPressed, keySequence, colors])

  return (
    <div style={{ padding: '8px', background: 'var(--color-panel)', borderBottom: '1px solid var(--color-divider)' }}>
      {isBacktickPressed && (
        <div style={{ 
          fontSize: '11px', 
          color: 'var(--color-text-3)', 
          marginBottom: '4px',
          fontFamily: 'monospace'
        }}>
          Sequence: ` + {keySequence || '__'} (Row 1-4, Col 1-7)
        </div>
      )}

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(7, 24px)',
        gap: '6px',
        justifyContent: 'center'
      }}>
        {colors.map((color, index) => {
          const row = Math.floor(index / 7) + 1
          const col = (index % 7) + 1
          const isSelected = selectedIndex === index
          
          return (
            <div key={index} style={{ position: 'relative' }}>
              <button
                onClick={() => selectColor(color, index)}
                onContextMenu={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  setEditingIndex(index)
                }}
                style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  border: isSelected ? '3px solid #fff' : '2px solid var(--color-background)',
                  background: color,
                  cursor: 'pointer',
                  boxShadow: isSelected 
                    ? '0 0 8px rgba(255,255,255,0.6)' 
                    : '0 1px 2px rgba(0,0,0,0.2)',
                  transition: 'all 0.15s',
                  transform: isSelected ? 'scale(1.15)' : 'scale(1)',
                }}
                onMouseEnter={(e) => {
                  if (!isSelected) e.currentTarget.style.transform = 'scale(1.1)'
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) e.currentTarget.style.transform = 'scale(1)'
                }}
                title={`Row ${row}, Col ${col}\n${color}`}
              />
            </div>
          )
        })}
      </div>

      {editingIndex !== null && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10000
          }}
          onClick={handleCloseColorPicker}
        >
          <div
            style={{
              background: 'var(--color-panel)',
              padding: '20px',
              borderRadius: '8px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <HexColorPicker
              color={colors[editingIndex]}
              onChange={(newColor) => updateColor(editingIndex, newColor)}
            />
            <div style={{ marginTop: '12px', display: 'flex', gap: '8px', alignItems: 'center' }}>
              <input
                type="text"
                value={colors[editingIndex]}
                onChange={(e) => updateColor(editingIndex, e.target.value)}
                style={{
                  flex: 1,
                  padding: '6px',
                  fontFamily: 'monospace',
                  border: '1px solid var(--color-divider)',
                  borderRadius: '4px',
                  background: 'var(--color-background)',
                  color: 'var(--color-text)'
                }}
              />
              <button
                onClick={handleCloseColorPicker}
                style={{
                  padding: '6px 16px',
                  background: 'var(--color-primary)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
