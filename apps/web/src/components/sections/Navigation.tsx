"use client";
import { AnimatePresence, motion } from "framer-motion";
import type React from "react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export default function Navigation() {
	const [isVisible, setIsVisible] = useState(true);
	const [lastScrollY, setLastScrollY] = useState(0);

	useEffect(() => {
		const handleScroll = () => {
			const currentScrollY = window.scrollY;

			// Show nav when scrolling up or at the top
			if (currentScrollY < lastScrollY || currentScrollY < 10) {
				setIsVisible(true);
			} else if (currentScrollY > 100 && currentScrollY > lastScrollY) {
				// Hide nav when scrolling down (after 100px)
				setIsVisible(false);
			}

			setLastScrollY(currentScrollY);
		};

		window.addEventListener("scroll", handleScroll, { passive: true });
		return () => window.removeEventListener("scroll", handleScroll);
	}, [lastScrollY]);

	const navItems = [
		{ name: "Home", href: "#home" },
		{ name: "Services", href: "#services" },
		{ name: "Contact", href: "#contact" },
	];

	const scrollToSection = (
		e: React.MouseEvent<HTMLAnchorElement>,
		href: string,
	) => {
		e.preventDefault();
		const element = document.querySelector(href);
		if (element) {
			element.scrollIntoView({ behavior: "smooth", block: "start" });
		}
	};

	return (
		<AnimatePresence mode="wait">
			<motion.nav
				initial={{ opacity: 1, y: 0 }}
				animate={{
					y: isVisible ? 0 : -100,
					opacity: isVisible ? 1 : 0,
				}}
				transition={{
					duration: 0.3,
					ease: "easeInOut",
				}}
				className="fixed top-0 left-0 right-0 z-50"
			>
				<div className="mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex items-center justify-between h-16">
						{/* Logo */}
						<motion.a
							href="#home"
							onClick={(e) => scrollToSection(e, "#home")}
							className="flex items-center"
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
						>
							<span className="text-2xl font-black gradient-text">Zabaca</span>
						</motion.a>

						{/* Desktop Navigation */}
						<div className="hidden md:flex items-center space-x-8">
							{navItems.map((item) => (
								<motion.a
									key={item.name}
									href={item.href}
									onClick={(e) => scrollToSection(e, item.href)}
									className={cn(
										"text-gray-700 dark:text-gray-300",
										"hover:text-gray-900 dark:hover:text-white",
										"px-3 py-2 text-sm font-medium",
										"transition-colors duration-200",
										"relative",
									)}
									whileHover={{ y: -2 }}
									whileTap={{ scale: 0.95 }}
								>
									{item.name}
									<motion.span
										className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-600 to-pink-600"
										initial={{ scaleX: 0 }}
										whileHover={{ scaleX: 1 }}
										transition={{ duration: 0.2 }}
									/>
								</motion.a>
							))}

							{/* CTA Button */}
							<motion.a
								href="mailto:hello@zabaca.com"
								className={cn(
									"inline-flex items-center px-4 py-2",
									"bg-gradient-to-r from-purple-600 to-pink-600",
									"text-white font-medium text-sm",
									"rounded-full",
									"hover:shadow-lg hover:shadow-purple-500/25",
									"transition-all duration-300",
								)}
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
							>
								Get Started
							</motion.a>
						</div>

						{/* Mobile menu button */}
						<div className="md:hidden">
							<MobileNav
								navItems={navItems}
								scrollToSection={scrollToSection}
							/>
						</div>
					</div>
				</div>

				{/* Backdrop blur */}
				<div className="absolute inset-0 -z-10 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800" />
			</motion.nav>
		</AnimatePresence>
	);
}

function MobileNav({
	navItems,
	scrollToSection,
}: {
	navItems: Array<{ name: string; href: string }>;
	scrollToSection: (
		e: React.MouseEvent<HTMLAnchorElement>,
		href: string,
	) => void;
}) {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<>
			<button
				onClick={() => setIsOpen(!isOpen)}
				className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-purple-500"
			>
				<span className="sr-only">Open main menu</span>
				{!isOpen ? (
					<svg
						className="block h-6 w-6"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M4 6h16M4 12h16M4 18h16"
						/>
					</svg>
				) : (
					<svg
						className="block h-6 w-6"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M6 18L18 6M6 6l12 12"
						/>
					</svg>
				)}
			</button>

			<AnimatePresence>
				{isOpen && (
					<motion.div
						initial={{ opacity: 0, height: 0 }}
						animate={{ opacity: 1, height: "auto" }}
						exit={{ opacity: 0, height: 0 }}
						className="md:hidden absolute top-16 left-0 right-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800"
					>
						<div className="px-2 pt-2 pb-3 space-y-1">
							{navItems.map((item) => (
								<a
									key={item.name}
									href={item.href}
									onClick={(e) => {
										scrollToSection(e, item.href);
										setIsOpen(false);
									}}
									className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
								>
									{item.name}
								</a>
							))}
							<a
								href="mailto:hello@zabaca.com"
								className="block px-3 py-2 rounded-md text-base font-medium text-white bg-gradient-to-r from-purple-600 to-pink-600"
								onClick={() => setIsOpen(false)}
							>
								Get Started
							</a>
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</>
	);
}
