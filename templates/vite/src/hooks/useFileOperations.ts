import { useCallback, useState } from 'react'

export function useFileOperations(onRefresh: () => void) {
	const [clipboard, setClipboard] = useState<{ path: string; operation: 'copy' | 'cut' } | null>(
		null
	)

	const rename = useCallback(
		async (oldPath: string, newName: string) => {
			try {
				const response = await fetch('/api/files/rename', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ oldPath, newName }),
				})

				const result = await response.json()

				if (!result.success) {
					throw new Error(result.error)
				}

				onRefresh()
			} catch (error) {
				const message = error instanceof Error ? error.message : 'Failed to rename file'
				alert(`Rename failed: ${message}`)
				throw error
			}
		},
		[onRefresh]
	)

	const deleteFile = useCallback(
		async (pathToDelete: string) => {
			// Special protection for welcome.tldr
			if (pathToDelete === 'welcome.tldr') {
				alert('Cannot delete welcome.tldr - this is the default fallback board')
				return
			}

			// Regular confirmation
			if (!confirm(`Are you sure you want to delete "${pathToDelete}"?`)) {
				return
			}

			try {
				const response = await fetch('/api/files', {
					method: 'DELETE',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ path: pathToDelete }),
				})

				const result = await response.json()

				if (!result.success) {
					throw new Error(result.error)
				}

				onRefresh()
			} catch (error) {
				const message = error instanceof Error ? error.message : 'Failed to delete file'
				alert(`Delete failed: ${message}`)
			}
		},
		[onRefresh]
	)

	const copy = useCallback((path: string) => {
		setClipboard({ path, operation: 'copy' })
		console.log('Copied:', path)
	}, [])

	const cut = useCallback((path: string) => {
		setClipboard({ path, operation: 'cut' })
		console.log('Cut:', path)
	}, [])

	const paste = useCallback(
		async (destinationPath: string) => {
			if (!clipboard) return

			try {
				const endpoint = clipboard.operation === 'copy' ? '/api/files/copy' : '/api/files/move'
				const response = await fetch(endpoint, {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({
						sourcePath: clipboard.path,
						destinationPath,
					}),
				})

				const result = await response.json()

				if (!result.success) {
					throw new Error(result.error)
				}

				// Clear clipboard if cut
				if (clipboard.operation === 'cut') {
					setClipboard(null)
				}

				onRefresh()
			} catch (error) {
				const message = error instanceof Error ? error.message : 'Failed to paste file'
				alert(`Paste failed: ${message}`)
			}
		},
		[clipboard, onRefresh]
	)

	return {
		rename,
		deleteFile,
		copy,
		cut,
		paste,
		clipboard,
	}
}
