import { TLDefaultColorStyle } from '@tldraw/editor'
import { useCallback, useState } from 'react'
import { TLUiDialogProps } from '../context/dialogs'
import { TldrawUiButton } from './primitives/Button/TldrawUiButton'
import { TldrawUiButtonLabel } from './primitives/Button/TldrawUiButtonLabel'
import {
	TldrawUiDialogBody,
	TldrawUiDialogCloseButton,
	TldrawUiDialogFooter,
	TldrawUiDialogHeader,
	TldrawUiDialogTitle,
} from './primitives/TldrawUiDialog'

export interface ColorPickerModalProps extends TLUiDialogProps {
	colorName: TLDefaultColorStyle
	currentLightColor: string
	currentDarkColor: string
	onSave: (lightColor: string, darkColor: string) => void
}

/**
 * Converts hex color to HSL
 */
function hexToHSL(hex: string): { h: number; s: number; l: number } {
	// Remove the hash if present
	hex = hex.replace(/^#/, '')

	// Parse the hex values
	const r = parseInt(hex.substring(0, 2), 16) / 255
	const g = parseInt(hex.substring(2, 4), 16) / 255
	const b = parseInt(hex.substring(4, 6), 16) / 255

	const max = Math.max(r, g, b)
	const min = Math.min(r, g, b)
	let h = 0
	let s = 0
	const l = (max + min) / 2

	if (max !== min) {
		const d = max - min
		s = l > 0.5 ? d / (2 - max - min) : d / (max + min)

		switch (max) {
			case r:
				h = ((g - b) / d + (g < b ? 6 : 0)) / 6
				break
			case g:
				h = ((b - r) / d + 2) / 6
				break
			case b:
				h = ((r - g) / d + 4) / 6
				break
		}
	}

	return {
		h: Math.round(h * 360),
		s: Math.round(s * 100),
		l: Math.round(l * 100),
	}
}

/**
 * Converts HSL to hex color
 */
function hslToHex(h: number, s: number, l: number): string {
	s /= 100
	l /= 100

	const c = (1 - Math.abs(2 * l - 1)) * s
	const x = c * (1 - Math.abs(((h / 60) % 2) - 1))
	const m = l - c / 2
	let r = 0
	let g = 0
	let b = 0

	if (h >= 0 && h < 60) {
		r = c
		g = x
		b = 0
	} else if (h >= 60 && h < 120) {
		r = x
		g = c
		b = 0
	} else if (h >= 120 && h < 180) {
		r = 0
		g = c
		b = x
	} else if (h >= 180 && h < 240) {
		r = 0
		g = x
		b = c
	} else if (h >= 240 && h < 300) {
		r = x
		g = 0
		b = c
	} else if (h >= 300 && h < 360) {
		r = c
		g = 0
		b = x
	}

	const toHex = (n: number) => {
		const hex = Math.round((n + m) * 255).toString(16)
		return hex.length === 1 ? '0' + hex : hex
	}

	return `#${toHex(r)}${toHex(g)}${toHex(b)}`
}

/**
 * Auto-generates a dark mode color variant from a light mode color
 * Strategy: Increase lightness for better visibility on dark backgrounds
 */
function generateDarkVariant(lightColorHex: string): string {
	const hsl = hexToHSL(lightColorHex)

	// Increase lightness for dark mode (make colors brighter)
	// If already very light, increase less; if dark, increase more
	let newLightness = hsl.l
	if (hsl.l < 50) {
		// Dark colors: increase significantly (e.g., 30% → 60%)
		newLightness = Math.min(hsl.l + 30, 70)
	} else if (hsl.l < 70) {
		// Medium colors: moderate increase (e.g., 50% → 65%)
		newLightness = Math.min(hsl.l + 15, 75)
	} else {
		// Already light colors: small increase (e.g., 75% → 82%)
		newLightness = Math.min(hsl.l + 7, 85)
	}

	// Slightly reduce saturation for softer appearance
	const newSaturation = Math.max(hsl.s - 5, 0)

	return hslToHex(hsl.h, newSaturation, newLightness)
}

export function ColorPickerModal({
	onClose,
	colorName,
	currentLightColor,
	currentDarkColor,
	onSave,
}: ColorPickerModalProps) {
	const [lightColor, setLightColor] = useState(currentLightColor)
	const [darkColor, setDarkColor] = useState(currentDarkColor)
	const [autoGenerate, setAutoGenerate] = useState(true)

	const handleLightColorChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			const newLightColor = e.target.value
			setLightColor(newLightColor)

			// Auto-generate dark variant if enabled
			if (autoGenerate) {
				setDarkColor(generateDarkVariant(newLightColor))
			}
		},
		[autoGenerate]
	)

	const handleDarkColorChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
		setDarkColor(e.target.value)
	}, [])

	const handleAutoGenerateToggle = useCallback(() => {
		const newAutoGenerate = !autoGenerate
		setAutoGenerate(newAutoGenerate)

		// If enabling auto-generate, immediately generate dark variant
		if (newAutoGenerate) {
			setDarkColor(generateDarkVariant(lightColor))
		}
	}, [autoGenerate, lightColor])

	const handleSave = useCallback(() => {
		onSave(lightColor, darkColor)
		onClose()
	}, [lightColor, darkColor, onSave, onClose])

	const handleCancel = useCallback(() => {
		onClose()
	}, [onClose])

	return (
		<>
			<TldrawUiDialogHeader>
				<TldrawUiDialogTitle>Customize color: {colorName}</TldrawUiDialogTitle>
				<TldrawUiDialogCloseButton />
			</TldrawUiDialogHeader>
			<TldrawUiDialogBody style={{ maxWidth: 400 }}>
				<div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
					{/* Light mode color picker */}
					<div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
						<label
							htmlFor="light-color-input"
							style={{ fontSize: 14, fontWeight: 500, color: 'var(--color-text)' }}
						>
							Light mode color
						</label>
						<div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
							<input
								id="light-color-input"
								type="color"
								value={lightColor}
								onChange={handleLightColorChange}
								style={{ width: 60, height: 40, cursor: 'pointer', border: 'none' }}
							/>
							<input
								type="text"
								value={lightColor}
								onChange={handleLightColorChange}
								style={{
									flex: 1,
									padding: '8px 12px',
									fontSize: 14,
									fontFamily: 'monospace',
									border: '1px solid var(--color-panel-contrast)',
									borderRadius: 4,
									backgroundColor: 'var(--color-panel)',
									color: 'var(--color-text)',
								}}
								placeholder="#000000"
								maxLength={7}
							/>
						</div>
					</div>

					{/* Auto-generate checkbox */}
					<div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
						<input
							id="auto-generate-checkbox"
							type="checkbox"
							checked={autoGenerate}
							onChange={handleAutoGenerateToggle}
							style={{ cursor: 'pointer' }}
						/>
						<label
							htmlFor="auto-generate-checkbox"
							style={{ fontSize: 14, cursor: 'pointer', color: 'var(--color-text)' }}
						>
							Auto-generate dark mode variant
						</label>
					</div>

					{/* Dark mode color picker */}
					<div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
						<label
							htmlFor="dark-color-input"
							style={{
								fontSize: 14,
								fontWeight: 500,
								color: autoGenerate ? 'var(--color-text-3)' : 'var(--color-text)',
							}}
						>
							Dark mode color
						</label>
						<div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
							<input
								id="dark-color-input"
								type="color"
								value={darkColor}
								onChange={handleDarkColorChange}
								disabled={autoGenerate}
								style={{
									width: 60,
									height: 40,
									cursor: autoGenerate ? 'not-allowed' : 'pointer',
									border: 'none',
									opacity: autoGenerate ? 0.5 : 1,
								}}
							/>
							<input
								type="text"
								value={darkColor}
								onChange={handleDarkColorChange}
								disabled={autoGenerate}
								style={{
									flex: 1,
									padding: '8px 12px',
									fontSize: 14,
									fontFamily: 'monospace',
									border: '1px solid var(--color-panel-contrast)',
									borderRadius: 4,
									backgroundColor: 'var(--color-panel)',
									color: 'var(--color-text)',
									opacity: autoGenerate ? 0.5 : 1,
									cursor: autoGenerate ? 'not-allowed' : 'text',
								}}
								placeholder="#000000"
								maxLength={7}
							/>
						</div>
					</div>
				</div>
			</TldrawUiDialogBody>
			<TldrawUiDialogFooter>
				<TldrawUiButton type="normal" onClick={handleCancel}>
					<TldrawUiButtonLabel>Cancel</TldrawUiButtonLabel>
				</TldrawUiButton>
				<TldrawUiButton type="primary" onClick={handleSave}>
					<TldrawUiButtonLabel>Save</TldrawUiButtonLabel>
				</TldrawUiButton>
			</TldrawUiDialogFooter>
		</>
	)
}
