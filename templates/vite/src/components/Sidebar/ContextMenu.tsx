import { useEffect, useRef } from 'react'
import './ContextMenu.css'

export interface ContextMenuItem {
	label: string
	action: () => void
	disabled?: boolean
	separator?: boolean
	dangerous?: boolean
}

interface ContextMenuProps {
	x: number
	y: number
	items: ContextMenuItem[]
	onClose: () => void
}

export function ContextMenu({ x, y, items, onClose }: ContextMenuProps) {
	const menuRef = useRef<HTMLDivElement>(null)

	useEffect(() => {
		const handleClickOutside = (e: MouseEvent) => {
			if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
				onClose()
			}
		}

		const handleEscape = (e: KeyboardEvent) => {
			if (e.key === 'Escape') {
				onClose()
			}
		}

		// Add listeners with slight delay to prevent immediate close
		setTimeout(() => {
			document.addEventListener('mousedown', handleClickOutside)
			document.addEventListener('keydown', handleEscape)
		}, 10)

		return () => {
			document.removeEventListener('mousedown', handleClickOutside)
			document.removeEventListener('keydown', handleEscape)
		}
	}, [onClose])

	// Adjust position if menu would go off-screen
	useEffect(() => {
		if (menuRef.current) {
			const rect = menuRef.current.getBoundingClientRect()
			const windowWidth = window.innerWidth
			const windowHeight = window.innerHeight

			let adjustedX = x
			let adjustedY = y

			if (rect.right > windowWidth) {
				adjustedX = windowWidth - rect.width - 10
			}

			if (rect.bottom > windowHeight) {
				adjustedY = windowHeight - rect.height - 10
			}

			menuRef.current.style.left = `${adjustedX}px`
			menuRef.current.style.top = `${adjustedY}px`
		}
	}, [x, y])

	return (
		<div ref={menuRef} className="context-menu" style={{ left: x, top: y }}>
			{items.map((item, index) =>
				item.separator ? (
					<div key={index} className="context-menu__separator" />
				) : (
					<button
						key={index}
						className={`context-menu__item ${
							item.disabled ? 'context-menu__item--disabled' : ''
						} ${item.dangerous ? 'context-menu__item--dangerous' : ''}`}
						onClick={() => {
							if (!item.disabled) {
								item.action()
								onClose()
							}
						}}
						disabled={item.disabled}
					>
						{item.label}
					</button>
				)
			)}
		</div>
	)
}
