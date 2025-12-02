import z from 'zod'

export const FocusColorSchema = z.enum([
	'color12_R3C4',
	'color11_R3C3',
	'color9_R3C1',
	'color10_R3C2',
	'color5_R2C1',
	'color6_R2C2',
	'color8_R2C4',
	'color7_R2C3',
	'color1_R1C1',
	'color4_R1C4',
	'color3_R1C3',
	'color2_R1C2',
	'color13_R4C1',
	// Extended colors
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
])

export type FocusColor = z.infer<typeof FocusColorSchema>

export function asColor(color: string): FocusColor {
	if (FocusColorSchema.safeParse(color).success) {
		return color as FocusColor
	}

	switch (color) {
		case 'color21_R6C1':
		case 'light-pink': {
			return 'color3_R1C3'
		}
	}

	return 'color1_R1C1'
}

export function asProjectColor(color: string): FocusColor {
	switch (color) {
		case 'color21_R6C1':
		case 'light-pink': {
			return 'color3_R1C3'
		}
		case 'color1_R1C1': {
			return 'color10_R3C2'
		}
		case 'gray': {
			return 'color12_R3C4'
		}
	}

	if (FocusColorSchema.safeParse(color).success) {
		return color as FocusColor
	}

	return 'color6_R2C2'
}
