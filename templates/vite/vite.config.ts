import react from '@vitejs/plugin-react-swc'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
	server: {
		port: 5180,
		host: true, // Listen on all addresses (for Tailscale access)
		proxy: {
			'/api': {
				target: 'http://localhost:3001',
				changeOrigin: true,
			},
		},
	},
	plugins: [
		react(
			/* EXCLUDE_FROM_TEMPLATE_EXPORT_START */
			{ tsDecorators: true }
			/* EXCLUDE_FROM_TEMPLATE_EXPORT_END */
		),
	],
})
