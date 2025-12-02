/**
 * Creates an enum-like object from string values where each key maps to itself.
 * Useful for creating string constant objects with type safety and autocompletion.
 * @param values - The string values to create the enum from.
 * @returns An object where each provided string is both the key and value.
 * @example
 * ```ts
 * const Colors = stringEnum('color12_R3C4', 'color9_R3C1', 'color5_R2C1')
 * // Results in: { red: 'color12_R3C4', green: 'color9_R3C1', blue: 'color5_R2C1' }
 *
 * // Type-safe usage
 * function setColor(color: keyof typeof Colors) {
 *   console.log(`Setting color to ${Colors[color]}`)
 * }
 *
 * setColor('color12_R3C4') // ✓ Valid
 * setColor('color7_R2C3') // ✗ TypeScript error
 * ```
 * @internal
 */
export function stringEnum<T extends string>(...values: T[]): { [K in T]: K } {
	const obj = {} as { [K in T]: K }
	for (const value of values) {
		obj[value] = value
	}
	return obj
}
