import { useEffect } from 'react'
import { useIsDarkMode } from 'tldraw'

interface TldrawWrapperProps {
	onThemeChange: (isDark: boolean) => void
}

/**
 * Wrapper component inside Tldraw that detects theme changes
 * and notifies the parent component
 */
export function TldrawWrapper({ onThemeChange }: TldrawWrapperProps) {
	const isDarkMode = useIsDarkMode()

	useEffect(() => {
		onThemeChange(isDarkMode)
	}, [isDarkMode, onThemeChange])

	return null // This component just monitors theme, doesn't render anything
}
