import { motion } from "framer-motion";
import { PrimaryButton } from "@/components/ui/gradient-button";

export default function HeroSection() {
	return (
		<section id="home" className="relative bg-white py-20">
			<div className="container mx-auto px-4 max-w-6xl">
				{/* Content section - Left aligned */}
				<motion.div
					className="text-left max-w-3xl"
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8, ease: "easeOut" }}
				>
					<motion.h1
						className="text-5xl sm:text-6xl md:text-7xl mb-6 leading-tight text-gray-900"
						initial={{ scale: 0.9 }}
						animate={{ scale: 1 }}
						transition={{ duration: 0.5, delay: 0.2 }}
						style={{ letterSpacing: "-0.025em", fontWeight: 700 }}
					>
						AI-Powered Tools
						<br />
						for the Future of Work
					</motion.h1>

					<p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl leading-relaxed">
						Zabaca builds cutting-edge AI tools that transform how teams
						collaborate, businesses connect, and knowledge persists. From visual
						meeting intelligence to universal business discovery and persistent
						AI memory.
					</p>

					{/* Explore Products CTA */}
					<div className="flex flex-col sm:flex-row gap-4 items-start">
						<a href="#products">
							<PrimaryButton className="text-lg px-8 py-4">
								Explore our Products
							</PrimaryButton>
						</a>
						<a
							href="/careers"
							className="text-lg font-medium text-gray-600 hover:text-gray-900 transition-colors duration-200 flex items-center gap-2 py-4"
						>
							Join our team
							<svg
								className="w-4 h-4"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M9 5l7 7-7 7"
								/>
							</svg>
						</a>
					</div>
				</motion.div>
			</div>
		</section>
	);
}
