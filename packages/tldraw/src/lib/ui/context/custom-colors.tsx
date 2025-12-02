import { TLDefaultColorStyle } from '@tldraw/editor'
import { ReactNode, createContext, useContext } from 'react'
import { useCustomColors } from '../hooks/useCustomColors'

export interface CustomColorContextType {
	updateColor: (colorName: TLDefaultColorStyle, lightColor: string, darkColor: string) => void
	resetToDefaults: () => void
	saveAsDefaultPalette: () => void
	getColor: (colorName: TLDefaultColorStyle, isDarkMode: boolean) => string | undefined
}

const CustomColorContext = createContext<CustomColorContextType | null>(null)

export function CustomColorProvider({ children }: { children: ReactNode }) {
	const colorManager = useCustomColors()

	return <CustomColorContext.Provider value={colorManager}>{children}</CustomColorContext.Provider>
}

export function useCustomColorContext() {
	const ctx = useContext(CustomColorContext)
	// Return undefined if not in provider (optional usage)
	return ctx ?? undefined
}
