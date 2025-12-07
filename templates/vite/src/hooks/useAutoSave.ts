import { useEffect, useRef } from 'react'
import { Editor } from 'tldraw'

const AUTO_SAVE_DEBOUNCE_MS = 2000 // 2 seconds

/**
 * useAutoSave hook
 *
 * Listens to editor store changes and automatically saves to server
 * with 2-second debounce.
 *
 * @param editor - Tldraw editor instance
 * @param whiteboardId - Current whiteboard ID
 */
export function useAutoSave(editor: Editor | null, whiteboardId: string) {
	const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null)
	const lastSavedRef = useRef<string>('')

	useEffect(() => {
		if (!editor || !whiteboardId) return

		// Listen to store changes
		const unsubscribe = editor.store.listen(() => {
			// Clear existing timeout
			if (saveTimeoutRef.current) {
				clearTimeout(saveTimeoutRef.current)
			}

			// Set new timeout for auto-save
			saveTimeoutRef.current = setTimeout(async () => {
				try {
					const snapshot = editor.getSnapshot()
					const snapshotJson = JSON.stringify(snapshot)

					// Only save if changed
					if (snapshotJson === lastSavedRef.current) {
						return
					}

					lastSavedRef.current = snapshotJson

					// TODO: Get color palette from editor context
					// For Phase 1, we'll use empty palette
					const boardData = {
						tldrawSnapshot: snapshot,
						metadata: {
							colorPalette: {},
							createdAt: new Date().toISOString(),
							lastModified: new Date().toISOString(),
							boardName: whiteboardId,
						},
					}

					// Send to server (using query parameter for nested paths)
					const response = await fetch(
						`/api/whiteboards/save?id=${encodeURIComponent(whiteboardId)}`,
						{
							method: 'POST',
							headers: {
								'Content-Type': 'application/json',
							},
							body: JSON.stringify(boardData),
						}
					)

					if (!response.ok) {
						console.error('Auto-save failed:', await response.text())
					} else {
						console.log('Auto-saved:', whiteboardId)
					}
				} catch (error) {
					console.error('Auto-save error:', error)
				}
			}, AUTO_SAVE_DEBOUNCE_MS)
		})

		// Cleanup
		return () => {
			unsubscribe()
			if (saveTimeoutRef.current) {
				clearTimeout(saveTimeoutRef.current)
			}
		}
	}, [editor, whiteboardId])
}
