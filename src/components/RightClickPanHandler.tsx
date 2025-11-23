import { useEditor } from 'tldraw'
import { useEffect } from 'react'

export function RightClickPanHandler() {
  const editor = useEditor()

  useEffect(() => {
    const container = editor.getContainer()
    
    // State tracking
    let startX = 0
    let startY = 0
    let startTime = 0
    let lastX = 0
    let lastY = 0
    let isPanning = false
    let previousTool = 'select'
    
    const DRAG_THRESHOLD = 5 // pixels
    const CLICK_TIME_THRESHOLD = 200 // milliseconds

    function onPointerDown(e: PointerEvent) {
      if (e.button === 2) { // Right mouse button
        startX = e.clientX
        startY = e.clientY
        lastX = e.clientX
        lastY = e.clientY
        startTime = Date.now()
        isPanning = false
        
        // Prevent default context menu from showing immediately
        e.preventDefault()
        e.stopPropagation()
        
        try {
          container.setPointerCapture(e.pointerId)
        } catch (err) {
          // Ignore capture errors
        }
      }
    }

    function onPointerMove(e: PointerEvent) {
      if (!(e.buttons & 2)) {
        // Right button not pressed - stop panning if active
        if (isPanning) {
          isPanning = false
          editor.setCurrentTool(previousTool)
          editor.setCursor({ type: 'default', rotation: 0 })
        }
        return
      }
      
      const dx = e.clientX - startX
      const dy = e.clientY - startY
      const distance = Math.hypot(dx, dy)
      
      // Start panning if threshold exceeded
      if (!isPanning && distance > DRAG_THRESHOLD) {
        isPanning = true
        previousTool = editor.getCurrentToolId()
        editor.setCurrentTool('hand')
        editor.setCursor({ type: 'grabbing', rotation: 0 })
      }
      
      if (isPanning) {
        // Perform actual panning
        const deltaX = e.clientX - lastX
        const deltaY = e.clientY - lastY
        lastX = e.clientX
        lastY = e.clientY
        
        const { x, y, z } = editor.getCamera()
        editor.setCamera({
          x: x + deltaX / z,
          y: y + deltaY / z,
          z,
        })
        e.stopPropagation()
      }
    }

    function onPointerUp(e: PointerEvent) {
      if (e.button === 2) {
        const duration = Date.now() - startTime
        const dx = e.clientX - startX
        const dy = e.clientY - startY
        const distance = Math.hypot(dx, dy)
        
        try {
          container.releasePointerCapture(e.pointerId)
        } catch (err) {
          // Ignore
        }
        
        if (isPanning) {
          // Was panning - restore tool
          editor.setCurrentTool(previousTool)
          editor.setCursor({ type: 'default', rotation: 0 })
          isPanning = false
          
          // Suppress context menu
          e.preventDefault()
          e.stopPropagation()
        } else if (duration < CLICK_TIME_THRESHOLD && distance < DRAG_THRESHOLD) {
          // Was a CLICK - manually trigger context menu
          
          // 1. Handle selection
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
          
          // 2. Allow context menu to show naturally
          // We do this by NOT calling preventDefault/stopPropagation
          // The browser will fire the contextmenu event, which Tldraw will handle
        } else {
          // Ambiguous case - suppress menu
          e.preventDefault()
          e.stopPropagation()
        }
      }
    }

    function onContextMenu(e: MouseEvent) {
      // Always prevent the default browser menu
      // Tldraw will show its own if appropriate
      if (isPanning) {
        e.preventDefault()
        e.stopPropagation()
      }
    }

    // Use capture phase to intercept before Tldraw
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
