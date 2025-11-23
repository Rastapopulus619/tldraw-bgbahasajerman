import { useEditor, TLShapeId } from 'tldraw'
import { useEffect } from 'react'

export function RightClickPanHandler() {
  const editor = useEditor()

  useEffect(() => {
    const container = editor.getContainer()
    let isPanning = false
    let didPan = false
    let lastX = 0
    let lastY = 0
    let startX = 0
    let startY = 0
    let previousTool = 'select'
    let previousSelection: TLShapeId[] = []
    const DRAG_THRESHOLD = 5

    function onPointerDown(e: PointerEvent) {
      if (e.button === 2) { // Right click
        didPan = false
        lastX = e.clientX
        lastY = e.clientY
        startX = e.clientX
        startY = e.clientY
        
        previousSelection = editor.getSelectedShapeIds()
        
        // STOP PROPAGATION: Prevent Tldraw from seeing the "down" event (no immediate selection/menu).
        e.stopPropagation()
        
        // DO NOT PREVENT DEFAULT: We need the browser to schedule the 'contextmenu' event.
        // e.preventDefault() <--- REMOVED
        
        try {
            container.setPointerCapture(e.pointerId)
        } catch (err) {
            // Ignore
        }
      }
    }

    function onPointerMove(e: PointerEvent) {
      if (!(e.buttons & 2)) {
        if (isPanning) {
            stopPanning(e)
        }
        return
      }

      if (!isPanning) {
        const dist = Math.hypot(e.clientX - startX, e.clientY - startY)
        if (dist > DRAG_THRESHOLD) {
          startPanning(e)
        }
      }

      if (isPanning) {
        const dx = e.clientX - lastX
        const dy = e.clientY - lastY
        lastX = e.clientX
        lastY = e.clientY

        const { x, y, z } = editor.getCamera()
        editor.setCamera({
          x: x + dx / z,
          y: y + dy / z,
          z,
        })
        e.stopPropagation()
      }
    }

    function startPanning(e: PointerEvent) {
        isPanning = true
        didPan = true
        editor.setSelectedIds(previousSelection)
        previousTool = editor.getCurrentToolId()
        editor.setCurrentTool('hand')
        editor.setCursor({ type: 'grabbing', rotation: 0 })
    }

    function stopPanning(e: PointerEvent) {
        isPanning = false
        try {
            container.releasePointerCapture(e.pointerId)
        } catch (err) {
            // Ignore
        }
        editor.setCurrentTool(previousTool)
        editor.setCursor({ type: 'default', rotation: 0 })
    }

    function onPointerUp(e: PointerEvent) {
      if (e.button === 2) {
        e.stopPropagation() // Always hide the UP event from Tldraw to avoid confusion

        if (isPanning) {
            stopPanning(e)
        } else {
            // IT WAS A CLICK
            
            // 1. Release capture so browser knows where the click happened
            try {
                container.releasePointerCapture(e.pointerId)
            } catch (err) {
                // Ignore
            }

            // 2. Manually Handle Selection
            // Since we hid pointerdown, Tldraw doesn't know what we clicked.
            // We must select it now, BEFORE the contextmenu event fires.
            const pagePoint = editor.screenToPage({ x: e.clientX, y: e.clientY })
            const shape = editor.getShapeAtPoint(pagePoint)
            
            if (shape) {
                const currentSelection = editor.getSelectedShapeIds()
                if (!currentSelection.includes(shape.id)) {
                    editor.setSelectedIds([shape.id])
                }
            } else {
                editor.setSelectedIds([])
            }
            
            // 3. DO NOTHING ELSE
            // The browser will now fire the native 'contextmenu' event.
            // Our onContextMenu handler will see it.
        }
      }
    }

    function onContextMenu(e: MouseEvent) {
      if (didPan) {
        // If we dragged, KILL the menu.
        e.preventDefault()
        e.stopPropagation()
        didPan = false // Reset
      }
      // If we didn't drag (didPan is false), we let the event pass.
      // Tldraw will receive it, see the selection we just set in onPointerUp, and show the menu.
    }

    container.addEventListener('pointerdown', onPointerDown, { capture: true })
    container.addEventListener('pointermove', onPointerMove, { capture: true })
    container.addEventListener('pointerup', onPointerUp, { capture: true })
    container.addEventListener('contextmenu', onContextMenu, { capture: true })

    return () => {
      container.removeEventListener('pointerdown', onPointerDown, { capture: true })
      container.removeEventListener('pointermove', onPointerMove, { capture: true })
      container.removeEventListener('pointerup', onPointerUp, { capture: true })
      container.removeEventListener('contextmenu', onContextMenu, { capture: true })
    }
  }, [editor])

  return null
}
