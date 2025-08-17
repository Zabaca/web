/** @type {import('tailwindcss').Config} */
export default {
	content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
	theme: {
		extend: {
			animation: {
				spotlight: "spotlight 2s ease .75s 1 forwards",
				"shimmer-slide":
					"shimmer-slide var(--speed) ease-in-out infinite alternate",
				"spin-around": "spin-around calc(var(--speed) * 2) infinite linear",
				aurora: "aurora 60s linear infinite",
			},
		},
	},
	plugins: [],
};
