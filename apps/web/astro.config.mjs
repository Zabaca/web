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

	// /web-contract is reached by a private per-client link, so it is kept out of
	// the sitemap as well as noindex'd in the layout. Listing it would hand a
	// crawler the one thing the link's unguessability is protecting.
	integrations: [
		react(),
		sitemap({ filter: (page) => !page.includes("/web-contract") }),
	],
});
