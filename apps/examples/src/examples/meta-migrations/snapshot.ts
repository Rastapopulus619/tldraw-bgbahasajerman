import { TLStoreSnapshot } from 'tldraw'

export const snapshot = {
	store: {
		'document:document': {
			gridSize: 10,
			name: '',
			meta: {},
			id: 'document:document',
			typeName: 'document',
		},
		'page:red': {
			meta: {
				backgroundTheme: 'color12_R3C4',
			},
			id: 'page:red',
			name: 'Red',
			index: 'a1',
			typeName: 'page',
		},
		'page:green': {
			meta: {
				backgroundTheme: 'color9_R3C1',
			},
			id: 'page:green',
			name: 'Green',
			index: 'a2',
			typeName: 'page',
		},
		'page:blue': {
			meta: {
				backgroundTheme: 'color5_R2C1',
			},
			id: 'page:blue',
			name: 'Blue',
			index: 'a3',
			typeName: 'page',
		},
		'page:purple': {
			meta: {
				backgroundTheme: 'color23_R6C3',
			},
			id: 'page:purple',
			name: 'Purple',
			index: 'a0',
			typeName: 'page',
		},
	},
	schema: {
		schemaVersion: 2,
		sequences: {
			'com.tldraw.store': 4,
			'com.tldraw.document': 2,
			'com.tldraw.page': 1,
		},
	},
} as TLStoreSnapshot
