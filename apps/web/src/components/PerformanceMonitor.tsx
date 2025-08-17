"use client";
import { useEffect, useState } from "react";

export function PerformanceMonitor() {
	const [fps, setFps] = useState(60);
	const [showMonitor, setShowMonitor] = useState(false);

	useEffect(() => {
		// Only show in development
		if (process.env.NODE_ENV !== "development") return;

		let lastTime = performance.now();
		let frames = 0;
		let frameId: number;

		const measureFPS = () => {
			frames++;
			const currentTime = performance.now();

			if (currentTime >= lastTime + 1000) {
				setFps(Math.round((frames * 1000) / (currentTime - lastTime)));
				frames = 0;
				lastTime = currentTime;
			}

			frameId = requestAnimationFrame(measureFPS);
		};

		// Start monitoring after a delay to avoid initial load impact
		const timeoutId = setTimeout(() => {
			setShowMonitor(true);
			frameId = requestAnimationFrame(measureFPS);
		}, 2000);

		return () => {
			clearTimeout(timeoutId);
			if (frameId) cancelAnimationFrame(frameId);
		};
	}, []);

	if (!showMonitor || process.env.NODE_ENV !== "development") return null;

	return (
		<div className="fixed bottom-4 right-4 bg-black/80 text-white px-3 py-2 rounded-lg text-sm font-mono z-50">
			FPS:{" "}
			<span
				className={
					fps < 30
						? "text-red-500"
						: fps < 50
							? "text-yellow-500"
							: "text-green-500"
				}
			>
				{fps}
			</span>
		</div>
	);
}
