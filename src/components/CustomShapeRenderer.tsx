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
    const MIN_UPDATE_INTERVAL = 100 // ms - only update every 100ms max during active drawing
    
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
        // Enough time has passed, update immediately
        updateStyles()
        if (updateTimeout) {
          clearTimeout(updateTimeout)
          updateTimeout = null
        }
      } else {
        // Too soon, schedule for later
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
    
    // Listen for shape changes ONLY (not pointer/camera changes)
    const unsubscribe = editor.store.listen((entry) => {
      // Only update if shapes were actually added, removed, or their metadata changed
      if (entry.changes.added || entry.changes.removed || 
          Object.keys(entry.changes.updated).some(key => {
            const [type] = key.split(':')
            return type === 'shape'
          })) {
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
    const handleShapeCreate = () => {
      const customColor = (editor as any)._customHexColor
      if (customColor) {
        // Wait for next tick to ensure shape is created
        setTimeout(() => {
          const allShapes = editor.getCurrentPageShapes()
          const newShapes = allShapes.slice(-5) // Check last 5 shapes for newly created ones
          
          newShapes.forEach(shape => {
            if (!shape.meta?.customColor) {
              editor.updateShapes([{
                id: shape.id,
                type: shape.type,
                meta: {
                  ...shape.meta,
                  customColor: customColor
                }
              }])
            }
          })
        }, 10)
      }
    }
    
    const unsubscribe = editor.store.listen(handleShapeCreate, { source: 'user' })
    
    return () => {
      unsubscribe()
    }
  }, [editor])
  
  return null
})
