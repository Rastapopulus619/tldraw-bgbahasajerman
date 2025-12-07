import { useCallback, useState } from 'react'
import { createTLStore, loadSnapshot, TLStore } from 'tldraw'
import { BoardFile } from '../types'

export function useWhiteboardLoader() {
	const [store, setStore] = useState<TLStore | null>(null)
	const [isLoading, setIsLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)
	const [currentBoardId, setCurrentBoardId] = useState<string | null>(null)

	const loadWhiteboard = useCallback(async (whiteboardId: string) => {
		try {
			setIsLoading(true)
			setError(null)

			// Fetch whiteboard data from server (using query parameter for nested paths)
			const response = await fetch(`/api/whiteboards/load?id=${encodeURIComponent(whiteboardId)}`)
			const result = await response.json()

			if (!result.success) {
				throw new Error(result.error || 'Failed to load whiteboard')
			}

			const boardData: BoardFile = result.data

			// Create new store
			const newStore = createTLStore({})

			// Load snapshot into store
			loadSnapshot(newStore, boardData.tldrawSnapshot)

			// TODO Phase 3.5: Apply color palette from boardData.metadata.colorPalette

			// Set the new store
			setStore(newStore)
			setCurrentBoardId(whiteboardId)

			console.log('✅ Loaded whiteboard:', whiteboardId)
		} catch (err) {
			console.error('Error loading whiteboard:', err)
			setError(err instanceof Error ? err.message : 'Unknown error')

			// Fall back to default board on error
			if (whiteboardId !== 'welcome.tldr') {
				console.log('Falling back to welcome.tldr')
				loadWhiteboard('welcome.tldr')
			}
		} finally {
			setIsLoading(false)
		}
	}, [])

	return {
		store,
		isLoading,
		error,
		currentBoardId,
		loadWhiteboard,
	}
}
