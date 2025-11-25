import { useEditor } from 'tldraw'
import { useEffect } from 'react'

export function RightClickPanHandler() {
  const editor = useEditor()

  useEffect(() => {
    const container = editor.getContainer()
    
    // State tracking
    let startX = 0
    let startY = 0
    let lastX = 0
    let lastY = 0
    let isPanning = false
    let previousTool = 'select'
    let didDrag = false
    
    const DRAG_THRESHOLD = 5 // pixels

    function onPointerDown(e: PointerEvent) {
      if (e.button !== 2) return

      startX = e.clientX
      startY = e.clientY
      lastX = e.clientX
      lastY = e.clientY
      isPanning = false
      didDrag = false

      // MIRO STYLE: Block tldraw from seeing the down event.
      // We will decide on 'up' whether to show menu or not.
      e.stopPropagation()
    }

    function onPointerMove(e: PointerEvent) {
      if (!(e.buttons & 2)) {
        if (isPanning) {
          stopPanning()
        }
        return
      }
      
      const dx = e.clientX - startX
      const dy = e.clientY - startY
      const distance = Math.hypot(dx, dy)
      
      // Start panning if threshold exceeded
      if (!isPanning && distance > DRAG_THRESHOLD) {
        isPanning = true
        didDrag = true
        previousTool = editor.getCurrentToolId()
        
        // SAFETY: Dispatch ESC in case a menu opened despite our block
        const escEvent = new KeyboardEvent('keydown', {
          key: 'Escape',
          code: 'Escape',
          keyCode: 27,
          bubbles: true,
          cancelable: true
        })
        document.dispatchEvent(escEvent)
        
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
        // Block tldraw from seeing pan movements
        e.stopPropagation()
      }
    }

    function stopPanning() {
      isPanning = false
      editor.setCurrentTool(previousTool)
      editor.setCursor({ type: 'default', rotation: 0 })
    }

    function onPointerUp(e: PointerEvent) {
      if (e.button !== 2) return

      if (isPanning) {
        stopPanning()
        e.stopPropagation()
        
        // USER REQUEST: Dispatch ESC on release to ensure menu is gone
        const escEvent = new KeyboardEvent('keydown', {
          key: 'Escape',
          code: 'Escape',
          keyCode: 27,
          bubbles: true,
          cancelable: true
        })
        document.dispatchEvent(escEvent)
        
        return
      }

      // If we didn't pan, this was a click!
      // Since we blocked pointerdown, tldraw didn't see it.
      // We now need to trigger the context menu.
      
      // Dispatch a synthetic contextmenu event
      const contextMenuEvent = new MouseEvent('contextmenu', {
        bubbles: true,
        cancelable: true,
        view: window,
        button: 2,
        buttons: 0,
        clientX: e.clientX,
        clientY: e.clientY
      })
      e.target?.dispatchEvent(contextMenuEvent)
    }

    function onContextMenu(e: MouseEvent) {
      // If we dragged, block the native menu
      if (didDrag) {
        e.preventDefault()
        e.stopPropagation()
        return
      }
      
      // If we didn't drag, this is either a native event or our synthetic one.
      // We want tldraw to handle it.
      // Tldraw listens to 'contextmenu' to show its menu.
      // So we just let it bubble.
    }

    // Listen in CAPTURE phase for down/move/up to intercept before tldraw
    container.addEventListener('pointerdown', onPointerDown, true)
    container.addEventListener('pointermove', onPointerMove, true)
    container.addEventListener('pointerup', onPointerUp, true)
    // Listen in CAPTURE phase for contextmenu to block if dragged
    container.addEventListener('contextmenu', onContextMenu, true)

    return () => {
      container.removeEventListener('pointerdown', onPointerDown, true)
      container.removeEventListener('pointermove', onPointerMove, true)
      container.removeEventListener('pointerup', onPointerUp, true)
      container.removeEventListener('contextmenu', onContextMenu, true)
    }
  }, [editor])

  return null
}
