import * as React from 'react'
import { TldrawUiButton } from './primitives/Button/TldrawUiButton'
import { TldrawUiButtonLabel } from './primitives/Button/TldrawUiButtonLabel'
import {
	TldrawUiDialogBody,
	TldrawUiDialogCloseButton,
	TldrawUiDialogFooter,
	TldrawUiDialogHeader,
	TldrawUiDialogTitle,
} from './primitives/TldrawUiDialog'

/** @internal */
export function ColorPaletteConfirmDialog({
	title,
	description,
	confirmLabel,
	onConfirm,
	onClose,
}: {
	title: string
	description: string
	confirmLabel: string
	onConfirm: () => void | Promise<void>
	onClose: () => void
}) {
	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		await onConfirm()
		onClose()
	}

	return (
		<form onSubmit={handleSubmit}>
			<TldrawUiDialogHeader>
				<TldrawUiDialogTitle>{title}</TldrawUiDialogTitle>
				<TldrawUiDialogCloseButton />
			</TldrawUiDialogHeader>
			<TldrawUiDialogBody style={{ maxWidth: 350 }}>
				<p>{description}</p>
			</TldrawUiDialogBody>
			<TldrawUiDialogFooter className="tlui-dialog__footer__actions">
				<TldrawUiButton type="normal" onClick={onClose} htmlButtonType="button">
					<TldrawUiButtonLabel>Cancel</TldrawUiButtonLabel>
				</TldrawUiButton>
				<TldrawUiButton type="primary" htmlButtonType="submit" autoFocus>
					<TldrawUiButtonLabel>{confirmLabel}</TldrawUiButtonLabel>
				</TldrawUiButton>
			</TldrawUiDialogFooter>
		</form>
	)
}
