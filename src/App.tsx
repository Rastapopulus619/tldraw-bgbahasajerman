import { Tldraw, useEditor, TLComponents, DefaultStylePanel, TLUiStylePanelProps, DefaultStylePanelContent } from 'tldraw'
import 'tldraw/tldraw.css'
import { useEffect, useState } from 'react'
import FileExplorer from './components/FileExplorer'
import { CustomColorPicker } from './components/CustomColorPicker'
import { CustomShapeRenderer } from './components/CustomShapeRenderer'
import { RightClickPanHandler } from './components/RightClickPanHandler'
import { useUserPreferences } from './hooks/useUserPreferences'

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

function PersistenceManager({ whiteboardPath }: { whiteboardPath: string | null }) {
  const editor = useEditor()

  useEffect(() => {
    if (!whiteboardPath) return

    async function loadData() {
      try {
        const response = await fetch(`/api/whiteboards/${whiteboardPath}`)
        const data = await response.json()
        
        if (data && Object.keys(data).length > 0) {
          editor.loadSnapshot(data)
          console.log(`Loaded whiteboard: ${whiteboardPath}`)
        } else {
          editor.selectAll()
          editor.deleteShapes(editor.getSelectedShapeIds())
        }
      } catch (error) {
        console.error('Failed to load whiteboard:', error)
      }
    }
    
    loadData()
  }, [editor, whiteboardPath])

  useEffect(() => {
    if (!whiteboardPath) return

    let timeoutId: ReturnType<typeof setTimeout>
    let isSaving = false

    const handleChange = () => {
      if (isSaving) return
      
      clearTimeout(timeoutId)
      timeoutId = setTimeout(async () => {
        isSaving = true
        try {
          const snapshot = editor.getSnapshot()
          await fetch(`/api/whiteboards/${whiteboardPath}`, {
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
      }, 2500)
    }

    const unsubscribe = editor.store.listen(handleChange, { source: 'user' })
    return () => {
      clearTimeout(timeoutId)
      unsubscribe()
    }
  }, [editor, whiteboardPath])

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
  const { preferences, setLastOpened, setDefaultBoard, getStartupBoard } = useUserPreferences();
  const [activeWhiteboardPath, setActiveWhiteboardPath] = useState<string | null>(null);

  // Auto-load startup board on mount
  useEffect(() => {
    const startupBoard = getStartupBoard();
    if (startupBoard) {
      setActiveWhiteboardPath(startupBoard);
    }
  }, []); // Empty deps - only run once on mount

  // Track last opened board when user switches
  useEffect(() => {
    if (activeWhiteboardPath) {
      setLastOpened(activeWhiteboardPath);
    }
  }, [activeWhiteboardPath, setLastOpened]);

  return (
    <div style={{ position: 'fixed', inset: 0, display: 'flex' }}>
      <FileExplorer
        currentPath={activeWhiteboardPath || ''}
        onSelectFile={setActiveWhiteboardPath}
        onSetDefaultBoard={setDefaultBoard}
        defaultBoard={preferences.defaultWhiteboard}
      />
      <div style={{ flex: 1 }}>
        {activeWhiteboardPath ? (
          <Tldraw components={components} key={activeWhiteboardPath}>
            <PersistenceManager whiteboardPath={activeWhiteboardPath} />
            <SwappedZoomPanHandler />
            <RightClickPanHandler />
            <CustomShapeRenderer />
          </Tldraw>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', flexDirection: 'column', color: '#666' }}>
            <h2>Select a whiteboard to start</h2>
            <p>Use the explorer on the left to create or open a file.</p>
          </div>
        )}
      </div>
    </div>
  )
}
