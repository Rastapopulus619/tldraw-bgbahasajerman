import { describe, expect, it, test } from 'vitest'
import {
	defaultColorNames,
	DefaultColorStyle,
	DefaultColorThemePalette,
	DefaultLabelColorStyle,
	getColorValue,
	getDefaultColorTheme,
	isDefaultThemeColor,
	TLDefaultColorStyle,
	TLDefaultColorThemeColor,
} from './TLColorStyle'

describe('TLColorStyle', () => {
	describe('defaultColorNames', () => {
		it('should contain expected default colors', () => {
			expect(defaultColorNames).toEqual([
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
			])
		})
	})

	describe('DefaultColorThemePalette', () => {
		it('should contain all default colors for both themes', () => {
			const lightTheme = DefaultColorThemePalette.lightMode
			const darkTheme = DefaultColorThemePalette.darkMode

			defaultColorNames.forEach((colorName) => {
				expect(lightTheme).toHaveProperty(colorName)
				expect(darkTheme).toHaveProperty(colorName)
			})
		})
	})

	describe('getDefaultColorTheme', () => {
		it('should return light theme when isDarkMode is false', () => {
			const result = getDefaultColorTheme({ isDarkMode: false })
			expect(result).toBe(DefaultColorThemePalette.lightMode)
		})

		it('should return dark theme when isDarkMode is true', () => {
			const result = getDefaultColorTheme({ isDarkMode: true })
			expect(result).toBe(DefaultColorThemePalette.darkMode)
		})
	})

	describe('DefaultColorStyle', () => {
		it('should validate all default color names', () => {
			defaultColorNames.forEach((color) => {
				expect(() => DefaultColorStyle.validate(color)).not.toThrow()
				expect(DefaultColorStyle.validate(color)).toBe(color)
			})
		})

		it('should reject invalid color names', () => {
			const invalidColors = ['invalid', 'color21_R6C1', 'color23_R6C3', 'color16_R4C4', '']

			invalidColors.forEach((color) => {
				expect(() => DefaultColorStyle.validate(color)).toThrow()
			})
		})
	})

	describe('DefaultLabelColorStyle', () => {
		it('should be a StyleProp with correct configuration', () => {
			expect(DefaultLabelColorStyle.id).toBe('tldraw:labelColor')
			expect(DefaultLabelColorStyle.defaultValue).toBe('color1_R1C1')
		})

		it('should validate all default color names', () => {
			defaultColorNames.forEach((color) => {
				expect(() => DefaultLabelColorStyle.validate(color)).not.toThrow()
				expect(DefaultLabelColorStyle.validate(color)).toBe(color)
			})
		})

		it('should reject invalid color names', () => {
			const invalidColors = ['invalid', 'color21_R6C1', 'color23_R6C3', 'color16_R4C4', '']

			invalidColors.forEach((color) => {
				expect(() => DefaultLabelColorStyle.validate(color)).toThrow()
			})
		})

		it('should have values property with all default colors', () => {
			expect(DefaultLabelColorStyle.values).toEqual(defaultColorNames)
		})

		it('should be separate from DefaultColorStyle', () => {
			expect(DefaultColorStyle.id).not.toBe(DefaultLabelColorStyle.id)
			expect(DefaultColorStyle).not.toBe(DefaultLabelColorStyle)
		})

		it('should allow different default values from DefaultColorStyle', () => {
			const originalColorDefault = DefaultColorStyle.defaultValue
			const originalLabelDefault = DefaultLabelColorStyle.defaultValue

			DefaultColorStyle.setDefaultValue('color12_R3C4')
			DefaultLabelColorStyle.setDefaultValue('color5_R2C1')

			expect(DefaultColorStyle.defaultValue).toBe('color12_R3C4')
			expect(DefaultLabelColorStyle.defaultValue).toBe('color5_R2C1')
			expect(DefaultColorStyle.defaultValue).not.toBe(DefaultLabelColorStyle.defaultValue)

			// Restore originals
			DefaultColorStyle.setDefaultValue(originalColorDefault)
			DefaultLabelColorStyle.setDefaultValue(originalLabelDefault)
		})
	})

	describe('isDefaultThemeColor', () => {
		it('should return true for all default color names', () => {
			defaultColorNames.forEach((color) => {
				expect(isDefaultThemeColor(color)).toBe(true)
			})
		})

		it('should return false for invalid color names', () => {
			const invalidColors = [
				'invalid',
				'color21_R6C1',
				'color23_R6C3',
				'color16_R4C4',
				'',
				'custom-color',
			]

			invalidColors.forEach((color) => {
				expect(isDefaultThemeColor(color as TLDefaultColorStyle)).toBe(false)
			})
		})

		it('should return false for hex colors', () => {
			const hexColors = ['#ff0000', '#00ff00', '#0000ff', '#ffffff', '#000000']

			hexColors.forEach((color) => {
				expect(isDefaultThemeColor(color as TLDefaultColorStyle)).toBe(false)
			})
		})

		it('should return false for CSS color names not in defaults', () => {
			// Use CSS color names that are NOT in the default color list
			const cssColors = ['aqua', 'fuchsia', 'color17_R5C1', 'navy', 'color28_R7C4']

			cssColors.forEach((color) => {
				expect(isDefaultThemeColor(color as TLDefaultColorStyle)).toBe(false)
			})
		})

		it('should handle edge cases', () => {
			expect(isDefaultThemeColor(null as any)).toBe(false)
			expect(isDefaultThemeColor(undefined as any)).toBe(false)
			expect(isDefaultThemeColor(123 as any)).toBe(false)
			expect(isDefaultThemeColor({} as any)).toBe(false)
		})

		it('should be case sensitive', () => {
			expect(isDefaultThemeColor('Black' as TLDefaultColorStyle)).toBe(false)
			expect(isDefaultThemeColor('RED' as TLDefaultColorStyle)).toBe(false)
			expect(isDefaultThemeColor('Blue' as TLDefaultColorStyle)).toBe(false)
		})

		it('should work as a type guard', () => {
			const color: TLDefaultColorStyle = 'color12_R3C4'

			if (isDefaultThemeColor(color)) {
				// TypeScript should narrow the type here
				expect(defaultColorNames.includes(color)).toBe(true)
			}
		})
	})

	describe('getColorValue', () => {
		const lightTheme = DefaultColorThemePalette.lightMode
		const darkTheme = DefaultColorThemePalette.darkMode

		it('should return correct color values for default colors', () => {
			expect(getColorValue(lightTheme, 'color12_R3C4', 'solid')).toBe('#e03131')
			expect(getColorValue(lightTheme, 'color5_R2C1', 'fill')).toBe('#4465e9')
			expect(getColorValue(lightTheme, 'color1_R1C1', 'solid')).toBe('#1d1d1d')
		})

		it('should work with different variants', () => {
			const variants: (keyof TLDefaultColorThemeColor)[] = [
				'solid',
				'semi',
				'pattern',
				'fill',
				'frameHeadingStroke',
				'frameHeadingFill',
				'frameStroke',
				'frameFill',
				'frameText',
				'noteFill',
				'noteText',
				'highlightSrgb',
				'highlightP3',
			]

			variants.forEach((variant) => {
				const result = getColorValue(lightTheme, 'color12_R3C4', variant)
				expect(typeof result).toBe('string')
				expect(result.length).toBeGreaterThan(0)
				expect(result).toBe(lightTheme.color12_R3C4[variant])
			})
		})

		it('should return different values for light and dark themes', () => {
			// Use colors/variants that actually differ between themes
			expect(getColorValue(lightTheme, 'color1_R1C1', 'solid')).not.toBe(
				getColorValue(darkTheme, 'color1_R1C1', 'solid')
			)
			expect(getColorValue(lightTheme, 'color13_R4C1', 'solid')).not.toBe(
				getColorValue(darkTheme, 'color13_R4C1', 'solid')
			)
		})

		it('should pass through non-default colors unchanged', () => {
			const customColors = ['#ff0000', '#00ff00', '#0000ff', 'custom-color', 'rgb(255, 0, 0)']

			customColors.forEach((color) => {
				expect(getColorValue(lightTheme, color as TLDefaultColorStyle, 'solid')).toBe(color)
				expect(getColorValue(darkTheme, color as TLDefaultColorStyle, 'fill')).toBe(color)
			})
		})

		it('should work with all default colors', () => {
			defaultColorNames.forEach((colorName) => {
				const lightResult = getColorValue(lightTheme, colorName, 'solid')
				const darkResult = getColorValue(darkTheme, colorName, 'solid')

				expect(typeof lightResult).toBe('string')
				expect(typeof darkResult).toBe('string')
				expect(lightResult).toBe(lightTheme[colorName].solid)
				expect(darkResult).toBe(darkTheme[colorName].solid)
			})
		})

		it('should handle edge cases gracefully', () => {
			// Test with empty string
			expect(getColorValue(lightTheme, '' as TLDefaultColorStyle, 'solid')).toBe('')

			// Test with null/undefined (they should pass through)
			expect(getColorValue(lightTheme, null as any, 'solid')).toBe(null)
			expect(getColorValue(lightTheme, undefined as any, 'solid')).toBe(undefined)
		})

		it('should work consistently across all variants for a color', () => {
			const color = 'color5_R2C1'
			const variants: (keyof TLDefaultColorThemeColor)[] = [
				'solid',
				'semi',
				'pattern',
				'fill',
				'frameHeadingStroke',
				'frameHeadingFill',
				'frameStroke',
				'frameFill',
				'frameText',
				'noteFill',
				'noteText',
				'highlightSrgb',
				'highlightP3',
			]

			variants.forEach((variant) => {
				const lightResult = getColorValue(lightTheme, color, variant)
				const darkResult = getColorValue(darkTheme, color, variant)

				expect(lightResult).toBe(lightTheme[color][variant])
				expect(darkResult).toBe(darkTheme[color][variant])
			})
		})

		it('should maintain consistency with isDefaultThemeColor', () => {
			const testColors = [...defaultColorNames, '#ff0000', 'custom', 'invalid']

			testColors.forEach((color) => {
				const isDefault = isDefaultThemeColor(color as TLDefaultColorStyle)
				const result = getColorValue(lightTheme, color as TLDefaultColorStyle, 'solid')

				if (isDefault) {
					// Should return the theme color value
					expect(result).toBe(
						(lightTheme[color as keyof typeof lightTheme] as TLDefaultColorThemeColor).solid
					)
				} else {
					// Should pass through unchanged
					expect(result).toBe(color)
				}
			})
		})
	})

	describe('type safety and integration', () => {
		it('should have proper TypeScript types', () => {
			// Test that TLDefaultColorStyle is properly typed
			const validColor: TLDefaultColorStyle = 'color12_R3C4'
			expect(DefaultColorStyle.validate(validColor)).toBe('color12_R3C4')
		})

		it('should work with both color style props', () => {
			const colorValue: TLDefaultColorStyle = 'color5_R2C1'
			const labelColorValue: TLDefaultColorStyle = 'color13_R4C1'

			expect(DefaultColorStyle.validate(colorValue)).toBe('color5_R2C1')
			expect(DefaultLabelColorStyle.validate(labelColorValue)).toBe('color13_R4C1')
		})

		it('should integrate properly with theme system', () => {
			const theme = getDefaultColorTheme({ isDarkMode: false })
			const color: TLDefaultColorStyle = 'color12_R3C4'

			if (isDefaultThemeColor(color)) {
				const colorValue = getColorValue(theme, color, 'solid')
				expect(typeof colorValue).toBe('string')
				expect(colorValue).toBe(theme.color12_R3C4.solid)
			}
		})

		it('should maintain consistent behavior across all exports', () => {
			// Test that all parts work together correctly
			const theme = getDefaultColorTheme({ isDarkMode: false })

			defaultColorNames.forEach((colorName) => {
				// Should validate in both style props
				expect(DefaultColorStyle.validate(colorName)).toBe(colorName)
				expect(DefaultLabelColorStyle.validate(colorName)).toBe(colorName)

				// Should be recognized as default theme color
				expect(isDefaultThemeColor(colorName)).toBe(true)

				// Should resolve to theme color value
				const colorValue = getColorValue(theme, colorName, 'solid')
				expect(colorValue).toBe(theme[colorName].solid)
			})
		})
	})

	describe('error handling and edge cases', () => {
		it('should handle malformed theme objects gracefully', () => {
			// Create a partial theme for testing edge cases
			const partialTheme = {
				...DefaultColorThemePalette.lightMode,
				color12_R3C4: {
					...DefaultColorThemePalette.lightMode.color12_R3C4,
					solid: undefined,
				} as any,
			}

			// getColorValue should still work but return undefined for this case
			expect(getColorValue(partialTheme, 'color12_R3C4', 'solid')).toBe(undefined)
		})

		it('should handle very large color names', () => {
			const longColorName = 'a'.repeat(1000)
			expect(isDefaultThemeColor(longColorName as TLDefaultColorStyle)).toBe(false)
			expect(
				getColorValue(
					DefaultColorThemePalette.lightMode,
					longColorName as TLDefaultColorStyle,
					'solid'
				)
			).toBe(longColorName)
		})

		it('should handle special characters in color values', () => {
			const specialColors = ['color-with-dashes', 'color_with_underscores', 'color.with.dots']

			specialColors.forEach((color) => {
				expect(isDefaultThemeColor(color as TLDefaultColorStyle)).toBe(false)
				expect(
					getColorValue(DefaultColorThemePalette.lightMode, color as TLDefaultColorStyle, 'solid')
				).toBe(color)
			})
		})

		test('should maintain immutability of exported objects', () => {
			const originalLightTheme = DefaultColorThemePalette.lightMode
			const originalDarkTheme = DefaultColorThemePalette.darkMode
			const originalColorNames = defaultColorNames

			// These should be the same references
			expect(getDefaultColorTheme({ isDarkMode: false })).toBe(originalLightTheme)
			expect(getDefaultColorTheme({ isDarkMode: true })).toBe(originalDarkTheme)

			// Arrays should maintain their values
			expect(defaultColorNames).toEqual(originalColorNames)
			expect(DefaultColorStyle.values).toEqual(originalColorNames)
		})
	})

	describe('performance considerations', () => {
		it('should validate colors efficiently', () => {
			const start = performance.now()

			for (let i = 0; i < 1000; i++) {
				defaultColorNames.forEach((color) => {
					DefaultColorStyle.validate(color)
					isDefaultThemeColor(color)
				})
			}

			const end = performance.now()
			expect(end - start).toBeLessThan(100) // Should be fast
		})

		it('should resolve color values efficiently', () => {
			const theme = DefaultColorThemePalette.lightMode
			const start = performance.now()

			for (let i = 0; i < 1000; i++) {
				defaultColorNames.forEach((color) => {
					getColorValue(theme, color, 'solid')
					getColorValue(theme, color, 'fill')
				})
			}

			const end = performance.now()
			expect(end - start).toBeLessThan(50) // Should be very fast
		})

		it('should handle theme switching efficiently', () => {
			const start = performance.now()

			for (let i = 0; i < 1000; i++) {
				getDefaultColorTheme({ isDarkMode: i % 2 === 0 })
			}

			const end = performance.now()
			expect(end - start).toBeLessThan(10) // Should be extremely fast (just returns references)
		})
	})
})
