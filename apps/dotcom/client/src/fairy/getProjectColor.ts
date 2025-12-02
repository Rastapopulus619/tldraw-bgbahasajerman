import { FocusColor } from '@tldraw/fairy-shared'

/**
 * Gets the CSS color value for a project color, using the editor's theme.
 * First normalizes the color using asColor, then resolves it using the DefaultColorThemePalette.
 *
 * @param editor - The tldraw editor instance (used to detect dark mode)
 * @param color - The FocusColor value to convert
 * @returns The CSS color string (e.g., '#4465e9')
 */
export function getProjectColor(color: FocusColor | string): string {
	switch (color) {
		case 'color12_R3C4': {
			return 'var(--tl-color-fairy-rose)'
		}
		case 'color11_R3C3': {
			return 'var(--tl-color-fairy-coral)'
		}
		case 'color9_R3C1': {
			return 'var(--tl-color-fairy-green)'
		}
		case 'color10_R3C2': {
			return 'var(--tl-color-fairy-teal)'
		}
		case 'color5_R2C1': {
			return 'var(--tl-color-fairy-pink)'
		}
		case 'color6_R2C2': {
			return 'var(--tl-color-fairy-purple)'
		}
		case 'color8_R2C4': {
			return 'var(--tl-color-fairy-gold)'
		}
		case 'color7_R2C3': {
			return 'var(--tl-color-fairy-peach)'
		}
		case 'color1_R1C1': {
			return 'var(--tl-color-fairy-green)'
		}
		case 'color4_R1C4': {
			return 'var(--tl-color-fairy-purple)'
		}
		case 'color3_R1C3': {
			return 'var(--tl-color-fairy-purple)'
		}
		case 'color2_R1C2': {
			return 'var(--tl-color-fairy-gold)'
		}
		case 'color13_R4C1': {
			return 'var(--tl-color-fairy-white)'
		}
	}
	return color
}
