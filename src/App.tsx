import { Tldraw, useEditor, TLComponents, DefaultStylePanel, TLUiStylePanelProps, DefaultStylePanelContent } from 'tldraw'
import 'tldraw/tldraw.css'
import { useEffect, useState } from 'react'
import { Sidebar } from './Sidebar'
import { CustomColorPicker } from './components/CustomColorPicker'
import { CustomShapeRenderer } from './components/CustomShapeRenderer'
import { RightClickPanHandler } from './components/RightClickPanHandler'

function SwappedZoomPanHandler() {
  const editor = useEditor()

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault()
      e.stopPropagation()

      const camera = editor.getCamera()
      const { x: camX, y: camY, z: currentZoom } = camera
      const point = editor.inputs.currentScreenPoint
      const { x: screenX, y: screenY } = point

      if (e.shiftKey) {
        const panAmount = e.deltaY * 0.5
        editor.setCamera({
          x: camX + panAmount / currentZoom,
          y: camY,
          z: currentZoom
        })
      } else if (e.ctrlKey || e.metaKey) {
        const panAmount = e.deltaY * -0.5
        editor.setCamera({
          x: camX,
          y: camY + panAmount / currentZoom,
          z: currentZoom
        })
      } else {
        const delta = -e.deltaY
        const zoomFactor = delta > 0 ? 1.1 : 0.9
        const newZoom = Math.max(0.01, Math.min(8, currentZoom * zoomFactor))

        const pageXBefore = screenX / currentZoom - camX
        const pageYBefore = screenY / currentZoom - camY
        const newCamX = screenX / newZoom - pageXBefore
        const newCamY = screenY / newZoom - pageYBefore

        editor.setCamera({
          x: newCamX,
          y: newCamY,
          z: newZoom
        })
      }
    }

    const container = editor.getContainer()
    container.addEventListener('wheel', handleWheel, { passive: false, capture: true })

    return () => {
      container.removeEventListener('wheel', handleWheel, { capture: true })
    }
  }, [editor])

  return null
}

function PersistenceManager({ whiteboardId }: { whiteboardId: string | null }) {
  const editor = useEditor()

  useEffect(() => {
    if (!whiteboardId) return

    async function loadData() {
      try {
        const response = await fetch(`/api/whiteboards/${whiteboardId}`)
        const data = await response.json()
        
        if (data && Object.keys(data).length > 0) {
          editor.loadSnapshot(data)
          console.log(`Loaded whiteboard: ${whiteboardId}`)
        } else {
          editor.selectAll()
          editor.deleteShapes(editor.getSelectedShapeIds())
        }
      } catch (error) {
        console.error('Failed to load whiteboard:', error)
      }
    }
    
    loadData()
  }, [editor, whiteboardId])

  useEffect(() => {
    if (!whiteboardId) return

    let timeoutId: ReturnType<typeof setTimeout>
    let isSaving = false

    const handleChange = () => {
      // Don't schedule a new save if one is already in progress
      if (isSaving) return
      
      clearTimeout(timeoutId)
      timeoutId = setTimeout(async () => {
        isSaving = true
        try {
          const snapshot = editor.getSnapshot()
          await fetch(`/api/whiteboards/${whiteboardId}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(snapshot),
          })
          console.log('Auto-saved whiteboard')
        } catch (error) {
          console.error('Failed to save whiteboard:', error)
        } finally {
          isSaving = false
        }
      }, 2500) // Increased from 1000ms to 2500ms to reduce saves during active drawing
    }

    const unsubscribe = editor.store.listen(handleChange, { source: 'user' })
    
    return () => {
      clearTimeout(timeoutId)
      unsubscribe()
    }
  }, [editor, whiteboardId])

  return null
}

function CustomStylePanel(props: TLUiStylePanelProps) {
  return (
    <DefaultStylePanel {...props}>
      <CustomColorPicker />
      <DefaultStylePanelContent />
    </DefaultStylePanel>
  )
}

const components: TLComponents = {
  StylePanel: CustomStylePanel
}

export default function App() {
  const [activeWhiteboardId, setActiveWhiteboardId] = useState<string | null>(null)

  useEffect(() => {
    async function initialize() {
      try {
        const response = await fetch('/api/whiteboards')
        const data = await response.json()
        
        if (data.whiteboards && data.whiteboards.length > 0) {
          setActiveWhiteboardId(data.whiteboards[0].id)
        } else {
          const createResponse = await fetch('/api/whiteboards', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: 'My First Whiteboard' })
          })
          const result = await createResponse.json()
          if (result.success) {
            setActiveWhiteboardId(result.id)
          }
        }
      } catch (error) {
        console.error('Failed to initialize:', error)
      }
    }
    
    initialize()
  }, [])

  return (
    <div style={{ position: 'fixed', inset: 0, display: 'flex' }}>
      <Sidebar
        activeWhiteboardId={activeWhiteboardId}
        onSelectWhiteboard={setActiveWhiteboardId}
        onCreateWhiteboard={(name) => {}}
        onDeleteWhiteboard={(id) => {}}
      />
      <div style={{ flex: 1 }}>
        {activeWhiteboardId ? (
          <Tldraw components={components}>
            <PersistenceManager whiteboardId={activeWhiteboardId} />
            <SwappedZoomPanHandler />
            <RightClickPanHandler />
            <CustomShapeRenderer />
          </Tldraw>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
            <p>Loading...</p>
          </div>
        )}
      </div>
    </div>
  )
}
