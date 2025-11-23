import { useEditor, TLShapeId } from 'tldraw'
import { useEffect } from 'react'

export function RightClickPanHandler() {
  const editor = useEditor()

  useEffect(() => {
    const container = editor.getContainer()
    let isPanning = false
    let preventContextMenu = false
    let lastX = 0
    let lastY = 0
    let startX = 0
    let startY = 0
    let previousTool = 'select'
    let previousSelection: TLShapeId[] = []
    const DRAG_THRESHOLD = 5

    function onPointerDown(e: PointerEvent) {
      if (e.button === 2) { // Right click
        preventContextMenu = false
        lastX = e.clientX
        lastY = e.clientY
        startX = e.clientX
        startY = e.clientY
        
        // Capture selection state BEFORE tldraw processes the click
        previousSelection = editor.getSelectedShapeIds()
        
        // Stop propagation immediately to prevent Tldraw from seeing the right click
        // This prevents the context menu from appearing on mouse down
        e.preventDefault()
        e.stopPropagation()
        
        try {
            container.setPointerCapture(e.pointerId)
        } catch (err) {
            // Ignore if capture fails
        }
      }
    }

    function onPointerMove(e: PointerEvent) {
      // Check if right button is held down (buttons bitmask 2)
      if (!(e.buttons & 2)) {
        if (isPanning) {
            stopPanning(e)
        }
        return
      }

      // If not yet panning, check threshold
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
        e.stopPropagation() // Prevent tldraw from handling this move
      }
    }

    function startPanning(e: PointerEvent) {
        isPanning = true
        preventContextMenu = true
        
        // Revert selection to what it was before the right-click
        // Since we stopped propagation on pointer down, selection might not have changed anyway,
        // but this is safe to keep.
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
        if (isPanning) {
            // Panning was active
            stopPanning(e)
            e.stopPropagation() // Prevent context menu
        } else {
            // Normal click (didn't move enough to start panning)
            // We stopped propagation on pointer down, so Tldraw didn't see the click.
            // We need to manually trigger the selection logic and then the context menu.
            
            // 1. Handle Selection
            const pagePoint = editor.screenToPage({ x: e.clientX, y: e.clientY })
            const shape = editor.getShapeAtPoint(pagePoint)
            
            if (shape) {
                // If the shape is already selected, keep the selection (don't deselect others)
                // If it's not selected, select it (and deselect others)
                const currentSelection = editor.getSelectedShapeIds()
                if (!currentSelection.includes(shape.id)) {
                    editor.setSelectedIds([shape.id])
                }
            } else {
                // Clicked on empty space -> Deselect all
                editor.setSelectedIds([])
            }
            
            // 2. Trigger Context Menu
            // We need to dispatch a contextmenu event that Tldraw will see.
            // Since we are in the capture phase of pointerup, we can dispatch a new event on the target.
            // We need to make sure we don't block it ourselves.
            
            // We need to find the actual target element to dispatch to, 
            // because dispatching on container might not be enough if Tldraw checks target.
            // But since we have pointer capture, e.target is container.
            // We can try dispatching on the container.
            
            const contextMenuEvent = new MouseEvent('contextmenu', {
                bubbles: true,
                cancelable: true,
                view: window,
                button: 2,
                buttons: 0,
                clientX: e.clientX,
                clientY: e.clientY,
                screenX: e.screenX,
                screenY: e.screenY,
            });
            
            // Ensure our own listener doesn't block this
            preventContextMenu = false;
            
            // Dispatch on the container (or e.target if we didn't have capture, but we do)
            // Tldraw likely listens on the container or window.
            e.target?.dispatchEvent(contextMenuEvent);
        }
        
        try {
            container.releasePointerCapture(e.pointerId)
        } catch (err) {
            // Ignore
        }
    }
    }

    function onContextMenu(e: MouseEvent) {
      if (preventContextMenu) {
        e.preventDefault()
        e.stopPropagation()
        preventContextMenu = false
      }
      // If not preventing, let it bubble to Tldraw
    }

    // Use capture phase to intercept events before Tldraw
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
