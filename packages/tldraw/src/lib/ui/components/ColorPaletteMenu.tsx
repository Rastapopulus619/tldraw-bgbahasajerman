import { useActions } from '../context/actions'
import { TldrawUiMenuGroup } from './primitives/menus/TldrawUiMenuGroup'
import { TldrawUiMenuItem } from './primitives/menus/TldrawUiMenuItem'
import { TldrawUiMenuSubmenu } from './primitives/menus/TldrawUiMenuSubmenu'

/** @public @react */
export function ColorPaletteMenu() {
	const actions = useActions()

	return (
		<TldrawUiMenuSubmenu id="color-palette" label="Color palette">
			<TldrawUiMenuGroup id="color-palette-actions">
				<TldrawUiMenuItem
					id="save-palette-as-default"
					label="Save palette as default"
					readonlyOk
					onSelect={() => actions['save-palette-as-default'].onSelect('menu')}
				/>
				<TldrawUiMenuItem
					id="reset-palette-to-default"
					label="Reset palette to default"
					readonlyOk
					onSelect={() => actions['reset-palette-to-default'].onSelect('menu')}
				/>
			</TldrawUiMenuGroup>
		</TldrawUiMenuSubmenu>
	)
}
