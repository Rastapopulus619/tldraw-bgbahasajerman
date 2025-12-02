import { useLayoutEffect } from 'react'
import { TLComponents, track, useEditor } from 'tldraw'
import { PageMetaV2 } from './MetaMigrations'

export const components: TLComponents = {
	TopPanel: track(() => {
		const editor = useEditor()
		const currentPage = editor.getCurrentPage()
		const meta: PageMetaV2 = currentPage.meta

		useLayoutEffect(() => {
			const elem = document.querySelector('.tl-background') as HTMLElement
			if (!elem) return
			elem.style.backgroundColor = meta.backgroundTheme ?? 'unset'
		}, [meta.backgroundTheme])

		return (
			<span style={{ pointerEvents: 'all', padding: '5px 15px', margin: 10, fontSize: 18 }}>
				bg: &nbsp;
				<select
					value={meta.backgroundTheme ?? 'none'}
					onChange={(e) => {
						if (e.currentTarget.value === 'none') {
							editor.updatePage({ ...currentPage, meta: {} })
						} else {
							editor.updatePage({
								...currentPage,
								meta: { backgroundTheme: e.currentTarget.value },
							})
						}
					}}
				>
					<option value="none">None</option>
					<option value="color12_R3C4">Red</option>
					<option value="color5_R2C1">Blue</option>
					<option value="color9_R3C1">Green</option>
				</select>
			</span>
		)
	}),
}
