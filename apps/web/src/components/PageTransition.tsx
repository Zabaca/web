import { AnimatePresence, motion } from "framer-motion";
import type React from "react";
import { useEffect, useState } from "react";

export default function PageTransition({
	children,
}: {
	children: React.ReactNode;
}) {
	const [isLoaded, setIsLoaded] = useState(false);

	useEffect(() => {
		setIsLoaded(true);
	}, []);

	return (
		<AnimatePresence mode="wait">
			{isLoaded && (
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					transition={{ duration: 0.3, ease: "easeInOut" }}
				>
					{children}
				</motion.div>
			)}
		</AnimatePresence>
	);
}
