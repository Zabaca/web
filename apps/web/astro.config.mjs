import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";

import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
	site: "https://www.zabaca.com",
	outDir: "dist",
	root: ".",

	server: {
		port: 4321,
		host: true,
	},

	vite: {
		plugins: [tailwindcss()],
		build: {
			target: "esnext", // Use the latest ES features
			minify: "esbuild", // Use esbuild for faster builds
			rollupOptions: {
				output: {
					manualChunks: {
						"react-vendor": ["react", "react-dom"],
						"animation-vendor": ["framer-motion"],
						"ui-vendor": [
							"@radix-ui/react-dialog",
							"@radix-ui/react-label",
							"@radix-ui/react-slot",
							"@radix-ui/react-tabs",
						],
					},
				},
			},
		},
		optimizeDeps: {
			include: ["react", "react-dom", "framer-motion"], // Pre-bundle heavy dependencies
		},
	},

	integrations: [react(), sitemap()],
});
