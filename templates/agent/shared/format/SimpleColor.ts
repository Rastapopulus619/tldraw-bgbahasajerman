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

export function asColor(color: string): ISimpleColor {
	if (SimpleColor.safeParse(color).success) {
		return color as ISimpleColor
	}

	switch (color) {
		case 'pink': {
			return 'light-violet'
		}
		case 'light-pink': {
			return 'light-violet'
		}
	}

	return 'black'
}
