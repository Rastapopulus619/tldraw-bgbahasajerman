import { Editor, Tldraw, createShapeId, toRichText } from 'tldraw'
import 'tldraw/tldraw.css'

export default function BeforeDeleteShapeExample() {
	return (
		<div className="tldraw__editor">
			<Tldraw
				onMount={(editor) => {
					// register a handler to run before any shape is deleted:
					editor.sideEffects.registerBeforeDeleteHandler('shape', (shape) => {
						// if the shape is red, prevent the deletion:
						if ('color' in shape.props && shape.props.color === 'color12_R3C4') {
							return false
						}

						return
					})

					createDemoShapes(editor)
				}}
			/>
		</div>
	)
}

// create some shapes to demonstrate the side-effect we added
function createDemoShapes(editor: Editor) {
	editor
		.createShapes([
			{
				id: createShapeId(),
				type: 'text',
				props: {
					richText: toRichText("Red shapes can't be deleted"),
					color: 'color12_R3C4',
				},
			},
			{
				id: createShapeId(),
				type: 'text',
				y: 30,
				props: {
					richText: toRichText('but other shapes can'),
					color: 'color1_R1C1',
				},
			},
		])
		.zoomToFit({ animation: { duration: 0 } })
}
