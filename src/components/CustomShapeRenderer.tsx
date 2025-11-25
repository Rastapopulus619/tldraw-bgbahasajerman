import { useEditor, track } from 'tldraw'
import { useEffect } from 'react'

// This component applies custom colors to shapes via CSS injection
export const CustomShapeRenderer = track(() => {
  const editor = useEditor()
  
  useEffect(() => {
    // Create a style element for custom colors
    const styleEl = document.createElement('style')
    styleEl.id = 'custom-shape-colors'
    document.head.appendChild(styleEl)
    
    // Track last update time to throttle updates during drawing
    let lastUpdateTime = 0
    let updateTimeout: ReturnType<typeof setTimeout> | null = null
    const MIN_UPDATE_INTERVAL = 100 // ms
    
    // Update styles when shapes change
    const updateStyles = () => {
      const shapes = editor.getCurrentPageShapes()
      const cssRules: string[] = []
      
      shapes.forEach(shape => {
        const customColor = (shape.meta as any)?.customColor
        if (customColor && typeof customColor === 'string') {
          // For draw shapes with "draw" dash style - apply both stroke AND fill
          if (shape.type === 'draw' && (shape.props as any)?.dash === 'draw') {
            cssRules.push(`
              .tl-shape[data-shape-id="${shape.id}"] > svg > path {
                stroke: ${customColor} !important;
                fill: ${customColor} !important;
              }
            `)
          } else {
            // For all other shapes/dash styles - only apply stroke to paths
            cssRules.push(`
              .tl-shape[data-shape-id="${shape.id}"] > svg > path {
                stroke: ${customColor} !important;
              }
            `)
          }
          
          // Other shape elements
          cssRules.push(`
            .tl-shape[data-shape-id="${shape.id}"] rect,
            .tl-shape[data-shape-id="${shape.id}"] circle,
            .tl-shape[data-shape-id="${shape.id}"] ellipse,
            .tl-shape[data-shape-id="${shape.id}"] polygon,
            .tl-shape[data-shape-id="${shape.id}"] polyline,
            .tl-shape[data-shape-id="${shape.id}"] line {
              stroke: ${customColor} !important;
            }
            
            .tl-shape[data-shape-id="${shape.id}"][data-shape-type="geo"] path[fill],
            .tl-shape[data-shape-id="${shape.id}"][data-shape-type="geo"] rect[fill],
            .tl-shape[data-shape-id="${shape.id}"][data-shape-type="geo"] circle[fill],
            .tl-shape[data-shape-id="${shape.id}"][data-shape-type="geo"] ellipse[fill] {
              fill: ${customColor}80 !important;
            }
            
            .tl-shape[data-shape-id="${shape.id}"][data-shape-type="geo"] path[fill="none"] {
              fill: none !important;
            }
            
            .tl-shape[data-shape-id="${shape.id}"][data-shape-type="text"] .tl-text-content,
            .tl-shape[data-shape-id="${shape.id}"][data-shape-type="text"] .tl-text p {
              color: ${customColor} !important;
            }
            
            .tl-shape[data-shape-id="${shape.id}"][data-shape-type="arrow"] path,
            .tl-shape[data-shape-id="${shape.id}"][data-shape-type="arrow"] line,
            .tl-shape[data-shape-id="${shape.id}"][data-shape-type="arrow"] polygon {
              stroke: ${customColor} !important;
              fill: ${customColor} !important;
            }
          `)
        }
      })
      
      styleEl.textContent = cssRules.join('\n')
      lastUpdateTime = Date.now()
    }
    
    // Throttled update function
    const scheduleUpdate = () => {
      const now = Date.now()
      const timeSinceLastUpdate = now - lastUpdateTime
      
      if (timeSinceLastUpdate >= MIN_UPDATE_INTERVAL) {
        updateStyles()
        if (updateTimeout) {
          clearTimeout(updateTimeout)
          updateTimeout = null
        }
      } else {
        if (!updateTimeout) {
          updateTimeout = setTimeout(() => {
            updateStyles()
            updateTimeout = null
          }, MIN_UPDATE_INTERVAL - timeSinceLastUpdate)
        }
      }
    }
    
    // Initial update
    updateStyles()
    
    // Listen for shape changes
    const unsubscribe = editor.store.listen((entry) => {
      const { changes } = entry
      
      // Check for added/removed shapes
      const hasAddedOrRemoved = Object.keys(changes.added).length > 0 || Object.keys(changes.removed).length > 0
      
      // Check for updated shapes where customColor changed
      const hasColorChange = Object.values(changes.updated).some((update: any) => {
        const [from, to] = update
        return from.meta?.customColor !== to.meta?.customColor
      })

      if (hasAddedOrRemoved || hasColorChange) {
        scheduleUpdate()
      }
    }, { source: 'user', scope: 'document' })
    
    return () => {
      unsubscribe()
      if (updateTimeout) clearTimeout(updateTimeout)
      styleEl.remove()
    }
  }, [editor])
  
  // Also intercept shape creation to apply custom color from editor instance
  useEffect(() => {
    const handleShapeCreate = (entry: any) => {
      const { changes } = entry
      const addedShapes = Object.values(changes.added)
      
      if (addedShapes.length === 0) return

      const customColor = (editor as any)._customHexColor
      if (!customColor) return

      const shapesToUpdate: any[] = []
      
      addedShapes.forEach((shape: any) => {
        if (shape.typeName === 'shape' && !shape.meta?.customColor) {
           shapesToUpdate.push({
             id: shape.id,
             type: shape.type,
             meta: { ...shape.meta, customColor }
           })
        }
      })

      if (shapesToUpdate.length > 0) {
        editor.updateShapes(shapesToUpdate)
      }
    }
    
    const unsubscribe = editor.store.listen(handleShapeCreate, { source: 'user' })
    return () => {
      unsubscribe()
    }
  }, [editor])
  
  return null
})
