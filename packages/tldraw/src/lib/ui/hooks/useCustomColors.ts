import { TLDefaultColorStyle } from '@tldraw/editor'
import { useEffect, useState } from 'react'

const API_BASE = 'http://localhost:3001/api'

export interface CustomColorData {
	light: string
	dark: string
}

export type CustomColorsMap = Partial<Record<TLDefaultColorStyle, CustomColorData>>

/**
 * Fetch custom colors from the server
 */
async function fetchCustomColors(): Promise<CustomColorsMap> {
	try {
		const response = await fetch(`${API_BASE}/colors/custom`)
		if (!response.ok) throw new Error('Failed to fetch custom colors')
		return await response.json()
	} catch (error) {
		console.error('Error fetching custom colors:', error)
		return {}
	}
}

/**
 * Save custom colors to the server
 */
async function saveCustomColors(colors: CustomColorsMap): Promise<void> {
	try {
		const response = await fetch(`${API_BASE}/colors/custom`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(colors),
		})
		if (!response.ok) throw new Error('Failed to save custom colors')
	} catch (error) {
		console.error('Error saving custom colors:', error)
		throw error
	}
}

/**
 * Reset to default colors
 */
async function resetToDefaults(): Promise<void> {
	try {
		const response = await fetch(`${API_BASE}/colors/reset`, {
			method: 'POST',
		})
		if (!response.ok) throw new Error('Failed to reset colors')
	} catch (error) {
		console.error('Error resetting colors:', error)
		throw error
	}
}

/**
 * Save current colors as default
 */
async function saveAsDefaultPalette(): Promise<void> {
	try {
		const response = await fetch(`${API_BASE}/colors/save-as-default`, {
			method: 'POST',
		})
		if (!response.ok) throw new Error('Failed to save as default')
	} catch (error) {
		console.error('Error saving as default:', error)
		throw error
	}
}

/**
 * Hook to manage custom color palette
 */
export function useCustomColors() {
	const [customColors, setCustomColors] = useState<CustomColorsMap>({})
	const [loading, setLoading] = useState(true)

	// Load colors from server on mount
	useEffect(() => {
		fetchCustomColors().then((colors) => {
			setCustomColors(colors)
			setLoading(false)
		})
	}, [])

	const updateColor = async (
		colorName: TLDefaultColorStyle,
		lightColor: string,
		darkColor: string
	) => {
		const updatedColors = {
			...customColors,
			[colorName]: { light: lightColor, dark: darkColor },
		}
		setCustomColors(updatedColors)

		// Save to server
		try {
			await saveCustomColors(updatedColors)
		} catch (error) {
			console.error('Failed to save color update:', error)
		}
	}

	const resetColors = async () => {
		await resetToDefaults()
		// Reload colors from server
		const colors = await fetchCustomColors()
		setCustomColors(colors)
	}

	const saveAsDefault = async () => {
		await saveAsDefaultPalette()
	}

	const getColor = (colorName: TLDefaultColorStyle, isDarkMode: boolean): string | undefined => {
		const customColor = customColors[colorName]
		if (customColor) {
			return isDarkMode ? customColor.dark : customColor.light
		}
		return undefined
	}

	return {
		customColors,
		loading,
		updateColor,
		resetToDefaults: resetColors,
		saveAsDefaultPalette: saveAsDefault,
		getColor,
	}
}
