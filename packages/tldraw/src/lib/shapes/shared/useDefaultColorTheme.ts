import {
	DefaultColorThemePalette,
	TLDefaultColorStyle,
	TLDefaultColorTheme,
	useIsDarkMode,
} from '@tldraw/editor'
import { useMemo } from 'react'
import { useCustomColorContext } from '../../ui/context/custom-colors'

/**
 * Hook that returns the color theme with custom colors applied
 * Merges custom colors from files with the default theme
 * @public
 */
export function useDefaultColorTheme(): TLDefaultColorTheme {
	const isDarkMode = useIsDarkMode()
	const colorManager = useCustomColorContext()

	return useMemo(() => {
		// Get base theme
		const baseTheme = isDarkMode
			? DefaultColorThemePalette.darkMode
			: DefaultColorThemePalette.lightMode

		// If no color manager, return base theme
		if (!colorManager) {
			return baseTheme
		}

		// Clone the base theme
		const customTheme = { ...baseTheme }

		// Override colors with custom values
		const colorNames: TLDefaultColorStyle[] = [
			'color1_R1C1',
			'color2_R1C2',
			'color3_R1C3',
			'color4_R1C4',
			'color5_R2C1',
			'color6_R2C2',
			'color7_R2C3',
			'color8_R2C4',
			'color9_R3C1',
			'color10_R3C2',
			'color11_R3C3',
			'color12_R3C4',
			'color13_R4C1',
			'color14_R4C2',
			'color15_R4C3',
			'color16_R4C4',
			'color17_R5C1',
			'color18_R5C2',
			'color19_R5C3',
			'color20_R5C4',
			'color21_R6C1',
			'color22_R6C2',
			'color23_R6C3',
			'color24_R6C4',
			'color25_R7C1',
			'color26_R7C2',
			'color27_R7C3',
			'color28_R7C4',
		]

		for (const colorName of colorNames) {
			const customColor = colorManager.getColor(colorName, isDarkMode)
			if (customColor && customTheme[colorName]) {
				// Override the solid color (main color used for shapes)
				customTheme[colorName] = {
					...customTheme[colorName],
					solid: customColor,
					fill: customColor,
				}
			}
		}

		return customTheme
	}, [isDarkMode, colorManager])
}
