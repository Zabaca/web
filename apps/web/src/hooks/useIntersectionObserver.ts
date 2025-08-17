import { useEffect, useRef, useState } from "react";

interface UseIntersectionObserverOptions {
	threshold?: number | number[];
	rootMargin?: string;
	freezeOnceVisible?: boolean;
}

export function useIntersectionObserver({
	threshold = 0,
	rootMargin = "0px",
	freezeOnceVisible = false,
}: UseIntersectionObserverOptions = {}) {
	const elementRef = useRef<HTMLElement | null>(null);
	const [entry, setEntry] = useState<IntersectionObserverEntry>();

	const frozen = entry?.isIntersecting && freezeOnceVisible;

	useEffect(() => {
		const node = elementRef.current;
		if (!node || frozen) return;

		const observer = new IntersectionObserver(([entry]) => setEntry(entry), {
			threshold,
			rootMargin,
		});

		observer.observe(node);

		return () => observer.disconnect();
	}, [threshold, rootMargin, frozen]);

	return { ref: elementRef, entry, isIntersecting: !!entry?.isIntersecting };
}

// Utility hook for animation triggers
export function useScrollAnimation(options?: UseIntersectionObserverOptions) {
	const { ref, isIntersecting } = useIntersectionObserver({
		threshold: 0.1,
		rootMargin: "-50px",
		freezeOnceVisible: true,
		...options,
	});

	return { ref, shouldAnimate: isIntersecting };
}
