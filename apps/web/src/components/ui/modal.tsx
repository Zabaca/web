import { AnimatePresence, motion } from "framer-motion";
import type React from "react";
import { useEffect, useRef } from "react";

interface ModalProps {
	isOpen: boolean;
	onClose: () => void;
	children: React.ReactNode;
	title?: string;
}

export function Modal({ isOpen, onClose, children, title }: ModalProps) {
	const modalRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const handleEscape = (e: KeyboardEvent) => {
			if (e.key === "Escape") {
				onClose();
			}
		};

		if (isOpen) {
			document.addEventListener("keydown", handleEscape);
			document.body.style.overflow = "hidden";
		}

		return () => {
			document.removeEventListener("keydown", handleEscape);
			document.body.style.overflow = "unset";
		};
	}, [isOpen, onClose]);

	const handleBackdropClick = (e: React.MouseEvent) => {
		if (e.target === e.currentTarget) {
			onClose();
		}
	};

	return (
		<AnimatePresence>
			{isOpen && (
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					transition={{ duration: 0.2 }}
					className="fixed inset-0 flex items-center justify-center px-4 bg-black/50 backdrop-blur-sm"
					style={{ zIndex: 999999 }}
					onClick={handleBackdropClick}
				>
					<motion.div
						ref={modalRef}
						initial={{ scale: 0.95, opacity: 0 }}
						animate={{ scale: 1, opacity: 1 }}
						exit={{ scale: 0.95, opacity: 0 }}
						transition={{ duration: 0.2 }}
						className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden"
						style={{ zIndex: 1000000 }}
					>
						{/* Close button */}
						<button
							onClick={onClose}
							className="absolute top-4 right-4 z-10 p-2 rounded-full hover:bg-gray-100 transition-colors"
							aria-label="Close modal"
						>
							<svg
								width="24"
								height="24"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
							>
								<line x1="18" y1="6" x2="6" y2="18" />
								<line x1="6" y1="6" x2="18" y2="18" />
							</svg>
						</button>

						{/* Modal content */}
						<div className="p-4">
							{title && (
								<h2 className="text-2xl font-bold text-gray-900 mb-4">
									{title}
								</h2>
							)}
							{children}
						</div>
					</motion.div>
				</motion.div>
			)}
		</AnimatePresence>
	);
}
