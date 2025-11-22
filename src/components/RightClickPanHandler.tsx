import { useEditor } from 'tldraw'
import { useEffect } from 'react'

export function RightClickPanHandler() {
  const editor = useEditor()

  useEffect(() => {
    const container = editor.getContainer()
    let isPanning = false
    let lastX = 0
    let lastY = 0
    let startX = 0
    let startY = 0
    let previousTool = 'select'
    const DRAG_THRESHOLD = 5

    function onPointerDown(e: PointerEvent) {
      if (e.button === 2) { // Right click
        lastX = e.clientX
        lastY = e.clientY
        startX = e.clientX
        startY = e.clientY
        // Do not stop propagation yet, allow potential context menu
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
        container.setPointerCapture(e.pointerId)
        previousTool = editor.getCurrentToolId()
        editor.setCurrentTool('hand')
        editor.setCursor({ type: 'grabbing', rotation: 0 })
    }

    function stopPanning(e: PointerEvent) {
        isPanning = false
        container.releasePointerCapture(e.pointerId)
        editor.setCurrentTool(previousTool)
        editor.setCursor({ type: 'default', rotation: 0 })
    }

    function onPointerUp(e: PointerEvent) {
      if (e.button === 2) {
        if (isPanning) {
          stopPanning(e)
          e.stopPropagation() // Prevent context menu
        }
      }
    }

    function onContextMenu(e: MouseEvent) {
      if (isPanning) {
        e.preventDefault()
        e.stopPropagation()
      }
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
