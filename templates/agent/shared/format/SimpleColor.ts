import { TLDefaultColorStyle } from 'tldraw'
import z from 'zod'

export const SimpleColor = z.enum([
	'red',
	'light-red',
	'green',
	'light-green',
	'blue',
	'light-blue',
	'orange',
	'yellow',
	'black',
	'violet',
	'light-violet',
	'grey',
	'white',
	// Extended colors
	'dark-blue',
	'teal',
	'cyan',
	'lime',
	'dark-green',
	'brown',
	'tan',
	'pink',
	'magenta',
	'purple',
	'indigo',
	'dark-red',
	'maroon',
	'gold',
	'silver',
])

export type ISimpleColor = z.infer<typeof SimpleColor>

// Map SimpleColor to new position-based TLDefaultColorStyle
const SIMPLE_COLOR_TO_TLDRAW_MAP: Record<ISimpleColor, TLDefaultColorStyle> = {
	black: 'color1_R1C1',
	grey: 'color2_R1C2',
	white: 'color3_R1C3',
	silver: 'color4_R1C4',
	'light-violet': 'color5_R2C1',
	violet: 'color6_R2C2',
	blue: 'color7_R2C3',
	'light-blue': 'color8_R2C4',
	cyan: 'color9_R3C1',
	teal: 'color10_R3C2',
	'light-green': 'color11_R3C3',
	red: 'color12_R3C4',
	'light-red': 'color13_R4C1',
	orange: 'color14_R4C2',
	yellow: 'color15_R4C3',
	green: 'color16_R4C4',
	lime: 'color17_R5C1',
	'dark-green': 'color18_R5C2',
	brown: 'color19_R5C3',
	tan: 'color20_R5C4',
	pink: 'color21_R6C1',
	magenta: 'color22_R6C2',
	purple: 'color23_R6C3',
	indigo: 'color24_R6C4',
	'dark-blue': 'color25_R7C1',
	'dark-red': 'color26_R7C2',
	maroon: 'color27_R7C3',
	gold: 'color28_R7C4',
}

// Reverse map from TLDefaultColorStyle to SimpleColor
const TLDRAW_TO_SIMPLE_COLOR_MAP: Record<TLDefaultColorStyle, ISimpleColor> = {
	color1_R1C1: 'black',
	color2_R1C2: 'grey',
	color3_R1C3: 'white',
	color4_R1C4: 'silver',
	color5_R2C1: 'light-violet',
	color6_R2C2: 'violet',
	color7_R2C3: 'blue',
	color8_R2C4: 'light-blue',
	color9_R3C1: 'cyan',
	color10_R3C2: 'teal',
	color11_R3C3: 'light-green',
	color12_R3C4: 'red',
	color13_R4C1: 'light-red',
	color14_R4C2: 'orange',
	color15_R4C3: 'yellow',
	color16_R4C4: 'green',
	color17_R5C1: 'lime',
	color18_R5C2: 'dark-green',
	color19_R5C3: 'brown',
	color20_R5C4: 'tan',
	color21_R6C1: 'pink',
	color22_R6C2: 'magenta',
	color23_R6C3: 'purple',
	color24_R6C4: 'indigo',
	color25_R7C1: 'dark-blue',
	color26_R7C2: 'dark-red',
	color27_R7C3: 'maroon',
	color28_R7C4: 'gold',
}

export function asColor(color: string): TLDefaultColorStyle {
	// First check if it's already a valid TLDefaultColorStyle (position-based)
	if (color.startsWith('color') && color.includes('_R')) {
		return color as TLDefaultColorStyle
	}

	// Try to parse as SimpleColor
	if (SimpleColor.safeParse(color).success) {
		return SIMPLE_COLOR_TO_TLDRAW_MAP[color as ISimpleColor]
	}

	// Additional mappings
	switch (color) {
		case 'light-pink': {
			return SIMPLE_COLOR_TO_TLDRAW_MAP['light-violet']
		}
	}

	// Default to black (color1_R1C1)
	return 'color1_R1C1'
}

export function toSimpleColor(tldrawColor: TLDefaultColorStyle): ISimpleColor {
	return TLDRAW_TO_SIMPLE_COLOR_MAP[tldrawColor] || 'black'
}
