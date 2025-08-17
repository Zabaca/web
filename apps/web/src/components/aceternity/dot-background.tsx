export function DotBackground({ children }: { children: React.ReactNode }) {
	return (
		<div className="h-full w-full dark:bg-black bg-white dark:bg-dot-white/[0.2] bg-dot-black/[0.2] relative">
			{/* Radial gradient for faded look */}
			<div className="absolute pointer-events-none inset-0 bg-white dark:bg-black [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
			{children}
		</div>
	);
}
