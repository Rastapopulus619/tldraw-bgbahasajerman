import { Expand } from '@tldraw/utils'
import { T } from '@tldraw/validate'
import { StyleProp } from './StyleProp'

/**
 * Array of default color names available in tldraw's color palette.
 * These colors form the basis for the default color style system and are available
 * in both light and dark theme variants.
 *
 * @example
 * ```ts
 * import { defaultColorNames } from '@tldraw/tlschema'
 *
 * // Create a color picker with all default colors
 * const colorOptions = defaultColorNames.map(color => ({
 *   name: color,
 *   value: color
 * }))
 * ```
 *
 * @public
 */
export const defaultColorNames = [
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
] as const

/**
 * Defines the color variants available for each color in the default theme.
 * Each color has multiple variants for different use cases like fills, strokes,
 * patterns, and UI elements like frames and notes.
 *
 * @example
 * ```ts
 * import { TLDefaultColorThemeColor } from '@tldraw/tlschema'
 *
 * const blueColor: TLDefaultColorThemeColor = {
 *   solid: '#4465e9',
 *   semi: '#dce1f8',
 *   pattern: '#6681ee',
 *   fill: '#4465e9',
 *   // ... other variants
 * }
 * ```
 *
 * @public
 */
export interface TLDefaultColorThemeColor {
	solid: string
	semi: string
	pattern: string
	fill: string // usually same as solid
	linedFill: string // usually slightly lighter than fill
	frameHeadingStroke: string
	frameHeadingFill: string
	frameStroke: string
	frameFill: string
	frameText: string
	noteFill: string
	noteText: string
	highlightSrgb: string
	highlightP3: string
}

/**
 * Complete color theme definition containing all colors and their variants
 * for either light or dark mode. Includes base theme properties and all
 * default colors with their respective color variants.
 *
 * @example
 * ```ts
 * import { TLDefaultColorTheme } from '@tldraw/tlschema'
 *
 * const customTheme: TLDefaultColorTheme = {
 *   id: 'light',
 *   text: '#000000',
 *   background: '#ffffff',
 *   solid: '#fcfffe',
 *   'color1_R1C1': { solid: '#000000', semi: '#cccccc', ... },
 *   // ... other colors
 * }
 * ```
 *
 * @public
 */
export type TLDefaultColorTheme = Expand<
	{
		id: 'light' | 'dark'
		text: string
		background: string
		solid: string
	} & Record<(typeof defaultColorNames)[number], TLDefaultColorThemeColor>
>

/**
 * Complete color palette containing both light and dark theme definitions.
 * This object provides the full color system used by tldraw's default themes,
 * including all color variants and theme-specific adjustments.
 *
 * @example
 * ```ts
 * import { DefaultColorThemePalette } from '@tldraw/tlschema'
 *
 * // Get the dark theme colors
 * const darkTheme = DefaultColorThemePalette.darkMode
 * const redColor = darkTheme.red.solid // '#e03131'
 *
 * // Access light theme colors
 * const lightTheme = DefaultColorThemePalette.lightMode
 * const blueColor = lightTheme.blue.fill // '#4465e9'
 * ```
 *
 * @public
 */
export const DefaultColorThemePalette: {
	lightMode: TLDefaultColorTheme
	darkMode: TLDefaultColorTheme
} = {
	lightMode: {
		id: 'light',
		text: '#000000',
		background: '#f9fafb',
		solid: '#fcfffe',
		'color1_R1C1': {
			solid: '#1d1d1d',
			fill: '#1d1d1d',
			linedFill: '#363636',
			frameHeadingStroke: '#717171',
			frameHeadingFill: '#ffffff',
			frameStroke: '#717171',
			frameFill: '#ffffff',
			frameText: '#000000',
			noteFill: '#FCE19C',
			noteText: '#000000',
			semi: '#e8e8e8',
			pattern: '#494949',
			highlightSrgb: '#fddd00',
			highlightP3: 'color(display-p3 0.972 0.8205 0.05)',
		},
		'color5_R2C1': {
			solid: '#4465e9',
			fill: '#4465e9',
			linedFill: '#6580ec',
			frameHeadingStroke: '#6681ec',
			frameHeadingFill: '#f9fafe',
			frameStroke: '#6681ec',
			frameFill: '#f9fafe',
			frameText: '#000000',
			noteFill: '#8AA3FF',
			noteText: '#000000',
			semi: '#dce1f8',
			pattern: '#6681ee',
			highlightSrgb: '#10acff',
			highlightP3: 'color(display-p3 0.308 0.6632 0.9996)',
		},
		'color9_R3C1': {
			solid: '#099268',
			fill: '#099268',
			linedFill: '#0bad7c',
			frameHeadingStroke: '#37a684',
			frameHeadingFill: '#f8fcfa',
			frameStroke: '#37a684',
			frameFill: '#f8fcfa',
			frameText: '#000000',
			noteFill: '#6FC896',
			noteText: '#000000',
			semi: '#d3e9e3',
			pattern: '#39a785',
			highlightSrgb: '#00ffc8',
			highlightP3: 'color(display-p3 0.2536 0.984 0.7981)',
		},
		'color2_R1C2': {
			solid: '#9fa8b2',
			fill: '#9fa8b2',
			linedFill: '#bbc1c9',
			frameHeadingStroke: '#aaaaab',
			frameHeadingFill: '#fbfcfc',
			frameStroke: '#aaaaab',
			frameFill: '#fcfcfd',
			frameText: '#000000',
			noteFill: '#C0CAD3',
			noteText: '#000000',
			semi: '#eceef0',
			pattern: '#bcc3c9',
			highlightSrgb: '#cbe7f1',
			highlightP3: 'color(display-p3 0.8163 0.9023 0.9416)',
		},
		'color6_R2C2': {
			solid: '#4ba1f1',
			fill: '#4ba1f1',
			linedFill: '#7abaf5',
			frameHeadingStroke: '#6cb2f3',
			frameHeadingFill: '#f8fbfe',
			frameStroke: '#6cb2f3',
			frameFill: '#fafcff',
			frameText: '#000000',
			noteFill: '#9BC4FD',
			noteText: '#000000',
			semi: '#ddedfa',
			pattern: '#6fbbf8',
			highlightSrgb: '#00f4ff',
			highlightP3: 'color(display-p3 0.1512 0.9414 0.9996)',
		},
		'color10_R3C2': {
			solid: '#4cb05e',
			fill: '#4cb05e',
			linedFill: '#7ec88c',
			frameHeadingStroke: '#6dbe7c',
			frameHeadingFill: '#f8fcf9',
			frameStroke: '#6dbe7c',
			frameFill: '#fafdfa',
			frameText: '#000000',
			noteFill: '#98D08A',
			noteText: '#000000',
			semi: '#dbf0e0',
			pattern: '#65cb78',
			highlightSrgb: '#65f641',
			highlightP3: 'color(display-p3 0.563 0.9495 0.3857)',
		},
		'color11_R3C3': {
			solid: '#f87777',
			fill: '#f87777',
			linedFill: '#f99a9a',
			frameHeadingStroke: '#f89090',
			frameHeadingFill: '#fffafa',
			frameStroke: '#f89090',
			frameFill: '#fffbfb',
			frameText: '#000000',
			noteFill: '#F7A5A1',
			noteText: '#000000',
			semi: '#f4dadb',
			pattern: '#fe9e9e',
			highlightSrgb: '#ff7fa3',
			highlightP3: 'color(display-p3 0.9988 0.5301 0.6397)',
		},
		'color3_R1C3': {
			solid: '#e085f4',
			fill: '#e085f4',
			linedFill: '#e9abf7',
			frameHeadingStroke: '#e59bf5',
			frameHeadingFill: '#fefaff',
			frameStroke: '#e59bf5',
			frameFill: '#fefbff',
			frameText: '#000000',
			noteFill: '#DFB0F9',
			noteText: '#000000',
			semi: '#f5eafa',
			pattern: '#e9acf8',
			highlightSrgb: '#ff88ff',
			highlightP3: 'color(display-p3 0.9676 0.5652 0.9999)',
		},
		'color8_R2C4': {
			solid: '#e16919',
			fill: '#e16919',
			linedFill: '#ea8643',
			frameHeadingStroke: '#e68544',
			frameHeadingFill: '#fef9f6',
			frameStroke: '#e68544',
			frameFill: '#fef9f6',
			frameText: '#000000',
			noteFill: '#FAA475',
			noteText: '#000000',
			semi: '#f8e2d4',
			pattern: '#f78438',
			highlightSrgb: '#ffa500',
			highlightP3: 'color(display-p3 0.9988 0.6905 0.266)',
		},
		'color12_R3C4': {
			solid: '#e03131',
			fill: '#e03131',
			linedFill: '#e75f5f',
			frameHeadingStroke: '#e55757',
			frameHeadingFill: '#fef7f7',
			frameStroke: '#e55757',
			frameFill: '#fef9f9',
			frameText: '#000000',
			noteFill: '#FC8282',
			noteText: '#000000',
			semi: '#f4dadb',
			pattern: '#e55959',
			highlightSrgb: '#ff636e',
			highlightP3: 'color(display-p3 0.9992 0.4376 0.45)',
		},
		'color4_R1C4': {
			solid: '#ae3ec9',
			fill: '#ae3ec9',
			linedFill: '#be68d4',
			frameHeadingStroke: '#bc62d3',
			frameHeadingFill: '#fcf7fd',
			frameStroke: '#bc62d3',
			frameFill: '#fdf9fd',
			frameText: '#000000',
			noteFill: '#DB91FD',
			noteText: '#000000',
			semi: '#ecdcf2',
			pattern: '#bd63d3',
			highlightSrgb: '#c77cff',
			highlightP3: 'color(display-p3 0.7469 0.5089 0.9995)',
		},
		'color7_R2C3': {
			solid: '#f1ac4b',
			fill: '#f1ac4b',
			linedFill: '#f5c27a',
			frameHeadingStroke: '#f3bb6c',
			frameHeadingFill: '#fefcf8',
			frameStroke: '#f3bb6c',
			frameFill: '#fffdfa',
			frameText: '#000000',
			noteFill: '#FED49A',
			noteText: '#000000',
			semi: '#f9f0e6',
			pattern: '#fecb92',
			highlightSrgb: '#fddd00',
			highlightP3: 'color(display-p3 0.972 0.8705 0.05)',
		},
		'color13_R4C1': {
			solid: '#f3f3f3',
			fill: '#f3f3f3',
			linedFill: '#f3f3f3',
			semi: '#f5f5f5',
			pattern: '#f9f9f9',
			frameHeadingStroke: '#7d7d7d',
			frameHeadingFill: '#f3f3f3',
			frameStroke: '#7d7d7d',
			frameFill: '#f3f3f3',
			frameText: '#000000',
			noteFill: '#f3f3f3',
			noteText: '#000000',
			highlightSrgb: '#f3f3f3',
			highlightP3: 'color(display-p3 0.95 0.95 0.95)',
		},
		// Extended colors (placeholders - will be customizable)
		'color14_R4C2': {
			solid: '#1e3a8a',
			fill: '#1e3a8a',
			linedFill: '#2563eb',
			frameHeadingStroke: '#1e40af',
			frameHeadingFill: '#eff6ff',
			frameStroke: '#1e40af',
			frameFill: '#f0f9ff',
			frameText: '#000000',
			noteFill: '#3b82f6',
			noteText: '#000000',
			semi: '#dbeafe',
			pattern: '#2563eb',
			highlightSrgb: '#0066ff',
			highlightP3: 'color(display-p3 0.2 0.4 0.9)',
		},
		'color15_R4C3': {
			solid: '#14b8a6',
			fill: '#14b8a6',
			linedFill: '#2dd4bf',
			frameHeadingStroke: '#0d9488',
			frameHeadingFill: '#f0fdfa',
			frameStroke: '#0d9488',
			frameFill: '#f0fdfa',
			frameText: '#000000',
			noteFill: '#5eead4',
			noteText: '#000000',
			semi: '#ccfbf1',
			pattern: '#2dd4bf',
			highlightSrgb: '#00d9d9',
			highlightP3: 'color(display-p3 0.1 0.8 0.8)',
		},
		'color16_R4C4': {
			solid: '#06b6d4',
			fill: '#06b6d4',
			linedFill: '#22d3ee',
			frameHeadingStroke: '#0891b2',
			frameHeadingFill: '#ecfeff',
			frameStroke: '#0891b2',
			frameFill: '#ecfeff',
			frameText: '#000000',
			noteFill: '#67e8f9',
			noteText: '#000000',
			semi: '#cffafe',
			pattern: '#22d3ee',
			highlightSrgb: '#00e5ff',
			highlightP3: 'color(display-p3 0.1 0.85 0.95)',
		},
		'color17_R5C1': {
			solid: '#84cc16',
			fill: '#84cc16',
			linedFill: '#a3e635',
			frameHeadingStroke: '#65a30d',
			frameHeadingFill: '#f7fee7',
			frameStroke: '#65a30d',
			frameFill: '#f7fee7',
			frameText: '#000000',
			noteFill: '#bef264',
			noteText: '#000000',
			semi: '#ecfccb',
			pattern: '#a3e635',
			highlightSrgb: '#99ff00',
			highlightP3: 'color(display-p3 0.6 0.95 0.2)',
		},
		'color18_R5C2': {
			solid: '#047857',
			fill: '#047857',
			linedFill: '#059669',
			frameHeadingStroke: '#065f46',
			frameHeadingFill: '#ecfdf5',
			frameStroke: '#065f46',
			frameFill: '#ecfdf5',
			frameText: '#000000',
			noteFill: '#34d399',
			noteText: '#000000',
			semi: '#d1fae5',
			pattern: '#059669',
			highlightSrgb: '#00a86b',
			highlightP3: 'color(display-p3 0.15 0.65 0.42)',
		},
		'color19_R5C3': {
			solid: '#92400e',
			fill: '#92400e',
			linedFill: '#b45309',
			frameHeadingStroke: '#78350f',
			frameHeadingFill: '#fef3c7',
			frameStroke: '#78350f',
			frameFill: '#fef3c7',
			frameText: '#000000',
			noteFill: '#d97706',
			noteText: '#000000',
			semi: '#fde68a',
			pattern: '#b45309',
			highlightSrgb: '#a0522d',
			highlightP3: 'color(display-p3 0.55 0.32 0.18)',
		},
		'color20_R5C4': {
			solid: '#d4a574',
			fill: '#d4a574',
			linedFill: '#ddb892',
			frameHeadingStroke: '#c19663',
			frameHeadingFill: '#fefcf9',
			frameStroke: '#c19663',
			frameFill: '#fefcf9',
			frameText: '#000000',
			noteFill: '#e8d5b7',
			noteText: '#000000',
			semi: '#f5e6d3',
			pattern: '#ddb892',
			highlightSrgb: '#d2b48c',
			highlightP3: 'color(display-p3 0.78 0.68 0.55)',
		},
		'color21_R6C1': {
			solid: '#ec4899',
			fill: '#ec4899',
			linedFill: '#f472b6',
			frameHeadingStroke: '#db2777',
			frameHeadingFill: '#fdf2f8',
			frameStroke: '#db2777',
			frameFill: '#fdf2f8',
			frameText: '#000000',
			noteFill: '#f9a8d4',
			noteText: '#000000',
			semi: '#fce7f3',
			pattern: '#f472b6',
			highlightSrgb: '#ff69b4',
			highlightP3: 'color(display-p3 0.95 0.42 0.7)',
		},
		'color22_R6C2': {
			solid: '#d946ef',
			fill: '#d946ef',
			linedFill: '#e879f9',
			frameHeadingStroke: '#c026d3',
			frameHeadingFill: '#fdf4ff',
			frameStroke: '#c026d3',
			frameFill: '#fdf4ff',
			frameText: '#000000',
			noteFill: '#f0abfc',
			noteText: '#000000',
			semi: '#fae8ff',
			pattern: '#e879f9',
			highlightSrgb: '#ff00ff',
			highlightP3: 'color(display-p3 0.9 0.3 0.95)',
		},
		'color23_R6C3': {
			solid: '#9333ea',
			fill: '#9333ea',
			linedFill: '#a855f7',
			frameHeadingStroke: '#7e22ce',
			frameHeadingFill: '#faf5ff',
			frameStroke: '#7e22ce',
			frameFill: '#faf5ff',
			frameText: '#000000',
			noteFill: '#c084fc',
			noteText: '#000000',
			semi: '#f3e8ff',
			pattern: '#a855f7',
			highlightSrgb: '#9400d3',
			highlightP3: 'color(display-p3 0.58 0.0 0.83)',
		},
		'color24_R6C4': {
			solid: '#4f46e5',
			fill: '#4f46e5',
			linedFill: '#6366f1',
			frameHeadingStroke: '#4338ca',
			frameHeadingFill: '#eef2ff',
			frameStroke: '#4338ca',
			frameFill: '#eef2ff',
			frameText: '#000000',
			noteFill: '#818cf8',
			noteText: '#000000',
			semi: '#e0e7ff',
			pattern: '#6366f1',
			highlightSrgb: '#4b0082',
			highlightP3: 'color(display-p3 0.29 0.0 0.51)',
		},
		'color25_R7C1': {
			solid: '#b91c1c',
			fill: '#b91c1c',
			linedFill: '#dc2626',
			frameHeadingStroke: '#991b1b',
			frameHeadingFill: '#fef2f2',
			frameStroke: '#991b1b',
			frameFill: '#fef2f2',
			frameText: '#000000',
			noteFill: '#ef4444',
			noteText: '#000000',
			semi: '#fee2e2',
			pattern: '#dc2626',
			highlightSrgb: '#8b0000',
			highlightP3: 'color(display-p3 0.54 0.0 0.0)',
		},
		'color26_R7C2': {
			solid: '#831843',
			fill: '#831843',
			linedFill: '#9f1239',
			frameHeadingStroke: '#881337',
			frameHeadingFill: '#fff1f2',
			frameStroke: '#881337',
			frameFill: '#fff1f2',
			frameText: '#000000',
			noteFill: '#be123c',
			noteText: '#000000',
			semi: '#ffe4e6',
			pattern: '#9f1239',
			highlightSrgb: '#800000',
			highlightP3: 'color(display-p3 0.5 0.0 0.0)',
		},
		'color27_R7C3': {
			solid: '#d97706',
			fill: '#d97706',
			linedFill: '#f59e0b',
			frameHeadingStroke: '#b45309',
			frameHeadingFill: '#fffbeb',
			frameStroke: '#b45309',
			frameFill: '#fffbeb',
			frameText: '#000000',
			noteFill: '#fbbf24',
			noteText: '#000000',
			semi: '#fef3c7',
			pattern: '#f59e0b',
			highlightSrgb: '#ffd700',
			highlightP3: 'color(display-p3 0.95 0.84 0.0)',
		},
		'color28_R7C4': {
			solid: '#94a3b8',
			fill: '#94a3b8',
			linedFill: '#cbd5e1',
			frameHeadingStroke: '#64748b',
			frameHeadingFill: '#f8fafc',
			frameStroke: '#64748b',
			frameFill: '#f8fafc',
			frameText: '#000000',
			noteFill: '#e2e8f0',
			noteText: '#000000',
			semi: '#f1f5f9',
			pattern: '#cbd5e1',
			highlightSrgb: '#c0c0c0',
			highlightP3: 'color(display-p3 0.75 0.75 0.75)',
		},
	},
	darkMode: {
		id: 'dark',
		text: 'hsl(210, 17%, 98%)',
		background: 'hsl(240, 5%, 6.5%)',
		solid: '#010403',

		'color1_R1C1': {
			solid: '#1d1d1d',
			fill: '#1d1d1d',
			linedFill: '#363636',
			frameHeadingStroke: '#717171',
			frameHeadingFill: '#252525',
			frameStroke: '#717171',
			frameFill: '#0c0c0c',
			frameText: '#f2f2f2',
			noteFill: '#2c2c2c',
			noteText: '#f2f2f2',
			semi: '#2c3036',
			pattern: '#494949',
			highlightSrgb: '#fddd00',
			highlightP3: 'color(display-p3 0.972 0.8205 0.05)',
		},
		'color5_R2C1': {
			solid: '#4f72fc', // 3c60f0
			fill: '#4f72fc',
			linedFill: '#3c5cdd',
			frameHeadingStroke: '#384994',
			frameHeadingFill: '#1C2036',
			frameStroke: '#384994',
			frameFill: '#11141f',
			frameText: '#f2f2f2',
			noteFill: '#2A3F98',
			noteText: '#f2f2f2',
			semi: '#262d40',
			pattern: '#3a4b9e',
			highlightSrgb: '#0079d2',
			highlightP3: 'color(display-p3 0.0032 0.4655 0.7991)',
		},
		'color9_R3C1': {
			solid: '#099268',
			fill: '#099268',
			linedFill: '#087856',
			frameHeadingStroke: '#10513C',
			frameHeadingFill: '#14241f',
			frameStroke: '#10513C',
			frameFill: '#0E1614',
			frameText: '#f2f2f2',
			noteFill: '#014429',
			noteText: '#f2f2f2',
			semi: '#253231',
			pattern: '#366a53',
			highlightSrgb: '#009774',
			highlightP3: 'color(display-p3 0.0085 0.582 0.4604)',
		},
		'color2_R1C2': {
			solid: '#9398b0',
			fill: '#9398b0',
			linedFill: '#8388a5',
			frameHeadingStroke: '#42474D',
			frameHeadingFill: '#23262A',
			frameStroke: '#42474D',
			frameFill: '#151719',
			frameText: '#f2f2f2',
			noteFill: '#56595F',
			noteText: '#f2f2f2',
			semi: '#33373c',
			pattern: '#7c8187',
			highlightSrgb: '#9cb4cb',
			highlightP3: 'color(display-p3 0.6299 0.7012 0.7856)',
		},
		'color6_R2C2': {
			solid: '#4dabf7',
			fill: '#4dabf7',
			linedFill: '#2793ec',
			frameHeadingStroke: '#075797',
			frameHeadingFill: '#142839',
			frameStroke: '#075797',
			frameFill: '#0B1823',
			frameText: '#f2f2f2',
			noteFill: '#1F5495',
			noteText: '#f2f2f2',
			semi: '#2a3642',
			pattern: '#4d7aa9',
			highlightSrgb: '#00bdc8',
			highlightP3: 'color(display-p3 0.0023 0.7259 0.7735)',
		},
		'color10_R3C2': {
			solid: '#40c057',
			fill: '#40c057',
			linedFill: '#37a44b',
			frameHeadingStroke: '#1C5427',
			frameHeadingFill: '#18251A',
			frameStroke: '#1C5427',
			frameFill: '#0F1911',
			frameText: '#f2f2f2',
			noteFill: '#21581D',
			noteText: '#f2f2f2',
			semi: '#2a3830',
			pattern: '#4e874e',
			highlightSrgb: '#00a000',
			highlightP3: 'color(display-p3 0.2711 0.6172 0.0195)',
		},
		'color11_R3C3': {
			solid: '#ff8787',
			fill: '#ff8787',
			linedFill: '#ff6666',
			frameHeadingStroke: '#6f3232', // Darker and desaturated variant of solid
			frameHeadingFill: '#341818', // Deep, muted dark red
			frameStroke: '#6f3232', // Matches headingStroke
			frameFill: '#181212', // Darker, muted background shade
			frameText: '#f2f2f2', // Consistent bright text color
			noteFill: '#7a3333', // Medium-dark, muted variant of solid
			noteText: '#f2f2f2',
			semi: '#3c2b2b', // Subdued, darker neutral-red tone
			pattern: '#a56767', // Existing pattern shade retained
			highlightSrgb: '#db005b',
			highlightP3: 'color(display-p3 0.7849 0.0585 0.3589)',
		},
		'color3_R1C3': {
			solid: '#e599f7',
			fill: '#e599f7',
			linedFill: '#dc71f4',
			frameHeadingStroke: '#6c367a',
			frameHeadingFill: '#2D2230',
			frameStroke: '#6c367a',
			frameFill: '#1C151E',
			frameText: '#f2f2f2',
			noteFill: '#762F8E',
			noteText: '#f2f2f2',
			semi: '#383442',
			pattern: '#9770a9',
			highlightSrgb: '#c400c7',
			highlightP3: 'color(display-p3 0.7024 0.0403 0.753)',
		},
		'color8_R2C4': {
			solid: '#f76707',
			fill: '#f76707',
			linedFill: '#f54900',
			frameHeadingStroke: '#773a0e', // Darker, muted version of solid
			frameHeadingFill: '#2f1d13', // Deep, warm, muted background
			frameStroke: '#773a0e', // Matches headingStroke
			frameFill: '#1c1512', // Darker, richer muted background
			frameText: '#f2f2f2', // Bright text for contrast
			noteFill: '#7c3905', // Muted dark variant for note fill
			noteText: '#f2f2f2',
			semi: '#3b2e27', // Muted neutral-orange tone
			pattern: '#9f552d', // Retained existing shade
			highlightSrgb: '#d07a00',
			highlightP3: 'color(display-p3 0.7699 0.4937 0.0085)',
		},
		'color12_R3C4': {
			solid: '#e03131',
			fill: '#e03131',
			linedFill: '#c31d1d',
			frameHeadingStroke: '#701e1e', // Darker, muted variation of solid
			frameHeadingFill: '#301616', // Deep, muted reddish backdrop
			frameStroke: '#701e1e', // Matches headingStroke
			frameFill: '#1b1313', // Rich, dark muted background
			frameText: '#f2f2f2', // Bright text for readability
			noteFill: '#7e201f', // Muted dark variant for note fill
			noteText: '#f2f2f2',
			semi: '#382726', // Dark neutral-red tone
			pattern: '#8f3734', // Existing pattern color retained
			highlightSrgb: '#de002c',
			highlightP3: 'color(display-p3 0.7978 0.0509 0.2035)',
		},
		'color4_R1C4': {
			solid: '#ae3ec9',
			fill: '#ae3ec9',
			linedFill: '#8f2fa7',
			frameHeadingStroke: '#6d1583', // Darker, muted variation of solid
			frameHeadingFill: '#27152e', // Deep, rich muted violet backdrop
			frameStroke: '#6d1583', // Matches headingStroke
			frameFill: '#1b0f21', // Darker muted violet background
			frameText: '#f2f2f2', // Consistent bright text color
			noteFill: '#5f1c70', // Muted dark variant for note fill
			noteText: '#f2f2f2',
			semi: '#342938', // Dark neutral-violet tone
			pattern: '#763a8b', // Retained existing pattern color
			highlightSrgb: '#9e00ee',
			highlightP3: 'color(display-p3 0.5651 0.0079 0.8986)',
		},
		'color7_R2C3': {
			solid: '#ffc034',
			fill: '#ffc034',
			linedFill: '#ffae00',
			frameHeadingStroke: '#684e12', // Darker, muted variant of solid
			frameHeadingFill: '#2a2113', // Rich, muted dark-yellow background
			frameStroke: '#684e12', // Matches headingStroke
			frameFill: '#1e1911', // Darker muted shade for background fill
			frameText: '#f2f2f2', // Bright text color for readability
			noteFill: '#8a5e1c', // Muted, dark complementary variant
			noteText: '#f2f2f2',
			semi: '#3b352b', // Dark muted neutral-yellow tone
			pattern: '#fecb92', // Existing shade retained
			highlightSrgb: '#d2b700',
			highlightP3: 'color(display-p3 0.8078 0.7225 0.0312)',
		},
		'color13_R4C1': {
			solid: '#f3f3f3',
			fill: '#f3f3f3',
			linedFill: '#f3f3f3',
			semi: '#f5f5f5',
			pattern: '#f9f9f9',
			frameHeadingStroke: '#ffffff',
			frameHeadingFill: '#ffffff',
			frameStroke: '#ffffff',
			frameFill: '#ffffff',
			frameText: '#000000',
			noteFill: '#eaeaea',
			noteText: '#1d1d1d',
			highlightSrgb: '#ffffff',
			highlightP3: 'color(display-p3 1 1 1)',
		},
		// Extended colors - dark mode (placeholders - will be customizable)
		'color14_R4C2': {
			solid: '#3b82f6',
			fill: '#3b82f6',
			linedFill: '#2563eb',
			frameHeadingStroke: '#1e3a8a',
			frameHeadingFill: '#1e293b',
			frameStroke: '#1e3a8a',
			frameFill: '#0f172a',
			frameText: '#f2f2f2',
			noteFill: '#1e40af',
			noteText: '#f2f2f2',
			semi: '#1e3a5f',
			pattern: '#2563eb',
			highlightSrgb: '#0066ff',
			highlightP3: 'color(display-p3 0.3 0.5 0.95)',
		},
		'color15_R4C3': {
			solid: '#2dd4bf',
			fill: '#2dd4bf',
			linedFill: '#14b8a6',
			frameHeadingStroke: '#0f766e',
			frameHeadingFill: '#1a2e2a',
			frameStroke: '#0f766e',
			frameFill: '#0f1e1a',
			frameText: '#f2f2f2',
			noteFill: '#0d9488',
			noteText: '#f2f2f2',
			semi: '#1f3832',
			pattern: '#14b8a6',
			highlightSrgb: '#00d9d9',
			highlightP3: 'color(display-p3 0.2 0.85 0.85)',
		},
		'color16_R4C4': {
			solid: '#22d3ee',
			fill: '#22d3ee',
			linedFill: '#06b6d4',
			frameHeadingStroke: '#0e7490',
			frameHeadingFill: '#1a2e33',
			frameStroke: '#0e7490',
			frameFill: '#0f1e23',
			frameText: '#f2f2f2',
			noteFill: '#0891b2',
			noteText: '#f2f2f2',
			semi: '#1f3840',
			pattern: '#06b6d4',
			highlightSrgb: '#00e5ff',
			highlightP3: 'color(display-p3 0.15 0.88 0.98)',
		},
		'color17_R5C1': {
			solid: '#a3e635',
			fill: '#a3e635',
			linedFill: '#84cc16',
			frameHeadingStroke: '#4d7c0f',
			frameHeadingFill: '#1f2a14',
			frameStroke: '#4d7c0f',
			frameFill: '#14190f',
			frameText: '#f2f2f2',
			noteFill: '#65a30d',
			noteText: '#f2f2f2',
			semi: '#2a3820',
			pattern: '#84cc16',
			highlightSrgb: '#99ff00',
			highlightP3: 'color(display-p3 0.65 0.97 0.25)',
		},
		'color18_R5C2': {
			solid: '#10b981',
			fill: '#10b981',
			linedFill: '#059669',
			frameHeadingStroke: '#065f46',
			frameHeadingFill: '#1a2e26',
			frameStroke: '#065f46',
			frameFill: '#0f1e18',
			frameText: '#f2f2f2',
			noteFill: '#047857',
			noteText: '#f2f2f2',
			semi: '#1f3830',
			pattern: '#059669',
			highlightSrgb: '#00a86b',
			highlightP3: 'color(display-p3 0.2 0.7 0.47)',
		},
		'color19_R5C3': {
			solid: '#d97706',
			fill: '#d97706',
			linedFill: '#b45309',
			frameHeadingStroke: '#78350f',
			frameHeadingFill: '#2a1f13',
			frameStroke: '#78350f',
			frameFill: '#1e160f',
			frameText: '#f2f2f2',
			noteFill: '#92400e',
			noteText: '#f2f2f2',
			semi: '#3b2f20',
			pattern: '#b45309',
			highlightSrgb: '#a0522d',
			highlightP3: 'color(display-p3 0.6 0.37 0.23)',
		},
		'color20_R5C4': {
			solid: '#e8d5b7',
			fill: '#e8d5b7',
			linedFill: '#d4a574',
			frameHeadingStroke: '#8b7355',
			frameHeadingFill: '#2a251e',
			frameStroke: '#8b7355',
			frameFill: '#1e1a14',
			frameText: '#f2f2f2',
			noteFill: '#c19663',
			noteText: '#f2f2f2',
			semi: '#3b3428',
			pattern: '#d4a574',
			highlightSrgb: '#d2b48c',
			highlightP3: 'color(display-p3 0.82 0.72 0.6)',
		},
		'color21_R6C1': {
			solid: '#f472b6',
			fill: '#f472b6',
			linedFill: '#ec4899',
			frameHeadingStroke: '#9f1239',
			frameHeadingFill: '#2e1a24',
			frameStroke: '#9f1239',
			frameFill: '#1e1318',
			frameText: '#f2f2f2',
			noteFill: '#db2777',
			noteText: '#f2f2f2',
			semi: '#3e2935',
			pattern: '#ec4899',
			highlightSrgb: '#ff69b4',
			highlightP3: 'color(display-p3 0.97 0.47 0.75)',
		},
		'color22_R6C2': {
			solid: '#e879f9',
			fill: '#e879f9',
			linedFill: '#d946ef',
			frameHeadingStroke: '#a21caf',
			frameHeadingFill: '#2e1a2e',
			frameStroke: '#a21caf',
			frameFill: '#1e131e',
			frameText: '#f2f2f2',
			noteFill: '#c026d3',
			noteText: '#f2f2f2',
			semi: '#3e293e',
			pattern: '#d946ef',
			highlightSrgb: '#ff00ff',
			highlightP3: 'color(display-p3 0.92 0.35 0.97)',
		},
		'color23_R6C3': {
			solid: '#a855f7',
			fill: '#a855f7',
			linedFill: '#9333ea',
			frameHeadingStroke: '#6b21a8',
			frameHeadingFill: '#261a2e',
			frameStroke: '#6b21a8',
			frameFill: '#1a131e',
			frameText: '#f2f2f2',
			noteFill: '#7e22ce',
			noteText: '#f2f2f2',
			semi: '#35293e',
			pattern: '#9333ea',
			highlightSrgb: '#9400d3',
			highlightP3: 'color(display-p3 0.62 0.05 0.86)',
		},
		'color24_R6C4': {
			solid: '#6366f1',
			fill: '#6366f1',
			linedFill: '#4f46e5',
			frameHeadingStroke: '#3730a3',
			frameHeadingFill: '#1f1a2e',
			frameStroke: '#3730a3',
			frameFill: '#15131e',
			frameText: '#f2f2f2',
			noteFill: '#4338ca',
			noteText: '#f2f2f2',
			semi: '#2e293e',
			pattern: '#4f46e5',
			highlightSrgb: '#4b0082',
			highlightP3: 'color(display-p3 0.34 0.05 0.56)',
		},
		'color25_R7C1': {
			solid: '#ef4444',
			fill: '#ef4444',
			linedFill: '#dc2626',
			frameHeadingStroke: '#7f1d1d',
			frameHeadingFill: '#2e1a1a',
			frameStroke: '#7f1d1d',
			frameFill: '#1e1313',
			frameText: '#f2f2f2',
			noteFill: '#b91c1c',
			noteText: '#f2f2f2',
			semi: '#3e2626',
			pattern: '#dc2626',
			highlightSrgb: '#8b0000',
			highlightP3: 'color(display-p3 0.59 0.05 0.05)',
		},
		'color26_R7C2': {
			solid: '#e11d48',
			fill: '#e11d48',
			linedFill: '#be123c',
			frameHeadingStroke: '#881337',
			frameHeadingFill: '#2e1a20',
			frameStroke: '#881337',
			frameFill: '#1e1316',
			frameText: '#f2f2f2',
			noteFill: '#9f1239',
			noteText: '#f2f2f2',
			semi: '#3e2630',
			pattern: '#be123c',
			highlightSrgb: '#800000',
			highlightP3: 'color(display-p3 0.55 0.05 0.05)',
		},
		'color27_R7C3': {
			solid: '#fbbf24',
			fill: '#fbbf24',
			linedFill: '#f59e0b',
			frameHeadingStroke: '#92400e',
			frameHeadingFill: '#2a2113',
			frameStroke: '#92400e',
			frameFill: '#1e1911',
			frameText: '#f2f2f2',
			noteFill: '#d97706',
			noteText: '#f2f2f2',
			semi: '#3b3120',
			pattern: '#f59e0b',
			highlightSrgb: '#ffd700',
			highlightP3: 'color(display-p3 0.97 0.87 0.05)',
		},
		'color28_R7C4': {
			solid: '#cbd5e1',
			fill: '#cbd5e1',
			linedFill: '#94a3b8',
			frameHeadingStroke: '#475569',
			frameHeadingFill: '#1e293b',
			frameStroke: '#475569',
			frameFill: '#0f172a',
			frameText: '#f2f2f2',
			noteFill: '#64748b',
			noteText: '#f2f2f2',
			semi: '#334155',
			pattern: '#94a3b8',
			highlightSrgb: '#c0c0c0',
			highlightP3: 'color(display-p3 0.78 0.78 0.78)',
		},
	},
}

/**
 * Returns the appropriate default color theme based on the dark mode preference.
 *
 * @param opts - Configuration options
 *   - isDarkMode - Whether to return the dark theme (true) or light theme (false)
 * @returns The corresponding TLDefaultColorTheme (light or dark)
 *
 * @example
 * ```ts
 * import { getDefaultColorTheme } from '@tldraw/tlschema'
 *
 * // Get light theme
 * const lightTheme = getDefaultColorTheme({ isDarkMode: false })
 *
 * // Get dark theme
 * const darkTheme = getDefaultColorTheme({ isDarkMode: true })
 *
 * // Use with editor
 * const theme = getDefaultColorTheme({ isDarkMode: window.matchMedia('(prefers-color-scheme: dark)').matches })
 * ```
 *
 * @public
 */
export function getDefaultColorTheme(opts: { isDarkMode: boolean }): TLDefaultColorTheme {
	return opts.isDarkMode ? DefaultColorThemePalette.darkMode : DefaultColorThemePalette.lightMode
}

/**
 * Default color style property used by tldraw shapes for their primary color.
 * This style prop allows shapes to use any of the default color names and
 * automatically saves the last used value for new shapes.
 *
 * @example
 * ```ts
 * import { DefaultColorStyle } from '@tldraw/tlschema'
 *
 * // Use in shape props definition
 * interface MyShapeProps {
 *   color: typeof DefaultColorStyle
 *   // other props...
 * }
 *
 * // Set color on a shape
 * const shape = {
 *   // ... other properties
 *   props: {
 *     color: 'color12_R3C4' as const,
 *     // ... other props
 *   }
 * }
 * ```
 *
 * @public
 */
export const DefaultColorStyle = StyleProp.defineEnum('tldraw:color', {
	defaultValue: 'color1_R1C1',
	values: defaultColorNames,
})

/**
 * Default label color style property used for text labels on shapes.
 * This is separate from the main color style to allow different colors
 * for shape fills/strokes versus their text labels.
 *
 * @example
 * ```ts
 * import { DefaultLabelColorStyle } from '@tldraw/tlschema'
 *
 * // Use in shape props definition
 * interface MyShapeProps {
 *   labelColor: typeof DefaultLabelColorStyle
 *   // other props...
 * }
 *
 * // Create a shape with different fill and label colors
 * const shape = {
 *   // ... other properties
 *   props: {
 *     color: 'color5_R2C1' as const,
 *     labelColor: 'color13_R4C1' as const,
 *     // ... other props
 *   }
 * }
 * ```
 *
 * @public
 */
export const DefaultLabelColorStyle = StyleProp.defineEnum('tldraw:labelColor', {
	defaultValue: 'color1_R1C1',
	values: defaultColorNames,
})

/**
 * Type representing a default color style value.
 * This is a union type of all available default color names.
 *
 * @example
 * ```ts
 * import { TLDefaultColorStyle } from '@tldraw/tlschema'
 *
 * // Valid color values
 * const redColor: TLDefaultColorStyle = 'color12_R3C4'
 * const blueColor: TLDefaultColorStyle = 'color5_R2C1'
 *
 * // Type guard usage
 * function isValidColor(color: string): color is TLDefaultColorStyle {
 *   return ['color1_R1C1', 'color12_R3C4', 'color5_R2C1'].includes(color as TLDefaultColorStyle)
 * }
 * ```
 *
 * @public
 */
export type TLDefaultColorStyle = T.TypeOf<typeof DefaultColorStyle>

const defaultColorNamesSet = new Set(defaultColorNames)

/**
 * Type guard to check if a color value is one of the default theme colors.
 * Useful for determining if a color can be looked up in the theme palette.
 *
 * @param color - The color value to check
 * @returns True if the color is a default theme color, false otherwise
 *
 * @example
 * ```ts
 * import { isDefaultThemeColor, TLDefaultColorStyle } from '@tldraw/tlschema'
 *
 * const color: TLDefaultColorStyle = 'color12_R3C4'
 *
 * if (isDefaultThemeColor(color)) {
 *   // color is guaranteed to be a default theme color
 *   console.log(`${color} is a default theme color`)
 * } else {
 *   // color might be a custom hex value or other format
 *   console.log(`${color} is a custom color`)
 * }
 * ```
 *
 * @public
 */
export function isDefaultThemeColor(
	color: TLDefaultColorStyle
): color is (typeof defaultColorNames)[number] {
	return defaultColorNamesSet.has(color as (typeof defaultColorNames)[number])
}

/**
 * Resolves a color style value to its actual CSS color string for a given theme and variant.
 * If the color is not a default theme color, returns the color value as-is.
 *
 * @param theme - The color theme to use for resolution
 * @param color - The color style value to resolve
 * @param variant - Which variant of the color to return (solid, fill, pattern, etc.)
 * @returns The CSS color string for the specified color and variant
 *
 * @example
 * ```ts
 * import { getColorValue, getDefaultColorTheme } from '@tldraw/tlschema'
 *
 * const theme = getDefaultColorTheme({ isDarkMode: false })
 *
 * // Get the solid variant of red
 * const redSolid = getColorValue(theme, 'color12_R3C4', 'solid') // '#e03131'
 *
 * // Get the fill variant of blue
 * const blueFill = getColorValue(theme, 'color5_R2C1', 'fill') // '#4465e9'
 *
 * // Custom color passes through unchanged
 * const customColor = getColorValue(theme, '#ff0000', 'solid') // '#ff0000'
 * ```
 *
 * @public
 */
export function getColorValue(
	theme: TLDefaultColorTheme,
	color: TLDefaultColorStyle,
	variant: keyof TLDefaultColorThemeColor
): string {
	if (!isDefaultThemeColor(color)) {
		return color
	}

	return theme[color][variant]
}
